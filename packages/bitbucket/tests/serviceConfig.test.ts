import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
import type { Mock, MockInstance } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from 'datacenter-mcp-core';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  request: vi.fn(),
}));

const createBitbucketClientMock = vi.hoisted(() =>
  vi.fn((_config: { username?: unknown; password?: unknown }) => bb),
);

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: createBitbucketClientMock,
}));

describe('BitbucketService', () => {
  let bitbucketService: BitbucketService;
  let tempHome: string;
  let homedirSpy: MockInstance;
  const originalPlatform = process.platform;

  beforeEach(() => {
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'bitbucket-service-home-'));
    homedirSpy = vi.spyOn(os, 'homedir').mockReturnValue(tempHome);
    Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
    initializeRuntimeConfig();
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  afterEach(() => {
    homedirSpy.mockRestore();
    Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    fs.rmSync(tempHome, { recursive: true, force: true });
  });

  describe('validateConfig', () => {
    const originalEnv = process.env;
    let tempDir: string;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.ATLASSIAN_DC_MCP_CONFIG_FILE;
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bitbucket-validate-config-'));
      initializeRuntimeConfig({ cwd: tempDir });
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return empty array when all required env vars are present', () => {
      process.env.BITBUCKET_API_TOKEN = 'test-token';
      process.env.BITBUCKET_HOST = 'test-host';

      const missingVars = BitbucketService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should allow anonymous access when BITBUCKET_API_TOKEN is missing', () => {
      delete process.env.BITBUCKET_API_TOKEN;
      process.env.BITBUCKET_HOST = 'test-host';

      const missingVars = BitbucketService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should return missing vars when both host options are missing', () => {
      process.env.BITBUCKET_API_TOKEN = 'test-token';
      delete process.env.BITBUCKET_HOST;
      delete process.env.BITBUCKET_API_BASE_PATH;

      const missingVars = BitbucketService.validateConfig();
      expect(missingVars).toContain('BITBUCKET_HOST or BITBUCKET_API_BASE_PATH');
    });

    it('should accept BITBUCKET_API_BASE_PATH as alternative to BITBUCKET_HOST', () => {
      process.env.BITBUCKET_API_TOKEN = 'test-token';
      delete process.env.BITBUCKET_HOST;
      process.env.BITBUCKET_API_BASE_PATH = 'https://test-host/rest';

      const missingVars = BitbucketService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should accept required config from the shared config file', () => {
      const sharedConfigPath = path.join(tempDir, 'shared.env');
      fs.writeFileSync(sharedConfigPath, 'BITBUCKET_HOST=file-host\nBITBUCKET_API_TOKEN=file-token\n');
      process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;

      const missingVars = BitbucketService.validateConfig();
      expect(missingVars).toEqual([]);
    });
  });

  describe('constructor Basic auth wiring', () => {
    it('resolves username and password onto OpenAPI for Basic auth', () => {
      new BitbucketService('test-host', '', undefined, () => 25, 'jdoe', 'hunter2');
      const config = createBitbucketClientMock.mock.calls.at(-1)?.[0];
      expect(config?.username).toBe('jdoe');
      expect(config?.password).toBe('hunter2');
    });

    it('resolves username/password from getter functions, same as token', () => {
      new BitbucketService('test-host', '', undefined, () => 25, () => 'jdoe', () => 'hunter2');
      const config = createBitbucketClientMock.mock.calls.at(-1)?.[0];
      expect((config?.username as () => string)()).toBe('jdoe');
      expect((config?.password as () => string)()).toBe('hunter2');
    });

    it('resolves username/password to an empty string when omitted', () => {
      new BitbucketService('test-host', 'test-token');
      const config = createBitbucketClientMock.mock.calls.at(-1)?.[0];
      expect(config?.username).toBeUndefined();
      expect(config?.password).toBeUndefined();
    });
  });

  describe('getUser', () => {
    it('should fetch a user by exact slug', async () => {
      const mockUser = { slug: 'jsmith', displayName: 'John Smith', emailAddress: 'jsmith@example.com' };
      (bb.request as Mock).mockResolvedValue(mockUser);

      const result = await bitbucketService.getUser('jsmith', undefined);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(bb.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/latest/users/jsmith',
        }),
      );
    });

    it('should search for users by filter string', async () => {
      const mockUsers = { values: [{ slug: 'jsmith', displayName: 'John Smith' }], size: 1, isLastPage: true };
      (bb.request as Mock).mockResolvedValue(mockUsers);

      const result = await bitbucketService.getUser(undefined, 'John');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(bb.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/latest/users',
          searchParams: { filter: 'John' },
        }),
      );
    });

    it('should handle API errors gracefully', async () => {
      (bb.request as Mock).mockRejectedValue(new Error('Not Found'));

      const result = await bitbucketService.getUser('nonexistent', undefined);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not Found');
    });
  });
});
