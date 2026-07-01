import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EnvFileSource, ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR } from '../../sources/env-file.js';
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

const BITBUCKET: ProductDefinition = {
  id: 'bitbucket',
  envVars: {
    host: 'BITBUCKET_HOST',
    apiBasePath: 'BITBUCKET_API_BASE_PATH',
    token: 'BITBUCKET_API_TOKEN',
    defaultPageSize: 'BITBUCKET_DEFAULT_PAGE_SIZE',
  },
};

describe('EnvFileSource', () => {
  const originalEnv = process.env;
  let tempDir: string;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR];
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-file-src-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('reads an explicit shared config file', () => {
    const filePath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(filePath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\n');
    process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR] = filePath;
    const source = new EnvFileSource();
    source.initialize({ cwd: tempDir });
    expect(source.read(JIRA, 'host')).toBe('file-host');
    expect(source.read(JIRA, 'token')).toBe('file-token');
  });

  it('reads cwd/.env when no explicit file is configured', () => {
    fs.writeFileSync(path.join(tempDir, '.env'), 'BITBUCKET_HOST=cwd-host\n');
    const source = new EnvFileSource();
    source.initialize({ cwd: tempDir });
    expect(source.read(BITBUCKET, 'host')).toBe('cwd-host');
  });

  it('throws when explicit file is relative', () => {
    process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR] = 'relative/shared.env';
    const source = new EnvFileSource();
    expect(() => source.initialize({ cwd: tempDir })).toThrow(/must be an absolute path/);
  });

  it('throws when explicit file is missing', () => {
    const missing = path.join(tempDir, 'missing.env');
    process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR] = missing;
    const source = new EnvFileSource();
    expect(() => source.initialize({ cwd: tempDir })).toThrow(
      `${ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR} points to a missing file: ${missing}`,
    );
  });

  it('revalidates cache when mtime changes', () => {
    const filePath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(filePath, 'JIRA_API_TOKEN=token-a\n');
    const initial = new Date('2026-01-01T00:00:00.000Z');
    fs.utimesSync(filePath, initial, initial);
    process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR] = filePath;

    const source = new EnvFileSource();
    source.initialize({ cwd: tempDir });
    expect(source.read(JIRA, 'token')).toBe('token-a');

    fs.writeFileSync(filePath, 'JIRA_API_TOKEN=token-b\n');
    const updated = new Date('2026-01-01T00:00:01.000Z');
    fs.utimesSync(filePath, updated, updated);
    expect(source.read(JIRA, 'token')).toBe('token-b');
  });

  it('returns empty object when cwd/.env is missing', () => {
    const source = new EnvFileSource();
    source.initialize({ cwd: tempDir });
    expect(source.read(JIRA, 'host')).toBeUndefined();
  });

  it('evicts cache when an explicit file disappears after a successful read', () => {
    const filePath = path.join(tempDir, 'shared.env');
    fs.writeFileSync(filePath, 'JIRA_API_TOKEN=token-a\n');
    process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR] = filePath;
    const source = new EnvFileSource();
    source.initialize({ cwd: tempDir });
    expect(source.read(JIRA, 'token')).toBe('token-a');

    fs.unlinkSync(filePath);
    expect(() => source.read(JIRA, 'token')).toThrow(
      `${ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR} points to a missing file: ${filePath}`,
    );
  });
});
