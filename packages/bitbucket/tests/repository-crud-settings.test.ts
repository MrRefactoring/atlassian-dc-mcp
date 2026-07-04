import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucket-service.js';
import { ProjectService, RepositoryService, PullRequestsService } from '../src/bitbucket-client/index.js';

vi.mock('../src/bitbucket-client/index.js', () => ({
  ProjectService: {
    createRepository: vi.fn(),
    deleteRepository: vi.fn(),
    forkRepository: vi.fn(),
    getForkedRepositories: vi.fn(),
    updateRepository: vi.fn(),
    setDefaultBranch2: vi.fn(),
  },
  RepositoryService: {
    delete5: vi.fn(),
    deleteAutoDeclineSettings1: vi.fn(),
    disableHook1: vi.fn(),
    enableHook1: vi.fn(),
    get5: vi.fn(),
    getAutoDeclineSettings1: vi.fn(),
    getPullRequestSettings1: vi.fn(),
    getRepositoryHooks1: vi.fn(),
    getSettings1: vi.fn(),
    set1: vi.fn(),
    setAutoDeclineSettings1: vi.fn(),
    setSettings1: vi.fn(),
    updatePullRequestSettings1: vi.fn(),
  },
  PullRequestsService: {
    createPullRequestCondition1: vi.fn(),
    deletePullRequestCondition1: vi.fn(),
    getPullRequestConditions1: vi.fn(),
    updatePullRequestCondition1: vi.fn(),
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

  describe('repository CRUD', () => {
    it('should create a repository with default scm', async () => {
      const mockData = { slug: 'new-repo' };
      (ProjectService.createRepository as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createRepository('test', 'New Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(ProjectService.createRepository).toHaveBeenCalledWith('TEST', {
        name: 'New Repo',
        scmId: 'git',
      });
    });

    it('should create a repository with a custom scm and default branch', async () => {
      (ProjectService.createRepository as Mock).mockResolvedValue({});

      await bitbucketService.createRepository('TEST', 'Repo', 'hg', 'main');

      expect(ProjectService.createRepository).toHaveBeenCalledWith('TEST', {
        name: 'Repo',
        scmId: 'hg',
        defaultBranch: 'main',
      });
    });

    it('should handle errors when creating a repository', async () => {
      (ProjectService.createRepository as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createRepository('TEST', 'Repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a repository with only the provided fields', async () => {
      const mockData = { slug: 'renamed' };
      (ProjectService.updateRepository as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateRepository(
        'test', 'Test-Repo', 'Renamed', 'desc', 'main', 'dest',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(ProjectService.updateRepository).toHaveBeenCalledWith('TEST', 'test-repo', {
        name: 'Renamed',
        description: 'desc',
        defaultBranch: 'main',
        project: { key: 'DEST' },
      });
    });

    it('should send an empty body when no update fields are provided', async () => {
      (ProjectService.updateRepository as Mock).mockResolvedValue({});

      await bitbucketService.updateRepository('TEST', 'test-repo');

      expect(ProjectService.updateRepository).toHaveBeenCalledWith('TEST', 'test-repo', {});
    });

    it('should fork a repository into a target project', async () => {
      const mockData = { slug: 'fork' };
      (ProjectService.forkRepository as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.forkRepository('test', 'Test-Repo', 'my-fork', 'dest');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(ProjectService.forkRepository).toHaveBeenCalledWith('TEST', 'test-repo', {
        name: 'my-fork',
        project: { key: 'DEST' },
      });
    });

    it('should fork a repository with an empty body when no options provided', async () => {
      (ProjectService.forkRepository as Mock).mockResolvedValue({});

      await bitbucketService.forkRepository('TEST', 'test-repo');

      expect(ProjectService.forkRepository).toHaveBeenCalledWith('TEST', 'test-repo', {});
    });

    it('should get the direct forks of a repository with default limit', async () => {
      const mockData = { values: [{ slug: 'my-fork' }], isLastPage: true };
      (ProjectService.getForkedRepositories as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRepositoryForks('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(ProjectService.getForkedRepositories).toHaveBeenCalledWith('TEST', 'test-repo', undefined, 25);
    });

    it('should handle errors when getting repository forks', async () => {
      (ProjectService.getForkedRepositories as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getRepositoryForks('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete a repository and return an ack', async () => {
      (ProjectService.deleteRepository as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteRepository('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        scheduledForDeletion: true,
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
      });
      expect(ProjectService.deleteRepository).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should preserve the error field when delete fails', async () => {
      (ProjectService.deleteRepository as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteRepository('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('repo settings: default branch, pull request settings, hooks', () => {
    it('should set the default branch', async () => {
      (ProjectService.setDefaultBranch2 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setDefaultBranch('test', 'Test-Repo', 'refs/heads/main');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        updated: true,
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        branchId: 'refs/heads/main',
      });
      expect(ProjectService.setDefaultBranch2).toHaveBeenCalledWith('TEST', 'test-repo', { id: 'refs/heads/main' });
    });

    it('should handle errors when setting the default branch', async () => {
      (ProjectService.setDefaultBranch2 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setDefaultBranch('TEST', 'test-repo', 'refs/heads/main');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get pull request settings', async () => {
      const mockData = { mergeConfig: { defaultStrategy: { id: 'no-ff' } } };
      (RepositoryService.getPullRequestSettings1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getPullRequestSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getPullRequestSettings1).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should handle errors when getting pull request settings', async () => {
      (RepositoryService.getPullRequestSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getPullRequestSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update pull request settings with the provided settings object', async () => {
      const mockData = { requiredAllApprovers: true };
      (RepositoryService.updatePullRequestSettings1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updatePullRequestSettings('test', 'Test-Repo', { requiredAllApprovers: true });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.updatePullRequestSettings1).toHaveBeenCalledWith('TEST', 'test-repo', { requiredAllApprovers: true });
    });

    it('should handle errors when updating pull request settings', async () => {
      (RepositoryService.updatePullRequestSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.updatePullRequestSettings('TEST', 'test-repo', { requiredAllApprovers: true });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get auto-decline settings', async () => {
      const mockData = { enabled: true, inactivityWeeks: 4 };
      (RepositoryService.getAutoDeclineSettings1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getAutoDeclineSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getAutoDeclineSettings1).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should handle errors when getting auto-decline settings', async () => {
      (RepositoryService.getAutoDeclineSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getAutoDeclineSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set auto-decline settings with inactivity weeks', async () => {
      const mockData = { enabled: true, inactivityWeeks: 8 };
      (RepositoryService.setAutoDeclineSettings1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setAutoDeclineSettings('test', 'Test-Repo', true, 8);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.setAutoDeclineSettings1).toHaveBeenCalledWith('TEST', 'test-repo', {
        enabled: true,
        inactivityWeeks: 8,
      });
    });

    it('should omit inactivityWeeks from the auto-decline body when not provided', async () => {
      (RepositoryService.setAutoDeclineSettings1 as Mock).mockResolvedValue({});

      await bitbucketService.setAutoDeclineSettings('TEST', 'test-repo', false);

      expect(RepositoryService.setAutoDeclineSettings1).toHaveBeenCalledWith('TEST', 'test-repo', { enabled: false });
    });

    it('should handle errors when setting auto-decline settings', async () => {
      (RepositoryService.setAutoDeclineSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setAutoDeclineSettings('TEST', 'test-repo', true);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete auto-decline settings and return an ack', async () => {
      (RepositoryService.deleteAutoDeclineSettings1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAutoDeclineSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectKey: 'TEST', repositorySlug: 'test-repo' });
      expect(RepositoryService.deleteAutoDeclineSettings1).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should handle errors when deleting auto-decline settings', async () => {
      (RepositoryService.deleteAutoDeclineSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteAutoDeclineSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get auto-merge settings', async () => {
      const mockData = { enabled: true };
      (RepositoryService.get5 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getAutoMergeSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.get5).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should handle errors when getting auto-merge settings', async () => {
      (RepositoryService.get5 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getAutoMergeSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set auto-merge settings', async () => {
      const mockData = { enabled: true };
      (RepositoryService.set1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setAutoMergeSettings('test', 'Test-Repo', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.set1).toHaveBeenCalledWith('TEST', 'test-repo', { enabled: true });
    });

    it('should handle errors when setting auto-merge settings', async () => {
      (RepositoryService.set1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setAutoMergeSettings('TEST', 'test-repo', false);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete auto-merge settings and return an ack', async () => {
      (RepositoryService.delete5 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAutoMergeSettings('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectKey: 'TEST', repositorySlug: 'test-repo' });
      expect(RepositoryService.delete5).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should handle errors when deleting auto-merge settings', async () => {
      (RepositoryService.delete5 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteAutoMergeSettings('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get repository hooks with a type filter and default limit', async () => {
      const mockData = { values: [{ details: { key: 'hook-key' }, enabled: true } ], isLastPage: true };
      (RepositoryService.getRepositoryHooks1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRepoHooks('test', 'Test-Repo', 'PRE_RECEIVE');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getRepositoryHooks1).toHaveBeenCalledWith('TEST', 'test-repo', 'PRE_RECEIVE', undefined, 25);
    });

    it('should handle errors when getting repository hooks', async () => {
      (RepositoryService.getRepositoryHooks1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getRepoHooks('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should enable a repository hook', async () => {
      const mockData = { enabled: true };
      (RepositoryService.enableHook1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.enableRepoHook('test', 'Test-Repo', 'hook-key');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.enableHook1).toHaveBeenCalledWith('TEST', 'hook-key', 'test-repo');
    });

    it('should handle errors when enabling a repository hook', async () => {
      (RepositoryService.enableHook1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.enableRepoHook('TEST', 'test-repo', 'hook-key');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should disable a repository hook', async () => {
      const mockData = { enabled: false };
      (RepositoryService.disableHook1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.disableRepoHook('test', 'Test-Repo', 'hook-key');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.disableHook1).toHaveBeenCalledWith('TEST', 'hook-key', 'test-repo');
    });

    it('should handle errors when disabling a repository hook', async () => {
      (RepositoryService.disableHook1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.disableRepoHook('TEST', 'test-repo', 'hook-key');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get repository hook settings', async () => {
      const mockData = { branchesToExclude: [] };
      (RepositoryService.getSettings1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRepoHookSettings('test', 'Test-Repo', 'hook-key');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getSettings1).toHaveBeenCalledWith('TEST', 'hook-key', 'test-repo');
    });

    it('should handle errors when getting repository hook settings', async () => {
      (RepositoryService.getSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getRepoHookSettings('TEST', 'test-repo', 'hook-key');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set repository hook settings with the provided settings object', async () => {
      const mockData = { branchesToExclude: ['refs/heads/main'] };
      (RepositoryService.setSettings1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setRepoHookSettings('test', 'Test-Repo', 'hook-key', { branchesToExclude: ['refs/heads/main'] });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.setSettings1).toHaveBeenCalledWith('TEST', 'hook-key', 'test-repo', { branchesToExclude: ['refs/heads/main'] });
    });

    it('should handle errors when setting repository hook settings', async () => {
      (RepositoryService.setSettings1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setRepoHookSettings('TEST', 'test-repo', 'hook-key', { branchesToExclude: [] });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('default reviewer conditions', () => {
    it('should get default reviewer conditions with normalized keys', async () => {
      const mockData = [{ id: 1 }];
      (PullRequestsService.getPullRequestConditions1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getDefaultReviewerConditions('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(PullRequestsService.getPullRequestConditions1).toHaveBeenCalledWith('TEST', 'test-repo');
    });

    it('should create a condition mapping reviewer ids and matchers', async () => {
      const mockData = { id: 1 };
      (PullRequestsService.createPullRequestCondition1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createDefaultReviewerCondition(
        'test', 'Test-Repo', 'ANY_REF', 'ANY_REF', 'BRANCH', 'refs/heads/main', [52], 1, undefined, 'main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(PullRequestsService.createPullRequestCondition1).toHaveBeenCalledWith('TEST', 'test-repo', {
        reviewers: [{ id: 52 }],
        sourceMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
        targetMatcher: { id: 'refs/heads/main', displayId: 'main', type: { id: 'BRANCH' } },
        requiredApprovals: 1,
      });
    });

    it('should omit requiredApprovals when not provided', async () => {
      (PullRequestsService.createPullRequestCondition1 as Mock).mockResolvedValue({});

      await bitbucketService.createDefaultReviewerCondition(
        'TEST', 'test-repo', 'ANY_REF', 'ANY_REF', 'ANY_REF', 'ANY_REF', [52],
      );

      expect(PullRequestsService.createPullRequestCondition1).toHaveBeenCalledWith('TEST', 'test-repo', {
        reviewers: [{ id: 52 }],
        sourceMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
        targetMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
      });
    });

    it('should handle errors when creating a condition', async () => {
      (PullRequestsService.createPullRequestCondition1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createDefaultReviewerCondition(
        'TEST', 'test-repo', 'ANY_REF', 'ANY_REF', 'ANY_REF', 'ANY_REF', [52],
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a condition passing the id as a string', async () => {
      const mockData = { id: 1, requiredApprovals: 2 };
      (PullRequestsService.updatePullRequestCondition1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateDefaultReviewerCondition(
        'test', 'Test-Repo', '1', 'ANY_REF', 'ANY_REF', 'BRANCH', 'refs/heads/main', [52], 2, undefined, 'main',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(PullRequestsService.updatePullRequestCondition1).toHaveBeenCalledWith('TEST', '1', 'test-repo', {
        reviewers: [{ id: 52 }],
        sourceMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
        targetMatcher: { id: 'refs/heads/main', displayId: 'main', type: { id: 'BRANCH' } },
        requiredApprovals: 2,
      });
    });

    it('should delete a condition coercing the id to a number and return an ack', async () => {
      (PullRequestsService.deletePullRequestCondition1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteDefaultReviewerCondition('test', 'Test-Repo', '1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, id: '1' });
      expect(PullRequestsService.deletePullRequestCondition1).toHaveBeenCalledWith('TEST', 1, 'test-repo');
    });

    it('should preserve the error field when delete fails', async () => {
      (PullRequestsService.deletePullRequestCondition1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteDefaultReviewerCondition('TEST', 'test-repo', '1');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
