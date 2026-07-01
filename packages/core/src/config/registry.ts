import type {
  ConfigKey,
  ProductDefinition,
  ReadableSource,
  SourceLocation,
  WritableSource,
} from './source.js';
import { isWritableSource } from './source.js';
import { ProcessEnvSource } from './sources/process-env.js';
import { EnvFileSource } from './sources/env-file.js';
import { HomeFileSource } from './sources/home-file.js';
import { MacosKeychainSource } from './sources/macos-keychain.js';

export interface ResolvedValue {
  value: string | undefined;
  from?: SourceLocation;
}

export interface ConfigRegistry {
  readonly sources: readonly ReadableSource[];
  initialize(options?: { cwd?: string }): void;
  resolve(product: ProductDefinition, key: ConfigKey): ResolvedValue;
  locate(product: ProductDefinition, key: ConfigKey): SourceLocation[];
  getWritableSource<T extends WritableSource>(predicate: (s: WritableSource) => s is T): T | undefined;
}

export class DefaultConfigRegistry implements ConfigRegistry {
  readonly sources: readonly ReadableSource[];

  constructor(sources: ReadableSource[]) {
    this.sources = [...sources].sort((a, b) => b.priority - a.priority);
  }

  initialize(options?: { cwd?: string }): void {
    for (const source of this.sources) {
      source.initialize?.(options);
    }
  }

  resolve(product: ProductDefinition, key: ConfigKey): ResolvedValue {
    for (const source of this.sources) {
      const value = source.read(product, key);
      if (value !== undefined) {
        return { value, from: { sourceId: source.id, detail: source.describe() } };
      }
    }
    return { value: undefined };
  }

  locate(product: ProductDefinition, key: ConfigKey): SourceLocation[] {
    const locations: SourceLocation[] = [];
    for (const source of this.sources) {
      if (source.read(product, key) !== undefined) {
        locations.push({ sourceId: source.id, detail: source.describe() });
      }
    }
    return locations;
  }

  getWritableSource<T extends WritableSource>(
    predicate: (s: WritableSource) => s is T,
  ): T | undefined {
    for (const source of this.sources) {
      if (isWritableSource(source) && predicate(source)) {
        return source;
      }
    }
    return undefined;
  }
}

export function buildDefaultRegistry(): DefaultConfigRegistry {
  return new DefaultConfigRegistry([
    new ProcessEnvSource(),
    new EnvFileSource(),
    new HomeFileSource(),
    new MacosKeychainSource(),
  ]);
}
