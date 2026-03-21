import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from '@atlassian-dc-mcp/common';
import { getJiraRuntimeConfig } from '../config.js';
import { JiraService } from '../jira-service.js';
import { OpenAPI } from '../jira-client/core/OpenAPI.js';
import { getHeaders } from '../jira-client/core/request.js';

describe('Jira runtime config integration', () => {
  const originalEnv = process.env;
  let tempDir: string;
  let sharedConfigPath: string;

  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-runtime-config-'));
    sharedConfigPath = path.join(tempDir, 'shared.env');
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('refreshes the bearer token from the shared config file without recreating the service', async () => {
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=token-a\nJIRA_DEFAULT_PAGE_SIZE=30\n');
    const initialTime = new Date('2026-01-01T00:00:00.000Z');
    fs.utimesSync(sharedConfigPath, initialTime, initialTime);
    initializeRuntimeConfig({ cwd: tempDir });

    const startupConfig = getJiraRuntimeConfig();
    new JiraService(
      startupConfig.host,
      () => getJiraRuntimeConfig().token,
      startupConfig.apiBasePath,
      () => getJiraRuntimeConfig().defaultPageSize,
    );

    const firstHeaders = await getHeaders(OpenAPI, { method: 'GET', url: '/issue' });
    expect(firstHeaders.get('Authorization')).toBe('Bearer token-a');

    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=token-b\nJIRA_DEFAULT_PAGE_SIZE=45\n');
    const updatedTime = new Date('2026-01-01T00:00:01.000Z');
    fs.utimesSync(sharedConfigPath, updatedTime, updatedTime);

    const secondHeaders = await getHeaders(OpenAPI, { method: 'GET', url: '/issue' });
    expect(secondHeaders.get('Authorization')).toBe('Bearer token-b');
    expect(getJiraRuntimeConfig().defaultPageSize).toBe(45);
  });
});
