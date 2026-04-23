import { MacosKeychainSource, SECURITY_BINARY, type KeychainDeps } from '../../sources/macos-keychain.js';
import type { ProductDefinition } from '../../source.js';

const JIRA: ProductDefinition = {
  id: 'jira',
  envVars: {
    host: 'JIRA_HOST',
    apiBasePath: 'JIRA_API_BASE_PATH',
    token: 'JIRA_API_TOKEN',
    defaultPageSize: 'JIRA_DEFAULT_PAGE_SIZE',
  },
};

function makeDeps(overrides: Partial<KeychainDeps> = {}) {
  return {
    execFileSync: jest.fn(),
    existsSync: jest.fn(() => true),
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
    const deps = makeDeps({ existsSync: jest.fn(() => false) });
    expect(new MacosKeychainSource(deps).isAvailable()).toBe(false);
  });

  it('read returns token on success and strips trailing newline', () => {
    const execFileSync = jest.fn().mockReturnValueOnce('secret-token\n');
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
    const execFileSync = jest.fn().mockImplementationOnce(() => {
      const err: NodeJS.ErrnoException & { status?: number } = new Error('not found');
      err.status = 44;
      throw err;
    });
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(source.read(JIRA, 'token')).toBeUndefined();
  });

  it('read returns undefined when keychain is locked (non-44)', () => {
    const execFileSync = jest.fn().mockImplementationOnce(() => {
      const err: NodeJS.ErrnoException & { status?: number } = new Error('auth failed');
      err.status = 128;
      throw err;
    });
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(source.read(JIRA, 'token')).toBeUndefined();
  });

  it('read returns undefined for non-token keys without invoking security', () => {
    const execFileSync = jest.fn();
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(source.read(JIRA, 'host')).toBeUndefined();
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it('caches reads', () => {
    const execFileSync = jest.fn().mockReturnValueOnce('cached\n');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    source.read(JIRA, 'token');
    source.read(JIRA, 'token');
    source.read(JIRA, 'token');
    expect(execFileSync).toHaveBeenCalledTimes(1);
  });

  it('write uses -U flag', () => {
    const execFileSync = jest.fn().mockReturnValueOnce('');
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    source.write(JIRA, 'token', 'abc');
    expect(execFileSync).toHaveBeenCalledWith(
      SECURITY_BINARY,
      ['add-generic-password', '-U', '-s', 'atlassian-dc-mcp', '-a', 'jira-token', '-w', 'abc'],
      expect.objectContaining({ encoding: 'utf8' }),
    );
  });

  it('write throws when the key is not token', () => {
    const execFileSync = jest.fn();
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(() => source.write(JIRA, 'host', 'x')).toThrow(/only stores the token/);
    expect(execFileSync).not.toHaveBeenCalled();
  });

  it('round-trips a token containing shell metacharacters', () => {
    const tricky = 'a\'b"c$d`e';
    const execFileSync = jest
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
    const execFileSync = jest.fn().mockImplementationOnce(() => '');
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
    const execFileSync = jest.fn().mockImplementationOnce(() => {
      throw new Error('not found');
    });
    const source = new MacosKeychainSource(makeDeps({ execFileSync: execFileSync as any }));
    expect(() => source.clear(JIRA, 'token')).not.toThrow();
  });
});
