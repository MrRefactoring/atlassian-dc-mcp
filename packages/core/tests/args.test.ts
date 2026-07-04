import { parseSetupArgs, printSetupHelp, SetupArgsError } from '../setup/args.js';

describe('parseSetupArgs', () => {
  it('returns defaults for an empty argv', () => {
    const args = parseSetupArgs([]);
    expect(args).toEqual({
      host: undefined,
      apiBasePath: undefined,
      token: undefined,
      username: undefined,
      password: undefined,
      defaultPageSize: undefined,
      profile: undefined,
      nonInteractive: false,
      help: false,
    });
  });

  it('parses every supported flag with = form and space form', () => {
    const args = parseSetupArgs([
      '--host=jira.example.com',
      '--api-base-path',
      '/rest/api/2',
      '--token=secret',
      '--username=jdoe',
      '--password=hunter2',
      '--default-page-size=50',
      '--profile=work',
      '--non-interactive',
    ]);
    expect(args).toEqual({
      host: 'jira.example.com',
      apiBasePath: '/rest/api/2',
      token: 'secret',
      username: 'jdoe',
      password: 'hunter2',
      defaultPageSize: '50',
      profile: 'work',
      nonInteractive: true,
      help: false,
    });
  });

  it('treats whitespace-only and empty values as not provided', () => {
    const args = parseSetupArgs(['--host=', '--token=   ', '--username=', '--password=   ', '--profile=   ']);
    expect(args.host).toBeUndefined();
    expect(args.token).toBeUndefined();
    expect(args.username).toBeUndefined();
    expect(args.password).toBeUndefined();
    expect(args.profile).toBeUndefined();
  });

  it('supports -h as short alias for --help', () => {
    expect(parseSetupArgs(['-h']).help).toBe(true);
    expect(parseSetupArgs(['--help']).help).toBe(true);
  });

  it('supports short aliases for every flag', () => {
    const args = parseSetupArgs([
      '-H', 'jira.example.com',
      '-b', '/rest/api/2',
      '-t', 'short-token',
      '-u', 'jdoe',
      '-p', 'hunter2',
      '-s', '50',
      '-P', 'work',
      '-n',
    ]);
    expect(args).toEqual({
      host: 'jira.example.com',
      apiBasePath: '/rest/api/2',
      token: 'short-token',
      username: 'jdoe',
      password: 'hunter2',
      defaultPageSize: '50',
      profile: 'work',
      nonInteractive: true,
      help: false,
    });
  });

  describe('short alias mapping', () => {
    it('-H sets host', () => {
      expect(parseSetupArgs(['-H', 'jira.example.com']).host).toBe('jira.example.com');
    });

    it('-b sets api-base-path', () => {
      expect(parseSetupArgs(['-b', '/rest/api/2']).apiBasePath).toBe('/rest/api/2');
    });

    it('-t sets token', () => {
      expect(parseSetupArgs(['-t', 'secret']).token).toBe('secret');
    });

    it('-u sets username', () => {
      expect(parseSetupArgs(['-u', 'jdoe']).username).toBe('jdoe');
    });

    it('-p sets password', () => {
      expect(parseSetupArgs(['-p', 'hunter2']).password).toBe('hunter2');
    });

    it('-s sets default-page-size', () => {
      expect(parseSetupArgs(['-s', '100']).defaultPageSize).toBe('100');
    });

    it('-P sets profile', () => {
      expect(parseSetupArgs(['-P', 'work']).profile).toBe('work');
    });

    it('-n sets non-interactive', () => {
      expect(parseSetupArgs(['-n']).nonInteractive).toBe(true);
    });

    it('short and long forms produce identical output', () => {
      const short = parseSetupArgs([
        '-H', 'jira.example.com',
        '-b', '/rest',
        '-t', 'tok',
        '-u', 'jdoe',
        '-p', 'hunter2',
        '-s', '25',
        '-P', 'work',
        '-n',
      ]);
      const long = parseSetupArgs([
        '--host', 'jira.example.com',
        '--api-base-path', '/rest',
        '--token', 'tok',
        '--username', 'jdoe',
        '--password', 'hunter2',
        '--default-page-size', '25',
        '--profile', 'work',
        '--non-interactive',
      ]);
      expect(short).toEqual(long);
    });

    it('-H is not aliased to help (lowercase -h is help, uppercase -H is host)', () => {
      expect(parseSetupArgs(['-H', 'jira.example.com']).help).toBe(false);
      expect(parseSetupArgs(['-h']).help).toBe(true);
      expect(parseSetupArgs(['-h']).host).toBeUndefined();
    });

    it('rejects unknown single-letter flags', () => {
      expect(() => parseSetupArgs(['-x'])).toThrow(SetupArgsError);
    });
  });

  it('throws SetupArgsError on an unknown flag', () => {
    expect(() => parseSetupArgs(['--unknown'])).toThrow(SetupArgsError);
  });

  it('throws SetupArgsError on a stray positional', () => {
    expect(() => parseSetupArgs(['extra'])).toThrow(SetupArgsError);
  });
});

describe('printSetupHelp', () => {
  it('emits product-aware lines including the home file path', () => {
    const out: string[] = [];
    printSetupHelp('jira', (m) => out.push(m));
    const joined = out.join('\n');
    expect(joined).toContain('jira-datacenter-mcp setup');
    expect(joined).toContain('--non-interactive');
    expect(joined).toContain('~/.atlassian-dc-mcp/jira.env');
  });
});
