import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  projects: {
    createRepository: vi.fn(),
    deleteRepository: vi.fn(),
    forkRepository: vi.fn(),
    getForkedRepositories: vi.fn(),
    updateRepository: vi.fn(),
    setDefaultBranch: vi.fn(),
  },
  repositories: {
    deleteAutoMergeSettings: vi.fn(),
    deleteAutoDeclineSettings: vi.fn(),
    disableHook: vi.fn(),
    enableHook: vi.fn(),
    getAutoMergeSettings: vi.fn(),
    getAutoDeclineSettings: vi.fn(),
    getPullRequestSettings: vi.fn(),
    getRepositoryHooks: vi.fn(),
    getSettings: vi.fn(),
    setAutoMergeSettings: vi.fn(),
    setAutoDeclineSettings: vi.fn(),
    setSettings: vi.fn(),
    updatePullRequestSettings: vi.fn(),
  },
  pullRequests: {
    createPullRequestCondition: vi.fn(),
    deletePullRequestCondition: vi.fn(),
    getPullRequestConditions: vi.fn(),
    updatePullRequestCondition: vi.fn(),
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

  describe('repository CRUD', () => {
    it('should create a repository with default scm', async () => {
      const mockData = { slug: 'new-repo' };
      (bb.projects.createRepository as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createRepository('test', 'New Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.projects.createRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', requestBody: {
          name: 'New Repo',
          scmId: 'git',
        },
      });
    });

    it('should create a repository with a custom scm and default branch', async () => {
      (bb.projects.createRepository as Mock).mockResolvedValue({});

      await bitbucketService.createRepository('TEST', 'Repo', 'hg', 'main');

      expect(bb.projects.createRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', requestBody: {
          name: 'Repo',
          scmId: 'hg',
          defaultBranch: 'main',
        },
      });
    });

    it('should handle errors when creating a repository', async () => {
      (bb.projects.createRepository as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createRepository('TEST', 'Repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a repository with only the provided fields', async () => {
      const mockData = { slug: 'renamed' };
      (bb.projects.updateRepository as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateRepository(
        'test', 'Test-Repo', 'Renamed', 'desc', 'main', 'dest',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.projects.updateRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {
          name: 'Renamed',
          description: 'desc',
          defaultBranch: 'main',
          project: { key: 'DEST' },
        },
      });
    });

    it('should send an empty body when no update fields are provided', async () => {
      (bb.projects.updateRepository as Mock).mockResolvedValue({});

      await bitbucketService.updateRepository('TEST', 'test-repo');

      expect(bb.projects.updateRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {},
      });
    });

    it('should fork a repository into a target project', async () => {
      const mockData = { slug: 'fork' };
      (bb.projects.forkRepository as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.forkRepository('test', 'Test-Repo', 'my-fork', 'dest');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.projects.forkRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {
          name: 'my-fork',
          project: { key: 'DEST' },
        },
      });
    });

    it('should fork a repository with an empty body when no options provided', async () => {
      (bb.projects.forkRepository as Mock).mockResolvedValue({});

      await bitbucketService.forkRepository('TEST', 'test-repo');

      expect(bb.projects.forkRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {},
      });
    });

    it('should get the direct forks of a repository with default limit', async () => {
      const mockData = { values: [{ slug: 'my-fork' }], isLastPage: true };
      (bb.projects.getForkedRepositories as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRepositoryForks('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.projects.getForkedRepositories).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', start: undefined, limit: 25,
      });
    });

    it('should handle errors when getting repository forks', async () => {
      (bb.projects.getForkedRepositories as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getRepositoryForks('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete a repository and return an ack', async () => {
      (bb.projects.deleteRepository as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteRepository('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        scheduledForDeletion: true,
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
      });
      expect(bb.projects.deleteRepository).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should preserve the error field when delete fails', async () => {
      (bb.projects.deleteRepository as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteRepository('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('repo settings: default branch, pull request settings, hooks', () => {
    it('should set the default branch', async () => {
      (bb.projects.setDefaultBranch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setDefaultBranch('test', 'Test-Repo', 'refs/heads/main');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        updated: true,
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        branchId: 'refs/heads/main',
      });
      expect(bb.projects.setDefaultBranch).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: { id: 'refs/heads/main' },
      });
    });

    it('should handle errors when setting the default branch', async () => {
      (bb.projects.setDefaultBranch as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setDefaultBranch('TEST', 'test-repo', 'refs/heads/main');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get pull request settings', async () => {
      const mockData = { mergeConfig: { defaultStrategy: { id: 'no-ff' } } };
      (bb.repositories.getPullRequestSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getPullRequestSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getPullRequestSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when getting pull request settings', async () => {
      (bb.repositories.getPullRequestSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getPullRequestSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update pull request settings with the provided settings object', async () => {
      const mockData = { requiredAllApprovers: true };
      (bb.repositories.updatePullRequestSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updatePullRequestSettings('test', 'Test-Repo', { requiredAllApprovers: true });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.updatePullRequestSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: { requiredAllApprovers: true },
      });
    });

    it('should handle errors when updating pull request settings', async () => {
      (bb.repositories.updatePullRequestSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.updatePullRequestSettings('TEST', 'test-repo', { requiredAllApprovers: true });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get auto-decline settings', async () => {
      const mockData = { enabled: true, inactivityWeeks: 4 };
      (bb.repositories.getAutoDeclineSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getAutoDeclineSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getAutoDeclineSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when getting auto-decline settings', async () => {
      (bb.repositories.getAutoDeclineSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getAutoDeclineSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set auto-decline settings with inactivity weeks', async () => {
      const mockData = { enabled: true, inactivityWeeks: 8 };
      (bb.repositories.setAutoDeclineSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setAutoDeclineSettings('test', 'Test-Repo', true, 8);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.setAutoDeclineSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {
          enabled: true,
          inactivityWeeks: 8,
        },
      });
    });

    it('should omit inactivityWeeks from the auto-decline body when not provided', async () => {
      (bb.repositories.setAutoDeclineSettings as Mock).mockResolvedValue({});

      await bitbucketService.setAutoDeclineSettings('TEST', 'test-repo', false);

      expect(bb.repositories.setAutoDeclineSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: { enabled: false },
      });
    });

    it('should handle errors when setting auto-decline settings', async () => {
      (bb.repositories.setAutoDeclineSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setAutoDeclineSettings('TEST', 'test-repo', true);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete auto-decline settings and return an ack', async () => {
      (bb.repositories.deleteAutoDeclineSettings as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAutoDeclineSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectKey: 'TEST', repositorySlug: 'test-repo' });
      expect(bb.repositories.deleteAutoDeclineSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when deleting auto-decline settings', async () => {
      (bb.repositories.deleteAutoDeclineSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteAutoDeclineSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get auto-merge settings', async () => {
      const mockData = { enabled: true };
      (bb.repositories.getAutoMergeSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getAutoMergeSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getAutoMergeSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when getting auto-merge settings', async () => {
      (bb.repositories.getAutoMergeSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getAutoMergeSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set auto-merge settings', async () => {
      const mockData = { enabled: true };
      (bb.repositories.setAutoMergeSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setAutoMergeSettings('test', 'Test-Repo', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.setAutoMergeSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: { enabled: true },
      });
    });

    it('should handle errors when setting auto-merge settings', async () => {
      (bb.repositories.setAutoMergeSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setAutoMergeSettings('TEST', 'test-repo', false);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete auto-merge settings and return an ack', async () => {
      (bb.repositories.deleteAutoMergeSettings as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAutoMergeSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectKey: 'TEST', repositorySlug: 'test-repo' });
      expect(bb.repositories.deleteAutoMergeSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when deleting auto-merge settings', async () => {
      (bb.repositories.deleteAutoMergeSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteAutoMergeSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get repository hooks with a type filter and default limit', async () => {
      const mockData = { values: [{ details: { key: 'hook-key' }, enabled: true } ], isLastPage: true };
      (bb.repositories.getRepositoryHooks as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRepoHooks('test', 'Test-Repo', 'PRE_RECEIVE');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getRepositoryHooks).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', type: 'PRE_RECEIVE', start: undefined, limit: 25,
      });
    });

    it('should handle errors when getting repository hooks', async () => {
      (bb.repositories.getRepositoryHooks as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getRepoHooks('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should enable a repository hook', async () => {
      const mockData = { enabled: true };
      (bb.repositories.enableHook as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.enableRepoHook('test', 'Test-Repo', 'hook-key');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.enableHook).toHaveBeenCalledWith({
        projectKey: 'TEST', hookKey: 'hook-key', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when enabling a repository hook', async () => {
      (bb.repositories.enableHook as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.enableRepoHook('TEST', 'test-repo', 'hook-key');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should disable a repository hook', async () => {
      const mockData = { enabled: false };
      (bb.repositories.disableHook as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.disableRepoHook('test', 'Test-Repo', 'hook-key');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.disableHook).toHaveBeenCalledWith({
        projectKey: 'TEST', hookKey: 'hook-key', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when disabling a repository hook', async () => {
      (bb.repositories.disableHook as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.disableRepoHook('TEST', 'test-repo', 'hook-key');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get repository hook settings', async () => {
      const mockData = { branchesToExclude: [] };
      (bb.repositories.getSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRepoHookSettings('test', 'Test-Repo', 'hook-key');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', hookKey: 'hook-key', repositorySlug: 'test-repo',
      });
    });

    it('should handle errors when getting repository hook settings', async () => {
      (bb.repositories.getSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getRepoHookSettings('TEST', 'test-repo', 'hook-key');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set repository hook settings with the provided settings object', async () => {
      const mockData = { branchesToExclude: ['refs/heads/main'] };
      (bb.repositories.setSettings as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setRepoHookSettings('test', 'Test-Repo', 'hook-key', { branchesToExclude: ['refs/heads/main'] });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.setSettings).toHaveBeenCalledWith({
        projectKey: 'TEST', hookKey: 'hook-key', repositorySlug: 'test-repo', requestBody: { branchesToExclude: ['refs/heads/main'] },
      });
    });

    it('should handle errors when setting repository hook settings', async () => {
      (bb.repositories.setSettings as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setRepoHookSettings('TEST', 'test-repo', 'hook-key', { branchesToExclude: [] });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('default reviewer conditions', () => {
    it('should get default reviewer conditions with normalized keys', async () => {
      const mockData = [{ id: 1 }];
      (bb.pullRequests.getPullRequestConditions as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getDefaultReviewerConditions('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.pullRequests.getPullRequestConditions).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo',
      });
    });

    it('should create a condition mapping reviewer ids and matchers', async () => {
      const mockData = { id: 1 };
      (bb.pullRequests.createPullRequestCondition as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createDefaultReviewerCondition(
        'test', 'Test-Repo', 'ANY_REF', 'ANY_REF', 'BRANCH', 'refs/heads/main', [52], 1, undefined, 'main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.pullRequests.createPullRequestCondition).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {
          reviewers: [{ id: 52 }],
          sourceMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
          targetMatcher: { id: 'refs/heads/main', displayId: 'main', type: { id: 'BRANCH' } },
          requiredApprovals: 1,
        },
      });
    });

    it('should omit requiredApprovals when not provided', async () => {
      (bb.pullRequests.createPullRequestCondition as Mock).mockResolvedValue({});

      await bitbucketService.createDefaultReviewerCondition(
        'TEST', 'test-repo', 'ANY_REF', 'ANY_REF', 'ANY_REF', 'ANY_REF', [52],
      );

      expect(bb.pullRequests.createPullRequestCondition).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', requestBody: {
          reviewers: [{ id: 52 }],
          sourceMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
          targetMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
        },
      });
    });

    it('should handle errors when creating a condition', async () => {
      (bb.pullRequests.createPullRequestCondition as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createDefaultReviewerCondition(
        'TEST', 'test-repo', 'ANY_REF', 'ANY_REF', 'ANY_REF', 'ANY_REF', [52],
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a condition passing the id as a string', async () => {
      const mockData = { id: 1, requiredApprovals: 2 };
      (bb.pullRequests.updatePullRequestCondition as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateDefaultReviewerCondition(
        'test', 'Test-Repo', '1', 'ANY_REF', 'ANY_REF', 'BRANCH', 'refs/heads/main', [52], 2, undefined, 'main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.pullRequests.updatePullRequestCondition).toHaveBeenCalledWith({
        projectKey: 'TEST', id: '1', repositorySlug: 'test-repo', requestBody: {
          reviewers: [{ id: 52 }],
          sourceMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
          targetMatcher: { id: 'refs/heads/main', displayId: 'main', type: { id: 'BRANCH' } },
          requiredApprovals: 2,
        },
      });
    });

    it('should delete a condition coercing the id to a number and return an ack', async () => {
      (bb.pullRequests.deletePullRequestCondition as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteDefaultReviewerCondition('test', 'Test-Repo', '1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, id: '1' });
      expect(bb.pullRequests.deletePullRequestCondition).toHaveBeenCalledWith({
        projectKey: 'TEST', id: 1, repositorySlug: 'test-repo',
      });
    });

    it('should preserve the error field when delete fails', async () => {
      (bb.pullRequests.deletePullRequestCondition as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteDefaultReviewerCondition('TEST', 'test-repo', '1');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
