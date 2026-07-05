import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  permissions: {
    getGroupsWithAnyPermission: vi.fn(),
    getUsersWithAnyPermission: vi.fn(),
    revokePermissions: vi.fn(),
    setPermissionForGroup: vi.fn(),
    setPermissionForUser: vi.fn(),
  },
  pullRequests: {
    create: vi.fn(),
    get: vi.fn(),
    getPage: vi.fn(),
    getReviewers: vi.fn(),
    streamChanges: vi.fn(),
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

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('repository permissions', () => {
    it('should get combined users and groups with repository permissions', async () => {
      const mockUsers = { values: [{ user: { name: 'alice' }, permission: 'REPO_WRITE' }], size: 1, isLastPage: true };
      const mockGroups = { values: [{ group: { name: 'devs' }, permission: 'REPO_READ' }], size: 1, isLastPage: true };
      (bb.permissions.getUsersWithAnyPermission as Mock).mockResolvedValue(mockUsers);
      (bb.permissions.getGroupsWithAnyPermission as Mock).mockResolvedValue(mockGroups);

      const result = await bitbucketService.getRepoPermissions(mockProjectKey, mockRepositorySlug);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ users: mockUsers, groups: mockGroups });
      expect(bb.permissions.getUsersWithAnyPermission).toHaveBeenCalledWith({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, filter: undefined, start: undefined, limit: 25 });
      expect(bb.permissions.getGroupsWithAnyPermission).toHaveBeenCalledWith({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, filter: undefined, start: undefined, limit: 25 });
    });

    it('should handle errors when fetching repository permissions', async () => {
      (bb.permissions.getUsersWithAnyPermission as Mock).mockRejectedValue(new Error('API Error'));
      (bb.permissions.getGroupsWithAnyPermission as Mock).mockResolvedValue({ values: [] });

      const result = await bitbucketService.getRepoPermissions(mockProjectKey, mockRepositorySlug);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a repository user permission', async () => {
      (bb.permissions.setPermissionForUser as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setRepoUserPermission(mockProjectKey, mockRepositorySlug, 'alice', 'REPO_WRITE');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, name: 'alice', permission: 'REPO_WRITE' });
      expect(bb.permissions.setPermissionForUser).toHaveBeenCalledWith({ projectKey: mockProjectKey, name: ['alice'], permission: 'REPO_WRITE', repositorySlug: mockRepositorySlug });
    });

    it('should handle errors when setting a repository user permission', async () => {
      (bb.permissions.setPermissionForUser as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setRepoUserPermission(mockProjectKey, mockRepositorySlug, 'alice', 'REPO_WRITE');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a repository group permission', async () => {
      (bb.permissions.setPermissionForGroup as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setRepoGroupPermission(mockProjectKey, mockRepositorySlug, 'devs', 'REPO_READ');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, name: 'devs', permission: 'REPO_READ' });
      expect(bb.permissions.setPermissionForGroup).toHaveBeenCalledWith({ projectKey: mockProjectKey, name: ['devs'], permission: 'REPO_READ', repositorySlug: mockRepositorySlug });
    });

    it('should handle errors when setting a repository group permission', async () => {
      (bb.permissions.setPermissionForGroup as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setRepoGroupPermission(mockProjectKey, mockRepositorySlug, 'devs', 'REPO_READ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should revoke a repository permission for a user and a group', async () => {
      (bb.permissions.revokePermissions as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.revokeRepoPermission(mockProjectKey, mockRepositorySlug, 'alice', 'devs');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ revoked: true, projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, user: 'alice', group: 'devs' });
      expect(bb.permissions.revokePermissions).toHaveBeenCalledWith({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, user: 'alice', group: 'devs' });
    });

    it('should handle errors when revoking a repository permission', async () => {
      (bb.permissions.revokePermissions as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.revokeRepoPermission(mockProjectKey, mockRepositorySlug, 'alice');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('searchCode', () => {
    it('should search code with the default page size', async () => {
      const mockData = { code: { count: 1, values: [{ repository: { slug: 'demo' } }] } };
      bb.request.mockResolvedValue(mockData);

      const result = await bitbucketService.searchCode('app');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/search/latest/search',
        body: {
          query: 'app',
          entities: { code: {} },
          limits: { primary: 25 },
        },
        mediaType: 'application/json',
      });
    });

    it('should pass explicit primary and secondary limits', async () => {
      bb.request.mockResolvedValue({ code: { count: 0, values: [] } });

      await bitbucketService.searchCode('repo:demo TODO', 10, 5);

      expect(bb.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/search/latest/search',
          body: {
            query: 'repo:demo TODO',
            entities: { code: {} },
            limits: { primary: 10, secondary: 5 },
          },
        }),
      );
    });

    it('should handle errors when searching', async () => {
      bb.request.mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.searchCode('app');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('case-insensitive project keys and repository slugs', () => {
    it('should uppercase projectKey and lowercase repositorySlug for getPullRequests', async () => {
      const mockData = { values: [], size: 0, isLastPage: true };
      (bb.pullRequests.getPage as Mock).mockResolvedValue(mockData);

      await bitbucketService.getPullRequests('test', 'Test-Repo');

      expect(bb.pullRequests.getPage).toHaveBeenCalledWith({
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
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

    it('should uppercase projectKey and lowercase repositorySlug for getPullRequest', async () => {
      const mockData = { id: 1, title: 'Test PR' };
      (bb.pullRequests.get as Mock).mockResolvedValue(mockData);

      await bitbucketService.getPullRequest('test', 'Test-Repo', '1');

      expect(bb.pullRequests.get).toHaveBeenCalledWith({ projectKey: 'TEST', pullRequestId: '1', repositorySlug: 'test-repo' });
    });

    it('should uppercase projectKey and lowercase repositorySlug for getPullRequestChanges', async () => {
      const mockData = { values: [], size: 0, isLastPage: true };
      (bb.pullRequests.streamChanges as Mock).mockResolvedValue(mockData);

      await bitbucketService.getPullRequestChanges('test', 'Test-Repo', '1');

      expect(bb.pullRequests.streamChanges).toHaveBeenCalledWith({
        projectKey: 'TEST',
        pullRequestId: '1',
        repositorySlug: 'test-repo',
        sinceId: undefined,
        changeScope: undefined,
        untilId: undefined,
        withComments: undefined,
        start: undefined,
        limit: 25,
      });
    });

    it('should uppercase projectKey and lowercase repositorySlug for createPullRequest', async () => {
      const mockData = { id: 1, title: 'New PR' };
      (bb.pullRequests.create as Mock).mockResolvedValue(mockData);

      await bitbucketService.createPullRequest(
        'test', 'Test-Repo', 'title', 'desc',
        'refs/heads/feature', 'refs/heads/main',
      );

      expect(bb.pullRequests.create).toHaveBeenCalledWith({
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        requestBody: expect.objectContaining({
          title: 'title',
          fromRef: expect.objectContaining({
            repository: expect.objectContaining({
              slug: 'test-repo',
              project: { key: 'TEST' },
            }),
          }),
        }),
      });
    });

    it('should uppercase projectKey and lowercase repositorySlug for getRequiredReviewers', async () => {
      const mockData: never[] = [];
      (bb.pullRequests.getReviewers as Mock).mockResolvedValue(mockData);

      await bitbucketService.getRequiredReviewers(
        'test', 'Test-Repo', 'refs/heads/feature', 'refs/heads/main',
      );

      expect(bb.pullRequests.getReviewers).toHaveBeenCalledWith({
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        targetRepoId: undefined,
        sourceRepoId: undefined,
        sourceRefId: 'refs/heads/feature',
        targetRefId: 'refs/heads/main',
      });
    });
  });
});
