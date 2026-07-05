import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  request: vi.fn(),
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

  describe('getDashboardPullRequests', () => {
    it('should default to AUTHOR role and the package page size', async () => {
      const mockData = {
        values: [
          { id: 1, title: 'PR 1', state: 'OPEN' },
          { id: 2, title: 'PR 2', state: 'OPEN' },
        ],
        size: 2,
        isLastPage: true,
      };
      bb.request.mockResolvedValue(mockData);

      const result = await bitbucketService.getDashboardPullRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/1.0/dashboard/pull-requests',
        searchParams: {
          'role': 'AUTHOR',
          'state': 'OPEN',
          'closedSince': undefined,
          'order': 'NEWEST',
          'start': undefined,
          'limit': 25,
        },
      });
    });

    it('should get dashboard PRs filtered by role and state', async () => {
      const mockData = {
        values: [{ id: 1, title: 'My PR', state: 'OPEN' }],
        size: 1,
        isLastPage: true,
      };
      bb.request.mockResolvedValue(mockData);

      const result = await bitbucketService.getDashboardPullRequests(
        'REVIEWER',
        'OPEN',
        undefined,
        'NEWEST',
        0,
        5,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/1.0/dashboard/pull-requests',
        searchParams: {
          'role': 'REVIEWER',
          'state': 'OPEN',
          'closedSince': undefined,
          'order': 'NEWEST',
          'start': 0,
          'limit': 5,
        },
      });
    });

    it('should get dashboard PRs with closedSince filter', async () => {
      const mockData = {
        values: [{ id: 3, title: 'Merged PR', state: 'MERGED' }],
        size: 1,
        isLastPage: true,
      };
      bb.request.mockResolvedValue(mockData);

      const closedSince = 1700000000000;
      const result = await bitbucketService.getDashboardPullRequests(
        'PARTICIPANT',
        'MERGED',
        closedSince,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/1.0/dashboard/pull-requests',
        searchParams: {
          'role': 'PARTICIPANT',
          'state': 'MERGED',
          'closedSince': closedSince,
          'order': 'NEWEST',
          'start': undefined,
          'limit': 25,
        },
      });
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Unauthorized');
      bb.request.mockRejectedValue(mockError);

      const result = await bitbucketService.getDashboardPullRequests();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('getInboxPullRequests', () => {
    it('should successfully get inbox pull requests with default parameters', async () => {
      const mockInboxData = {
        values: [
          {
            id: 1,
            title: 'Fix bug',
            state: 'OPEN',
            createdDate: 1700000000000,
            updatedDate: 1700001000000,
            author: { user: { name: 'user1', displayName: 'User One' } },
            fromRef: { id: 'refs/heads/feature', displayId: 'feature', repository: { slug: 'repo1', project: { key: 'PROJ' } } },
            toRef: { id: 'refs/heads/main', displayId: 'main', repository: { slug: 'repo1', project: { key: 'PROJ' } } },
            reviewers: [{ user: { name: 'reviewer1' }, approved: false, status: 'UNAPPROVED' }],
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      bb.request.mockResolvedValue(mockInboxData);

      const result = await bitbucketService.getInboxPullRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(bb.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/latest/inbox/pull-requests',
          searchParams: { start: undefined, limit: 25 },
        }),
      );
    });

    it('should successfully get inbox pull requests with pagination parameters', async () => {
      const mockInboxData = {
        values: [
          {
            id: 2,
            title: 'Add feature',
            state: 'OPEN',
            createdDate: 1700000000000,
            updatedDate: 1700001000000,
            fromRef: { id: 'refs/heads/feat', displayId: 'feat', repository: { slug: 'repo1', project: { key: 'PROJ' } } },
            toRef: { id: 'refs/heads/main', displayId: 'main', repository: { slug: 'repo1', project: { key: 'PROJ' } } },
          },
        ],
        size: 1,
        isLastPage: false,
        start: 25,
        limit: 10,
        nextPageStart: 35,
      };
      bb.request.mockResolvedValue(mockInboxData);

      const result = await bitbucketService.getInboxPullRequests(25, 10);

      expect(result.success).toBe(true);
      expect(bb.request).toHaveBeenCalledWith(
        expect.objectContaining({
          searchParams: { start: 25, limit: 10 },
        }),
      );
    });

    it('should handle empty inbox', async () => {
      const mockInboxData = {
        values: [],
        size: 0,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      bb.request.mockResolvedValue(mockInboxData);

      const result = await bitbucketService.getInboxPullRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Unauthorized');
      bb.request.mockRejectedValue(mockError);

      const result = await bitbucketService.getInboxPullRequests();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });
});
