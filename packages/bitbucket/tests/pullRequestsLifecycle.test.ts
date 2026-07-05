import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  pullRequests: {
    canMerge: vi.fn(),
    merge: vi.fn(),
    decline: vi.fn(),
    reopen: vi.fn(),
    getReviewers: vi.fn(),
    assignParticipantRole: vi.fn(),
    unassignParticipantRole: vi.fn(),
    listParticipants: vi.fn(),
    updateStatus: vi.fn(),
  },
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

  describe('canMergePullRequest', () => {
    it('should successfully check mergeability', async () => {
      const mockMergeability = { canMerge: true, conflicted: false, vetoes: [] };
      (bb.pullRequests.canMerge as Mock).mockResolvedValue(mockMergeability);

      const result = await bitbucketService.canMergePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMergeability);
      expect(bb.pullRequests.canMerge).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.pullRequests.canMerge as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.canMergePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('mergePullRequest', () => {
    it('should successfully merge a PR with minimal parameters', async () => {
      const mockMergedPR = {
        id: 1,
        version: 2,
        title: 'Test PR',
        state: 'MERGED',
        fromRef: { id: 'refs/heads/feature-branch' },
        toRef: { id: 'refs/heads/main' },
      };
      (bb.pullRequests.merge as Mock).mockResolvedValue(mockMergedPR);

      const result = await bitbucketService.mergePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 2,
        title: 'Test PR',
        state: 'MERGED',
        fromRefId: 'refs/heads/feature-branch',
        toRefId: 'refs/heads/main',
        reviewerCount: 0,
      });
      expect(bb.pullRequests.merge).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: '1',
        requestBody: {},
      });
    });

    it('should pass message and strategyId in the request body', async () => {
      const mockMergedPR = { id: 1, version: 2, state: 'MERGED' };
      (bb.pullRequests.merge as Mock).mockResolvedValue(mockMergedPR);

      await bitbucketService.mergePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
        'Custom merge message',
        'squash',
      );

      expect(bb.pullRequests.merge).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: '1',
        requestBody: { message: 'Custom merge message', strategyId: 'squash' },
      });
    });

    it('should return the full response when output is full', async () => {
      const mockMergedPR = { id: 1, version: 2, state: 'MERGED' };
      (bb.pullRequests.merge as Mock).mockResolvedValue(mockMergedPR);

      const result = await bitbucketService.mergePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
        undefined,
        undefined,
        'full',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMergedPR);
    });

    it('should handle merge veto errors gracefully', async () => {
      const mockError = new Error('The pull request has unresolved tasks');
      (bb.pullRequests.merge as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.mergePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('The pull request has unresolved tasks');
    });
  });

  describe('declinePullRequest', () => {
    it('should successfully decline a PR', async () => {
      const mockDeclinedPR = {
        id: 1,
        version: 2,
        title: 'Test PR',
        state: 'DECLINED',
      };
      (bb.pullRequests.decline as Mock).mockResolvedValue(mockDeclinedPR);

      const result = await bitbucketService.declinePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 2,
        title: 'Test PR',
        state: 'DECLINED',
        reviewerCount: 0,
      });
      expect(bb.pullRequests.decline).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: '1',
        requestBody: {},
      });
    });

    it('should pass an optional comment in the request body', async () => {
      const mockDeclinedPR = { id: 1, version: 2, state: 'DECLINED' };
      (bb.pullRequests.decline as Mock).mockResolvedValue(mockDeclinedPR);

      await bitbucketService.declinePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
        'Superseded by another PR',
      );

      expect(bb.pullRequests.decline).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: '1',
        requestBody: { comment: 'Superseded by another PR' },
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.pullRequests.decline as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.declinePullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        1,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('reopenPullRequest', () => {
    it('should successfully reopen a declined PR', async () => {
      const mockReopenedPR = {
        id: 1,
        version: 3,
        title: 'Test PR',
        state: 'OPEN',
      };
      (bb.pullRequests.reopen as Mock).mockResolvedValue(mockReopenedPR);

      const result = await bitbucketService.reopenPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        2,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 1,
        version: 3,
        title: 'Test PR',
        state: 'OPEN',
        reviewerCount: 0,
      });
      expect(bb.pullRequests.reopen).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        version: '2',
        requestBody: {},
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Pull request is not declined');
      (bb.pullRequests.reopen as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.reopenPullRequest(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        2,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Pull request is not declined');
    });
  });

  describe('getRequiredReviewers', () => {
    it('should successfully get required reviewers', async () => {
      const mockReviewersData = [
        {
          id: 1,
          reviewers: [
            { name: 'reviewer1', emailAddress: 'reviewer1@example.com' },
            { name: 'reviewer2', emailAddress: 'reviewer2@example.com' },
          ],
        },
      ];
      (bb.pullRequests.getReviewers as Mock).mockResolvedValue(mockReviewersData);

      const result = await bitbucketService.getRequiredReviewers(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature',
        'refs/heads/main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockReviewersData);
      expect(bb.pullRequests.getReviewers).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        targetRepoId: undefined,
        sourceRepoId: undefined,
        sourceRefId: 'refs/heads/feature',
        targetRefId: 'refs/heads/main',
      });
    });

    it('should successfully get required reviewers with all parameters', async () => {
      const mockReviewersData = [
        {
          id: 1,
          reviewers: [
            { name: 'reviewer1', emailAddress: 'reviewer1@example.com' },
          ],
        },
      ];
      (bb.pullRequests.getReviewers as Mock).mockResolvedValue(mockReviewersData);

      const result = await bitbucketService.getRequiredReviewers(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature',
        'refs/heads/main',
        '123', // sourceRepoId
        '456',  // targetRepoId
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockReviewersData);
      expect(bb.pullRequests.getReviewers).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        targetRepoId: '456',
        sourceRepoId: '123',
        sourceRefId: 'refs/heads/feature',
        targetRefId: 'refs/heads/main',
      });
    });

    it('should handle errors when getting required reviewers', async () => {
      const mockError = new Error('API Error');
      (bb.pullRequests.getReviewers as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getRequiredReviewers(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature',
        'refs/heads/main',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('addPullRequestReviewer', () => {
    it('should add a reviewer to a pull request', async () => {
      const mockParticipant = { user: { name: 'reviewer1' }, role: 'REVIEWER' };
      (bb.pullRequests.assignParticipantRole as Mock).mockResolvedValue(mockParticipant);

      const result = await bitbucketService.addPullRequestReviewer(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'reviewer1',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockParticipant);
      expect(bb.pullRequests.assignParticipantRole).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        requestBody: { user: { name: 'reviewer1' }, role: 'REVIEWER' },
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.pullRequests.assignParticipantRole as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.addPullRequestReviewer(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'reviewer1',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('removePullRequestReviewer', () => {
    it('should remove a reviewer from a pull request', async () => {
      (bb.pullRequests.unassignParticipantRole as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.removePullRequestReviewer(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'reviewer1',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ removed: true, userSlug: 'reviewer1' });
      expect(bb.pullRequests.unassignParticipantRole).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        userSlug: 'reviewer1',
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.pullRequests.unassignParticipantRole as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.removePullRequestReviewer(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'reviewer1',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getPullRequestParticipants', () => {
    it('should get the participants of a pull request with default limit', async () => {
      const mockData = {
        values: [
          { user: { name: 'author1' }, role: 'AUTHOR', approved: true },
          { user: { name: 'commenter1' }, role: 'PARTICIPANT', approved: false },
        ],
        isLastPage: true,
      };
      (bb.pullRequests.listParticipants as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getPullRequestParticipants(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.pullRequests.listParticipants).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        start: undefined,
        limit: 25,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.pullRequests.listParticipants as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getPullRequestParticipants(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('submitPullRequestReview', () => {
    const mockUserSlug = 'test-user';

    it('should submit a NEEDS_WORK review and call updateStatus with correct args', async () => {
      const mockParticipant = {
        user: { name: mockUserSlug },
        role: 'REVIEWER',
        status: 'NEEDS_WORK',
      };
      (bb.pullRequests.updateStatus as Mock).mockResolvedValue(mockParticipant);

      const result = await bitbucketService.submitPullRequestReview(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        mockUserSlug,
        'NEEDS_WORK',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockParticipant);
      expect(bb.pullRequests.updateStatus).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        userSlug: mockUserSlug,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        requestBody: { status: 'NEEDS_WORK' },
      });
    });

    it('should submit an APPROVED review', async () => {
      const mockParticipant = { user: { name: mockUserSlug }, status: 'APPROVED' };
      (bb.pullRequests.updateStatus as Mock).mockResolvedValue(mockParticipant);

      const result = await bitbucketService.submitPullRequestReview(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        mockUserSlug,
        'APPROVED',
      );

      expect(result.success).toBe(true);
      expect(bb.pullRequests.updateStatus).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        userSlug: mockUserSlug,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        requestBody: { status: 'APPROVED' },
      });
    });

    it('should include lastReviewedCommit when provided', async () => {
      const mockParticipant = { user: { name: mockUserSlug }, status: 'NEEDS_WORK' };
      (bb.pullRequests.updateStatus as Mock).mockResolvedValue(mockParticipant);

      await bitbucketService.submitPullRequestReview(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        mockUserSlug,
        'NEEDS_WORK',
        'abc123def456',
      );

      expect(bb.pullRequests.updateStatus).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        userSlug: mockUserSlug,
        pullRequestId: mockPullRequestId,
        repositorySlug: mockRepositorySlug,
        requestBody: { status: 'NEEDS_WORK', lastReviewedCommit: 'abc123def456' },
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Forbidden');
      (bb.pullRequests.updateStatus as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.submitPullRequestReview(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        mockUserSlug,
        'APPROVED',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden');
    });
  });
});
