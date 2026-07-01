import { DefaultConfigRegistry } from '../registry.js';
import type {
  ConfigKey,
  ProductDefinition,
  ReadableSource,
  SourceId,
  WritableSource,
} from '../source.js';

const PRODUCT: ProductDefinition = {
  id: 'jira',
  envVars: {
    host: 'JIRA_HOST',
    apiBasePath: 'JIRA_API_BASE_PATH',
    token: 'JIRA_API_TOKEN',
    defaultPageSize: 'JIRA_DEFAULT_PAGE_SIZE',
  },
};

class ReadOnlySource implements ReadableSource {
  constructor(
    public readonly id: SourceId,
    public readonly priority: number,
    public readonly values: Partial<Record<ConfigKey, string>> = {},
  ) {}
  read(_p: ProductDefinition, key: ConfigKey): string | undefined {
    return this.values[key];
  }
  describe(): string {
    return this.id;
  }
}

class FakeWritableSource implements WritableSource {
  calls: string[] = [];
  available = true;
  constructor(
    public readonly id: SourceId,
    public readonly priority: number,
  ) {}
  read(): string | undefined {
    return undefined;
  }
  describe(): string {
    return this.id;
  }
  isAvailable(): boolean {
    return this.available;
  }
  write(_p: ProductDefinition, key: ConfigKey, value: string): void {
    this.calls.push(`write:${key}:${value}`);
  }
  clear(_p: ProductDefinition, key: ConfigKey): void {
    this.calls.push(`clear:${key}`);
  }
}

describe('DefaultConfigRegistry', () => {
  it('sorts sources by priority descending', () => {
    const a = new ReadOnlySource('home-file', 60);
    const b = new ReadOnlySource('process-env', 100);
    const c = new ReadOnlySource('env-file', 80);
    const registry = new DefaultConfigRegistry([a, b, c]);
    expect(registry.sources.map((s) => s.id)).toEqual(['process-env', 'env-file', 'home-file']);
  });

  it('resolve returns the first non-empty value in priority order', () => {
    const envFile = new ReadOnlySource('env-file', 80, { token: 'file-token' });
    const processEnv = new ReadOnlySource('process-env', 100, { token: 'env-token' });
    const registry = new DefaultConfigRegistry([envFile, processEnv]);
    const resolved = registry.resolve(PRODUCT, 'token');
    expect(resolved.value).toBe('env-token');
    expect(resolved.from?.sourceId).toBe('process-env');
  });

  it('resolve falls through when a higher-priority source is empty', () => {
    const envFile = new ReadOnlySource('env-file', 80, { token: 'file-token' });
    const processEnv = new ReadOnlySource('process-env', 100, {});
    const registry = new DefaultConfigRegistry([envFile, processEnv]);
    expect(registry.resolve(PRODUCT, 'token').value).toBe('file-token');
  });

  it('locate returns all sources with values, priority order', () => {
    const home = new ReadOnlySource('home-file', 60, { token: 'home-token' });
    const env = new ReadOnlySource('process-env', 100, { token: 'env-token' });
    const envFile = new ReadOnlySource('env-file', 80, {});
    const registry = new DefaultConfigRegistry([home, env, envFile]);
    const locs = registry.locate(PRODUCT, 'token');
    expect(locs.map((l) => l.sourceId)).toEqual(['process-env', 'home-file']);
  });

  it('getWritableSource returns the first source matching the predicate', () => {
    const a = new FakeWritableSource('home-file', 60);
    const b = new FakeWritableSource('macos-keychain', 40);
    const registry = new DefaultConfigRegistry([a, b]);
    const found = registry.getWritableSource(
      (s): s is FakeWritableSource => s instanceof FakeWritableSource && s.id === 'macos-keychain',
    );
    expect(found).toBe(b);
  });

  it('calls initialize on all sources when registry.initialize runs', () => {
    const calls: string[] = [];
    const makeSource = (id: SourceId, priority: number) =>
      ({
        id,
        priority,
        read: () => undefined,
        describe: () => id,
        initialize: (opts?: { cwd?: string }) => {
          calls.push(`${id}:${opts?.cwd ?? ''}`);
        },
      }) satisfies ReadableSource;
    const registry = new DefaultConfigRegistry([makeSource('env-file', 80), makeSource('process-env', 100)]);
    registry.initialize({ cwd: '/tmp' });
    expect(calls.sort()).toEqual(['env-file:/tmp', 'process-env:/tmp']);
  });
});
