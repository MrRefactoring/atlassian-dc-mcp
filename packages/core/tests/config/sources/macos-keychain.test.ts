import { describe, expect, it, vi } from 'vitest';
import { MacosKeychainSource, SECURITY_BINARY, type KeychainDeps } from '../../../src/config/sources/macos-keychain.js';
import type { ProductDefinition } from '../../../src/config/source.js';

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
};

function makeDeps(overrides: Partial<KeychainDeps> = {}) {
  return {
    execFileSync: vi.fn(),
    existsSync: vi.fn(() => true),
    getPlatform: () => 'darwin' as NodeJS.Platform,
    ...overrides,
  };
}

describe('MacosKeychainSource', () => {
  it('isAvailable is true on darwin when binary exists', () => {
    expect(new MacosKeychainSource(makeDeps()).isAvailable()).toBe(true);
  });

  it('isAvailable is false off darwin', () => {
    const deps = makeDeps({ getPlatform: () => 'linux' as NodeJS.Platform });
    expect(new MacosKeychainSource(deps).isAvailable()).toBe(false);
  });

  it('isAvailable is false when binary is missing', () => {
    const deps = makeDeps({ existsSync: vi.fn(() => false) });
    expect(new MacosKeychainSource(deps).isAvailable()).toBe(false);
  });

  it('read returns token on success and strips trailing newline', () => {
    const execFileSync = vi.fn().mockReturnValueOnce('secret-token\n');
    const deps = makeDeps({ execFileSync: execFileSync as unknown as KeychainDeps['execFileSync'] });
    const source = new MacosKeychainSource(deps);
    expect(source.read(JIRA, 'token')).toBe('secret-token');
    expect(execFileSync).toHaveBeenCalledWith(
      SECURITY_BINARY,
      ['find-generic-password', '-s', 'atlassian-dc-mcp', '-a', 'jira-token', '-w'],
      expect.objectContaining({ encoding: 'utf8', timeout: 5000 }),
    );
  });

  it('read returns undefined when security exits non-zero (not found)', () => {
    const execFileSync = vi.fn().mockImplementationOnce(() => {
      const err: NodeJS.ErrnoException & { status?: number } = new Error('not found');
      err.status = 44;
      throw err;
    });
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(source.read(JIRA, 'token')).toBeUndefined();
  });

  it('read returns undefined when keychain is locked (non-44)', () => {
    const execFileSync = vi.fn().mockImplementationOnce(() => {
      const err: NodeJS.ErrnoException & { status?: number } = new Error('auth failed');
      err.status = 128;
      throw err;
    });
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(source.read(JIRA, 'token')).toBeUndefined();
  });

  it('read returns undefined for non-token keys without invoking security', () => {
    const execFileSync = vi.fn();
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(source.read(JIRA, 'host')).toBeUndefined();
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it('caches reads', () => {
    const execFileSync = vi.fn().mockReturnValueOnce('cached\n');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    source.read(JIRA, 'token');
    source.read(JIRA, 'token');
    source.read(JIRA, 'token');
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });

  it('write uses -U flag', () => {
    const execFileSync = vi.fn().mockReturnValueOnce('');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    source.write(JIRA, 'token', 'abc');
    expect(execFileSync).toHaveBeenCalledWith(
      SECURITY_BINARY,
      ['add-generic-password', '-U', '-s', 'atlassian-dc-mcp', '-a', 'jira-token', '-w', 'abc'],
      expect.objectContaining({ encoding: 'utf8' }),
    );
  });

  it('write throws when the key is not token or password', () => {
    const execFileSync = vi.fn();
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(() => source.write(JIRA, 'host', 'x')).toThrow(/only stores the token and password keys/);
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it('supports password with its own keychain account, independent from token', () => {
    const execFileSync = vi.fn().mockReturnValue('');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));

    source.write(JIRA, 'password', 'the-password');
    expect(execFileSync).toHaveBeenNthCalledWith(
      1,
      SECURITY_BINARY,
      ['add-generic-password', '-U', '-s', 'atlassian-dc-mcp', '-a', 'jira-password', '-w', 'the-password'],
      expect.objectContaining({ encoding: 'utf8' }),
    );

    expect(source.read(JIRA, 'password')).toBe('the-password');
    expect(execFileSync).toHaveBeenCalledTimes(1); // read hit cache from the write, not a fresh find

    source.clear(JIRA, 'password');
    expect(execFileSync).toHaveBeenNthCalledWith(
      2,
      SECURITY_BINARY,
      ['delete-generic-password', '-s', 'atlassian-dc-mcp', '-a', 'jira-password'],
      expect.any(Object),
    );
    expect(source.read(JIRA, 'password')).toBeUndefined();
  });

  it('caches token and password independently', () => {
    const execFileSync = vi
      .fn()
      .mockReturnValueOnce('token-value\n')
      .mockReturnValueOnce('password-value\n');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));

    expect(source.read(JIRA, 'token')).toBe('token-value');
    expect(source.read(JIRA, 'password')).toBe('password-value');
    expect(source.read(JIRA, 'token')).toBe('token-value');
    expect(source.read(JIRA, 'password')).toBe('password-value');
    expect(execFileSync).toHaveBeenCalledTimes(2);
  });

  it('round-trips a token containing shell metacharacters', () => {
    const tricky = 'a\'b"c$d`e';
    const execFileSync = vi
      .fn()
      .mockImplementationOnce(() => '')
      .mockImplementationOnce(() => `${tricky}\n`);
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    source.write(JIRA, 'token', tricky);
    expect(source.read(JIRA, 'token')).toBe(tricky);
    const writeArgs = execFileSync.mock.calls[0][1] as string[];
    expect(writeArgs[writeArgs.length - 1]).toBe(tricky);
  });

  it('clear invokes delete-generic-password and caches undefined', () => {
    const execFileSync = vi.fn().mockImplementationOnce(() => '');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    source.clear(JIRA, 'token');
    expect(execFileSync).toHaveBeenCalledWith(
      SECURITY_BINARY,
      ['delete-generic-password', '-s', 'atlassian-dc-mcp', '-a', 'jira-token'],
      expect.any(Object),
    );
    expect(source.read(JIRA, 'token')).toBeUndefined();
  });

  it('clear swallows errors', () => {
    const execFileSync = vi.fn().mockImplementationOnce(() => {
      throw new Error('not found');
    });
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(() => source.clear(JIRA, 'token')).not.toThrow();
  });

  describe('profiles', () => {
    it('write uses a profile-suffixed account name', () => {
      const execFileSync = vi.fn().mockReturnValueOnce('');
      const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }), { profile: 'work' });
      source.write(JIRA, 'token', 'abc');
      expect(execFileSync).toHaveBeenCalledWith(
        SECURITY_BINARY,
        ['add-generic-password', '-U', '-s', 'atlassian-dc-mcp', '-a', 'jira-work-token', '-w', 'abc'],
        expect.objectContaining({ encoding: 'utf8' }),
      );
    });

    it('a profiled source and the default source use different accounts and do not share storage', () => {
      const store = new Map<string, string>();
      const execFileSync = vi.fn((_bin: string, args: string[]) => {
        const accountIndex = args.indexOf('-a') + 1;
        const account = args[accountIndex];
        if (args[0] === 'add-generic-password') {
          store.set(account, args[args.indexOf('-w') + 1]);

          return '';
        }
        if (args[0] === 'find-generic-password') {
          if (!store.has(account)) {
            const err: NodeJS.ErrnoException & { status?: number } = new Error('not found');
            err.status = 44;
            throw err;
          }

          return `${store.get(account)}\n`;
        }

        return '';
      });
      const deps = makeDeps({ execFileSync: execFileSync as any });
      const defaultSource = new MacosKeychainSource(deps);
      const workSource = new MacosKeychainSource(deps, { profile: 'work' });

      defaultSource.write(JIRA, 'token', 'default-token');
      workSource.write(JIRA, 'token', 'work-token');

      expect(defaultSource.read(JIRA, 'token')).toBe('default-token');
      expect(workSource.read(JIRA, 'token')).toBe('work-token');
      expect(store.get('jira-token')).toBe('default-token');
      expect(store.get('jira-work-token')).toBe('work-token');
    });
  });
});
