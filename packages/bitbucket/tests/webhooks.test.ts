import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';
import { RepositoryService } from '../src/bitbucketClient/index.js';

vi.mock('../src/bitbucketClient/index.js', () => ({
  RepositoryService: {
    createWebhook1: vi.fn(),
    deleteWebhook1: vi.fn(),
    findWebhooks1: vi.fn(),
    getWebhook1: vi.fn(),
    updateWebhook1: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('BitbucketService', () => {
  let bitbucketService: BitbucketService;

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('webhooks', () => {
    it('should get webhooks with normalized keys', async () => {
      const mockData = { values: [{ id: 1 }], isLastPage: true };
      (RepositoryService.findWebhooks1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getWebhooks('test', 'Test-Repo', 'repo:refs_changed', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.findWebhooks1).toHaveBeenCalledWith(
        'TEST', 'test-repo', 'repo:refs_changed', true,
      );
    });

    it('should handle errors when getting webhooks', async () => {
      (RepositoryService.findWebhooks1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getWebhooks('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get a single webhook and stringify the statistics flag', async () => {
      const mockData = { id: 7, name: 'hook' };
      (RepositoryService.getWebhook1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getWebhook('test', 'Test-Repo', '7', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getWebhook1).toHaveBeenCalledWith('TEST', '7', 'test-repo', 'true');
    });

    it('should pass undefined statistics when omitted on getWebhook', async () => {
      (RepositoryService.getWebhook1 as Mock).mockResolvedValue({});

      await bitbucketService.getWebhook('TEST', 'test-repo', '7');

      expect(RepositoryService.getWebhook1).toHaveBeenCalledWith('TEST', '7', 'test-repo', undefined);
    });

    it('should create a webhook with a built request body', async () => {
      const mockData = { id: 9 };
      (RepositoryService.createWebhook1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createWebhook(
        'test', 'Test-Repo', 'my hook', 'https://example.com/hook',
        ['repo:refs_changed', 'pr:opened'], true, 's3cret', false,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.createWebhook1).toHaveBeenCalledWith('TEST', 'test-repo', {
        name: 'my hook',
        url: 'https://example.com/hook',
        events: ['repo:refs_changed', 'pr:opened'],
        active: true,
        configuration: { secret: 's3cret' },
        sslVerificationRequired: false,
      });
    });

    it('should omit optional fields from the webhook body when not provided', async () => {
      (RepositoryService.createWebhook1 as Mock).mockResolvedValue({ id: 1 });

      await bitbucketService.createWebhook(
        'TEST', 'test-repo', 'minimal', 'https://example.com/h', ['pr:merged'],
      );

      expect(RepositoryService.createWebhook1).toHaveBeenCalledWith('TEST', 'test-repo', {
        name: 'minimal',
        url: 'https://example.com/h',
        events: ['pr:merged'],
      });
    });

    it('should update a webhook', async () => {
      const mockData = { id: 5 };
      (RepositoryService.updateWebhook1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateWebhook(
        'test', 'Test-Repo', '5', 'renamed', 'https://example.com/new', ['pr:declined'], false,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.updateWebhook1).toHaveBeenCalledWith('TEST', '5', 'test-repo', {
        name: 'renamed',
        url: 'https://example.com/new',
        events: ['pr:declined'],
        active: false,
      });
    });

    it('should delete a webhook and return an ack', async () => {
      (RepositoryService.deleteWebhook1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteWebhook('test', 'Test-Repo', '5');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, webhookId: '5' });
      expect(RepositoryService.deleteWebhook1).toHaveBeenCalledWith('TEST', '5', 'test-repo');
    });

    it('should preserve the error field when delete fails', async () => {
      (RepositoryService.deleteWebhook1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteWebhook('TEST', 'test-repo', '5');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
