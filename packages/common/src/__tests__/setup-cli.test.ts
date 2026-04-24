import { DefaultConfigRegistry } from '../config/registry.js';
import { HomeFileSource } from '../config/sources/home-file.js';
import { MacosKeychainSource, type KeychainDeps } from '../config/sources/macos-keychain.js';
import { ProcessEnvSource } from '../config/sources/process-env.js';
import {
  runSetup,
  type CredentialValidationContext,
  type CredentialValidationResult,
  type SetupPrompts,
  type ValidateCredentials,
} from '../setup-cli.js';
import type { ConfigKey, ProductDefinition } from '../config/source.js';

const JIRA: ProductDefinition = {
  id: 'jira',
  envVars: {
    host: 'JIRA_HOST',
    apiBasePath: 'JIRA_API_BASE_PATH',
    token: 'JIRA_API_TOKEN',
    defaultPageSize: 'JIRA_DEFAULT_PAGE_SIZE',
  },
  defaultApiBasePath: '/rest/api/2',
};

class FakeKeychain extends MacosKeychainSource {
  available = true;
  store: string | undefined;
  writeCalls = 0;
  clearCalls = 0;
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
    return key === 'token' ? this.store : undefined;
  }
  override write(_p: ProductDefinition, _k: ConfigKey, v: string): void {
    this.writeCalls++;
    this.store = v;
  }
  override clear(_p: ProductDefinition, _k: ConfigKey): void {
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
      return filled.pageSize;
    },
    password: async () => filled.token,
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
    const exitFn = jest.fn();
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
    const exitFn = jest.fn();
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
});
