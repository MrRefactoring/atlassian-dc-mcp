import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const jira = vi.hoisted(() => {
  const group = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return { issues: group(), projects: group(), users: group(), workflows: group(), agile: group(), admin: group(), request: vi.fn() };
});
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient: () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('gets all visible projects', async () => {
      const mockProjects = [{ key: 'TEST' }];
      (jira.projects.getAllProjects as Mock).mockResolvedValue(mockProjects);

      const result = await jiraService.getProjects();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProjects);
      expect(jira.projects.getAllProjects).toHaveBeenCalledWith({});
    });

    it('forwards includeArchived, expand, and recent', async () => {
      (jira.projects.getAllProjects as Mock).mockResolvedValue([]);

      await jiraService.getProjects(true, 'lead', 5);

      expect(jira.projects.getAllProjects).toHaveBeenCalledWith({ includeArchived: true, expand: 'lead', recent: 5 });
    });

    it('handles API errors', async () => {
      (jira.projects.getAllProjects as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('searchProjects', () => {
    it('searches projects by query', async () => {
      const mockResult = { total: 1 };
      (jira.projects.searchForProjects as Mock).mockResolvedValue(mockResult);

      const result = await jiraService.searchProjects('TES');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(jira.projects.searchForProjects).toHaveBeenCalledWith({ query: 'TES' });
    });
  });
  describe('getProject', () => {
    it('gets a single project by id or key', async () => {
      const mockProject = { key: 'TEST' };
      (jira.projects.getProjectProject as Mock).mockResolvedValue(mockProject);

      const result = await jiraService.getProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(jira.projects.getProjectProject).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('handles project not found errors', async () => {
      (jira.projects.getProjectProject as Mock).mockRejectedValue(new Error('Project not found'));

      const result = await jiraService.getProject('MISSING');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project not found');
    });
  });
  describe('getProjectComponents', () => {
    it('gets project components', async () => {
      const mockComponents = [{ name: 'Backend' }];
      (jira.projects.getProjectComponents as Mock).mockResolvedValue(mockComponents);

      const result = await jiraService.getProjectComponents('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponents);
      expect(jira.projects.getProjectComponents).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });
  });
  describe('getProjectVersions', () => {
    it('gets project versions', async () => {
      const mockVersions = [{ name: '1.0' }];
      (jira.projects.getProjectVersions as Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getProjectVersions('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
      expect(jira.projects.getProjectVersions).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });
  });
  describe('createProject', () => {
    it('creates a project', async () => {
      const mockIdentity = { id: 10001, key: 'TEST', self: 'https://jira.example.com/rest/api/2/project/10001' };
      (jira.projects.createProject as Mock).mockResolvedValue(mockIdentity);

      const result = await jiraService.createProject({ key: 'TEST', name: 'Test Project' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIdentity);
      expect(jira.projects.createProject).toHaveBeenCalledWith({ requestBody: { key: 'TEST', name: 'Test Project' } });
    });

    it('handles API errors', async () => {
      (jira.projects.createProject as Mock).mockRejectedValue(new Error('Project key already exists'));

      const result = await jiraService.createProject({ key: 'TEST', name: 'Test Project' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project key already exists');
    });
  });
  describe('updateProject', () => {
    it('updates a project', async () => {
      const mockProject = { key: 'TEST', name: 'Renamed Project' };
      (jira.projects.updateProject as Mock).mockResolvedValue(mockProject);

      const result = await jiraService.updateProject('TEST', { name: 'Renamed Project' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(jira.projects.updateProject).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', requestBody: { name: 'Renamed Project' } });
    });

    it('forwards expand', async () => {
      (jira.projects.updateProject as Mock).mockResolvedValue({});

      await jiraService.updateProject('TEST', { description: 'New description' }, 'lead');

      expect(jira.projects.updateProject).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', requestBody: { description: 'New description' }, expand: 'lead' });
    });

    it('handles API errors', async () => {
      (jira.projects.updateProject as Mock).mockRejectedValue(new Error('Project not found'));

      const result = await jiraService.updateProject('MISSING', { name: 'X' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project not found');
    });
  });
  describe('deleteProject', () => {
    it('deletes a project and returns an acknowledgement', async () => {
      (jira.projects.deleteProject as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectIdOrKey: 'TEST' });
      expect(jira.projects.deleteProject).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('handles API errors', async () => {
      (jira.projects.deleteProject as Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await jiraService.deleteProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });
  describe('archiveProject', () => {
    it('archives a project and returns an acknowledgement', async () => {
      (jira.projects.archiveProject as Mock).mockResolvedValue(undefined);

      const result = await jiraService.archiveProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ archived: true, projectIdOrKey: 'TEST' });
      expect(jira.projects.archiveProject).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('handles API errors', async () => {
      (jira.projects.archiveProject as Mock).mockRejectedValue(new Error('Already archived'));

      const result = await jiraService.archiveProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already archived');
    });
  });
  describe('restoreProject', () => {
    it('restores an archived project', async () => {
      const mockProject = { key: 'TEST' };
      (jira.projects.restoreProject as Mock).mockResolvedValue(mockProject);

      const result = await jiraService.restoreProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(jira.projects.restoreProject).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('handles API errors', async () => {
      (jira.projects.restoreProject as Mock).mockRejectedValue(new Error('Already active'));

      const result = await jiraService.restoreProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already active');
    });
  });
  describe('project entity properties', () => {
    it('gets project property keys', async () => {
      const mockKeys = { keys: [{ key: 'my-property', self: 'https://example.com' }] };
      (jira.projects.getPropertiesKeys as Mock).mockResolvedValue(mockKeys);

      const result = await jiraService.getProjectPropertyKeys('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockKeys);
      expect(jira.projects.getPropertiesKeys).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('handles errors getting project property keys', async () => {
      (jira.projects.getPropertiesKeys as Mock).mockRejectedValue(new Error('The project does not exist'));

      const result = await jiraService.getProjectPropertyKeys('MISSING');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The project does not exist');
    });

    it('gets a project property', async () => {
      const mockProperty = { key: 'my-property', value: '{"a":1}' };
      (jira.projects.getProperty as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getProjectProperty('TEST', 'my-property');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(jira.projects.getProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', projectIdOrKey: 'TEST' });
    });

    it('handles errors getting a project property', async () => {
      (jira.projects.getProperty as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.getProjectProperty('TEST', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });

    it('sets a project property', async () => {
      (jira.projects.setProperty as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setProjectProperty('TEST', 'my-property', '{"a":1}');

      expect(result.success).toBe(true);
      expect(jira.projects.setProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', projectIdOrKey: 'TEST', requestBody: { key: 'my-property', value: '{"a":1}' } });
    });

    it('handles errors setting a project property', async () => {
      (jira.projects.setProperty as Mock).mockRejectedValue(new Error('The calling user does not have permission to administer the project'));

      const result = await jiraService.setProjectProperty('TEST', 'my-property', '{"a":1}');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The calling user does not have permission to administer the project');
    });

    it('deletes a project property', async () => {
      (jira.projects.deleteProperty as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectProperty('TEST', 'my-property');

      expect(result.success).toBe(true);
      expect(jira.projects.deleteProperty).toHaveBeenCalledWith({ propertyKey: 'my-property', projectIdOrKey: 'TEST' });
    });

    it('handles errors deleting a project property', async () => {
      (jira.projects.deleteProperty as Mock).mockRejectedValue(new Error('The property with given key is not found'));

      const result = await jiraService.deleteProjectProperty('TEST', 'missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The property with given key is not found');
    });
  });
  describe('components', () => {
    it('creates a component', async () => {
      const mockComponent = { id: '10000', name: 'Backend' };
      (jira.projects.createComponent as Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.createComponent('TEST', 'Backend');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(jira.projects.createComponent).toHaveBeenCalledWith({ requestBody: {
        project: 'TEST',
        name: 'Backend',
        description: undefined,
        leadUserName: undefined,
      } });
    });

    it('gets paginated components', async () => {
      const mockPage = { values: [{ name: 'Backend' }] };
      (jira.projects.getPaginatedComponents as Mock).mockResolvedValue(mockPage);

      const result = await jiraService.getComponents();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPage);
      expect(jira.projects.getPaginatedComponents).toHaveBeenCalledWith({});
    });

    it('gets a single component', async () => {
      const mockComponent = { id: '10000', name: 'Backend' };
      (jira.projects.getComponent as Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.getComponent('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(jira.projects.getComponent).toHaveBeenCalledWith({ id: '10000' });
    });

    it('updates a component', async () => {
      const mockComponent = { id: '10000', name: 'Backend v2' };
      (jira.projects.updateComponent as Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.updateComponent('10000', 'Backend v2');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(jira.projects.updateComponent).toHaveBeenCalledWith({ id: '10000', requestBody: {
        name: 'Backend v2',
        description: undefined,
        leadUserName: undefined,
      } });
    });

    it('deletes a component', async () => {
      (jira.projects.componentDelete as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteComponent('10000');

      expect(result.success).toBe(true);
      expect(jira.projects.componentDelete).toHaveBeenCalledWith({ id: '10000' });
    });

    it('gets component related issue counts', async () => {
      const mockCounts = { issueCount: 5 };
      (jira.projects.getComponentRelatedIssues as Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getComponentRelatedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });
  });
  describe('versions', () => {
    it('creates a version', async () => {
      const mockVersion = { id: '10000', name: '1.0' };
      (jira.projects.createVersion as Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.createVersion('TEST', '1.0');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(jira.projects.createVersion).toHaveBeenCalledWith({ requestBody: {
        project: 'TEST',
        name: '1.0',
        description: undefined,
        releaseDate: undefined,
        startDate: undefined,
      } });
    });

    it('gets paginated versions with defaults', async () => {
      const mockPage = { values: [{ name: '1.0' }] };
      (jira.projects.getPaginatedVersions as Mock).mockResolvedValue(mockPage);

      const result = await jiraService.getVersions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPage);
      expect(jira.projects.getPaginatedVersions).toHaveBeenCalledWith({ maxResults: 100, query: '' });
    });

    it('gets a single version', async () => {
      const mockVersion = { id: '10000', name: '1.0' };
      (jira.projects.getVersion as Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.getVersion('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(jira.projects.getVersion).toHaveBeenCalledWith({ id: '10000' });
    });

    it('updates a version', async () => {
      (jira.projects.updateVersion as Mock).mockResolvedValue({ id: '10000', released: true });

      const result = await jiraService.updateVersion('10000', undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(jira.projects.updateVersion).toHaveBeenCalledWith({ id: '10000', requestBody: {
        name: undefined,
        description: undefined,
        released: true,
        archived: undefined,
        releaseDate: undefined,
      } });
    });

    it('deletes and replaces a version', async () => {
      (jira.projects.versionDelete as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAndReplaceVersion('10000', 10001, 10002);

      expect(result.success).toBe(true);
      expect(jira.projects.versionDelete).toHaveBeenCalledWith({ id: '10000', requestBody: {
        moveFixIssuesTo: 10001,
        moveAffectedIssuesTo: 10002,
      } });
    });

    it('merges a version into another', async () => {
      (jira.projects.merge as Mock).mockResolvedValue(undefined);

      const result = await jiraService.mergeVersion('10000', '10001');

      expect(result.success).toBe(true);
      expect(jira.projects.merge).toHaveBeenCalledWith({ moveIssuesTo: '10001', id: '10000' });
    });

    it('moves a version', async () => {
      const mockVersion = { id: '10000' };
      (jira.projects.moveVersion as Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.moveVersion('10000', 'First');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(jira.projects.moveVersion).toHaveBeenCalledWith({ id: '10000', requestBody: { position: 'First', after: undefined } });
    });

    it('gets version related issue counts', async () => {
      const mockCounts = { issuesFixedCount: 3 };
      (jira.projects.getVersionRelatedIssues as Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getVersionRelatedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });

    it('gets version unresolved issue counts', async () => {
      const mockCounts = { issuesUnresolvedCount: 1 };
      (jira.projects.getVersionUnresolvedIssues as Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getVersionUnresolvedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });

    it('handles errors', async () => {
      (jira.projects.getVersion as Mock).mockRejectedValue(new Error('Version does not exist'));

      const result = await jiraService.getVersion('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Version does not exist');
    });
  });
  describe('project roles', () => {
    it('gets project roles', async () => {
      const mockRoles = { Developers: 'https://jira/rest/api/2/project/TEST/role/10000' };
      (jira.projects.getProjectRoles as Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getProjectRoles('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(jira.projects.getProjectRoles).toHaveBeenCalledWith({ projectIdOrKey: 'TEST' });
    });

    it('gets a single project role', async () => {
      const mockRole = { id: 10000, name: 'Developers', actors: [] };
      (jira.projects.getProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getProjectRole('TEST', 10000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.projects.getProjectRole).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', id: 10000 });
    });

    it('replaces all actors for a role', async () => {
      const mockRole = { id: 10000, name: 'Developers' };
      (jira.projects.setActors as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.setProjectRoleActors('TEST', 10000, { 'atlassian-user-role-actor': ['john.doe'] });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.projects.setActors).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', id: 10000, requestBody: {
        categorisedActors: { 'atlassian-user-role-actor': ['john.doe'] },
        id: 10000,
      } });
    });

    it('adds actors to a role', async () => {
      const mockRole = { id: 10000, name: 'Developers' };
      (jira.projects.addActorUsers as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.addProjectRoleActors('TEST', 10000, ['john.doe'], ['admins']);

      expect(result.success).toBe(true);
      expect(jira.projects.addActorUsers).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', id: 10000, requestBody: {
        user: ['john.doe'],
        group: ['admins'],
      } });
    });

    it('deletes an actor from a role', async () => {
      (jira.projects.deleteActor as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectRoleActor('TEST', 10000, 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.projects.deleteActor).toHaveBeenCalledWith({ projectIdOrKey: 'TEST', id: 10000, user: 'john.doe' });
    });

    it('handles errors', async () => {
      (jira.projects.getProjectRole as Mock).mockRejectedValue(new Error('Project or role not found'));

      const result = await jiraService.getProjectRole('TEST', 99999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project or role not found');
    });
  });
  describe('project categories', () => {
    it('gets all project categories', async () => {
      const mockCategories = [{ id: '1', name: 'Category 1' }];
      (jira.projects.getAllProjectCategories as Mock).mockResolvedValue(mockCategories);

      const result = await jiraService.getProjectCategories();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategories);
      expect(jira.projects.getAllProjectCategories).toHaveBeenCalledWith({});
    });

    it('creates a project category', async () => {
      const mockCategory = { id: '2', name: 'New Category' };
      (jira.projects.createProjectCategory as Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.createProjectCategory('New Category', 'A category');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(jira.projects.createProjectCategory).toHaveBeenCalledWith({ requestBody: {
        name: 'New Category',
        description: 'A category',
      } });
    });

    it('gets a project category by id', async () => {
      const mockCategory = { id: '1', name: 'Category 1' };
      (jira.projects.getProjectCategoryById as Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.getProjectCategory(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(jira.projects.getProjectCategoryById).toHaveBeenCalledWith({ id: 1 });
    });

    it('updates a project category', async () => {
      const mockCategory = { id: '1', name: 'Renamed' };
      (jira.projects.updateProjectCategory as Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.updateProjectCategory(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(jira.projects.updateProjectCategory).toHaveBeenCalledWith({ id: 1, requestBody: {
        name: 'Renamed',
        description: undefined,
      } });
    });

    it('deletes a project category', async () => {
      (jira.projects.removeProjectCategory as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectCategory(1);

      expect(result.success).toBe(true);
      expect(jira.projects.removeProjectCategory).toHaveBeenCalledWith({ id: 1 });
    });

    it('handles errors', async () => {
      (jira.projects.getProjectCategoryById as Mock).mockRejectedValue(new Error('The category does not exist'));

      const result = await jiraService.getProjectCategory(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The category does not exist');
    });
  });
  describe('validateProjectKey', () => {
    it('returns an empty error collection for a valid key', async () => {
      const mockValidation = { errorMessages: [], errors: {} };
      (jira.projects.getProjectvalidateProject as Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateProjectKey('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockValidation);
      expect(jira.projects.getProjectvalidateProject).toHaveBeenCalledWith({ key: 'TEST' });
    });

    it('returns validation errors for an invalid key', async () => {
      const mockValidation = { errorMessages: [], errors: { projectKey: 'A project with that key already exists.' } };
      (jira.projects.getProjectvalidateProject as Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateProjectKey('EXIST');

      expect(result.success).toBe(true);
      expect(result.data?.errors).toEqual({ projectKey: 'A project with that key already exists.' });
    });

    it('handles errors', async () => {
      (jira.projects.getProjectvalidateProject as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.validateProjectKey('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
});
