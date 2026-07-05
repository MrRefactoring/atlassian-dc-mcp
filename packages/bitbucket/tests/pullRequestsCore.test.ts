import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  pullRequests: {
    getPage: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    streamChanges: vi.fn(),
    applySuggestion: vi.fn(),
    deleteComment: vi.fn(),
    unwatch: vi.fn(),
    watch: vi.fn(),
  },
  request: vi.fn(),
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: undefined,
        filterText: undefined,
        state: undefined,
        order: undefined,
        direction: undefined,
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: undefined,
        filterText: undefined,
        state: 'MERGED',
        order: undefined,
        direction: undefined,
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: undefined,
        filterText: 'authentication',
        state: undefined,
        order: undefined,
        direction: undefined,
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // withAttributes
        'refs/heads/master', // at
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestsData);
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: 'refs/heads/master',
        withProperties: undefined,
        draft: undefined,
        filterText: undefined,
        state: undefined,
        order: undefined,
        direction: undefined,
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: undefined,
        filterText: undefined,
        state: undefined,
        order: undefined,
        direction: 'OUTGOING',
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: undefined,
        filterText: undefined,
        state: undefined,
        order: 'OLDEST',
        direction: undefined,
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: 'true',
        filterText: undefined,
        state: undefined,
        order: undefined,
        direction: undefined,
        start: undefined,
        limit: 25,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: undefined,
        at: undefined,
        withProperties: undefined,
        draft: undefined,
        filterText: undefined,
        state: undefined,
        order: undefined,
        direction: undefined,
        start: 50,
        limit: 10,
      });
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
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        withAttributes: 'true',
        at: 'refs/heads/develop',
        withProperties: 'true',
        draft: 'false',
        filterText: 'test',
        state: 'ALL',
        order: 'NEWEST',
        direction: 'INCOMING',
        start: 0,
        limit: 50,
      });
    });

    it('should handle empty results', async () => {
      const mockPullRequestsData = {
        values: [],
        size: 0,
        isLastPage: true,
        start: 0,
        limit: 25,
      };
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockPullRequestsData);

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
      (bb.pullRequests.getPage as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getPullRequests(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch pull requests');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('Insufficient permissions');
      (bb.pullRequests.getPage as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.get as Mock).mockResolvedValue(mockPullRequestData);

      const result = await bitbucketService.getPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        '123',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequestData);
      expect(bb.pullRequests.get).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: '123',
        repositorySlug: mockRepositorySlug,
      });
    });

    it('should handle errors when pull request does not exist', async () => {
      const mockError = new Error('Not found');
      (bb.pullRequests.get as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.get as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.create as Mock).mockResolvedValue(mockPullRequest);

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
      expect(bb.pullRequests.create).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        title: 'Test PR', description: 'Test description', fromRef: {
          id: 'refs/heads/feature-branch',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        }, toRef: {
          id: 'refs/heads/main',
          repository: {
            slug: mockRepositorySlug,
            project: { key: mockProjectKey },
          },
        },
      });
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
      (bb.pullRequests.create as Mock).mockResolvedValue(mockPullRequest);

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
      expect(bb.pullRequests.create).toHaveBeenCalledWith(expect.objectContaining({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        title: 'Test PR without description',
        description: undefined,
      }));
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
      (bb.pullRequests.create as Mock).mockResolvedValue(mockPullRequest);

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
      expect(bb.pullRequests.create).toHaveBeenCalledWith(expect.objectContaining({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        title: 'Test PR with reviewers',
        reviewers: [
          { user: { name: 'reviewer1' } },
          { user: { name: 'reviewer2' } },
        ],
      }));
    });

    it('should successfully create a PR with empty reviewers array', async () => {
      const mockPullRequest = {
        id: 4,
        version: 0,
        title: 'Test PR',
        description: 'Test',
        state: 'OPEN',
      };
      (bb.pullRequests.create as Mock).mockResolvedValue(mockPullRequest);

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
      expect(bb.pullRequests.create).toHaveBeenCalledWith(expect.not.objectContaining({
        reviewers: expect.anything(),
      }));
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Failed to create PR');
      (bb.pullRequests.create as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: 0, title: 'Updated Title',
      });
    });

    it('should successfully update PR with only description', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Original Title',
        description: 'Updated description',
        state: 'OPEN',
      };
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: 0, description: 'Updated description',
      });
    });

    it('should successfully update PR with title and description', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Updated Title',
        description: 'Updated description',
        state: 'OPEN',
      };
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: 0, title: 'Updated Title', description: 'Updated description',
      });
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
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: 0, reviewers: [
          { user: { name: 'reviewer1' } },
          { user: { name: 'reviewer2' } },
          { user: { name: 'reviewer3' } },
        ],
      });
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
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: 1, title: 'Updated Title', description: 'Updated description', reviewers: [
          { user: { name: 'newreviewer1' } },
          { user: { name: 'newreviewer2' } },
        ],
      });
    });

    it('should successfully update PR with only version (no changes)', async () => {
      const mockUpdatedPR = {
        id: 1,
        version: 1,
        title: 'Original Title',
        description: 'Original description',
        state: 'OPEN',
      };
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: 0,
      });
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
      (bb.pullRequests.update as Mock).mockResolvedValue(mockUpdatedPR);

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
      expect(bb.pullRequests.update).toHaveBeenCalledWith(expect.not.objectContaining({
        reviewers: expect.anything(),
      }));
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Failed to update PR');
      (bb.pullRequests.update as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.update as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.streamChanges as Mock).mockResolvedValue(mockChangesData);

      const result = await bitbucketService.getPullRequestChanges(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChangesData);
      expect(bb.pullRequests.streamChanges).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        sinceId: undefined,
        changeScope: undefined,
        untilId: undefined,
        withComments: undefined,
        start: undefined,
        limit: 25,
      });
    });

    it('should successfully get PR changes with all parameters', async () => {
      const mockChangesData = {
        values: [
          { path: { toString: 'file.txt' }, type: 'MODIFY' },
        ],
        size: 1,
        isLastPage: true,
      };
      (bb.pullRequests.streamChanges as Mock).mockResolvedValue(mockChangesData);

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
      expect(bb.pullRequests.streamChanges).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        sinceId: 'abc123',
        changeScope: 'RANGE',
        untilId: 'def456',
        withComments: 'true',
        start: 0,
        limit: 50,
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.pullRequests.streamChanges as Mock).mockRejectedValue(mockError);

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
      (bb.request as Mock).mockResolvedValue(mockRawDiff);

      const result = await bitbucketService.getPullRequestDiff(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'src/file.txt',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRawDiff);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/latest/projects/TEST/repos/test-repo/pull-requests/123/diff/src/file.txt',
        searchParams: {
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
      });
    });

    it('should successfully get raw diff with all parameters', async () => {
      const mockRawDiff = 'diff --git a/old/file.txt b/new/file.txt\nindex 1234567..abcdefg 100644\n--- a/old/file.txt\n+++ b/new/file.txt\n@@ -1,5 +1,6 @@\n line1\n line2\n+new line\n line3\n line4\n line5';
      (bb.request as Mock).mockResolvedValue(mockRawDiff);

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
      expect(bb.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/latest/projects/TEST/repos/test-repo/pull-requests/123/diff/src/file.txt',
        searchParams: {
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
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.request as Mock).mockRejectedValue(mockError);

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
      (bb.pullRequests.deleteComment as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deletePullRequestComment('test', 'Test-Repo', '123', '99', 4);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, commentId: '99' });
      expect(bb.pullRequests.deleteComment).toHaveBeenCalledWith({
        projectKey: 'TEST', commentId: '99', pullRequestId: '123', repositorySlug: 'test-repo', version: '4',
      });
    });

    it('should preserve the error field when comment delete fails', async () => {
      (bb.pullRequests.deleteComment as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deletePullRequestComment('TEST', 'test-repo', '123', '99', 4);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should apply a suggestion with a full body', async () => {
      (bb.pullRequests.applySuggestion as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.applyPullRequestSuggestion(
        'test', 'Test-Repo', '123', '99', 2, 5, 'apply fix', 1,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ applied: true, commentId: '99' });
      expect(bb.pullRequests.applySuggestion).toHaveBeenCalledWith({
        projectKey: 'TEST', commentId: '99', pullRequestId: '123', repositorySlug: 'test-repo', commentVersion: 2, pullRequestVersion: 5, message: 'apply fix', suggestionIndex: 1,
      });
    });

    it('should apply a suggestion omitting the optional suggestion index', async () => {
      (bb.pullRequests.applySuggestion as Mock).mockResolvedValue(undefined);

      await bitbucketService.applyPullRequestSuggestion('TEST', 'test-repo', '123', '99', 2, 5, 'apply fix');

      expect(bb.pullRequests.applySuggestion).toHaveBeenCalledWith({
        projectKey: 'TEST', commentId: '99', pullRequestId: '123', repositorySlug: 'test-repo', commentVersion: 2, pullRequestVersion: 5, message: 'apply fix',
      });
    });

    it('should watch a pull request and return an ack', async () => {
      (bb.pullRequests.watch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.watchPullRequest('test', 'Test-Repo', '123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ watching: true, pullRequestId: '123' });
      expect(bb.pullRequests.watch).toHaveBeenCalledWith({
        projectKey: 'TEST', pullRequestId: '123', repositorySlug: 'test-repo',
      });
    });

    it('should unwatch a pull request and return an ack', async () => {
      (bb.pullRequests.unwatch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.unwatchPullRequest('test', 'Test-Repo', '123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ watching: false, pullRequestId: '123' });
      expect(bb.pullRequests.unwatch).toHaveBeenCalledWith({
        projectKey: 'TEST', pullRequestId: '123', repositorySlug: 'test-repo',
      });
    });

    it('should preserve the error field when watch fails', async () => {
      (bb.pullRequests.watch as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.watchPullRequest('TEST', 'test-repo', '123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
