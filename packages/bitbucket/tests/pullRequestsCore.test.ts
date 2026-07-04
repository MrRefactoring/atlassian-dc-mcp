import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';
import { PullRequestsService } from '../src/bitbucketClient/index.js';
import { request } from '../src/bitbucketClient/core/request.js';

vi.mock('../src/bitbucketClient/core/request.js', () => ({
  request: vi.fn(),
}));

const mockRequest = vi.mocked(request);

vi.mock('../src/bitbucketClient/index.js', () => ({
  PullRequestsService: {
    getPage: vi.fn(),
    get3: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    streamChanges1: vi.fn(),
    applySuggestion: vi.fn(),
    deleteComment2: vi.fn(),
    unwatch1: vi.fn(),
    watch1: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('BitbucketService', () => {
  let bitbucketService: BitbucketService;
  const mockProjectKey = 'TEST';
  const mockRepositorySlug = 'test-repo';
  const mockPullRequestId = '123';

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('getPullRequests', () => {
    it('should successfully get pull requests with default parameters', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Test PR 1',
            state: 'OPEN',
            author: { user: { name: 'user1' } },
          },
          {
            id: 2,
            title: 'Test PR 2',
            state: 'OPEN',
            author: { user: { name: 'user2' } },
          },
        ],
        size: 2,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        undefined, // draft
        undefined, // filterText
        undefined, // state
        undefined, // order
        undefined, // direction
        undefined, // start
        25, // limit
      );
    });

    it('should successfully get pull requests with state filter', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Merged PR',
            state: 'MERGED',
            author: { user: { name: 'user1' } },
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        undefined, // draft
        undefined, // filterText
        'MERGED', // state
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'MERGED',
        undefined,
        undefined,
        undefined,
        25,
      );
    });

    it('should successfully get pull requests with text filter', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Fix bug in authentication',
            state: 'OPEN',
            author: { user: { name: 'user1' } },
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        undefined, // draft
        'authentication', // filterText
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        'authentication',
        undefined,
        undefined,
        undefined,
        undefined,
        25,
      );
    });

    it('should successfully get pull requests with branch filter', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'PR to master',
            state: 'OPEN',
            toRef: { id: 'refs/heads/master' },
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        'refs/heads/master', // at
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        'refs/heads/master',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        25,
      );
    });

    it('should successfully get pull requests with direction filter', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Outgoing PR',
            state: 'OPEN',
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        undefined, // draft
        undefined, // filterText
        undefined, // state
        undefined, // order
        'OUTGOING', // direction
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'OUTGOING',
        undefined,
        25,
      );
    });

    it('should successfully get pull requests with order filter', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Oldest PR',
            state: 'OPEN',
            createdDate: 1234567890,
          },
          {
            id: 2,
            title: 'Newer PR',
            state: 'OPEN',
            createdDate: 1234567900,
          },
        ],
        size: 2,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        undefined, // draft
        undefined, // filterText
        undefined, // state
        'OLDEST', // order
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'OLDEST',
        undefined,
        undefined,
        25,
      );
    });

    it('should successfully get pull requests with draft filter', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Draft PR',
            state: 'OPEN',
            draft: true,
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        'true', // draft
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        'true',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        25,
      );
    });

    it('should successfully get pull requests with pagination', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 51,
            title: 'PR 51',
            state: 'OPEN',
          },
        ],
        size: 1,
        isLastPage: false,
        start: 50,
        limit: 10,
        nextPageStart: 60,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        undefined, // at
        undefined, // withProperties
        undefined, // draft
        undefined, // filterText
        undefined, // state
        undefined, // order
        undefined, // direction
        50, // start
        10, // limit
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        50,
        10,
      );
    });

    it('should successfully get pull requests with all parameters', async () => {
      const mockPullRequestsData = {
        values: [
          {
            id: 1,
            title: 'Complete PR test',
            state: 'OPEN',
            draft: false,
          },
        ],
        size: 1,
        isLastPage: true,
        start: 0,
        limit: 50,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        'true', // withAttributes
        'refs/heads/develop', // at
        'true', // withProperties
        'false', // draft
        'test', // filterText
        'ALL', // state
        'NEWEST', // order
        'INCOMING', // direction
        0, // start
        50, // limit
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        'true',
        'refs/heads/develop',
        'true',
        'false',
        'test',
        'ALL',
        'NEWEST',
        'INCOMING',
        0,
        50,
      );
    });

    it('should handle empty results', async () => {
      const mockPullRequestsData = {
        values: [],
        size: 0,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      if (result.data) {
        expect(result.data.values).toHaveLength(0);
      }
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Failed to fetch pull requests');
      (PullRequestsService.getPage as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch pull requests');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('Insufficient permissions');
      (PullRequestsService.getPage as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'OPEN',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions');
    });
  });

  describe('getPullRequest', () => {
    it('should successfully get a specific pull request by ID', async () => {
      const mockPullRequestData = {
        id: 123,
        version: 1,
        title: 'Feature: Add new functionality',
        description: 'This PR adds new functionality',
        state: 'OPEN',
        open: true,
        closed: false,
        createdDate: 1234567890,
        updatedDate: 1234567900,
        fromRef: {
          id: 'refs/heads/feature-branch',
          displayId: 'feature-branch',
          latestCommit: 'abc123',
          repository: {
            slug: 'test-repo',
            project: { key: 'TEST' },
          },
        },
        toRef: {
          id: 'refs/heads/main',
          displayId: 'main',
          latestCommit: 'def456',
          repository: {
            slug: 'test-repo',
            project: { key: 'TEST' },
          },
        },
        author: {
          user: {
            name: 'testuser',
            emailAddress: 'test@example.com',
            displayName: 'Test User',
          },
        },
        reviewers: [
          {
            user: { name: 'reviewer1', displayName: 'Reviewer One' },
            approved: true,
          },
        ],
        participants: [],
      };
      (PullRequestsService.get3 as Mock).mockResolvedValue(mockPullRequestData);

      const result = await bitbucketService.getPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        '123',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestData);
      expect(PullRequestsService.get3).toHaveBeenCalledWith(
        mockProjectKey,
        '123',
        mockRepositorySlug,
      );
    });

    it('should handle errors when pull request does not exist', async () => {
      const mockError = new Error('Not found');
      (PullRequestsService.get3 as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        '999',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not found');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('Insufficient permissions');
      (PullRequestsService.get3 as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        '123',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions');
    });
  });

  describe('createPullRequest', () => {
    it('should successfully create a PR with minimal parameters', async () => {
      const mockPullRequest = {
        id: 1,
        version: 0,
        title: 'Test PR',
        description: 'Test description',
        state: 'OPEN',
        fromRef: {
          id: 'refs/heads/feature-branch',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
        toRef: {
          id: 'refs/heads/main',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
      };
      (PullRequestsService.create as Mock).mockResolvedValue(mockPullRequest);

      const result = await bitbucketService.createPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        'Test PR',
        'Test description',
        'refs/heads/feature-branch',
        'refs/heads/main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 0,
        title: 'Test PR',
        state: 'OPEN',
        fromRefId: 'refs/heads/feature-branch',
        toRefId: 'refs/heads/main',
        reviewerCount: 0,
      });
      expect(PullRequestsService.create).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        {
          title: 'Test PR',
          description: 'Test description',
          fromRef: {
            id: 'refs/heads/feature-branch',
            repository: {
              slug: mockRepositorySlug,
              project: { key: mockProjectKey },
            },
          },
          toRef: {
            id: 'refs/heads/main',
            repository: {
              slug: mockRepositorySlug,
              project: { key: mockProjectKey },
            },
          },
        },
      );
    });

    it('should successfully create a PR without description', async () => {
      const mockPullRequest = {
        id: 2,
        version: 0,
        title: 'Test PR without description',
        state: 'OPEN',
        fromRef: {
          id: 'refs/heads/feature-branch',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
        toRef: {
          id: 'refs/heads/main',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
      };
      (PullRequestsService.create as Mock).mockResolvedValue(mockPullRequest);

      const result = await bitbucketService.createPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        'Test PR without description',
        undefined,
        'refs/heads/feature-branch',
        'refs/heads/main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 2,
        version: 0,
        title: 'Test PR without description',
        state: 'OPEN',
        fromRefId: 'refs/heads/feature-branch',
        toRefId: 'refs/heads/main',
        reviewerCount: 0,
      });
      expect(PullRequestsService.create).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        expect.objectContaining({
          title: 'Test PR without description',
          description: undefined,
        }),
      );
    });

    it('should successfully create a PR with reviewers', async () => {
      const mockPullRequest = {
        id: 3,
        version: 0,
        title: 'Test PR with reviewers',
        description: 'PR with reviewers',
        state: 'OPEN',
        fromRef: {
          id: 'refs/heads/feature-branch',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
        toRef: {
          id: 'refs/heads/main',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
        reviewers: [
          { user: { name: 'reviewer1' } },
          { user: { name: 'reviewer2' } },
        ],
      };
      (PullRequestsService.create as Mock).mockResolvedValue(mockPullRequest);

      const result = await bitbucketService.createPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        'Test PR with reviewers',
        'PR with reviewers',
        'refs/heads/feature-branch',
        'refs/heads/main',
        ['reviewer1', 'reviewer2'],
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 3,
        version: 0,
        title: 'Test PR with reviewers',
        state: 'OPEN',
        fromRefId: 'refs/heads/feature-branch',
        toRefId: 'refs/heads/main',
        reviewerCount: 2,
      });
      expect(PullRequestsService.create).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        expect.objectContaining({
          title: 'Test PR with reviewers',
          reviewers: [
            { user: { name: 'reviewer1' } },
            { user: { name: 'reviewer2' } },
          ],
        }),
      );
    });

    it('should successfully create a PR with empty reviewers array', async () => {
      const mockPullRequest = {
        id: 4,
        version: 0,
        title: 'Test PR',
        description: 'Test',
        state: 'OPEN',
      };
      (PullRequestsService.create as Mock).mockResolvedValue(mockPullRequest);

      const result = await bitbucketService.createPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        'Test PR',
        'Test',
        'refs/heads/feature-branch',
        'refs/heads/main',
        [],
      );

      expect(result.success).toBe(true);
      expect(PullRequestsService.create).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        expect.not.objectContaining({
          reviewers: expect.anything(),
        }),
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Failed to create PR');
      (PullRequestsService.create as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.createPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        'Test PR',
        'Test description',
        'refs/heads/feature-branch',
        'refs/heads/main',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create PR');
    });
  });

  describe('updatePullRequest', () => {
    it('should successfully update PR with only title', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Updated Title',
        description: 'Original description',
        state: 'OPEN',
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
        'Updated Title',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 1,
        title: 'Updated Title',
        state: 'OPEN',
        reviewerCount: 0,
      });
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          version: 0,
          title: 'Updated Title',
        },
      );
    });

    it('should successfully update PR with only description', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Original Title',
        description: 'Updated description',
        state: 'OPEN',
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
        undefined,
        'Updated description',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 1,
        title: 'Original Title',
        state: 'OPEN',
        reviewerCount: 0,
      });
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          version: 0,
          description: 'Updated description',
        },
      );
    });

    it('should successfully update PR with title and description', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Updated Title',
        description: 'Updated description',
        state: 'OPEN',
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
        'Updated Title',
        'Updated description',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 1,
        title: 'Updated Title',
        state: 'OPEN',
        reviewerCount: 0,
      });
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          version: 0,
          title: 'Updated Title',
          description: 'Updated description',
        },
      );
    });

    it('should successfully update PR with reviewers', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Test PR',
        description: 'Test',
        state: 'OPEN',
        reviewers: [
          { user: { name: 'reviewer1' } },
          { user: { name: 'reviewer2' } },
          { user: { name: 'reviewer3' } },
        ],
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
        undefined,
        undefined,
        ['reviewer1', 'reviewer2', 'reviewer3'],
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 1,
        title: 'Test PR',
        state: 'OPEN',
        reviewerCount: 3,
      });
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          version: 0,
          reviewers: [
            { user: { name: 'reviewer1' } },
            { user: { name: 'reviewer2' } },
            { user: { name: 'reviewer3' } },
          ],
        },
      );
    });

    it('should successfully update PR with all parameters', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 2,
        title: 'Updated Title',
        description: 'Updated description',
        state: 'OPEN',
        reviewers: [
          { user: { name: 'newreviewer1' } },
          { user: { name: 'newreviewer2' } },
        ],
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
        'Updated Title',
        'Updated description',
        ['newreviewer1', 'newreviewer2'],
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 2,
        title: 'Updated Title',
        state: 'OPEN',
        reviewerCount: 2,
      });
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          version: 1,
          title: 'Updated Title',
          description: 'Updated description',
          reviewers: [
            { user: { name: 'newreviewer1' } },
            { user: { name: 'newreviewer2' } },
          ],
        },
      );
    });

    it('should successfully update PR with only version (no changes)', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Original Title',
        description: 'Original description',
        state: 'OPEN',
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 1,
        title: 'Original Title',
        state: 'OPEN',
        reviewerCount: 0,
      });
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          version: 0,
        },
      );
    });

    it('should successfully update PR with empty reviewers array', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Test PR',
        description: 'Test',
        state: 'OPEN',
        reviewers: [],
      };
      (PullRequestsService.update as Mock).mockResolvedValue(mockUpdatedPR);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
        undefined,
        undefined,
        [],
      );

      expect(result.success).toBe(true);
      expect(PullRequestsService.update).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        expect.not.objectContaining({
          reviewers: expect.anything(),
        }),
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Failed to update PR');
      (PullRequestsService.update as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        0,
        'Updated Title',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to update PR');
    });

    it('should handle version conflict errors', async () => {
      const mockError = new Error('Version conflict - PR has been modified');
      (PullRequestsService.update as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.updatePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        5,
        'Updated Title',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Version conflict - PR has been modified');
    });
  });

  describe('getPullRequestChanges', () => {
    it('should successfully get PR changes', async () => {
      const mockChangesData = {
        values: [
          { path: { toString: 'file.txt' }, type: 'MODIFY' },
        ],
        size: 1,
        isLastPage: true,
      };
      (PullRequestsService.streamChanges1 as Mock).mockResolvedValue(mockChangesData);

      const result = await bitbucketService.getPullRequestChanges(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChangesData);
      expect(PullRequestsService.streamChanges1).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        25,
      );
    });

    it('should successfully get PR changes with all parameters', async () => {
      const mockChangesData = {
        values: [
          { path: { toString: 'file.txt' }, type: 'MODIFY' },
        ],
        size: 1,
        isLastPage: true,
      };
      (PullRequestsService.streamChanges1 as Mock).mockResolvedValue(mockChangesData);

      const result = await bitbucketService.getPullRequestChanges(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'abc123',
        'RANGE',
        'def456',
        'true',
        0,
        50,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChangesData);
      expect(PullRequestsService.streamChanges1).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        'abc123',
        'RANGE',
        'def456',
        'true',
        0,
        50,
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (PullRequestsService.streamChanges1 as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequestChanges(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getPullRequestDiff', () => {
    it('should successfully get raw diff with minimal parameters', async () => {
      const mockRawDiff = 'diff --git a/file.txt b/file.txt\nindex 1234567..abcdefg 100644\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n line1\n line2\n+new line\n line3';
      mockRequest.mockResolvedValue(mockRawDiff);

      const result = await bitbucketService.getPullRequestDiff(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'src/file.txt',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRawDiff);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object), // OpenAPI config
        {
          method: 'GET',
          url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/diff/{path}',
          path: {
            'path': 'src/file.txt',
            'projectKey': mockProjectKey,
            'pullRequestId': mockPullRequestId,
            'repositorySlug': mockRepositorySlug,
          },
          query: {
            'contextLines': undefined,
            'sinceId': undefined,
            'srcPath': undefined,
            'diffType': undefined,
            'untilId': undefined,
            'whitespace': undefined,
          },
          headers: {
            'Accept': 'text/plain',
          },
          errors: {
            400: 'If the request was malformed.',
            401: 'The currently authenticated user has insufficient permissions to view the repository or pull request.',
            404: 'The repository or pull request does not exist.',
          },
        },
      );
    });

    it('should successfully get raw diff with all parameters', async () => {
      const mockRawDiff = 'diff --git a/old/file.txt b/new/file.txt\nindex 1234567..abcdefg 100644\n--- a/old/file.txt\n+++ b/new/file.txt\n@@ -1,5 +1,6 @@\n line1\n line2\n+new line\n line3\n line4\n line5';
      mockRequest.mockResolvedValue(mockRawDiff);

      const result = await bitbucketService.getPullRequestDiff(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'src/file.txt',
        '5', // contextLines
        'abc123', // sinceId
        'old/file.txt', // srcPath
        'EFFECTIVE', // diffType
        'def456', // untilId
        'ignore-all', // whitespace
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRawDiff);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object), // OpenAPI config
        {
          method: 'GET',
          url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/diff/{path}',
          path: {
            'path': 'src/file.txt',
            'projectKey': mockProjectKey,
            'pullRequestId': mockPullRequestId,
            'repositorySlug': mockRepositorySlug,
          },
          query: {
            'contextLines': '5',
            'sinceId': 'abc123',
            'srcPath': 'old/file.txt',
            'diffType': 'EFFECTIVE',
            'untilId': 'def456',
            'whitespace': 'ignore-all',
          },
          headers: {
            'Accept': 'text/plain',
          },
          errors: {
            400: 'If the request was malformed.',
            401: 'The currently authenticated user has insufficient permissions to view the repository or pull request.',
            404: 'The repository or pull request does not exist.',
          },
        },
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockRequest.mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequestDiff(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'src/file.txt',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('pull request operations', () => {
    it('should delete a pull request comment and return an ack', async () => {
      (PullRequestsService.deleteComment2 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deletePullRequestComment('test', 'Test-Repo', '123', '99', 4);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, commentId: '99' });
      expect(PullRequestsService.deleteComment2).toHaveBeenCalledWith('TEST', '99', '123', 'test-repo', '4');
    });

    it('should preserve the error field when comment delete fails', async () => {
      (PullRequestsService.deleteComment2 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deletePullRequestComment('TEST', 'test-repo', '123', '99', 4);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should apply a suggestion with a full body', async () => {
      (PullRequestsService.applySuggestion as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.applyPullRequestSuggestion(
        'test', 'Test-Repo', '123', '99', 2, 5, 'apply fix', 1,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ applied: true, commentId: '99' });
      expect(PullRequestsService.applySuggestion).toHaveBeenCalledWith('TEST', '99', '123', 'test-repo', {
        commentVersion: 2,
        pullRequestVersion: 5,
        message: 'apply fix',
        suggestionIndex: 1,
      });
    });

    it('should apply a suggestion omitting the optional suggestion index', async () => {
      (PullRequestsService.applySuggestion as Mock).mockResolvedValue(undefined);

      await bitbucketService.applyPullRequestSuggestion('TEST', 'test-repo', '123', '99', 2, 5, 'apply fix');

      expect(PullRequestsService.applySuggestion).toHaveBeenCalledWith('TEST', '99', '123', 'test-repo', {
        commentVersion: 2,
        pullRequestVersion: 5,
        message: 'apply fix',
      });
    });

    it('should watch a pull request and return an ack', async () => {
      (PullRequestsService.watch1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.watchPullRequest('test', 'Test-Repo', '123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ watching: true, pullRequestId: '123' });
      expect(PullRequestsService.watch1).toHaveBeenCalledWith('TEST', '123', 'test-repo');
    });

    it('should unwatch a pull request and return an ack', async () => {
      (PullRequestsService.unwatch1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.unwatchPullRequest('test', 'Test-Repo', '123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ watching: false, pullRequestId: '123' });
      expect(PullRequestsService.unwatch1).toHaveBeenCalledWith('TEST', '123', 'test-repo');
    });

    it('should preserve the error field when watch fails', async () => {
      (PullRequestsService.watch1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.watchPullRequest('TEST', 'test-repo', '123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
