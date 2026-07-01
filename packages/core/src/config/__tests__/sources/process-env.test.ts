import { ProcessEnvSource } from '../../sources/process-env.js';
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

const CONFLUENCE: ProductDefinition = {
  id: 'confluence',
  envVars: {
    host: 'CONFLUENCE_HOST',
    apiBasePath: 'CONFLUENCE_API_BASE_PATH',
    token: 'CONFLUENCE_API_TOKEN',
    defaultPageSize: 'CONFLUENCE_DEFAULT_PAGE_SIZE',
  },
};

describe('ProcessEnvSource', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.JIRA_HOST;
    delete process.env.JIRA_API_TOKEN;
    delete process.env.CONFLUENCE_HOST;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('maps product+key to the correct env var', () => {
    process.env.JIRA_HOST = 'j-host';
    process.env.JIRA_API_TOKEN = 'j-token';
    process.env.CONFLUENCE_HOST = 'c-host';
    const source = new ProcessEnvSource();
    expect(source.read(JIRA, 'host')).toBe('j-host');
    expect(source.read(JIRA, 'token')).toBe('j-token');
    expect(source.read(CONFLUENCE, 'host')).toBe('c-host');
  });

  it('returns undefined for absent or whitespace-only values', () => {
    const source = new ProcessEnvSource();
    expect(source.read(JIRA, 'host')).toBeUndefined();
    process.env.JIRA_HOST = '   ';
    expect(source.read(JIRA, 'host')).toBeUndefined();
  });

  it('trims surrounding whitespace', () => {
    process.env.JIRA_HOST = '  j-host  ';
    expect(new ProcessEnvSource().read(JIRA, 'host')).toBe('j-host');
  });
});
