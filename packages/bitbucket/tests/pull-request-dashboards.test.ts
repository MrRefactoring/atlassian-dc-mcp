import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BitbucketService } from '../src/bitbucket-service.js';
import { request } from '../src/bitbucket-client/core/request.js';

vi.mock('../src/bitbucket-client/core/request.js', () => ({
  request: vi.fn()
}));

const mockRequest = vi.mocked(request);

vi.mock('../src/bitbucket-client/index.js', () => ({
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: ''
  }
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
          { id: 2, title: 'PR 2', state: 'OPEN' }
        ],
        size: 2,
        isLastPage: true
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await bitbucketService.getDashboardPullRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'GET',
          url: '/api/1.0/dashboard/pull-requests',
          query: {
            'role': 'AUTHOR',
            'state': 'OPEN',
            'closedSince': undefined,
            'order': 'NEWEST',
            'start': undefined,
            'limit': 25,
          },
          errors: {
            401: 'The currently authenticated user is not permitted to access the dashboard.',
          },
        }
      );
    });

    it('should get dashboard PRs filtered by role and state', async () => {
      const mockData = {
        values: [{ id: 1, title: 'My PR', state: 'OPEN' }],
        size: 1,
        isLastPage: true
      };
      mockRequest.mockResolvedValue(mockData);

      const result = await bitbucketService.getDashboardPullRequests(
        'REVIEWER',
        'OPEN',
        undefined,
        'NEWEST',
        0,
        5
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'GET',
          url: '/api/1.0/dashboard/pull-requests',
          query: {
            'role': 'REVIEWER',
            'state': 'OPEN',
            'closedSince': undefined,
            'order': 'NEWEST',
            'start': 0,
            'limit': 5,
          },
          errors: {
            401: 'The currently authenticated user is not permitted to access the dashboard.',
          },
        }
      );
    });

    it('should get dashboard PRs with closedSince filter', async () => {
      const mockData = {
        values: [{ id: 3, title: 'Merged PR', state: 'MERGED' }],
        size: 1,
        isLastPage: true
      };
      mockRequest.mockResolvedValue(mockData);

      const closedSince = 1700000000000;
      const result = await bitbucketService.getDashboardPullRequests(
        'PARTICIPANT',
        'MERGED',
        closedSince
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'GET',
          url: '/api/1.0/dashboard/pull-requests',
          query: {
            'role': 'PARTICIPANT',
            'state': 'MERGED',
            'closedSince': closedSince,
            'order': 'NEWEST',
            'start': undefined,
            'limit': 25,
          },
          errors: {
            401: 'The currently authenticated user is not permitted to access the dashboard.',
          },
        }
      );
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Unauthorized');
      mockRequest.mockRejectedValue(mockError);

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
      mockRequest.mockResolvedValue(mockInboxData);

      const result = await bitbucketService.getInboxPullRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          method: 'GET',
          url: '/api/latest/inbox/pull-requests',
          query: { start: undefined, limit: 25 },
        })
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
      mockRequest.mockResolvedValue(mockInboxData);

      const result = await bitbucketService.getInboxPullRequests(25, 10);

      expect(result.success).toBe(true);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          query: { start: 25, limit: 10 },
        })
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
      mockRequest.mockResolvedValue(mockInboxData);

      const result = await bitbucketService.getInboxPullRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Unauthorized');
      mockRequest.mockRejectedValue(mockError);

      const result = await bitbucketService.getInboxPullRequests();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });
});
