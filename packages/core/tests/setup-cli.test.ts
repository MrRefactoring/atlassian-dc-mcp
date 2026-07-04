import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { DefaultConfigRegistry } from '../src/config/registry.js';
import { HomeFileSource } from '../src/config/sources/home-file.js';
import { MacosKeychainSource, type KeychainDeps } from '../src/config/sources/macos-keychain.js';
import { ProcessEnvSource } from '../src/config/sources/process-env.js';
import {
  runSetup,
  type CredentialValidationContext,
  type CredentialValidationResult,
  type SetupPrompts,
  type ValidateCredentials,
} from '../src/setup-cli.js';
import type { ParsedSetupArgs } from '../src/setup/args.js';
import type { ConfigKey, ProductDefinition } from '../src/config/source.js';

function makeArgs(overrides: Partial<ParsedSetupArgs> = {}): ParsedSetupArgs {
  return {
    host: undefined,
    apiBasePath: undefined,
    token: undefined,
    username: undefined,
    password: undefined,
    defaultPageSize: undefined,
    nonInteractive: false,
    help: false,
    ...overrides,
  };
}

const JIRA: ProductDefinition = {
  id: 'jira',
  envVars: {
    host: 'JIRA_HOST',
    apiBasePath: 'JIRA_API_BASE_PATH',
    token: 'JIRA_API_TOKEN',
    username: 'JIRA_USERNAME',
    password: 'JIRA_PASSWORD',
    defaultPageSize: 'JIRA_DEFAULT_PAGE_SIZE',
  },
  defaultApiBasePath: '/rest/api/2',
};

class FakeKeychain extends MacosKeychainSource {
  available = true;
  store: string | undefined;
  passwordStore: string | undefined;
  writeCalls = 0;
  clearCalls = 0;
  passwordWriteCalls = 0;
  passwordClearCalls = 0;
  constructor() {
    const deps: Partial<KeychainDeps> = {
      execFileSync: (() => '') as unknown as KeychainDeps['execFileSync'],
      existsSync: () => true,
      getPlatform: () => 'darwin' as NodeJS.Platform,
    };
    super(deps);
  }

  override isAvailable(): boolean {
    return this.available;
  }

  override read(_p: ProductDefinition, key: ConfigKey): string | undefined {
    if (key === 'password') return this.passwordStore;

    return key === 'token' ? this.store : undefined;
  }

  override write(_p: ProductDefinition, key: ConfigKey, v: string): void {
    if (key === 'password') {
      this.passwordWriteCalls++;
      this.passwordStore = v;

      return;
    }
    this.writeCalls++;
    this.store = v;
  }

  override clear(_p: ProductDefinition, key: ConfigKey): void {
    if (key === 'password') {
      this.passwordClearCalls++;
      this.passwordStore = undefined;

      return;
    }
    this.clearCalls++;
    this.store = undefined;
  }
}

class FakeHomeFile extends HomeFileSource {
  values: Record<string, Partial<Record<ConfigKey, string>>> = {
    jira: {},
    confluence: {},
    bitbucket: {},
  };

  writes: Array<[string, ConfigKey, string]> = [];
  clears: Array<[string, ConfigKey]> = [];
  override read(product: ProductDefinition, key: ConfigKey): string | undefined {
    return this.values[product.id]?.[key];
  }

  override write(product: ProductDefinition, key: ConfigKey, value: string): void {
    this.values[product.id] = this.values[product.id] ?? {};
    this.values[product.id][key] = value;
    this.writes.push([product.id, key, value]);
  }

  override clear(product: ProductDefinition, key: ConfigKey): void {
    if (this.values[product.id]) {
      delete this.values[product.id][key];
    }
    this.clears.push([product.id, key]);
  }

  override describeForProduct(product: ProductDefinition): string {
    return `home-file-fake(${product.id})`;
  }
}

class StubCredentialValidator {
  readonly calls: CredentialValidationContext[] = [];
  private readonly queue: CredentialValidationResult[] = [];
  private fallback: CredentialValidationResult = { ok: true };

  returns(result: CredentialValidationResult): this {
    this.fallback = result;

    return this;
  }

  reject(message: string): this {
    return this.returns({ ok: false, message });
  }

  enqueue(...results: CredentialValidationResult[]): this {
    this.queue.push(...results);

    return this;
  }

