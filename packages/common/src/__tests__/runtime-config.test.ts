import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('runtime config loader', () => {
  const originalEnv = process.env;
  let tempDir: string;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.ATLASSIAN_DC_MCP_CONFIG_FILE;
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlassian-dc-mcp-config-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('loads an explicit shared config file', async () => {
    const sharedConfigPath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\n');
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../runtime-config.js');

    initializeRuntimeConfig({ cwd: tempDir });

    expect(getProductRuntimeConfig('jira')).toEqual({
      host: 'file-host',
      apiBasePath: undefined,
      token: 'file-token',
      defaultPageSize: 25,
    });
  });

  it('throws when the explicit shared config file is missing', async () => {
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = path.join(tempDir, 'missing.env');

    const { initializeRuntimeConfig } = await import('../runtime-config.js');

    expect(() => initializeRuntimeConfig({ cwd: tempDir })).toThrow(
      `ATLASSIAN_DC_MCP_CONFIG_FILE points to a missing file: ${path.join(tempDir, 'missing.env')}`,
    );
  });

  it('requires an absolute shared config file path', async () => {
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = 'relative/shared.env';

    const { initializeRuntimeConfig } = await import('../runtime-config.js');

    expect(() => initializeRuntimeConfig({ cwd: tempDir })).toThrow(
      'ATLASSIAN_DC_MCP_CONFIG_FILE must be an absolute path: relative/shared.env',
    );
  });

  it('keeps environment variables higher priority than file values', async () => {
    const sharedConfigPath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\nJIRA_DEFAULT_PAGE_SIZE=50\n');
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;
    process.env.JIRA_API_TOKEN = 'env-token';
    process.env.JIRA_DEFAULT_PAGE_SIZE = '10';

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../runtime-config.js');

    initializeRuntimeConfig({ cwd: tempDir });

    expect(getProductRuntimeConfig('jira')).toEqual({
      host: 'file-host',
      apiBasePath: undefined,
      token: 'env-token',
      defaultPageSize: 10,
    });
  });

  it('falls back to the cwd .env file when no explicit shared file is configured', async () => {
    fs.writeFileSync(
      path.join(tempDir, '.env'),
      'CONFLUENCE_HOST=cwd-host\nCONFLUENCE_API_TOKEN=cwd-token\nCONFLUENCE_DEFAULT_PAGE_SIZE=30\n',
    );

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../runtime-config.js');

    initializeRuntimeConfig({ cwd: tempDir });

    expect(getProductRuntimeConfig('confluence')).toEqual({
      host: 'cwd-host',
      apiBasePath: undefined,
      token: 'cwd-token',
      defaultPageSize: 30,
    });
  });

  it('refreshes the cached file when its mtime changes', async () => {
    const sharedConfigPath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(sharedConfigPath, 'BITBUCKET_HOST=file-host\nBITBUCKET_API_TOKEN=token-a\n');
    const initialTime = new Date('2026-01-01T00:00:00.000Z');
    fs.utimesSync(sharedConfigPath, initialTime, initialTime);
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../runtime-config.js');

    initializeRuntimeConfig({ cwd: tempDir });
    expect(getProductRuntimeConfig('bitbucket').token).toBe('token-a');

    fs.writeFileSync(sharedConfigPath, 'BITBUCKET_HOST=file-host\nBITBUCKET_API_TOKEN=token-b\n');
    const updatedTime = new Date('2026-01-01T00:00:01.000Z');
    fs.utimesSync(sharedConfigPath, updatedTime, updatedTime);

    expect(getProductRuntimeConfig('bitbucket').token).toBe('token-b');
  });
});
