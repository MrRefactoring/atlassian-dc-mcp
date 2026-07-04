import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucket-service.js';
import { PermissionManagementService, PullRequestsService } from '../src/bitbucket-client/index.js';
import { request } from '../src/bitbucket-client/core/request.js';

vi.mock('../src/bitbucket-client/core/request.js', () => ({
  request: vi.fn()
}));

const mockRequest = vi.mocked(request);

vi.mock('../src/bitbucket-client/index.js', () => ({
  PermissionManagementService: {
    getGroupsWithAnyPermission2: vi.fn(),
    getUsersWithAnyPermission2: vi.fn(),
    revokePermissions1: vi.fn(),
    setPermissionForGroup: vi.fn(),
    setPermissionForUser: vi.fn()
  },
  PullRequestsService: {
    create: vi.fn(),
    get3: vi.fn(),
    getPage: vi.fn(),
    getReviewers: vi.fn(),
    streamChanges1: vi.fn()
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: ''
  }
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
      (PermissionManagementService.getUsersWithAnyPermission2 as Mock).mockResolvedValue(mockUsers);
      (PermissionManagementService.getGroupsWithAnyPermission2 as Mock).mockResolvedValue(mockGroups);

      const result = await bitbucketService.getRepoPermissions(mockProjectKey, mockRepositorySlug);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ users: mockUsers, groups: mockGroups });
      expect(PermissionManagementService.getUsersWithAnyPermission2).toHaveBeenCalledWith(mockProjectKey, mockRepositorySlug, undefined, undefined, 25);
      expect(PermissionManagementService.getGroupsWithAnyPermission2).toHaveBeenCalledWith(mockProjectKey, mockRepositorySlug, undefined, undefined, 25);
    });

    it('should handle errors when fetching repository permissions', async () => {
      (PermissionManagementService.getUsersWithAnyPermission2 as Mock).mockRejectedValue(new Error('API Error'));
      (PermissionManagementService.getGroupsWithAnyPermission2 as Mock).mockResolvedValue({ values: [] });

      const result = await bitbucketService.getRepoPermissions(mockProjectKey, mockRepositorySlug);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a repository user permission', async () => {
      (PermissionManagementService.setPermissionForUser as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setRepoUserPermission(mockProjectKey, mockRepositorySlug, 'alice', 'REPO_WRITE');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, name: 'alice', permission: 'REPO_WRITE' });
      expect(PermissionManagementService.setPermissionForUser).toHaveBeenCalledWith(mockProjectKey, ['alice'], 'REPO_WRITE', mockRepositorySlug);
    });

    it('should handle errors when setting a repository user permission', async () => {
      (PermissionManagementService.setPermissionForUser as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setRepoUserPermission(mockProjectKey, mockRepositorySlug, 'alice', 'REPO_WRITE');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a repository group permission', async () => {
      (PermissionManagementService.setPermissionForGroup as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setRepoGroupPermission(mockProjectKey, mockRepositorySlug, 'devs', 'REPO_READ');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, name: 'devs', permission: 'REPO_READ' });
      expect(PermissionManagementService.setPermissionForGroup).toHaveBeenCalledWith(mockProjectKey, ['devs'], 'REPO_READ', mockRepositorySlug);
    });

    it('should handle errors when setting a repository group permission', async () => {
      (PermissionManagementService.setPermissionForGroup as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setRepoGroupPermission(mockProjectKey, mockRepositorySlug, 'devs', 'REPO_READ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should revoke a repository permission for a user and a group', async () => {
      (PermissionManagementService.revokePermissions1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.revokeRepoPermission(mockProjectKey, mockRepositorySlug, 'alice', 'devs');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ revoked: true, projectKey: mockProjectKey, repositorySlug: mockRepositorySlug, user: 'alice', group: 'devs' });
      expect(PermissionManagementService.revokePermissions1).toHaveBeenCalledWith(mockProjectKey, mockRepositorySlug, 'alice', 'devs');
    });

    it('should handle errors when revoking a repository permission', async () => {
      (PermissionManagementService.revokePermissions1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.revokeRepoPermission(mockProjectKey, mockRepositorySlug, 'alice');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('searchCode', () => {
    it('should search code with the default page size', async () => {
      const mockData = { code: { count: 1, values: [{ repository: { slug: 'demo' } }] } };
      mockRequest.mockResolvedValue(mockData);

      const result = await bitbucketService.searchCode('app');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'POST',
          url: '/search/latest/search',
          body: {
            query: 'app',
            entities: { code: {} },
            limits: { primary: 25 }
          },
          mediaType: 'application/json',
          errors: {
            400: 'The search query was malformed.',
            401: 'The currently authenticated user is not permitted to search.',
          },
        }
      );
    });

    it('should pass explicit primary and secondary limits', async () => {
      mockRequest.mockResolvedValue({ code: { count: 0, values: [] } });

      await bitbucketService.searchCode('repo:demo TODO', 10, 5);

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          method: 'POST',
          url: '/search/latest/search',
          body: {
            query: 'repo:demo TODO',
            entities: { code: {} },
            limits: { primary: 10, secondary: 5 }
          },
        })
      );
    });

    it('should handle errors when searching', async () => {
      mockRequest.mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.searchCode('app');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('case-insensitive project keys and repository slugs', () => {
    it('should uppercase projectKey and lowercase repositorySlug for getPullRequests', async () => {
      const mockData = { values: [], size: 0, isLastPage: true };
      (PullRequestsService.getPage as Mock).mockResolvedValue(mockData);

      await bitbucketService.getPullRequests('test', 'Test-Repo');

      expect(PullRequestsService.getPage).toHaveBeenCalledWith(
        'TEST',
        'test-repo',
        undefined, undefined, undefined, undefined, undefined,
        undefined, undefined, undefined, undefined, 25
      );
    });

    it('should uppercase projectKey and lowercase repositorySlug for getPullRequest', async () => {
      const mockData = { id: 1, title: 'Test PR' };
      (PullRequestsService.get3 as Mock).mockResolvedValue(mockData);

      await bitbucketService.getPullRequest('test', 'Test-Repo', '1');

      expect(PullRequestsService.get3).toHaveBeenCalledWith('TEST', '1', 'test-repo');
    });

    it('should uppercase projectKey and lowercase repositorySlug for getPullRequestChanges', async () => {
      const mockData = { values: [], size: 0, isLastPage: true };
      (PullRequestsService.streamChanges1 as Mock).mockResolvedValue(mockData);

      await bitbucketService.getPullRequestChanges('test', 'Test-Repo', '1');

      expect(PullRequestsService.streamChanges1).toHaveBeenCalledWith(
        'TEST', '1', 'test-repo',
        undefined, undefined, undefined, undefined, undefined, 25
      );
    });

    it('should uppercase projectKey and lowercase repositorySlug for createPullRequest', async () => {
      const mockData = { id: 1, title: 'New PR' };
      (PullRequestsService.create as Mock).mockResolvedValue(mockData);

      await bitbucketService.createPullRequest(
        'test', 'Test-Repo', 'title', 'desc',
        'refs/heads/feature', 'refs/heads/main'
      );

      expect(PullRequestsService.create).toHaveBeenCalledWith(
        'TEST', 'test-repo',
        expect.objectContaining({
          title: 'title',
          fromRef: expect.objectContaining({
            repository: expect.objectContaining({
              slug: 'test-repo',
              project: { key: 'TEST' }
            })
          })
        })
      );
    });

    it('should uppercase projectKey and lowercase repositorySlug for getRequiredReviewers', async () => {
      const mockData: never[] = [];
      (PullRequestsService.getReviewers as Mock).mockResolvedValue(mockData);

      await bitbucketService.getRequiredReviewers(
        'test', 'Test-Repo', 'refs/heads/feature', 'refs/heads/main'
      );

      expect(PullRequestsService.getReviewers).toHaveBeenCalledWith(
        'TEST', 'test-repo', undefined, undefined,
        'refs/heads/feature', 'refs/heads/main'
      );
    });
  });
});
