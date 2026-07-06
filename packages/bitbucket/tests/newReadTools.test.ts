import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  repositories: {
    getCommitChanges: vi.fn(),
    getCommitPullRequests: vi.fn(),
    getCompareDiff: vi.fn(),
    getRepositoryLabels: vi.fn(),
    getBranches: vi.fn(),
    getTags: vi.fn(),
  },
  pullRequests: {
    getBlockerComments: vi.fn(),
  },
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
}));

describe('BitbucketService new read tools', () => {
  let service: BitbucketService;
  const P = 'TEST';
  const R = 'demo';

  beforeEach(() => {
    service = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('getCommitChanges', () => {
    it('passes commit id and pagination through with the default page size', async () => {
      (bb.repositories.getCommitChanges as Mock).mockResolvedValue({ values: [], isLastPage: true });
      const result = await service.getCommitChanges(P, R, 'abc123');
      expect(result.success).toBe(true);
      expect(bb.repositories.getCommitChanges).toHaveBeenCalledWith({
        projectKey: P, repositorySlug: R, commitId: 'abc123', since: undefined, start: undefined, limit: 25,
      });
    });

    it('passes since and explicit pagination through', async () => {
      (bb.repositories.getCommitChanges as Mock).mockResolvedValue({ values: [] });
      await service.getCommitChanges(P, R, 'abc123', 'def456', 5, 50);
      expect(bb.repositories.getCommitChanges).toHaveBeenCalledWith({
        projectKey: P, repositorySlug: R, commitId: 'abc123', since: 'def456', start: 5, limit: 50,
      });
    });

    it('handles API errors gracefully', async () => {
      (bb.repositories.getCommitChanges as Mock).mockRejectedValue(new Error('API Error'));
      const result = await service.getCommitChanges(P, R, 'abc123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getCommitPullRequests', () => {
    it('lists pull requests containing a commit', async () => {
      const mock = { values: [{ id: 1 }], isLastPage: true };
      (bb.repositories.getCommitPullRequests as Mock).mockResolvedValue(mock);
      const result = await service.getCommitPullRequests(P, R, 'abc123');
      expect(result.data).toBe(mock);
      expect(bb.repositories.getCommitPullRequests).toHaveBeenCalledWith({
        projectKey: P, repositorySlug: R, commitId: 'abc123', start: undefined, limit: 25,
      });
    });
  });

  describe('getCompareDiff', () => {
    it('passes refs and diff options through', async () => {
      (bb.repositories.getCompareDiff as Mock).mockResolvedValue({ diffs: [] });
      await service.getCompareDiff(P, R, 'feature', 'master', 'OTHER/repo', 'src/app.js', 5, 'ignore-all');
      expect(bb.repositories.getCompareDiff).toHaveBeenCalledWith({
        projectKey: P, repositorySlug: R, from: 'feature', to: 'master', fromRepo: 'OTHER/repo',
        srcPath: 'src/app.js', contextLines: 5, whitespace: 'ignore-all',
      });
    });
  });

  describe('getRepositoryLabels', () => {
    it('lists repository labels with the default page size', async () => {
      (bb.repositories.getRepositoryLabels as Mock).mockResolvedValue({ values: [{ name: 'infra' }] });
      const result = await service.getRepositoryLabels(P, R);
      expect(result.success).toBe(true);
      expect(bb.repositories.getRepositoryLabels).toHaveBeenCalledWith({
        projectKey: P, repositorySlug: R, start: undefined, limit: 25,
      });
    });
  });

  describe('getPullRequestBlockerComments', () => {
    it('lists blocker comments (tasks) for a pull request', async () => {
      (bb.pullRequests.getBlockerComments as Mock).mockResolvedValue({ values: [], isLastPage: true });
      await service.getPullRequestBlockerComments(P, R, '13', true, 0, 10);
      expect(bb.pullRequests.getBlockerComments).toHaveBeenCalledWith({
        projectKey: P, repositorySlug: R, pullRequestId: '13', count: true, start: 0, limit: 10,
      });
    });
  });

  describe('fetchAll pagination', () => {
    it('getBranches follows pages and returns a flat array', async () => {
      (bb.repositories.getBranches as Mock)
        .mockResolvedValueOnce({ values: [{ displayId: 'a' }, { displayId: 'b' }], isLastPage: false, nextPageStart: 2 })
        .mockResolvedValueOnce({ values: [{ displayId: 'c' }], isLastPage: true });

      const result = await service.getBranches(P, R, undefined, undefined, undefined, 2, true);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ displayId: 'a' }, { displayId: 'b' }, { displayId: 'c' }]);
      expect(bb.repositories.getBranches).toHaveBeenCalledTimes(2);
    });

    it('getTags without fetchAll returns the single raw page', async () => {
      const page = { values: [{ displayId: 'v1' }], isLastPage: false, nextPageStart: 1 };
      (bb.repositories.getTags as Mock).mockResolvedValue(page);
      const result = await service.getTags(P, R);
      expect(result.data).toBe(page);
      expect(bb.repositories.getTags).toHaveBeenCalledTimes(1);
    });
  });
});
