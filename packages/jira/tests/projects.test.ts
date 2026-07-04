import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jira-service.js';
import {
  ComponentService,
  ProjectCategoryService,
  ProjectService,
  ProjectsService,
  ProjectvalidateService,
  VersionService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/index.js', () => ({
  ProjectService: {
    getAllProjects: vi.fn(),
    getProject: vi.fn(),
    getProjectComponents: vi.fn(),
    getProjectVersions: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    archiveProject: vi.fn(),
    restoreProject: vi.fn(),
    getPropertiesKeys3: vi.fn(),
    getProperty5: vi.fn(),
    setProperty4: vi.fn(),
    deleteProperty5: vi.fn(),
    getProjectRoles: vi.fn(),
    getProjectRole: vi.fn(),
    setActors: vi.fn(),
    addActorUsers: vi.fn(),
    deleteActor: vi.fn(),
  },
  ProjectsService: {
    searchForProjects: vi.fn(),
  },
  ComponentService: {
    createComponent: vi.fn(),
    getPaginatedComponents: vi.fn(),
    getComponent: vi.fn(),
    updateComponent: vi.fn(),
    delete: vi.fn(),
    getComponentRelatedIssues: vi.fn(),
  },
  VersionService: {
    createVersion: vi.fn(),
    getPaginatedVersions: vi.fn(),
    getVersion: vi.fn(),
    updateVersion: vi.fn(),
    delete1: vi.fn(),
    merge: vi.fn(),
    moveVersion: vi.fn(),
    getVersionRelatedIssues: vi.fn(),
    getVersionUnresolvedIssues: vi.fn(),
  },
  ProjectCategoryService: {
    getAllProjectCategories: vi.fn(),
    createProjectCategory: vi.fn(),
    getProjectCategoryById: vi.fn(),
    updateProjectCategory: vi.fn(),
    removeProjectCategory: vi.fn(),
  },
  ProjectvalidateService: {
    getProject1: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('gets all visible projects', async () => {
      const mockProjects = [{ key: 'TEST' }];
      (ProjectService.getAllProjects as Mock).mockResolvedValue(mockProjects);

      const result = await jiraService.getProjects();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProjects);
      expect(ProjectService.getAllProjects).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('forwards includeArchived, expand, and recent', async () => {
      (ProjectService.getAllProjects as Mock).mockResolvedValue([]);

      await jiraService.getProjects(true, 'lead', 5);

      expect(ProjectService.getAllProjects).toHaveBeenCalledWith(true, 'lead', 5);
    });

    it('handles API errors', async () => {
      (ProjectService.getAllProjects as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('searchProjects', () => {
    it('searches projects by query', async () => {
      const mockResult = { total: 1 };
      (ProjectsService.searchForProjects as Mock).mockResolvedValue(mockResult);

      const result = await jiraService.searchProjects('TES');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(ProjectsService.searchForProjects).toHaveBeenCalledWith(undefined, 'TES', undefined);
    });
  });
  describe('getProject', () => {
    it('gets a single project by id or key', async () => {
      const mockProject = { key: 'TEST' };
      (ProjectService.getProject as Mock).mockResolvedValue(mockProject);

      const result = await jiraService.getProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(ProjectService.getProject).toHaveBeenCalledWith('TEST', undefined);
    });

    it('handles project not found errors', async () => {
      (ProjectService.getProject as Mock).mockRejectedValue(new Error('Project not found'));

      const result = await jiraService.getProject('MISSING');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project not found');
    });
  });
  describe('getProjectComponents', () => {
    it('gets project components', async () => {
      const mockComponents = [{ name: 'Backend' }];
      (ProjectService.getProjectComponents as Mock).mockResolvedValue(mockComponents);

      const result = await jiraService.getProjectComponents('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponents);
      expect(ProjectService.getProjectComponents).toHaveBeenCalledWith('TEST');
    });
  });
  describe('getProjectVersions', () => {
    it('gets project versions', async () => {
      const mockVersions = [{ name: '1.0' }];
      (ProjectService.getProjectVersions as Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getProjectVersions('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
      expect(ProjectService.getProjectVersions).toHaveBeenCalledWith('TEST', undefined);
    });
  });
  describe('createProject', () => {
    it('creates a project', async () => {
      const mockIdentity = { id: 10001, key: 'TEST', self: 'https://jira.example.com/rest/api/2/project/10001' };
      (ProjectService.createProject as Mock).mockResolvedValue(mockIdentity);

      const result = await jiraService.createProject({ key: 'TEST', name: 'Test Project' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIdentity);
      expect(ProjectService.createProject).toHaveBeenCalledWith({ key: 'TEST', name: 'Test Project' });
    });

    it('handles API errors', async () => {
      (ProjectService.createProject as Mock).mockRejectedValue(new Error('Project key already exists'));

      const result = await jiraService.createProject({ key: 'TEST', name: 'Test Project' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project key already exists');
    });
  });
  describe('updateProject', () => {
    it('updates a project', async () => {
      const mockProject = { key: 'TEST', name: 'Renamed Project' };
      (ProjectService.updateProject as Mock).mockResolvedValue(mockProject);

      const result = await jiraService.updateProject('TEST', { name: 'Renamed Project' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(ProjectService.updateProject).toHaveBeenCalledWith('TEST', { name: 'Renamed Project' }, undefined);
    });

    it('forwards expand', async () => {
      (ProjectService.updateProject as Mock).mockResolvedValue({});

      await jiraService.updateProject('TEST', { description: 'New description' }, 'lead');

      expect(ProjectService.updateProject).toHaveBeenCalledWith('TEST', { description: 'New description' }, 'lead');
    });

    it('handles API errors', async () => {
      (ProjectService.updateProject as Mock).mockRejectedValue(new Error('Project not found'));

      const result = await jiraService.updateProject('MISSING', { name: 'X' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project not found');
    });
  });
  describe('deleteProject', () => {
    it('deletes a project and returns an acknowledgement', async () => {
      (ProjectService.deleteProject as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectIdOrKey: 'TEST' });
      expect(ProjectService.deleteProject).toHaveBeenCalledWith('TEST');
    });

    it('handles API errors', async () => {
      (ProjectService.deleteProject as Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await jiraService.deleteProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });
  describe('archiveProject', () => {
    it('archives a project and returns an acknowledgement', async () => {
      (ProjectService.archiveProject as Mock).mockResolvedValue(undefined);

      const result = await jiraService.archiveProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ archived: true, projectIdOrKey: 'TEST' });
      expect(ProjectService.archiveProject).toHaveBeenCalledWith('TEST');
    });

    it('handles API errors', async () => {
      (ProjectService.archiveProject as Mock).mockRejectedValue(new Error('Already archived'));

      const result = await jiraService.archiveProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already archived');
    });
  });
  describe('restoreProject', () => {
    it('restores an archived project', async () => {
      const mockProject = { key: 'TEST' };
      (ProjectService.restoreProject as Mock).mockResolvedValue(mockProject);

      const result = await jiraService.restoreProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(ProjectService.restoreProject).toHaveBeenCalledWith('TEST');
    });

    it('handles API errors', async () => {
      (ProjectService.restoreProject as Mock).mockRejectedValue(new Error('Already active'));

      const result = await jiraService.restoreProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already active');
    });
  });
  describe('project entity properties', () => {
    it('gets project property keys', async () => {
      const mockKeys = { keys: [{ key: 'my-property', self: 'https://example.com' }] };
      (ProjectService.getPropertiesKeys3 as Mock).mockResolvedValue(mockKeys);

      const result = await jiraService.getProjectPropertyKeys('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockKeys);
      expect(ProjectService.getPropertiesKeys3).toHaveBeenCalledWith('TEST');
    });

    it('handles errors getting project property keys', async () => {
      (ProjectService.getPropertiesKeys3 as Mock).mockRejectedValue(new Error('The project does not exist'));

      const result = await jiraService.getProjectPropertyKeys('MISSING');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The project does not exist');
    });

    it('gets a project property', async () => {
      const mockProperty = { key: 'my-property', value: '{"a":1}' };
      (ProjectService.getProperty5 as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getProjectProperty('TEST', 'my-property');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(ProjectService.getProperty5).toHaveBeenCalledWith('my-property', 'TEST');
    });

    it('handles errors getting a project property', async () => {
      (ProjectService.getProperty5 as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.getProjectProperty('TEST', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });

    it('sets a project property', async () => {
      (ProjectService.setProperty4 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setProjectProperty('TEST', 'my-property', '{"a":1}');

      expect(result.success).toBe(true);
      expect(ProjectService.setProperty4).toHaveBeenCalledWith('my-property', 'TEST', { key: 'my-property', value: '{"a":1}' });
    });

    it('handles errors setting a project property', async () => {
      (ProjectService.setProperty4 as Mock).mockRejectedValue(new Error('The calling user does not have permission to administer the project'));

      const result = await jiraService.setProjectProperty('TEST', 'my-property', '{"a":1}');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The calling user does not have permission to administer the project');
    });

    it('deletes a project property', async () => {
      (ProjectService.deleteProperty5 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectProperty('TEST', 'my-property');

      expect(result.success).toBe(true);
      expect(ProjectService.deleteProperty5).toHaveBeenCalledWith('my-property', 'TEST');
    });

    it('handles errors deleting a project property', async () => {
      (ProjectService.deleteProperty5 as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.deleteProjectProperty('TEST', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });
  });
  describe('components', () => {
    it('creates a component', async () => {
      const mockComponent = { id: '10000', name: 'Backend' };
      (ComponentService.createComponent as Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.createComponent('TEST', 'Backend');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(ComponentService.createComponent).toHaveBeenCalledWith({
        project: 'TEST',
        name: 'Backend',
        description: undefined,
        leadUserName: undefined,
      });
    });

    it('gets paginated components', async () => {
      const mockPage = { values: [{ name: 'Backend' }] };
      (ComponentService.getPaginatedComponents as Mock).mockResolvedValue(mockPage);

      const result = await jiraService.getComponents();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPage);
      expect(ComponentService.getPaginatedComponents).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('gets a single component', async () => {
      const mockComponent = { id: '10000', name: 'Backend' };
      (ComponentService.getComponent as Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.getComponent('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(ComponentService.getComponent).toHaveBeenCalledWith('10000');
    });

    it('updates a component', async () => {
      const mockComponent = { id: '10000', name: 'Backend v2' };
      (ComponentService.updateComponent as Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.updateComponent('10000', 'Backend v2');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(ComponentService.updateComponent).toHaveBeenCalledWith('10000', {
        name: 'Backend v2',
        description: undefined,
        leadUserName: undefined,
      });
    });

    it('deletes a component', async () => {
      (ComponentService.delete as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteComponent('10000');

      expect(result.success).toBe(true);
      expect(ComponentService.delete).toHaveBeenCalledWith('10000', undefined);
    });

    it('gets component related issue counts', async () => {
      const mockCounts = { issueCount: 5 };
      (ComponentService.getComponentRelatedIssues as Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getComponentRelatedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });
  });
  describe('versions', () => {
    it('creates a version', async () => {
      const mockVersion = { id: '10000', name: '1.0' };
      (VersionService.createVersion as Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.createVersion('TEST', '1.0');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(VersionService.createVersion).toHaveBeenCalledWith({
        project: 'TEST',
        name: '1.0',
        description: undefined,
        releaseDate: undefined,
        startDate: undefined,
      });
    });

    it('gets paginated versions with defaults', async () => {
      const mockPage = { values: [{ name: '1.0' }] };
      (VersionService.getPaginatedVersions as Mock).mockResolvedValue(mockPage);

      const result = await jiraService.getVersions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPage);
      expect(VersionService.getPaginatedVersions).toHaveBeenCalledWith(100, '', undefined, undefined);
    });

    it('gets a single version', async () => {
      const mockVersion = { id: '10000', name: '1.0' };
      (VersionService.getVersion as Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.getVersion('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(VersionService.getVersion).toHaveBeenCalledWith('10000', undefined);
    });

    it('updates a version', async () => {
      (VersionService.updateVersion as Mock).mockResolvedValue({ id: '10000', released: true });

      const result = await jiraService.updateVersion('10000', undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(VersionService.updateVersion).toHaveBeenCalledWith('10000', {
        name: undefined,
        description: undefined,
        released: true,
        archived: undefined,
        releaseDate: undefined,
      });
    });

    it('deletes and replaces a version', async () => {
      (VersionService.delete1 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAndReplaceVersion('10000', 10001, 10002);

      expect(result.success).toBe(true);
      expect(VersionService.delete1).toHaveBeenCalledWith('10000', {
        moveFixIssuesTo: 10001,
        moveAffectedIssuesTo: 10002,
      });
    });

    it('merges a version into another', async () => {
      (VersionService.merge as Mock).mockResolvedValue(undefined);

      const result = await jiraService.mergeVersion('10000', '10001');

      expect(result.success).toBe(true);
      expect(VersionService.merge).toHaveBeenCalledWith('10001', '10000');
    });

    it('moves a version', async () => {
      const mockVersion = { id: '10000' };
      (VersionService.moveVersion as Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.moveVersion('10000', 'First');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(VersionService.moveVersion).toHaveBeenCalledWith('10000', { position: 'First', after: undefined });
    });

    it('gets version related issue counts', async () => {
      const mockCounts = { issuesFixedCount: 3 };
      (VersionService.getVersionRelatedIssues as Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getVersionRelatedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });

    it('gets version unresolved issue counts', async () => {
      const mockCounts = { issuesUnresolvedCount: 1 };
      (VersionService.getVersionUnresolvedIssues as Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getVersionUnresolvedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });

    it('handles errors', async () => {
      (VersionService.getVersion as Mock).mockRejectedValue(new Error('Version does not exist'));

      const result = await jiraService.getVersion('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Version does not exist');
    });
  });
  describe('project roles', () => {
    it('gets project roles', async () => {
      const mockRoles = { Developers: 'https://jira/rest/api/2/project/TEST/role/10000' };
      (ProjectService.getProjectRoles as Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getProjectRoles('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(ProjectService.getProjectRoles).toHaveBeenCalledWith('TEST');
    });

    it('gets a single project role', async () => {
      const mockRole = { id: 10000, name: 'Developers', actors: [] };
      (ProjectService.getProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getProjectRole('TEST', 10000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(ProjectService.getProjectRole).toHaveBeenCalledWith('TEST', 10000);
    });

    it('replaces all actors for a role', async () => {
      const mockRole = { id: 10000, name: 'Developers' };
      (ProjectService.setActors as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.setProjectRoleActors('TEST', 10000, { 'atlassian-user-role-actor': ['john.doe'] });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(ProjectService.setActors).toHaveBeenCalledWith('TEST', 10000, {
        categorisedActors: { 'atlassian-user-role-actor': ['john.doe'] },
        id: 10000,
      });
    });

    it('adds actors to a role', async () => {
      const mockRole = { id: 10000, name: 'Developers' };
      (ProjectService.addActorUsers as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.addProjectRoleActors('TEST', 10000, ['john.doe'], ['admins']);

      expect(result.success).toBe(true);
      expect(ProjectService.addActorUsers).toHaveBeenCalledWith('TEST', 10000, {
        user: ['john.doe'],
        group: ['admins'],
      });
    });

    it('deletes an actor from a role', async () => {
      (ProjectService.deleteActor as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectRoleActor('TEST', 10000, 'john.doe');

      expect(result.success).toBe(true);
      expect(ProjectService.deleteActor).toHaveBeenCalledWith('TEST', 10000, 'john.doe', undefined);
    });

    it('handles errors', async () => {
      (ProjectService.getProjectRole as Mock).mockRejectedValue(new Error('Project or role not found'));

      const result = await jiraService.getProjectRole('TEST', 99999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project or role not found');
    });
  });
  describe('project categories', () => {
    it('gets all project categories', async () => {
      const mockCategories = [{ id: '1', name: 'Category 1' }];
      (ProjectCategoryService.getAllProjectCategories as Mock).mockResolvedValue(mockCategories);

      const result = await jiraService.getProjectCategories();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategories);
      expect(ProjectCategoryService.getAllProjectCategories).toHaveBeenCalledWith();
    });

    it('creates a project category', async () => {
      const mockCategory = { id: '2', name: 'New Category' };
      (ProjectCategoryService.createProjectCategory as Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.createProjectCategory('New Category', 'A category');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(ProjectCategoryService.createProjectCategory).toHaveBeenCalledWith({
        name: 'New Category',
        description: 'A category',
      });
    });

    it('gets a project category by id', async () => {
      const mockCategory = { id: '1', name: 'Category 1' };
      (ProjectCategoryService.getProjectCategoryById as Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.getProjectCategory(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(ProjectCategoryService.getProjectCategoryById).toHaveBeenCalledWith(1);
    });

    it('updates a project category', async () => {
      const mockCategory = { id: '1', name: 'Renamed' };
      (ProjectCategoryService.updateProjectCategory as Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.updateProjectCategory(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(ProjectCategoryService.updateProjectCategory).toHaveBeenCalledWith(1, {
        name: 'Renamed',
        description: undefined,
      });
    });

    it('deletes a project category', async () => {
      (ProjectCategoryService.removeProjectCategory as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectCategory(1);

      expect(result.success).toBe(true);
      expect(ProjectCategoryService.removeProjectCategory).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (ProjectCategoryService.getProjectCategoryById as Mock).mockRejectedValue(new Error('The category does not exist'));

      const result = await jiraService.getProjectCategory(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The category does not exist');
    });
  });
  describe('validateProjectKey', () => {
    it('returns an empty error collection for a valid key', async () => {
      const mockValidation = { errorMessages: [], errors: {} };
      (ProjectvalidateService.getProject1 as Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateProjectKey('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockValidation);
      expect(ProjectvalidateService.getProject1).toHaveBeenCalledWith('TEST');
    });

    it('returns validation errors for an invalid key', async () => {
      const mockValidation = { errorMessages: [], errors: { projectKey: 'A project with that key already exists.' } };
      (ProjectvalidateService.getProject1 as Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateProjectKey('EXIST');

      expect(result.success).toBe(true);
      expect(result.data?.errors).toEqual({ projectKey: 'A project with that key already exists.' });
    });

    it('handles errors', async () => {
      (ProjectvalidateService.getProject1 as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.validateProjectKey('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
});
