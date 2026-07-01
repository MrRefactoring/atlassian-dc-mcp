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

function accountFor(product: ProductDefinition): string {
  return `${product.id}-token`;
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
    if (key !== 'token' || !this.isAvailable()) {
      return undefined;
    }
    if (this.cacheWarmed.has(product.id)) {
      return this.cache.get(product.id);
    }
    const value = this.findPassword(product);
    this.cache.set(product.id, value);
    this.cacheWarmed.add(product.id);
    return value;
  }

  describe(): string {
    return 'macOS Keychain';
  }

  write(product: ProductDefinition, key: ConfigKey, value: string): void {
    if (key !== 'token') {
      throw new Error('macOS Keychain only stores the token key');
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
        '-a', accountFor(product),
        '-w', value,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: KEYCHAIN_TIMEOUT_MS },
    );
    this.cache.set(product.id, value);
    this.cacheWarmed.add(product.id);
  }

  clear(product: ProductDefinition, key: ConfigKey): void {
    if (key !== 'token' || !this.isAvailable()) {
      return;
    }
    try {
      this.deps.execFileSync(
        SECURITY_BINARY,
        ['delete-generic-password', '-s', KEYCHAIN_SERVICE, '-a', accountFor(product)],
        { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: KEYCHAIN_TIMEOUT_MS },
      );
    } catch {
      // absent / already cleared — non-fatal
    }
    this.cache.set(product.id, undefined);
    this.cacheWarmed.add(product.id);
  }

  private findPassword(product: ProductDefinition): string | undefined {
    try {
      const stdout = this.deps.execFileSync(
        SECURITY_BINARY,
        ['find-generic-password', '-s', KEYCHAIN_SERVICE, '-a', accountFor(product), '-w'],
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