  asFn(): ValidateCredentials {
    return async (ctx) => {
      this.calls.push(ctx);

      return this.queue.shift() ?? this.fallback;
    };
  }
}

type ConfirmStub = (message: string, fallbackDefault?: boolean) => boolean;

function scriptedConfirms(script: Record<string, boolean>): ConfirmStub {
  return (message, fallbackDefault) => {
    for (const [prefix, answer] of Object.entries(script)) {
      if (message.startsWith(prefix)) return answer;
    }

    return fallbackDefault ?? false;
  };
}

function makeRegistry(keychain: FakeKeychain, home: FakeHomeFile) {
  return new DefaultConfigRegistry([new ProcessEnvSource(), home, keychain]);
}

const standardAnswers = {
  host: 'j-host',
  apiBasePath: '/rest/api/2',
  pageSize: '25',
  token: 'secret',
  username: '',
  password: '',
};

function makePrompts(
  overrides: Partial<SetupPrompts> = {},
  answers: Partial<typeof standardAnswers> = {},
  confirms?: ConfirmStub,
): SetupPrompts {
  const filled = { ...standardAnswers, ...answers };

  return {
    input: async (opts) => {
      if (opts.message.startsWith('Host')) return filled.host;
      if (opts.message.startsWith('API base path')) return filled.apiBasePath;
      if (opts.message.startsWith('Username')) return filled.username;

      return filled.pageSize;
    },
    password: async (opts) => {
      if (opts.message.startsWith('API token')) return filled.token;

      return filled.password;
    },
    confirm: async (opts) => (confirms ?? ((_m, d) => d ?? false))(opts.message, opts.default),
    ...overrides,
  };
}

