import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from 'datacenter-mcp-core';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getJiraRuntimeConfig } from '../src/config.js';
import { JiraService } from '../src/jiraService.js';

// Integration: credentials flow config file -> JiraService -> createJiraClient ->
// the shared httpClient, which resolves the (lazy) credential thunks per request.
// We assert on the Authorization header the client puts on the real fetch call.
describe('Jira runtime config integration', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;
  let tempDir: string;
  let sharedConfigPath: string;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env = { ...originalEnv };
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-runtime-config-'));
    sharedConfigPath = path.join(tempDir, 'shared.env');
    process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;
    fetchMock = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
      new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const lastAuth = () => (fetchMock.mock.calls.at(-1)![1]!.headers as Headers).get('Authorization');

  const makeService = () => {
    const cfg = getJiraRuntimeConfig();

    return new JiraService(
      cfg.host,
      () => getJiraRuntimeConfig().token,
      cfg.apiBasePath,
      () => getJiraRuntimeConfig().defaultPageSize,
      () => getJiraRuntimeConfig().username,
      () => getJiraRuntimeConfig().password,
    );
  };

  it('refreshes the bearer token from the shared config file without recreating the service', async () => {
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=token-a\nJIRA_DEFAULT_PAGE_SIZE=30\n');
    const initialTime = new Date('2026-01-01T00:00:00.000Z');
    fs.utimesSync(sharedConfigPath, initialTime, initialTime);
    initializeRuntimeConfig({ cwd: tempDir });

    const jiraService = makeService();
    await jiraService.getServerInfo();
    expect(lastAuth()).toBe('Bearer token-a');

    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=token-b\nJIRA_DEFAULT_PAGE_SIZE=45\n');
    const updatedTime = new Date('2026-01-01T00:00:01.000Z');
    fs.utimesSync(sharedConfigPath, updatedTime, updatedTime);

    await jiraService.getServerInfo();
    expect(lastAuth()).toBe('Bearer token-b');
    expect(getJiraRuntimeConfig().defaultPageSize).toBe(45);
  });

  it('omits the Authorization header entirely for anonymous access when no token is configured', async () => {
    fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_DEFAULT_PAGE_SIZE=30\n');
    initializeRuntimeConfig({ cwd: tempDir });

    const jiraService = makeService();
    await jiraService.getServerInfo();
    expect(lastAuth()).toBeNull();
  });

  it('sends Basic auth when username/password are configured instead of a token', async () => {
    fs.writeFileSync(
      sharedConfigPath,
      'JIRA_HOST=file-host\nJIRA_USERNAME=jdoe\nJIRA_PASSWORD=hunter2\nJIRA_DEFAULT_PAGE_SIZE=30\n',
    );
    initializeRuntimeConfig({ cwd: tempDir });

    const jiraService = makeService();
    await jiraService.getServerInfo();
    expect(lastAuth()).toBe(`Basic ${Buffer.from('jdoe:hunter2').toString('base64')}`);
  });

  it('prefers Basic auth over a Bearer token when both are configured', async () => {
    fs.writeFileSync(
      sharedConfigPath,
      'JIRA_HOST=file-host\nJIRA_API_TOKEN=token-a\nJIRA_USERNAME=jdoe\nJIRA_PASSWORD=hunter2\nJIRA_DEFAULT_PAGE_SIZE=30\n',
    );
    initializeRuntimeConfig({ cwd: tempDir });

    const jiraService = makeService();
    await jiraService.getServerInfo();
    expect(lastAuth()).toBe(`Basic ${Buffer.from('jdoe:hunter2').toString('base64')}`);
  });
});
