import { resolveOpenApiBase } from '../resolve-base.js';

describe('resolveOpenApiBase', () => {
  it('combines bare host with default base path', () => {
    const base = resolveOpenApiBase({
      host: 'jira.example.com',
      defaultBasePath: '/rest',
    });
    expect(base).toBe('https://jira.example.com/rest');
  });

  it('uses an explicit apiBasePath when it is a path', () => {
    const base = resolveOpenApiBase({
      host: 'jira.example.com',
      apiBasePath: '/custom',
      defaultBasePath: '/rest',
    });
    expect(base).toBe('https://jira.example.com/custom');
  });

  it('uses an empty default for confluence-style generated paths', () => {
    const base = resolveOpenApiBase({
      host: 'wiki.example.com',
      defaultBasePath: '',
    });
    expect(base).toBe('https://wiki.example.com');
  });

  it('accepts a fully-qualified apiBasePath as a full URL override', () => {
    const base = resolveOpenApiBase({
      host: 'ignored.example.com',
      apiBasePath: 'https://real.example.com/rest',
      defaultBasePath: '/rest',
    });
    expect(base).toBe('https://real.example.com/rest');
  });

  it('strips known generated suffix included by mistake (jira)', () => {
    const base = resolveOpenApiBase({
      host: 'jira.example.com',
      apiBasePath: '/rest/api/2',
      defaultBasePath: '/rest',
      strippableSuffixes: ['/api/2'],
    });
    expect(base).toBe('https://jira.example.com/rest');
  });

  it('strips known generated suffix included by mistake (bitbucket)', () => {
    const base = resolveOpenApiBase({
      host: 'bb.example.com',
      apiBasePath: '/rest/api/1.0',
      defaultBasePath: '/rest',
      strippableSuffixes: ['/api/1.0', '/api/latest'],
    });
    expect(base).toBe('https://bb.example.com/rest');
  });

  it('strips known generated suffix included by mistake (confluence)', () => {
    const base = resolveOpenApiBase({
      host: 'wiki.example.com',
      apiBasePath: '/rest/api',
      defaultBasePath: '',
      strippableSuffixes: ['/rest/api', '/rest'],
    });
    expect(base).toBe('https://wiki.example.com');
  });

  it('preserves a host that already includes a scheme', () => {
    const base = resolveOpenApiBase({
      host: 'https://jira.example.com/',
      defaultBasePath: '/rest',
    });
    expect(base).toBe('https://jira.example.com/rest');
  });

  it('throws when host and apiBasePath are both missing', () => {
    expect(() =>
      resolveOpenApiBase({ defaultBasePath: '/rest' }),
    ).toThrow('host or apiBasePath must be provided');
  });
});
