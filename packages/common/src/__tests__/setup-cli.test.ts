import { DefaultConfigRegistry } from '../config/registry.js';
import { HomeFileSource } from '../config/sources/home-file.js';
import { MacosKeychainSource, type KeychainDeps } from '../config/sources/macos-keychain.js';
import { ProcessEnvSource } from '../config/sources/process-env.js';
import { runSetup, type SetupPrompts } from '../setup-cli.js';
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

function makeRegistry(keychain: FakeKeychain, home: FakeHomeFile) {
  return new DefaultConfigRegistry([new ProcessEnvSource(), home, keychain]);
}

function makePrompts(overrides: Partial<SetupPrompts> = {}): SetupPrompts {
  return {
    input: async (opts) => opts.default ?? '',
    password: async () => '',
    confirm: async (opts) => opts.default ?? false,
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
    const prompts = makePrompts({
      input: async (opts) => {
        if (opts.message.startsWith('Host')) return 'j-host';
        if (opts.message.startsWith('API base path')) return '/rest/api/2';
        return '25';
      },
      password: async () => 'secret',
    });
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, { registry, log: (m) => logs.push(m), exit: () => undefined, prompts });

    expect(keychain.writeCalls).toBe(1);
    expect(keychain.store).toBe('secret');
    expect(home.clears).toContainEqual(['jira', 'token']);
    expect(home.values.jira.host).toBe('j-host');
  });

  it('falls back to home file when keychain is unavailable', async () => {
    keychain.available = false;
    const prompts = makePrompts({
      input: async (opts) => {
        if (opts.message.startsWith('Host')) return 'j-host';
        if (opts.message.startsWith('API base path')) return '/rest/api/2';
        return '25';
      },
      password: async () => 'secret',
    });
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, { registry, log: (m) => logs.push(m), exit: () => undefined, prompts });

    expect(keychain.writeCalls).toBe(0);
    const tokenWrites = home.writes.filter(([, k]) => k === 'token');
    expect(tokenWrites).toHaveLength(1);
  });

  it('prints shadowing warning when env var is set higher than target', async () => {
    process.env.JIRA_API_TOKEN = 'shadow';
    const prompts = makePrompts({
      input: async (opts) => {
        if (opts.message.startsWith('Host')) return 'j-host';
        if (opts.message.startsWith('API base path')) return '/rest/api/2';
        return '25';
      },
      password: async () => 'secret',
    });
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, { registry, log: (m) => logs.push(m), exit: () => undefined, prompts });

    expect(logs.some((l) => l.includes('JIRA_API_TOKEN') && l.includes('Warning'))).toBe(true);
  });

  it('exits 130 on SIGINT cancellation before any write', async () => {
    const exitErr: Error & { name: string } = Object.assign(new Error('closed'), {
      name: 'ExitPromptError',
    });
    const prompts = makePrompts({
      input: async () => {
        throw exitErr;
      },
    });
    const exitFn = jest.fn();
    const registry = makeRegistry(keychain, home);
    await runSetup(JIRA, { registry, log: (m) => logs.push(m), exit: exitFn, prompts });
    expect(exitFn).toHaveBeenCalledWith(130);
    expect(keychain.writeCalls).toBe(0);
    expect(home.writes).toHaveLength(0);
  });
});
