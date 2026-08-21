import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

// jira.js groups its Data Center surface into sixty-one modules, so the stand-in conjures a module the first time one
// is asked for and a mock the first time a method on it is. `createJiraClient` hands back a provider, which is what
// lets the service re-read its credentials per call.
const jira = vi.hoisted(() => {
  const module_ = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return new Proxy({} as Record<string, unknown>, {
    get: (t, p: string) => (t[p] ??= p === 'request' ? vi.fn() : module_()),
  }) as Record<string, ReturnType<typeof module_>> & { request: ReturnType<typeof vi.fn> };
});
vi.mock('../src/jiraClient.js', () => ({ createJiraClient: () => () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('issue type schemes', () => {
    it('gets all issue type schemes', async () => {
      const mockSchemes = { schemes: [{ id: '1', name: 'Default' }] };
      (jira.issueTypeSchemes.getAllIssueTypeSchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getIssueTypeSchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(jira.issueTypeSchemes.getAllIssueTypeSchemes).toHaveBeenCalledWith();
    });

    it('creates an issue type scheme', async () => {
      const mockScheme = { id: '2', name: 'New Scheme' };
      (jira.issueTypeSchemes.createIssueTypeScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createIssueTypeScheme('New Scheme', 'A scheme', ['10000', '10001'], '10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.issueTypeSchemes.createIssueTypeScheme).toHaveBeenCalledWith({ name: 'New Scheme',
        description: 'A scheme',
        issueTypeIds: ['10000', '10001'],
        defaultIssueTypeId: '10000' });
    });

    it('gets an issue type scheme by id', async () => {
      const mockScheme = { id: '1', name: 'Default' };
      (jira.issueTypeSchemes.getIssueTypeScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getIssueTypeScheme('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.issueTypeSchemes.getIssueTypeScheme).toHaveBeenCalledWith({ schemeId: '1' });
    });

    it('updates an issue type scheme', async () => {
      const mockScheme = { id: '1', name: 'Renamed' };
      (jira.issueTypeSchemes.updateIssueTypeScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updateIssueTypeScheme('1', 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.issueTypeSchemes.updateIssueTypeScheme).toHaveBeenCalledWith({ schemeId: '1', name: 'Renamed',
        description: undefined,
        issueTypeIds: undefined,
        defaultIssueTypeId: undefined });
    });

    it('deletes an issue type scheme', async () => {
      (jira.issueTypeSchemes.deleteIssueTypeScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueTypeScheme('1');

      expect(result.success).toBe(true);
      expect(jira.issueTypeSchemes.deleteIssueTypeScheme).toHaveBeenCalledWith({ schemeId: '1' });
    });

    it('gets projects associated with an issue type scheme', async () => {
      const mockProjects = { values: [{ id: '10000', key: 'TEST' }] };
      (jira.issueTypeSchemes.getAssociatedProjects as Mock).mockResolvedValue(mockProjects);

      const result = await jiraService.getIssueTypeSchemeProjects('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProjects);
      expect(jira.issueTypeSchemes.getAssociatedProjects).toHaveBeenCalledWith({ schemeId: '1' });
    });

    it('sets project associations for an issue type scheme', async () => {
      (jira.issueTypeSchemes.setProjectAssociationsForScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setIssueTypeSchemeProjects('1', ['TEST']);

      expect(result.success).toBe(true);
      expect(jira.issueTypeSchemes.setProjectAssociationsForScheme).toHaveBeenCalledWith({ schemeId: '1', idsOrKeys: ['TEST'] });
    });

    it('adds project associations to an issue type scheme', async () => {
      (jira.issueTypeSchemes.addProjectAssociationsToScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueTypeSchemeProjects('1', ['TEST']);

      expect(result.success).toBe(true);
      expect(jira.issueTypeSchemes.addProjectAssociationsToScheme).toHaveBeenCalledWith({ schemeId: '1', idsOrKeys: ['TEST'] });
    });

    it('removes all project associations from an issue type scheme', async () => {
      (jira.issueTypeSchemes.removeAllProjectAssociations as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueTypeSchemeProjects('1');

      expect(result.success).toBe(true);
      expect(jira.issueTypeSchemes.removeAllProjectAssociations).toHaveBeenCalledWith({ schemeId: '1' });
    });

    it('removes a single project association from an issue type scheme', async () => {
      (jira.issueTypeSchemes.removeProjectAssociation as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueTypeSchemeProject('1', 'TEST');

      expect(result.success).toBe(true);
      expect(jira.issueTypeSchemes.removeProjectAssociation).toHaveBeenCalledWith({ projIdOrKey: 'TEST', schemeId: '1' });
    });

    it('handles errors', async () => {
      (jira.issueTypeSchemes.getIssueTypeScheme as Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getIssueTypeScheme('999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });
  describe('priority schemes', () => {
    it('gets all priority schemes', async () => {
      const mockSchemes = { schemes: [{ id: 1, name: 'Default' }] };
      (jira.prioritySchemes.getPrioritySchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getPrioritySchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(jira.prioritySchemes.getPrioritySchemes).toHaveBeenCalledWith({});
    });

    it('creates a priority scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (jira.prioritySchemes.createPriorityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createPriorityScheme('New Scheme', 'A scheme', '1', ['1', '2']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.prioritySchemes.createPriorityScheme).toHaveBeenCalledWith({ name: 'New Scheme',
        description: 'A scheme',
        defaultOptionId: '1',
        optionIds: ['1', '2'] });
    });

    it('gets a priority scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default' };
      (jira.prioritySchemes.getPriorityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getPriorityScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.prioritySchemes.getPriorityScheme).toHaveBeenCalledWith({ schemeId: 1 });
    });

    it('updates a priority scheme', async () => {
      const mockScheme = { id: 1, name: 'Renamed' };
      (jira.prioritySchemes.updatePriorityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updatePriorityScheme(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.prioritySchemes.updatePriorityScheme).toHaveBeenCalledWith({ schemeId: 1, name: 'Renamed',
        description: undefined,
        defaultOptionId: undefined,
        optionIds: undefined });
    });

    it('deletes a priority scheme', async () => {
      (jira.prioritySchemes.deletePriorityScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePriorityScheme(1);

      expect(result.success).toBe(true);
      expect(jira.prioritySchemes.deletePriorityScheme).toHaveBeenCalledWith({ schemeId: 1 });
    });

    it('handles errors', async () => {
      (jira.prioritySchemes.getPriorityScheme as Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getPriorityScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });
  describe('role definitions', () => {
    it('gets all role definitions', async () => {
      const mockRoles = [{ id: 10, name: 'Administrators' }];
      (jira.projectRoles.getAllProjectRoles as Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getRoleDefinitions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(jira.projectRoles.getAllProjectRoles).toHaveBeenCalledWith();
    });

    it('creates a role definition', async () => {
      const mockRole = { id: 11, name: 'New Role' };
      (jira.projectRoles.createProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.createRoleDefinition('New Role', 'A role');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.projectRoles.createProjectRole).toHaveBeenCalledWith({ name: 'New Role', description: 'A role' });
    });

    it('gets a role definition by id', async () => {
      const mockRole = { id: 10, name: 'Administrators' };
      (jira.projectRoles.getProjectRolesById as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getRoleDefinition(10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.projectRoles.getProjectRolesById).toHaveBeenCalledWith({ id: 10 });
    });

    it('fully updates a role definition', async () => {
      const mockRole = { id: 10, name: 'Renamed', description: 'Updated' };
      (jira.projectRoles.fullyUpdateProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.updateRoleDefinition(10, 'Renamed', 'Updated');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.projectRoles.fullyUpdateProjectRole).toHaveBeenCalledWith({ id: 10, name: 'Renamed', description: 'Updated' });
    });

    it('partially updates a role definition', async () => {
      const mockRole = { id: 10, name: 'Renamed' };
      (jira.projectRoles.partialUpdateProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.partialUpdateRoleDefinition(10, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.projectRoles.partialUpdateProjectRole).toHaveBeenCalledWith({ id: 10, name: 'Renamed', description: undefined });
    });

    it('deletes a role definition', async () => {
      (jira.projectRoles.deleteProjectRole as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRoleDefinition(10, 11);

      expect(result.success).toBe(true);
      expect(jira.projectRoles.deleteProjectRole).toHaveBeenCalledWith({ id: 10, swap: 11 });
    });

    it('gets role definition actors', async () => {
      const mockActors = { id: 10, actors: [] };
      (jira.projectRoles.getProjectRoleActorsForRole as Mock).mockResolvedValue(mockActors);

      const result = await jiraService.getRoleDefinitionActors(10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(jira.projectRoles.getProjectRoleActorsForRole).toHaveBeenCalledWith({ id: 10 });
    });

    it('adds role definition actors', async () => {
      const mockActors = { id: 10, actors: [] };
      (jira.projectRoles.addProjectRoleActorsToRole as Mock).mockResolvedValue(mockActors);

      const result = await jiraService.addRoleDefinitionActors(10, ['jsmith'], ['jira-admins']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(jira.projectRoles.addProjectRoleActorsToRole).toHaveBeenCalledWith({ id: 10, user: ['jsmith'],
        group: ['jira-admins'] });
    });

    it('deletes a role definition actor', async () => {
      const mockActors = { id: 10, actors: [] };
      (jira.projectRoles.deleteProjectRoleActorsFromRole as Mock).mockResolvedValue(mockActors);

      const result = await jiraService.deleteRoleDefinitionActor(10, 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(jira.projectRoles.deleteProjectRoleActorsFromRole).toHaveBeenCalledWith({ id: 10, user: 'jsmith' });
    });

    it('handles errors', async () => {
      (jira.projectRoles.getProjectRolesById as Mock).mockRejectedValue(new Error('The role does not exist'));

      const result = await jiraService.getRoleDefinition(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The role does not exist');
    });
  });
  describe('permission schemes', () => {
    it('gets all permission schemes', async () => {
      const mockSchemes = { permissionSchemes: [{ id: 1, name: 'Default' }] };
      (jira.permissionSchemes.getPermissionSchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getPermissionSchemes('permissions');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(jira.permissionSchemes.getPermissionSchemes).toHaveBeenCalledWith({ expand: 'permissions' });
    });

    it('gets a permission scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default' };
      (jira.permissionSchemes.getPermissionScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getPermissionScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.permissionSchemes.getPermissionScheme).toHaveBeenCalledWith({ schemeId: 1 });
    });

    it('creates a permission scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (jira.permissionSchemes.createPermissionScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createPermissionScheme('New Scheme', 'A scheme', [
        { permission: 'BROWSE_PROJECTS', holderType: 'group', holderParameter: 'jira-users' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.permissionSchemes.createPermissionScheme).toHaveBeenCalledWith({ body: {
        name: 'New Scheme',
        description: 'A scheme',
        permissions: [
          { permission: 'BROWSE_PROJECTS', holder: { type: 'group', parameter: 'jira-users' } },
        ],
      } });
    });

    it('updates a permission scheme', async () => {
      const mockScheme = { id: 1, name: 'Renamed' };
      (jira.permissionSchemes.updatePermissionScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updatePermissionScheme(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.permissionSchemes.updatePermissionScheme).toHaveBeenCalledWith({ schemeId: 1, body: {
        name: 'Renamed',
        description: undefined,
        permissions: undefined,
      } });
    });

    it('deletes a permission scheme', async () => {
      (jira.permissionSchemes.deletePermissionScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePermissionScheme(1);

      expect(result.success).toBe(true);
      expect(jira.permissionSchemes.deletePermissionScheme).toHaveBeenCalledWith({ schemeId: 1 });
    });

    it('gets permission scheme grants', async () => {
      const mockGrants = { permissions: [{ id: 10, permission: 'BROWSE_PROJECTS' }] };
      (jira.permissionSchemes.getPermissionSchemeGrants as Mock).mockResolvedValue(mockGrants);

      const result = await jiraService.getPermissionSchemeGrants(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGrants);
      expect(jira.permissionSchemes.getPermissionSchemeGrants).toHaveBeenCalledWith({ schemeId: 1 });
    });

    it('creates a permission grant', async () => {
      const mockGrant = { id: 10, permission: 'BROWSE_PROJECTS' };
      (jira.permissionSchemes.createPermissionGrant as Mock).mockResolvedValue(mockGrant);

      const result = await jiraService.createPermissionGrant(1, 'BROWSE_PROJECTS', 'group', 'jira-users');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGrant);
      expect(jira.permissionSchemes.createPermissionGrant).toHaveBeenCalledWith({ schemeId: 1, permission: 'BROWSE_PROJECTS',
        holder: { type: 'group', parameter: 'jira-users' } });
    });

    it('deletes a permission grant', async () => {
      (jira.permissionSchemes.deletePermissionSchemeEntity as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePermissionGrant(1, 10);

      expect(result.success).toBe(true);
      expect(jira.permissionSchemes.deletePermissionSchemeEntity).toHaveBeenCalledWith({ permissionId: 10, schemeId: 1 });
    });

    it('handles errors', async () => {
      (jira.permissionSchemes.getPermissionScheme as Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getPermissionScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });
  describe('application roles', () => {
    it('gets all application roles', async () => {
      const mockRoles = [{ key: 'jira-software', name: 'JIRA Software' }];
      (jira.applicationRoles.getAll as Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getApplicationRoles();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(jira.applicationRoles.getAll).toHaveBeenCalledWith();
    });

    it('gets a single application role by key', async () => {
      const mockRole = { key: 'jira-software', name: 'JIRA Software' };
      (jira.applicationRoles.getApplicationRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getApplicationRole('jira-software');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(jira.applicationRoles.getApplicationRole).toHaveBeenCalledWith({ key: 'jira-software' });
    });

    it('handles errors', async () => {
      (jira.applicationRoles.getAll as Mock).mockRejectedValue(new Error('The current user is not an administrator'));

      const result = await jiraService.getApplicationRoles();

      expect(result.success).toBe(false);
      expect(result.error).toBe('The current user is not an administrator');
    });
  });
  describe('workflows and workflow schemes', () => {
    it('gets all workflows', async () => {
      const mockWorkflows = [{ name: 'jira' }];
      (jira.workflows.getAllWorkflows as Mock).mockResolvedValue(mockWorkflows);

      const result = await jiraService.getWorkflows();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorkflows);
      expect(jira.workflows.getAllWorkflows).toHaveBeenCalledWith({});
    });

    it('gets a workflow scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default Workflow Scheme' };
      (jira.workflowSchemes.getById as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getWorkflowScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.getById).toHaveBeenCalledWith({ id: 1 });
    });

    it('gets the default workflow for a scheme', async () => {
      const mockDefault = { defaultWorkflow: 'jira' };
      (jira.workflowSchemes.getDefault as Mock).mockResolvedValue(mockDefault);

      const result = await jiraService.getWorkflowSchemeDefault(1, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDefault);
      expect(jira.workflowSchemes.getDefault).toHaveBeenCalledWith({ id: 1, returnDraftIfExists: true });
    });

    it('gets the issue type mapping for a scheme', async () => {
      const mockMapping = { issueType: '10001', workflow: 'jira' };
      (jira.workflowSchemes.getWorkflowSchemeIssueType as Mock).mockResolvedValue(mockMapping);

      const result = await jiraService.getWorkflowSchemeIssueTypeMapping(1, '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMapping);
      expect(jira.workflowSchemes.getWorkflowSchemeIssueType).toHaveBeenCalledWith({ issueType: '10001', id: 1 });
    });

    it('gets the workflow mapping for a scheme', async () => {
      const mockMapping = { issueTypes: ['10001'], workflow: 'jira' };
      (jira.workflowSchemes.getWorkflow as Mock).mockResolvedValue(mockMapping);

      const result = await jiraService.getWorkflowSchemeWorkflowMapping(1, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMapping);
      expect(jira.workflowSchemes.getWorkflow).toHaveBeenCalledWith({ id: 1, workflowName: 'jira' });
    });

    it('handles errors', async () => {
      (jira.workflowSchemes.getById as Mock).mockRejectedValue(new Error('The workflow scheme does not exist'));

      const result = await jiraService.getWorkflowScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The workflow scheme does not exist');
    });

    it('creates a workflow scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (jira.workflowSchemes.createScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createWorkflowScheme('New Scheme', 'A new scheme', 'jira', { '10001': 'jira' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.createScheme).toHaveBeenCalledWith({ name: 'New Scheme',
        description: 'A new scheme',
        defaultWorkflow: 'jira',
        issueTypeMappings: { '10001': 'jira' } });
    });

    it('handles errors creating a workflow scheme', async () => {
      (jira.workflowSchemes.createScheme as Mock).mockRejectedValue(new Error('A scheme with that name already exists'));

      const result = await jiraService.createWorkflowScheme('New Scheme');

      expect(result.success).toBe(false);
      expect(result.error).toBe('A scheme with that name already exists');
    });

    it('updates a workflow scheme', async () => {
      const mockScheme = { id: 2, name: 'Renamed Scheme' };
      (jira.workflowSchemes.updateWorkflowScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updateWorkflowScheme(2, 'Renamed Scheme');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.updateWorkflowScheme).toHaveBeenCalledWith({ id: 2, body: {
        name: 'Renamed Scheme',
        description: undefined,
        defaultWorkflow: undefined,
        issueTypeMappings: undefined,
        updateDraftIfNeeded: undefined,
      } });
    });

    it('handles errors updating a workflow scheme', async () => {
      (jira.workflowSchemes.updateWorkflowScheme as Mock).mockRejectedValue(new Error('The requested scheme does not exist'));

      const result = await jiraService.updateWorkflowScheme(999, 'Renamed Scheme');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested scheme does not exist');
    });

    it('deletes a workflow scheme', async () => {
      (jira.workflowSchemes.deleteScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteWorkflowScheme(2);

      expect(result.success).toBe(true);
      expect(jira.workflowSchemes.deleteScheme).toHaveBeenCalledWith({ id: 2 });
    });

    it('handles errors deleting a workflow scheme', async () => {
      (jira.workflowSchemes.deleteScheme as Mock).mockRejectedValue(new Error('The requested scheme is active'));

      const result = await jiraService.deleteWorkflowScheme(2);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested scheme is active');
    });

    it('sets a workflow scheme issue type mapping', async () => {
      const mockScheme = { id: 2, issueTypeMappings: { '10001': 'jira' } };
      (jira.workflowSchemes.setIssueType as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.setWorkflowSchemeIssueTypeMapping(2, '10001', 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.setIssueType).toHaveBeenCalledWith({ issueType: '10001', id: 2, body: { issueType: '10001', workflow: 'jira', updateDraftIfNeeded: undefined } });
    });

    it('handles errors setting a workflow scheme issue type mapping', async () => {
      (jira.workflowSchemes.setIssueType as Mock).mockRejectedValue(new Error('The requested issue type does not exist'));

      const result = await jiraService.setWorkflowSchemeIssueTypeMapping(2, '99999', 'jira');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested issue type does not exist');
    });

    it('deletes a workflow scheme issue type mapping', async () => {
      const mockScheme = { id: 2 };
      (jira.workflowSchemes.deleteWorkflowSchemeIssueType as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.deleteWorkflowSchemeIssueTypeMapping(2, '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.deleteWorkflowSchemeIssueType).toHaveBeenCalledWith({ issueType: '10001', id: 2 });
    });

    it('handles errors deleting a workflow scheme issue type mapping', async () => {
      (jira.workflowSchemes.deleteWorkflowSchemeIssueType as Mock).mockRejectedValue(new Error('The requested mapping does not exist'));

      const result = await jiraService.deleteWorkflowSchemeIssueTypeMapping(2, '99999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested mapping does not exist');
    });

    it('sets a workflow scheme workflow mapping', async () => {
      const mockScheme = { id: 2 };
      (jira.workflowSchemes.updateWorkflowMapping as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.setWorkflowSchemeWorkflowMapping(2, 'jira', ['10001'], true, undefined, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.updateWorkflowMapping).toHaveBeenCalledWith(
        { id: 2, workflow: 'jira', issueTypes: ['10001'], defaultMapping: true, updateDraftIfNeeded: undefined, workflowName: 'jira' },
      );
    });

    it('handles errors setting a workflow scheme workflow mapping', async () => {
      (jira.workflowSchemes.updateWorkflowMapping as Mock).mockRejectedValue(new Error('The currently authenticated user does not have permission'));

      const result = await jiraService.setWorkflowSchemeWorkflowMapping(2, 'jira');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The currently authenticated user does not have permission');
    });

    it('deletes a workflow scheme workflow mapping', async () => {
      const mockScheme = { id: 2 };
      (jira.workflowSchemes.deleteWorkflowMapping as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.deleteWorkflowSchemeWorkflowMapping(2, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.workflowSchemes.deleteWorkflowMapping).toHaveBeenCalledWith({ id: 2, workflowName: 'jira' });
    });

    it('handles errors deleting a workflow scheme workflow mapping', async () => {
      (jira.workflowSchemes.deleteWorkflowMapping as Mock).mockRejectedValue(new Error('The requested scheme or workflow does not exist'));

      const result = await jiraService.deleteWorkflowSchemeWorkflowMapping(2, 'missing-workflow');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested scheme or workflow does not exist');
    });
  });
  describe('notification schemes', () => {
    it('gets a paginated list of notification schemes', async () => {
      const mockSchemes = { values: [{ id: 1, name: 'Default Notification Scheme' }] };
      (jira.issueNotificationSchemes.getNotificationSchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getNotificationSchemes('all', 50, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(jira.issueNotificationSchemes.getNotificationSchemes).toHaveBeenCalledWith({ expand: 'all', maxResults: 50, startAt: 0 });
    });

    it('gets a notification scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default Notification Scheme' };
      (jira.issueNotificationSchemes.getNotificationScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getNotificationScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.issueNotificationSchemes.getNotificationScheme).toHaveBeenCalledWith({ id: 1 });
    });

    it('handles errors', async () => {
      (jira.issueNotificationSchemes.getNotificationScheme as Mock).mockRejectedValue(new Error('The notification scheme does not exist'));

      const result = await jiraService.getNotificationScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The notification scheme does not exist');
    });
  });
  describe('security levels and schemes', () => {
    it('gets a security level by id', async () => {
      const mockLevel = { id: '10000', name: 'Confidential' };
      (jira.issueSecurityLevel.getIssuesecuritylevel as Mock).mockResolvedValue(mockLevel);

      const result = await jiraService.getSecurityLevel('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLevel);
      expect(jira.issueSecurityLevel.getIssuesecuritylevel).toHaveBeenCalledWith({ id: '10000' });
    });

    it('gets all issue security schemes', async () => {
      const mockSchemes = { issueSecuritySchemes: [{ id: '1', name: 'Default Scheme' }] };
      (jira.issueSecuritySchemes.getIssueSecuritySchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getIssueSecuritySchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(jira.issueSecuritySchemes.getIssueSecuritySchemes).toHaveBeenCalledWith();
    });

    it('gets an issue security scheme by id', async () => {
      const mockScheme = { id: '1', name: 'Default Scheme' };
      (jira.issueSecuritySchemes.getIssueSecurityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getIssueSecurityScheme('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(jira.issueSecuritySchemes.getIssueSecurityScheme).toHaveBeenCalledWith({ id: '1' });
    });

    it('handles errors', async () => {
      (jira.issueSecurityLevel.getIssuesecuritylevel as Mock).mockRejectedValue(new Error('The security level does not exist'));

      const result = await jiraService.getSecurityLevel('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The security level does not exist');
    });
  });

  // Webhooks live under /rest/jira-webhook/1.0/webhooks, and their ids are numbers. The path this server used before
  // — /rest/webhooks/1.0/webhook — was retired with Jira 9 and answers 404 on every 10.x instance.
  describe('webhooks', () => {
    it('lists webhooks', async () => {
      const mockWebhooks = [{ id: 1, name: 'CI hook', url: 'https://ci.example/hook' }];
      (jira.webhooks.getWebhooks as Mock).mockResolvedValue(mockWebhooks);

      const result = await jiraService.getWebhooks();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWebhooks);
      expect(jira.webhooks.getWebhooks).toHaveBeenCalledWith({});
    });

    it('gets a webhook by id', async () => {
      const mockWebhook = { id: 1, name: 'CI hook', url: 'https://ci.example/hook' };
      (jira.webhooks.getWebhook as Mock).mockResolvedValue(mockWebhook);

      const result = await jiraService.getWebhook('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWebhook);
      expect(jira.webhooks.getWebhook).toHaveBeenCalledWith({ webhookId: 1 });
    });

    it('creates a webhook and wraps the JQL filter', async () => {
      const mockWebhook = { id: 1, name: 'CI hook', url: 'https://ci.example/hook' };
      (jira.webhooks.createWebhook as Mock).mockResolvedValue(mockWebhook);

      const result = await jiraService.createWebhook('CI hook', 'https://ci.example/hook', ['jira:issue_created'], 'project = SS', true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWebhook);
      expect(jira.webhooks.createWebhook).toHaveBeenCalledWith({
        name: 'CI hook',
        url: 'https://ci.example/hook',
        events: ['jira:issue_created'],
        filters: { 'issue-related-events-section': 'project = SS' },
        excludeBody: true,
      });
    });

    // A PUT replaces the registration outright, so an update that names one field has to carry the rest over.
    it('updates a webhook by laying the change over the current registration', async () => {
      const current = { id: 1, name: 'CI hook', url: 'https://ci.example/hook', events: ['jira:issue_created'] };
      (jira.webhooks.getWebhook as Mock).mockResolvedValue(current);
      (jira.webhooks.updateWebhook as Mock).mockResolvedValue({ ...current, name: 'CI hook renamed' });

      const result = await jiraService.updateWebhook('1', 'CI hook renamed');

      expect(result.success).toBe(true);
      expect(jira.webhooks.getWebhook).toHaveBeenCalledWith({ webhookId: 1 });
      expect(jira.webhooks.updateWebhook).toHaveBeenCalledWith({
        webhookId: 1,
        name: 'CI hook renamed',
        url: 'https://ci.example/hook',
        events: ['jira:issue_created'],
        filters: undefined,
        excludeBody: undefined,
      });
    });

    it('deletes a webhook', async () => {
      (jira.webhooks.deleteWebhook as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteWebhook('1');

      expect(result.success).toBe(true);
      expect(jira.webhooks.deleteWebhook).toHaveBeenCalledWith({ webhookId: 1 });
    });
  });
});
