import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucket-service.js';
import { ProjectService } from '../src/bitbucket-client/index.js';

vi.mock('../src/bitbucket-client/index.js', () => ({
  ProjectService: {
    createProject: vi.fn(),
    deleteProject: vi.fn(),
    updateProject: vi.fn(),
    getGroupsWithAnyPermission1: vi.fn(),
    getUsersWithAnyPermission1: vi.fn(),
    revokePermissions: vi.fn(),
    setPermissionForGroups1: vi.fn(),
    setPermissionForUsers1: vi.fn(),
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

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('project CRUD', () => {
    it('should create a project', async () => {
      const mockData = { key: 'PROJ' };
      (ProjectService.createProject as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createProject('proj', 'My Project', 'desc');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(ProjectService.createProject).toHaveBeenCalledWith({
        key: 'PROJ',
        name: 'My Project',
        description: 'desc',
      });
    });

    it('should omit description when not provided on create', async () => {
      (ProjectService.createProject as Mock).mockResolvedValue({});

      await bitbucketService.createProject('PROJ', 'My Project');

      expect(ProjectService.createProject).toHaveBeenCalledWith({
        key: 'PROJ',
        name: 'My Project',
      });
    });

    it('should handle errors when creating a project', async () => {
      (ProjectService.createProject as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createProject('PROJ', 'My Project');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a project with only the provided fields', async () => {
      const mockData = { key: 'PROJ' };
      (ProjectService.updateProject as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateProject('proj', 'Renamed', 'new desc');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(ProjectService.updateProject).toHaveBeenCalledWith('PROJ', {
        key: 'PROJ',
        name: 'Renamed',
        description: 'new desc',
      });
    });

    it('should update a project sending only the key when nothing else provided', async () => {
      (ProjectService.updateProject as Mock).mockResolvedValue({});

      await bitbucketService.updateProject('PROJ');

      expect(ProjectService.updateProject).toHaveBeenCalledWith('PROJ', { key: 'PROJ' });
    });

    it('should delete a project and return an ack', async () => {
      (ProjectService.deleteProject as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteProject('proj');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, key: 'PROJ' });
      expect(ProjectService.deleteProject).toHaveBeenCalledWith('PROJ');
    });

    it('should preserve the error field when delete fails', async () => {
      (ProjectService.deleteProject as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteProject('PROJ');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('project permissions', () => {
    it('should get combined users and groups with project permissions', async () => {
      const mockUsers = { values: [{ user: { name: 'alice' }, permission: 'PROJECT_WRITE' }], size: 1, isLastPage: true };
      const mockGroups = { values: [{ group: { name: 'devs' }, permission: 'PROJECT_READ' }], size: 1, isLastPage: true };
      (ProjectService.getUsersWithAnyPermission1 as Mock).mockResolvedValue(mockUsers);
      (ProjectService.getGroupsWithAnyPermission1 as Mock).mockResolvedValue(mockGroups);

      const result = await bitbucketService.getProjectPermissions(mockProjectKey);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ users: mockUsers, groups: mockGroups });
      expect(ProjectService.getUsersWithAnyPermission1).toHaveBeenCalledWith(mockProjectKey, undefined, undefined, 25);
      expect(ProjectService.getGroupsWithAnyPermission1).toHaveBeenCalledWith(mockProjectKey, undefined, undefined, 25);
    });

    it('should handle errors when fetching project permissions', async () => {
      (ProjectService.getUsersWithAnyPermission1 as Mock).mockRejectedValue(new Error('API Error'));
      (ProjectService.getGroupsWithAnyPermission1 as Mock).mockResolvedValue({ values: [] });

      const result = await bitbucketService.getProjectPermissions(mockProjectKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a project user permission', async () => {
      (ProjectService.setPermissionForUsers1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setProjectUserPermission(mockProjectKey, 'alice', 'PROJECT_WRITE');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, name: 'alice', permission: 'PROJECT_WRITE' });
      expect(ProjectService.setPermissionForUsers1).toHaveBeenCalledWith(mockProjectKey, 'alice', 'PROJECT_WRITE');
    });

    it('should handle errors when setting a project user permission', async () => {
      (ProjectService.setPermissionForUsers1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setProjectUserPermission(mockProjectKey, 'alice', 'PROJECT_WRITE');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a project group permission', async () => {
      (ProjectService.setPermissionForGroups1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setProjectGroupPermission(mockProjectKey, 'devs', 'PROJECT_READ');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, name: 'devs', permission: 'PROJECT_READ' });
      expect(ProjectService.setPermissionForGroups1).toHaveBeenCalledWith(mockProjectKey, 'devs', 'PROJECT_READ');
    });

    it('should handle errors when setting a project group permission', async () => {
      (ProjectService.setPermissionForGroups1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setProjectGroupPermission(mockProjectKey, 'devs', 'PROJECT_READ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should revoke a project permission for a user and a group', async () => {
      (ProjectService.revokePermissions as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.revokeProjectPermission(mockProjectKey, 'alice', 'devs');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ revoked: true, projectKey: mockProjectKey, user: 'alice', group: 'devs' });
      expect(ProjectService.revokePermissions).toHaveBeenCalledWith(mockProjectKey, 'alice', 'devs');
    });

    it('should handle errors when revoking a project permission', async () => {
      (ProjectService.revokePermissions as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.revokeProjectPermission(mockProjectKey, 'alice');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });
});
