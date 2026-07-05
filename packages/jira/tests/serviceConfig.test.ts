import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from 'datacenter-mcp-core';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const createJiraClient = vi.hoisted(() => vi.fn((_config: unknown) => ({})));
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient }));

describe('JiraService', () => {
  // Unlike the other split files, every test here constructs its own JiraService
  // instance (to assert on the resulting OpenAPI state) or calls the static
  // validateConfig() method directly, so there is no shared jiraService instance.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor base URL resolution', () => {
    it('builds baseUrl from host + default /rest when apiBasePath is missing', () => {
      new JiraService('jira.example.com', 'test-token');
      expect(createJiraClient).toHaveBeenCalledWith(expect.objectContaining({ baseUrl: 'https://jira.example.com/rest' }));
    });

    it('strips accidentally-included /api/2 suffix from saved apiBasePath', () => {
      new JiraService('jira.example.com', 'test-token', '/rest/api/2');
      expect(createJiraClient).toHaveBeenCalledWith(expect.objectContaining({ baseUrl: 'https://jira.example.com/rest' }));
    });

    it('accepts a fully-qualified apiBasePath as an override', () => {
      new JiraService('ignored.example.com', 'test-token', 'https://real.example.com/rest');
      expect(createJiraClient).toHaveBeenCalledWith(expect.objectContaining({ baseUrl: 'https://real.example.com/rest' }));
    });
  });
  describe('constructor auth wiring', () => {
    const configArg = () => createJiraClient.mock.calls[0][0] as { token?: unknown; username?: unknown; password?: unknown };
    const resolve = (v: unknown) => (typeof v === 'function' ? (v as () => unknown)() : v);

    it('passes username and password to the client for Basic auth', () => {
      new JiraService('jira.example.com', '', undefined, () => 25, 'jdoe', 'hunter2');
      expect(resolve(configArg().username)).toBe('jdoe');
      expect(resolve(configArg().password)).toBe('hunter2');
    });

    it('passes username/password getter functions through, same as token', () => {
      new JiraService('jira.example.com', '', undefined, () => 25, () => 'jdoe', () => 'hunter2');
      expect(resolve(configArg().username)).toBe('jdoe');
      expect(resolve(configArg().password)).toBe('hunter2');
    });

    it('leaves username/password undefined when omitted', () => {
      new JiraService('jira.example.com', 'test-token');
      expect(configArg().username).toBeUndefined();
      expect(configArg().password).toBeUndefined();
    });
  });
  describe('validateConfig', () => {
    const originalEnv = process.env;
    const originalPlatform = process.platform;
    let tempDir: string;
    let tempHome: string;
    let homedirSpy: MockInstance;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.ATLASSIAN_DC_MCP_CONFIG_FILE;
      delete process.env.JIRA_API_TOKEN;
      delete process.env.JIRA_HOST;
      delete process.env.JIRA_API_BASE_PATH;
      delete process.env.JIRA_DEFAULT_PAGE_SIZE;
      tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-validate-config-home-'));
      homedirSpy = vi.spyOn(os, 'homedir').mockReturnValue(tempHome);
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-validate-config-'));
      initializeRuntimeConfig({ cwd: tempDir });
    });

    afterEach(() => {
      homedirSpy.mockRestore();
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
      fs.rmSync(tempHome, { recursive: true, force: true });
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return empty array when all required env vars are present', () => {
      process.env.JIRA_API_TOKEN = 'test-token';
      process.env.JIRA_HOST = 'test-host';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should allow anonymous access when JIRA_API_TOKEN is missing', () => {
      delete process.env.JIRA_API_TOKEN;
      process.env.JIRA_HOST = 'test-host';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should return missing vars when both host options are missing', () => {
      process.env.JIRA_API_TOKEN = 'test-token';
      delete process.env.JIRA_HOST;
      delete process.env.JIRA_API_BASE_PATH;

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toContain('JIRA_HOST or JIRA_API_BASE_PATH');
    });

    it('should accept JIRA_API_BASE_PATH as alternative to JIRA_HOST', () => {
      process.env.JIRA_API_TOKEN = 'test-token';
      delete process.env.JIRA_HOST;
      process.env.JIRA_API_BASE_PATH = 'https://test-host/rest';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should accept required config from the shared config file', () => {
      const sharedConfigPath = path.join(tempDir, 'shared.env');
      fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\n');
      process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });
  });
});