describe('runSetup', () => {
  const originalEnv = process.env;
  let keychain: FakeKeychain;
  let home: FakeHomeFile;
  let logs: string[];

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.JIRA_API_TOKEN;
    delete process.env.JIRA_HOST;
    keychain = new FakeKeychain();
    home = new FakeHomeFile();
    logs = [];
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('writes the token to keychain first on darwin and clears home file token', async () => {
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      prompts: makePrompts(),
    });

    expect(keychain.writeCalls).toBe(1);
    expect(keychain.store).toBe('secret');
    expect(home.clears).toContainEqual(['jira', 'token']);
    expect(home.values.jira.host).toBe('j-host');
  });

  it('falls back to home file when keychain is unavailable', async () => {
    keychain.available = false;
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      prompts: makePrompts(),
    });

    expect(keychain.writeCalls).toBe(0);
    const tokenWrites = home.writes.filter(([, k]) => k === 'token');
    expect(tokenWrites).toHaveLength(1);
  });

  it('prints shadowing warning when env var is set higher than target', async () => {
    process.env.JIRA_API_TOKEN = 'shadow';
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      prompts: makePrompts(),
    });

    expect(logs.some((l) => l.includes('JIRA_API_TOKEN') && l.includes('Warning'))).toBe(true);
  });

  it('calls validateCredentials with the entered values before saving', async () => {
    const validator = new StubCredentialValidator();
    const registry = makeRegistry(keychain, home);

    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      prompts: makePrompts(),
      validateCredentials: validator.asFn(),
    });

    expect(validator.calls).toEqual([
      { host: 'j-host', apiBasePath: '/rest/api/2', token: 'secret' },
    ]);
    expect(keychain.writeCalls).toBe(1);
  });

  it('exits without writing when validation fails and user declines retry or save-anyway', async () => {
    const validator = new StubCredentialValidator().reject('401 Unauthorized');
    const exitFn = vi.fn();
    const registry = makeRegistry(keychain, home);

    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: exitFn,
      prompts: makePrompts({}, { token: 'bad-token' }, scriptedConfirms({
        'Try again': false,
        'Save configuration anyway': false,
      })),
      validateCredentials: validator.asFn(),
    });

    expect(validator.calls).toHaveLength(1);
    expect(exitFn).toHaveBeenCalledWith(1);
    expect(keychain.writeCalls).toBe(0);
    expect(home.writes).toHaveLength(0);
    expect(logs.some((l) => l.includes('401 Unauthorized'))).toBe(true);
  });

  it('retries validation after a failure and writes once it succeeds', async () => {
    const validator = new StubCredentialValidator().enqueue(
      { ok: false, message: '401 Unauthorized' },
      { ok: true },
    );
    const registry = makeRegistry(keychain, home);

    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      prompts: makePrompts({}, {}, scriptedConfirms({ 'Try again': true })),
      validateCredentials: validator.asFn(),
    });

    expect(validator.calls).toHaveLength(2);
    expect(keychain.writeCalls).toBe(1);
    expect(logs.some((l) => l.includes('401 Unauthorized'))).toBe(true);
    expect(logs.some((l) => l.startsWith('Validation succeeded'))).toBe(true);
  });

  it('stops offering retry after the third failure and lets the user save anyway', async () => {
    const validator = new StubCredentialValidator().reject('401 Unauthorized');
    let retryPromptsShown = 0;
    const confirms: ConfirmStub = (message) => {
      if (message.startsWith('Try again')) {
        retryPromptsShown++;

        return true;
      }
      if (message.startsWith('Save configuration anyway')) return true;

      return false;
    };
    const registry = makeRegistry(keychain, home);

    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      prompts: makePrompts({}, {}, confirms),
      validateCredentials: validator.asFn(),
    });

    expect(validator.calls).toHaveLength(3);
    expect(retryPromptsShown).toBe(2);
    expect(keychain.writeCalls).toBe(1);
  });

  it('exits 130 on SIGINT cancellation before any write', async () => {
    const exitErr: Error & { name: string } = Object.assign(new Error('closed'), {
      name: 'ExitPromptError',
    });
    const exitFn = vi.fn();
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: exitFn,
      prompts: makePrompts({
        input: async () => {
          throw exitErr;
        },
      }),
    });
    expect(exitFn).toHaveBeenCalledWith(130);
    expect(keychain.writeCalls).toBe(0);
    expect(home.writes).toHaveLength(0);
  });

  it('skips the host prompt when --host is passed and still prompts for the rest', async () => {
    const inputCalls: string[] = [];
    const passwordCalls = vi.fn(async (opts: { message: string }) =>
      opts.message.startsWith('API token') ? 'secret' : '',
    );
    const registry = makeRegistry(keychain, home);

    await runSetup(JIRA, {
      registry,
      log: (m) => logs.push(m),
      exit: () => undefined,
      args: makeArgs({ host: 'cli-host.example.com' }),
      prompts: {
        input: async (opts) => {
          inputCalls.push(opts.message);
          if (opts.message.startsWith('API base path')) return '/rest/api/2';
          if (opts.message.startsWith('Username')) return '';

          return '25';
        },
        password: passwordCalls,
        confirm: async (opts) => opts.default ?? false,
      },
    });

    expect(inputCalls.some((m) => m.startsWith('Host'))).toBe(false);
    expect(inputCalls.some((m) => m.startsWith('API base path'))).toBe(true);
    expect(passwordCalls).toHaveBeenCalledTimes(2);
    expect(home.values.jira.host).toBe('cli-host.example.com');
  });

  describe('profiles', () => {
    it('shows the profile in the setup header and in the stored-account summary line', async () => {
      const registry = makeRegistry(keychain, home);
      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        args: makeArgs({ profile: 'work' }),
        prompts: makePrompts(),
      });

      expect(logs[0]).toBe('Atlassian DC MCP setup — jira (profile: work)');
      // FakeKeychain extends MacosKeychainSource, so describeWriter's real
      // profile-aware account-name string is exercised even against the fake.
      expect(logs.some((l) => l.startsWith('  token:') && l.includes('account jira-work-token'))).toBe(true);
    });

    it('omits the profile suffix from the header and account name when no profile is passed', async () => {
      const registry = makeRegistry(keychain, home);
      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: makePrompts(),
      });

      expect(logs[0]).toBe('Atlassian DC MCP setup — jira');
      expect(logs.some((l) => l.startsWith('  token:') && l.includes('account jira-token'))).toBe(true);
    });
  });

  describe('Basic auth (username/password)', () => {
    it('writes username to home file (non-secret) and password to keychain first on darwin', async () => {
      const registry = makeRegistry(keychain, home);
      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: makePrompts({}, { username: 'jdoe', password: 'hunter2' }),
      });

      expect(home.values.jira.username).toBe('jdoe');
      expect(keychain.passwordWriteCalls).toBe(1);
      expect(keychain.passwordStore).toBe('hunter2');
      expect(home.clears).toContainEqual(['jira', 'password']);
      // token keychain account is independent from the password account
      expect(keychain.writeCalls).toBe(1);
      expect(keychain.store).toBe('secret');
    });

    it('falls back to home file for password when keychain is unavailable', async () => {
      keychain.available = false;
      const registry = makeRegistry(keychain, home);
      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: makePrompts({}, { password: 'hunter2' }),
      });

      expect(keychain.passwordWriteCalls).toBe(0);
      const passwordWrites = home.writes.filter(([, k]) => k === 'password');
      expect(passwordWrites).toHaveLength(1);
      expect(passwordWrites[0][2]).toBe('hunter2');
    });

    it('keeps existing password when left blank and confirmed to keep', async () => {
      keychain.passwordStore = 'kept-password';
      const registry = makeRegistry(keychain, home);
      const validator = new StubCredentialValidator();

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: makePrompts({}, {}, scriptedConfirms({ 'Keep existing password': true })),
        validateCredentials: validator.asFn(),
      });

      expect(keychain.passwordWriteCalls).toBe(0);
      expect(keychain.passwordStore).toBe('kept-password');
      expect(validator.calls[0]).toEqual(
        expect.objectContaining({ password: 'kept-password' }),
      );
    });

    it('passes username and password to validateCredentials alongside the token', async () => {
      const validator = new StubCredentialValidator();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: makePrompts({}, { username: 'jdoe', password: 'hunter2' }),
        validateCredentials: validator.asFn(),
      });

      expect(validator.calls).toEqual([
        {
          host: 'j-host',
          apiBasePath: '/rest/api/2',
          token: 'secret',
          username: 'jdoe',
          password: 'hunter2',
        },
      ]);
    });

    it('omits token from write when only Basic auth is provided, and vice versa', async () => {
      const registry = makeRegistry(keychain, home);
      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: makePrompts({}, { token: '', username: 'jdoe', password: 'hunter2' }),
      });

      expect(keychain.writeCalls).toBe(0);
      expect(keychain.store).toBeUndefined();
      expect(keychain.passwordWriteCalls).toBe(1);
      expect(keychain.passwordStore).toBe('hunter2');
    });
  });

  describe('non-interactive mode', () => {
    function nonInteractivePrompts(): SetupPrompts & { inputCalls: string[]; passwordCalls: number } {
      const inputCalls: string[] = [];
      let passwordCalls = 0;

      return Object.assign(
        {
          input: async (opts: { message: string }) => {
            inputCalls.push(opts.message);

            return '';
          },
          password: async () => {
            passwordCalls++;

            return '';
          },
          confirm: async () => false,
        },
        {
          inputCalls,
          get passwordCalls() {
            return passwordCalls;
          },
        },
      ) as SetupPrompts & { inputCalls: string[]; passwordCalls: number };
    }

    it('writes everything without prompts when all required fields come from CLI args', async () => {
      const validator = new StubCredentialValidator();
      const exitFn = vi.fn();
      const registry = makeRegistry(keychain, home);
      const prompts = nonInteractivePrompts();

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: exitFn,
        prompts,
        validateCredentials: validator.asFn(),
        args: makeArgs({
          host: 'cli-host.example.com',
          token: 'cli-token',
          nonInteractive: true,
        }),
      });

      expect(prompts.inputCalls).toHaveLength(0);
      expect(prompts.passwordCalls).toBe(0);
      expect(exitFn).not.toHaveBeenCalled();
      expect(validator.calls).toEqual([
        { host: 'cli-host.example.com', apiBasePath: '/rest/api/2', token: 'cli-token' },
      ]);
      expect(home.values.jira.host).toBe('cli-host.example.com');
      expect(home.values.jira.apiBasePath).toBe('/rest/api/2');
      expect(keychain.store).toBe('cli-token');
    });

    it('succeeds for anonymous access when --token is missing and there is no existing token', async () => {
      const validator = new StubCredentialValidator();
      const exitFn = vi.fn();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: exitFn,
        prompts: nonInteractivePrompts(),
        validateCredentials: validator.asFn(),
        args: makeArgs({ host: 'cli-host.example.com', nonInteractive: true }),
      });

      expect(exitFn).not.toHaveBeenCalled();
      expect(validator.calls).toHaveLength(0);
      expect(keychain.writeCalls).toBe(0);
      expect(home.values.jira.host).toBe('cli-host.example.com');
      const tokenWrites = home.writes.filter(([, k]) => k === 'token');
      expect(tokenWrites).toHaveLength(0);
    });

    it('reuses an existing keychain token without rewriting it when --token is omitted', async () => {
      keychain.store = 'kept-token';
      const validator = new StubCredentialValidator();
      const exitFn = vi.fn();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: exitFn,
        prompts: nonInteractivePrompts(),
        validateCredentials: validator.asFn(),
        args: makeArgs({ host: 'cli-host.example.com', nonInteractive: true }),
      });

      expect(exitFn).not.toHaveBeenCalled();
      expect(validator.calls).toEqual([
        { host: 'cli-host.example.com', apiBasePath: '/rest/api/2', token: 'kept-token' },
      ]);
      expect(keychain.writeCalls).toBe(0);
      expect(keychain.store).toBe('kept-token');
      const tokenWrites = home.writes.filter(([, k]) => k === 'token');
      expect(tokenWrites).toHaveLength(0);
    });

    it('exits 1 with a format error when --default-page-size is not a positive integer', async () => {
      const exitFn = vi.fn();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: exitFn,
        prompts: nonInteractivePrompts(),
        args: makeArgs({
          host: 'cli-host.example.com',
          token: 'cli-token',
          defaultPageSize: 'abc',
          nonInteractive: true,
        }),
      });

      expect(exitFn).toHaveBeenCalledWith(1);
      expect(home.writes).toHaveLength(0);
      expect(keychain.writeCalls).toBe(0);
      expect(logs.some((l) => l.includes('default page size'))).toBe(true);
    });

    it('exits 1 on credential rejection without retrying or asking to save anyway', async () => {
      const validator = new StubCredentialValidator().reject('401 Unauthorized');
      const exitFn = vi.fn();
      const confirmFn = vi.fn(async () => false);
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: exitFn,
        prompts: { ...nonInteractivePrompts(), confirm: confirmFn },
        validateCredentials: validator.asFn(),
        args: makeArgs({
          host: 'cli-host.example.com',
          token: 'cli-token',
          nonInteractive: true,
        }),
      });

      expect(validator.calls).toHaveLength(1);
      expect(exitFn).toHaveBeenCalledWith(1);
      expect(confirmFn).not.toHaveBeenCalled();
      expect(keychain.writeCalls).toBe(0);
      expect(home.writes).toHaveLength(0);
    });

    it('falls back to product.defaultApiBasePath and FALLBACK_PAGE_SIZE for unspecified optional fields', async () => {
      const validator = new StubCredentialValidator();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: nonInteractivePrompts(),
        validateCredentials: validator.asFn(),
        args: makeArgs({
          host: 'cli-host.example.com',
          token: 'cli-token',
          nonInteractive: true,
        }),
      });

      expect(home.values.jira.apiBasePath).toBe('/rest/api/2');
      expect(home.values.jira.defaultPageSize).toBe('25');
    });

    it('writes username and password from CLI args without prompting', async () => {
      const validator = new StubCredentialValidator();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: nonInteractivePrompts(),
        validateCredentials: validator.asFn(),
        args: makeArgs({
          host: 'cli-host.example.com',
          username: 'jdoe',
          password: 'hunter2',
          nonInteractive: true,
        }),
      });

      expect(home.values.jira.username).toBe('jdoe');
      expect(keychain.passwordWriteCalls).toBe(1);
      expect(keychain.passwordStore).toBe('hunter2');
      expect(validator.calls).toEqual([
        {
          host: 'cli-host.example.com',
          apiBasePath: '/rest/api/2',
          token: '',
          username: 'jdoe',
          password: 'hunter2',
        },
      ]);
    });

    it('reuses an existing keychain password without rewriting it when --password is omitted', async () => {
      keychain.passwordStore = 'kept-password';
      const validator = new StubCredentialValidator();
      const registry = makeRegistry(keychain, home);

      await runSetup(JIRA, {
        registry,
        log: (m) => logs.push(m),
        exit: () => undefined,
        prompts: nonInteractivePrompts(),
        validateCredentials: validator.asFn(),
        args: makeArgs({ host: 'cli-host.example.com', username: 'jdoe', nonInteractive: true }),
      });

      expect(keychain.passwordWriteCalls).toBe(0);
      expect(keychain.passwordStore).toBe('kept-password');
      expect(validator.calls).toEqual([
        {
          host: 'cli-host.example.com',
          apiBasePath: '/rest/api/2',
          token: '',
          username: 'jdoe',
          password: 'kept-password',
        },
      ]);
    });
  });
});
