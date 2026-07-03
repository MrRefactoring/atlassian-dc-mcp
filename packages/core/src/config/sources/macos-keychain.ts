import { execFileSync as nodeExecFileSync } from 'node:child_process';
import { existsSync as nodeExistsSync } from 'node:fs';
import type { ConfigKey, ProductDefinition, SourceId, WritableSource } from '../source.js';

// We pass the token via `-w <value>` on write. `security add-generic-password`
// has no stdin-password mode, so the token is visible in argv to same-user
// processes. A same-user attacker already has keychain access via `security`
// itself; this does not widen the attack surface.

export const SECURITY_BINARY = '/usr/bin/security';
export const KEYCHAIN_SERVICE = 'atlassian-dc-mcp';
const KEYCHAIN_TIMEOUT_MS = 5000;
export const NOT_FOUND_STATUS = 44;

export type KeychainDeps = {
  execFileSync: typeof nodeExecFileSync;
  existsSync: typeof nodeExistsSync;
  getPlatform: () => NodeJS.Platform;
};

// Secrets storable in Keychain. 'token' keeps its original (suffix-less-named)
// account for backward compatibility with entries written before 'password'
// support existed; 'password' gets its own account so both can coexist.
type KeychainSecretKey = 'token' | 'password';

function isKeychainSecretKey(key: ConfigKey): key is KeychainSecretKey {
  return key === 'token' || key === 'password';
}

function accountFor(product: ProductDefinition, key: KeychainSecretKey): string {
  return `${product.id}-${key}`;
}

function cacheKeyFor(product: ProductDefinition, key: KeychainSecretKey): string {
  return `${product.id}:${key}`;
}

const DEFAULT_DEPS: KeychainDeps = {
  execFileSync: nodeExecFileSync,
  existsSync: nodeExistsSync,
  getPlatform: () => process.platform,
};

export class MacosKeychainSource implements WritableSource {
  readonly id: SourceId = 'macos-keychain';
  readonly priority = 40;

  private cache = new Map<string, string | undefined>();
  private cacheWarmed = new Set<string>();
  private readonly deps: KeychainDeps;

  constructor(deps: Partial<KeychainDeps> = {}) {
    this.deps = { ...DEFAULT_DEPS, ...deps };
  }

  isAvailable(): boolean {
    return this.deps.getPlatform() === 'darwin' && this.deps.existsSync(SECURITY_BINARY);
  }

  read(product: ProductDefinition, key: ConfigKey): string | undefined {
    if (!isKeychainSecretKey(key) || !this.isAvailable()) {
      return undefined;
    }
    const cacheKey = cacheKeyFor(product, key);
    if (this.cacheWarmed.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const value = this.findPassword(product, key);
    this.cache.set(cacheKey, value);
    this.cacheWarmed.add(cacheKey);
    return value;
  }

  describe(): string {
    return 'macOS Keychain';
  }

  write(product: ProductDefinition, key: ConfigKey, value: string): void {
    if (!isKeychainSecretKey(key)) {
      throw new Error('macOS Keychain only stores the token and password keys');
    }
    if (!this.isAvailable()) {
      throw new Error('macOS Keychain is not available on this platform');
    }
    this.deps.execFileSync(
      SECURITY_BINARY,
      [
        'add-generic-password',
        '-U',
        '-s', KEYCHAIN_SERVICE,
        '-a', accountFor(product, key),
        '-w', value,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: KEYCHAIN_TIMEOUT_MS },
    );
    const cacheKey = cacheKeyFor(product, key);
    this.cache.set(cacheKey, value);
    this.cacheWarmed.add(cacheKey);
  }

  clear(product: ProductDefinition, key: ConfigKey): void {
    if (!isKeychainSecretKey(key) || !this.isAvailable()) {
      return;
    }
    try {
      this.deps.execFileSync(
        SECURITY_BINARY,
        ['delete-generic-password', '-s', KEYCHAIN_SERVICE, '-a', accountFor(product, key)],
        { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: KEYCHAIN_TIMEOUT_MS },
      );
    } catch {
      // absent / already cleared — non-fatal
    }
    const cacheKey = cacheKeyFor(product, key);
    this.cache.set(cacheKey, undefined);
    this.cacheWarmed.add(cacheKey);
  }

  private findPassword(product: ProductDefinition, key: KeychainSecretKey): string | undefined {
    try {
      const stdout = this.deps.execFileSync(
        SECURITY_BINARY,
        ['find-generic-password', '-s', KEYCHAIN_SERVICE, '-a', accountFor(product, key), '-w'],
        { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: KEYCHAIN_TIMEOUT_MS },
      );
      return String(stdout).replace(/\n$/, '');
    } catch {
      // exit 44 = not found; any other failure (locked keychain, etc.) is
      // treated as absent so the resolver continues down the chain.
      return undefined;
    }
  }
}
