export type ConfigKey = 'host' | 'apiBasePath' | 'token' | 'defaultPageSize';

export type SourceId = 'process-env' | 'env-file' | 'home-file' | 'macos-keychain';

export type SourceLocation = { sourceId: SourceId; detail?: string };

export interface ProductDefinition {
  readonly id: string;
  readonly envVars: Record<ConfigKey, string>;
  readonly defaultApiBasePath?: string;
  readonly apiBasePathStrippableSuffixes?: readonly string[];
}

export interface ReadableSource {
  readonly id: SourceId;
  readonly priority: number;
  read(product: ProductDefinition, key: ConfigKey): string | undefined;
  initialize?(options?: { cwd?: string }): void;
  describe(): string;
}

export interface WritableSource extends ReadableSource {
  isAvailable(): boolean;
  write(product: ProductDefinition, key: ConfigKey, value: string): void;
  clear(product: ProductDefinition, key: ConfigKey): void;
}

export function isWritableSource(source: ReadableSource): source is WritableSource {
  return typeof (source as WritableSource).write === 'function';
}

export function getNonEmptyValue(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
