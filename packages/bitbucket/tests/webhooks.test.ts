import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  repositories: {
    findWebhooks: vi.fn(),
    getWebhook: vi.fn(),
    createWebhook: vi.fn(),
    updateWebhook: vi.fn(),
    deleteWebhook: vi.fn(),
  },
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
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
      (bb.repositories.findWebhooks as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getWebhooks('test', 'Test-Repo', 'repo:refs_changed', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.findWebhooks).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', event: 'repo:refs_changed', statistics: true,
      });
    });

    it('should handle errors when getting webhooks', async () => {
      (bb.repositories.findWebhooks as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getWebhooks('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get a single webhook and stringify the statistics flag', async () => {
      const mockData = { id: 7, name: 'hook' };
      (bb.repositories.getWebhook as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getWebhook('test', 'Test-Repo', '7', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getWebhook).toHaveBeenCalledWith({
        projectKey: 'TEST', webhookId: '7', repositorySlug: 'test-repo', statistics: 'true',
      });
    });

    it('should pass undefined statistics when omitted on getWebhook', async () => {
      (bb.repositories.getWebhook as Mock).mockResolvedValue({});

      await bitbucketService.getWebhook('TEST', 'test-repo', '7');

      expect(bb.repositories.getWebhook).toHaveBeenCalledWith({
        projectKey: 'TEST', webhookId: '7', repositorySlug: 'test-repo', statistics: undefined,
      });
    });

    it('should create a webhook with a built request body', async () => {
      const mockData = { id: 9 };
      (bb.repositories.createWebhook as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createWebhook(
        'test', 'Test-Repo', 'my hook', 'https://example.com/hook',
        ['repo:refs_changed', 'pr:opened'], true, 's3cret', false,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.createWebhook).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', name: 'my hook', url: 'https://example.com/hook', events: ['repo:refs_changed', 'pr:opened'], active: true, configuration: { secret: 's3cret' }, sslVerificationRequired: false,
      });
    });

    it('should omit optional fields from the webhook body when not provided', async () => {
      (bb.repositories.createWebhook as Mock).mockResolvedValue({ id: 1 });

      await bitbucketService.createWebhook(
        'TEST', 'test-repo', 'minimal', 'https://example.com/h', ['pr:merged'],
      );

      expect(bb.repositories.createWebhook).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', name: 'minimal', url: 'https://example.com/h', events: ['pr:merged'],
      });
    });

    it('should update a webhook', async () => {
      const mockData = { id: 5 };
      (bb.repositories.updateWebhook as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateWebhook(
        'test', 'Test-Repo', '5', 'renamed', 'https://example.com/new', ['pr:declined'], false,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.updateWebhook).toHaveBeenCalledWith({
        projectKey: 'TEST', webhookId: '5', repositorySlug: 'test-repo', name: 'renamed', url: 'https://example.com/new', events: ['pr:declined'], active: false,
      });
    });

    it('should delete a webhook and return an ack', async () => {
      (bb.repositories.deleteWebhook as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteWebhook('test', 'Test-Repo', '5');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, webhookId: '5' });
      expect(bb.repositories.deleteWebhook).toHaveBeenCalledWith({
        projectKey: 'TEST', webhookId: '5', repositorySlug: 'test-repo',
      });
    });

    it('should preserve the error field when delete fails', async () => {
      (bb.repositories.deleteWebhook as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteWebhook('TEST', 'test-repo', '5');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
