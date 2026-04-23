import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ProductDefinition } from '../config/source.js';

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

const BITBUCKET: ProductDefinition = {
  id: 'bitbucket',
  envVars: {
    host: 'BITBUCKET_HOST',
    apiBasePath: 'BITBUCKET_API_BASE_PATH',
    token: 'BITBUCKET_API_TOKEN',
    defaultPageSize: 'BITBUCKET_DEFAULT_PAGE_SIZE',
  },
};

describe('runtime config facade', () => {
  const originalEnv = process.env;
  let tempDir: string;
  let tempHome: string;
  let homedirSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.ATLASSIAN_DC_MCP_CONFIG_FILE;
    delete process.env.JIRA_HOST;
    delete process.env.JIRA_API_TOKEN;
    delete process.env.JIRA_API_BASE_PATH;
    delete process.env.JIRA_DEFAULT_PAGE_SIZE;
    delete process.env.CONFLUENCE_HOST;
    delete process.env.CONFLUENCE_API_TOKEN;
    delete process.env.CONFLUENCE_DEFAULT_PAGE_SIZE;
    delete process.env.BITBUCKET_HOST;
    delete process.env.BITBUCKET_API_TOKEN;
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlassian-dc-mcp-config-'));
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'atlassian-dc-mcp-home-'));
    homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tempHome);
  });

  afterEach(() => {
    homedirSpy.mockRestore();
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.rmSync(tempHome, { recursive: true, force: true });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('loads an explicit shared config file', async () => {
    const sharedConfigPath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\n');
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../index.js');
    initializeRuntimeConfig({ cwd: tempDir });
    expect(getProductRuntimeConfig(JIRA)).toEqual({
      host: 'file-host',
      apiBasePath: undefined,
      token: 'file-token',
      defaultPageSize: 25,
    });
  });

  it('throws when the explicit shared config file is missing', async () => {
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = path.join(tempDir, 'missing.env');
    const { initializeRuntimeConfig } = await import('../index.js');
    expect(() => initializeRuntimeConfig({ cwd: tempDir })).toThrow(
      `ATLASSIAN_DC_MCP_CONFIG_FILE points to a missing file: ${path.join(tempDir, 'missing.env')}`,
    );
  });

  it('requires an absolute shared config file path', async () => {
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = 'relative/shared.env';
    const { initializeRuntimeConfig } = await import('../index.js');
    expect(() => initializeRuntimeConfig({ cwd: tempDir })).toThrow(
      'ATLASSIAN_DC_MCP_CONFIG_FILE must be an absolute path: relative/shared.env',
    );
  });

  it('keeps env variables higher priority than file values', async () => {
    const sharedConfigPath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\nJIRA_DEFAULT_PAGE_SIZE=50\n');
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;
    process.env.JIRA_API_TOKEN = 'env-token';
    process.env.JIRA_DEFAULT_PAGE_SIZE = '10';

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../index.js');
    initializeRuntimeConfig({ cwd: tempDir });
    expect(getProductRuntimeConfig(JIRA)).toEqual({
      host: 'file-host',
      apiBasePath: undefined,
      token: 'env-token',
      defaultPageSize: 10,
    });
  });

  it('falls back to cwd/.env when no explicit shared file is configured', async () => {
    fs.writeFileSync(
      path.join(tempDir, '.env'),
      'CONFLUENCE_HOST=cwd-host\nCONFLUENCE_API_TOKEN=cwd-token\nCONFLUENCE_DEFAULT_PAGE_SIZE=30\n',
    );
    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../index.js');
    initializeRuntimeConfig({ cwd: tempDir });
    expect(getProductRuntimeConfig(CONFLUENCE)).toEqual({
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

    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../index.js');
    initializeRuntimeConfig({ cwd: tempDir });
    expect(getProductRuntimeConfig(BITBUCKET).token).toBe('token-a');

    fs.writeFileSync(sharedConfigPath, 'BITBUCKET_HOST=file-host\nBITBUCKET_API_TOKEN=token-b\n');
    const updatedTime = new Date('2026-01-01T00:00:01.000Z');
    fs.utimesSync(sharedConfigPath, updatedTime, updatedTime);

    expect(getProductRuntimeConfig(BITBUCKET).token).toBe('token-b');
  });

  it('reads the home file when env and env-file are empty', async () => {
    fs.mkdirSync(path.join(tempHome, '.atlassian-dc-mcp'), { recursive: true });
    fs.writeFileSync(
      path.join(tempHome, '.atlassian-dc-mcp', 'jira.env'),
      'JIRA_HOST=home-host\nJIRA_API_TOKEN=home-token\n',
      { mode: 0o600 },
    );
    const { getProductRuntimeConfig, initializeRuntimeConfig } = await import('../index.js');
    initializeRuntimeConfig({ cwd: tempDir });
    const config = getProductRuntimeConfig(JIRA);
    expect(config.host).toBe('home-host');
    expect(config.token).toBe('home-token');
  });
});
