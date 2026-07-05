import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  projects: {
    createProject: vi.fn(),
    deleteProject: vi.fn(),
    updateProject: vi.fn(),
    getGroupsWithAnyPermission: vi.fn(),
    getUsersWithAnyPermission: vi.fn(),
    revokePermissions: vi.fn(),
    setPermissionForGroups: vi.fn(),
    setPermissionForUsers: vi.fn(),
  },
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
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
      (bb.projects.createProject as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createProject('proj', 'My Project', 'desc');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.projects.createProject).toHaveBeenCalledWith({
        key: 'PROJ', name: 'My Project', description: 'desc',
      });
    });

    it('should omit description when not provided on create', async () => {
      (bb.projects.createProject as Mock).mockResolvedValue({});

      await bitbucketService.createProject('PROJ', 'My Project');

      expect(bb.projects.createProject).toHaveBeenCalledWith({
        key: 'PROJ', name: 'My Project',
      });
    });

    it('should handle errors when creating a project', async () => {
      (bb.projects.createProject as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createProject('PROJ', 'My Project');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a project with only the provided fields', async () => {
      const mockData = { key: 'PROJ' };
      (bb.projects.updateProject as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateProject('proj', 'Renamed', 'new desc');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.projects.updateProject).toHaveBeenCalledWith({
        projectKey: 'PROJ',
        key: 'PROJ', name: 'Renamed', description: 'new desc',
      });
    });

    it('should update a project sending only the key when nothing else provided', async () => {
      (bb.projects.updateProject as Mock).mockResolvedValue({});

      await bitbucketService.updateProject('PROJ');

      expect(bb.projects.updateProject).toHaveBeenCalledWith({ projectKey: 'PROJ', key: 'PROJ' });
    });

    it('should delete a project and return an ack', async () => {
      (bb.projects.deleteProject as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteProject('proj');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, key: 'PROJ' });
      expect(bb.projects.deleteProject).toHaveBeenCalledWith({ projectKey: 'PROJ' });
    });

    it('should preserve the error field when delete fails', async () => {
      (bb.projects.deleteProject as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteProject('PROJ');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('project permissions', () => {
    it('should get combined users and groups with project permissions', async () => {
      const mockUsers = { values: [{ user: { name: 'alice' }, permission: 'PROJECT_WRITE' }], size: 1, isLastPage: true };
      const mockGroups = { values: [{ group: { name: 'devs' }, permission: 'PROJECT_READ' }], size: 1, isLastPage: true };
      (bb.projects.getUsersWithAnyPermission as Mock).mockResolvedValue(mockUsers);
      (bb.projects.getGroupsWithAnyPermission as Mock).mockResolvedValue(mockGroups);

      const result = await bitbucketService.getProjectPermissions(mockProjectKey);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ users: mockUsers, groups: mockGroups });
      expect(bb.projects.getUsersWithAnyPermission).toHaveBeenCalledWith({
        projectKey: mockProjectKey, filter: undefined, start: undefined, limit: 25,
      });
      expect(bb.projects.getGroupsWithAnyPermission).toHaveBeenCalledWith({
        projectKey: mockProjectKey, filter: undefined, start: undefined, limit: 25,
      });
    });

    it('should handle errors when fetching project permissions', async () => {
      (bb.projects.getUsersWithAnyPermission as Mock).mockRejectedValue(new Error('API Error'));
      (bb.projects.getGroupsWithAnyPermission as Mock).mockResolvedValue({ values: [] });

      const result = await bitbucketService.getProjectPermissions(mockProjectKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a project user permission', async () => {
      (bb.projects.setPermissionForUsers as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setProjectUserPermission(mockProjectKey, 'alice', 'PROJECT_WRITE');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, name: 'alice', permission: 'PROJECT_WRITE' });
      expect(bb.projects.setPermissionForUsers).toHaveBeenCalledWith({
        projectKey: mockProjectKey, name: 'alice', permission: 'PROJECT_WRITE',
      });
    });

    it('should handle errors when setting a project user permission', async () => {
      (bb.projects.setPermissionForUsers as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setProjectUserPermission(mockProjectKey, 'alice', 'PROJECT_WRITE');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should set a project group permission', async () => {
      (bb.projects.setPermissionForGroups as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.setProjectGroupPermission(mockProjectKey, 'devs', 'PROJECT_READ');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ projectKey: mockProjectKey, name: 'devs', permission: 'PROJECT_READ' });
      expect(bb.projects.setPermissionForGroups).toHaveBeenCalledWith({
        projectKey: mockProjectKey, name: 'devs', permission: 'PROJECT_READ',
      });
    });

    it('should handle errors when setting a project group permission', async () => {
      (bb.projects.setPermissionForGroups as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setProjectGroupPermission(mockProjectKey, 'devs', 'PROJECT_READ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });

    it('should revoke a project permission for a user and a group', async () => {
      (bb.projects.revokePermissions as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.revokeProjectPermission(mockProjectKey, 'alice', 'devs');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ revoked: true, projectKey: mockProjectKey, user: 'alice', group: 'devs' });
      expect(bb.projects.revokePermissions).toHaveBeenCalledWith({
        projectKey: mockProjectKey, user: 'alice', group: 'devs',
      });
    });

    it('should handle errors when revoking a project permission', async () => {
      (bb.projects.revokePermissions as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.revokeProjectPermission(mockProjectKey, 'alice');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });
});
