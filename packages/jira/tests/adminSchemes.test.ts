import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';
import {
  ApplicationroleService,
  IssuesecurityschemesService,
  IssuetypeschemeService,
  NotificationschemeService,
  PermissionschemeService,
  PriorityschemesService,
  RoleService,
  SecuritylevelService,
  WorkflowService,
  WorkflowschemeService,
} from '../src/jiraClient/index.js';

vi.mock('../src/jiraClient/index.js', () => ({
  IssuetypeschemeService: {
    getAllIssueTypeSchemes: vi.fn(),
    createIssueTypeScheme: vi.fn(),
    getIssueTypeScheme: vi.fn(),
    updateIssueTypeScheme: vi.fn(),
    deleteIssueTypeScheme: vi.fn(),
    getAssociatedProjects: vi.fn(),
    setProjectAssociationsForScheme: vi.fn(),
    addProjectAssociationsToScheme: vi.fn(),
    removeAllProjectAssociations: vi.fn(),
    removeProjectAssociation: vi.fn(),
  },
  PriorityschemesService: {
    getPrioritySchemes: vi.fn(),
    createPriorityScheme: vi.fn(),
    getPriorityScheme: vi.fn(),
    updatePriorityScheme: vi.fn(),
    deletePriorityScheme: vi.fn(),
  },
  RoleService: {
    getProjectRoles1: vi.fn(),
    createProjectRole: vi.fn(),
    getProjectRolesById: vi.fn(),
    fullyUpdateProjectRole: vi.fn(),
    partialUpdateProjectRole: vi.fn(),
    deleteProjectRole: vi.fn(),
    getProjectRoleActorsForRole: vi.fn(),
    addProjectRoleActorsToRole: vi.fn(),
    deleteProjectRoleActorsFromRole: vi.fn(),
  },
  PermissionschemeService: {
    getPermissionSchemes: vi.fn(),
    getPermissionScheme: vi.fn(),
    createPermissionScheme: vi.fn(),
    updatePermissionScheme: vi.fn(),
    deletePermissionScheme: vi.fn(),
    getPermissionSchemeGrants: vi.fn(),
    createPermissionGrant: vi.fn(),
    deletePermissionSchemeEntity: vi.fn(),
  },
  ApplicationroleService: {
    getAll: vi.fn(),
    get4: vi.fn(),
  },
  WorkflowService: {
    getAllWorkflows: vi.fn(),
  },
  WorkflowschemeService: {
    getById: vi.fn(),
    getDefault: vi.fn(),
    getIssueType: vi.fn(),
    getWorkflow: vi.fn(),
    createScheme: vi.fn(),
    update: vi.fn(),
    deleteScheme: vi.fn(),
    setIssueType: vi.fn(),
    deleteIssueType: vi.fn(),
    updateWorkflowMapping: vi.fn(),
    deleteWorkflowMapping: vi.fn(),
  },
  NotificationschemeService: {
    getNotificationSchemes: vi.fn(),
    getNotificationScheme: vi.fn(),
  },
  SecuritylevelService: {
    getIssuesecuritylevel: vi.fn(),
  },
  IssuesecurityschemesService: {
    getIssueSecuritySchemes: vi.fn(),
    getIssueSecurityScheme: vi.fn(),
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

  describe('issue type schemes', () => {
    it('gets all issue type schemes', async () => {
      const mockSchemes = { schemes: [{ id: '1', name: 'Default' }] };
      (IssuetypeschemeService.getAllIssueTypeSchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getIssueTypeSchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(IssuetypeschemeService.getAllIssueTypeSchemes).toHaveBeenCalledWith();
    });

    it('creates an issue type scheme', async () => {
      const mockScheme = { id: '2', name: 'New Scheme' };
      (IssuetypeschemeService.createIssueTypeScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createIssueTypeScheme('New Scheme', 'A scheme', ['10000', '10001'], '10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(IssuetypeschemeService.createIssueTypeScheme).toHaveBeenCalledWith({
        name: 'New Scheme',
        description: 'A scheme',
        issueTypeIds: ['10000', '10001'],
        defaultIssueTypeId: '10000',
      });
    });

    it('gets an issue type scheme by id', async () => {
      const mockScheme = { id: '1', name: 'Default' };
      (IssuetypeschemeService.getIssueTypeScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getIssueTypeScheme('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(IssuetypeschemeService.getIssueTypeScheme).toHaveBeenCalledWith('1');
    });

    it('updates an issue type scheme', async () => {
      const mockScheme = { id: '1', name: 'Renamed' };
      (IssuetypeschemeService.updateIssueTypeScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updateIssueTypeScheme('1', 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(IssuetypeschemeService.updateIssueTypeScheme).toHaveBeenCalledWith('1', {
        name: 'Renamed',
        description: undefined,
        issueTypeIds: undefined,
        defaultIssueTypeId: undefined,
      });
    });

    it('deletes an issue type scheme', async () => {
      (IssuetypeschemeService.deleteIssueTypeScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueTypeScheme('1');

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.deleteIssueTypeScheme).toHaveBeenCalledWith('1');
    });

    it('gets projects associated with an issue type scheme', async () => {
      const mockProjects = { values: [{ id: '10000', key: 'TEST' }] };
      (IssuetypeschemeService.getAssociatedProjects as Mock).mockResolvedValue(mockProjects);

      const result = await jiraService.getIssueTypeSchemeProjects('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProjects);
      expect(IssuetypeschemeService.getAssociatedProjects).toHaveBeenCalledWith('1', undefined);
    });

    it('sets project associations for an issue type scheme', async () => {
      (IssuetypeschemeService.setProjectAssociationsForScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setIssueTypeSchemeProjects('1', ['TEST']);

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.setProjectAssociationsForScheme).toHaveBeenCalledWith('1', { idsOrKeys: ['TEST'] });
    });

    it('adds project associations to an issue type scheme', async () => {
      (IssuetypeschemeService.addProjectAssociationsToScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueTypeSchemeProjects('1', ['TEST']);

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.addProjectAssociationsToScheme).toHaveBeenCalledWith('1', { idsOrKeys: ['TEST'] });
    });

    it('removes all project associations from an issue type scheme', async () => {
      (IssuetypeschemeService.removeAllProjectAssociations as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueTypeSchemeProjects('1');

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.removeAllProjectAssociations).toHaveBeenCalledWith('1');
    });

    it('removes a single project association from an issue type scheme', async () => {
      (IssuetypeschemeService.removeProjectAssociation as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueTypeSchemeProject('1', 'TEST');

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.removeProjectAssociation).toHaveBeenCalledWith('TEST', '1');
    });

    it('handles errors', async () => {
      (IssuetypeschemeService.getIssueTypeScheme as Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getIssueTypeScheme('999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });
  describe('priority schemes', () => {
    it('gets all priority schemes', async () => {
      const mockSchemes = { schemes: [{ id: 1, name: 'Default' }] };
      (PriorityschemesService.getPrioritySchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getPrioritySchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(PriorityschemesService.getPrioritySchemes).toHaveBeenCalledWith(undefined, undefined);
    });

    it('creates a priority scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (PriorityschemesService.createPriorityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createPriorityScheme('New Scheme', 'A scheme', '1', ['1', '2']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PriorityschemesService.createPriorityScheme).toHaveBeenCalledWith({
        name: 'New Scheme',
        description: 'A scheme',
        defaultOptionId: '1',
        optionIds: ['1', '2'],
      });
    });

    it('gets a priority scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default' };
      (PriorityschemesService.getPriorityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getPriorityScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PriorityschemesService.getPriorityScheme).toHaveBeenCalledWith(1);
    });

    it('updates a priority scheme', async () => {
      const mockScheme = { id: 1, name: 'Renamed' };
      (PriorityschemesService.updatePriorityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updatePriorityScheme(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PriorityschemesService.updatePriorityScheme).toHaveBeenCalledWith(1, {
        name: 'Renamed',
        description: undefined,
        defaultOptionId: undefined,
        optionIds: undefined,
      });
    });

    it('deletes a priority scheme', async () => {
      (PriorityschemesService.deletePriorityScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePriorityScheme(1);

      expect(result.success).toBe(true);
      expect(PriorityschemesService.deletePriorityScheme).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (PriorityschemesService.getPriorityScheme as Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getPriorityScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });
  describe('role definitions', () => {
    it('gets all role definitions', async () => {
      const mockRoles = [{ id: 10, name: 'Administrators' }];
      (RoleService.getProjectRoles1 as Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getRoleDefinitions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(RoleService.getProjectRoles1).toHaveBeenCalledWith();
    });

    it('creates a role definition', async () => {
      const mockRole = { id: 11, name: 'New Role' };
      (RoleService.createProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.createRoleDefinition('New Role', 'A role');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.createProjectRole).toHaveBeenCalledWith({ name: 'New Role', description: 'A role' });
    });

    it('gets a role definition by id', async () => {
      const mockRole = { id: 10, name: 'Administrators' };
      (RoleService.getProjectRolesById as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getRoleDefinition(10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.getProjectRolesById).toHaveBeenCalledWith(10);
    });

    it('fully updates a role definition', async () => {
      const mockRole = { id: 10, name: 'Renamed', description: 'Updated' };
      (RoleService.fullyUpdateProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.updateRoleDefinition(10, 'Renamed', 'Updated');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.fullyUpdateProjectRole).toHaveBeenCalledWith(10, { name: 'Renamed', description: 'Updated' });
    });

    it('partially updates a role definition', async () => {
      const mockRole = { id: 10, name: 'Renamed' };
      (RoleService.partialUpdateProjectRole as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.partialUpdateRoleDefinition(10, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.partialUpdateProjectRole).toHaveBeenCalledWith(10, { name: 'Renamed', description: undefined });
    });

    it('deletes a role definition', async () => {
      (RoleService.deleteProjectRole as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRoleDefinition(10, 11);

      expect(result.success).toBe(true);
      expect(RoleService.deleteProjectRole).toHaveBeenCalledWith(10, 11);
    });

    it('gets role definition actors', async () => {
      const mockActors = { id: 10, actors: [] };
      (RoleService.getProjectRoleActorsForRole as Mock).mockResolvedValue(mockActors);

      const result = await jiraService.getRoleDefinitionActors(10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(RoleService.getProjectRoleActorsForRole).toHaveBeenCalledWith(10);
    });

    it('adds role definition actors', async () => {
      const mockActors = { id: 10, actors: [] };
      (RoleService.addProjectRoleActorsToRole as Mock).mockResolvedValue(mockActors);

      const result = await jiraService.addRoleDefinitionActors(10, ['jsmith'], ['jira-admins']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(RoleService.addProjectRoleActorsToRole).toHaveBeenCalledWith(10, {
        user: ['jsmith'],
        group: ['jira-admins'],
      });
    });

    it('deletes a role definition actor', async () => {
      const mockActors = { id: 10, actors: [] };
      (RoleService.deleteProjectRoleActorsFromRole as Mock).mockResolvedValue(mockActors);

      const result = await jiraService.deleteRoleDefinitionActor(10, 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(RoleService.deleteProjectRoleActorsFromRole).toHaveBeenCalledWith(10, 'jsmith', undefined);
    });

    it('handles errors', async () => {
      (RoleService.getProjectRolesById as Mock).mockRejectedValue(new Error('The role does not exist'));

      const result = await jiraService.getRoleDefinition(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The role does not exist');
    });
  });
  describe('permission schemes', () => {
    it('gets all permission schemes', async () => {
      const mockSchemes = { permissionSchemes: [{ id: 1, name: 'Default' }] };
      (PermissionschemeService.getPermissionSchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getPermissionSchemes('permissions');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(PermissionschemeService.getPermissionSchemes).toHaveBeenCalledWith('permissions');
    });

    it('gets a permission scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default' };
      (PermissionschemeService.getPermissionScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getPermissionScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PermissionschemeService.getPermissionScheme).toHaveBeenCalledWith(1, undefined);
    });

    it('creates a permission scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (PermissionschemeService.createPermissionScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createPermissionScheme('New Scheme', 'A scheme', [
        { permission: 'BROWSE_PROJECTS', holderType: 'group', holderParameter: 'jira-users' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PermissionschemeService.createPermissionScheme).toHaveBeenCalledWith(undefined, {
        name: 'New Scheme',
        description: 'A scheme',
        permissions: [
          { permission: 'BROWSE_PROJECTS', holder: { type: 'group', parameter: 'jira-users' } },
        ],
      });
    });

    it('updates a permission scheme', async () => {
      const mockScheme = { id: 1, name: 'Renamed' };
      (PermissionschemeService.updatePermissionScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updatePermissionScheme(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PermissionschemeService.updatePermissionScheme).toHaveBeenCalledWith(1, undefined, {
        name: 'Renamed',
        description: undefined,
        permissions: undefined,
      });
    });

    it('deletes a permission scheme', async () => {
      (PermissionschemeService.deletePermissionScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePermissionScheme(1);

      expect(result.success).toBe(true);
      expect(PermissionschemeService.deletePermissionScheme).toHaveBeenCalledWith(1);
    });

    it('gets permission scheme grants', async () => {
      const mockGrants = { permissions: [{ id: 10, permission: 'BROWSE_PROJECTS' }] };
      (PermissionschemeService.getPermissionSchemeGrants as Mock).mockResolvedValue(mockGrants);

      const result = await jiraService.getPermissionSchemeGrants(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGrants);
      expect(PermissionschemeService.getPermissionSchemeGrants).toHaveBeenCalledWith(1, undefined);
    });

    it('creates a permission grant', async () => {
      const mockGrant = { id: 10, permission: 'BROWSE_PROJECTS' };
      (PermissionschemeService.createPermissionGrant as Mock).mockResolvedValue(mockGrant);

      const result = await jiraService.createPermissionGrant(1, 'BROWSE_PROJECTS', 'group', 'jira-users');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGrant);
      expect(PermissionschemeService.createPermissionGrant).toHaveBeenCalledWith(1, undefined, {
        permission: 'BROWSE_PROJECTS',
        holder: { type: 'group', parameter: 'jira-users' },
      });
    });

    it('deletes a permission grant', async () => {
      (PermissionschemeService.deletePermissionSchemeEntity as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePermissionGrant(1, 10);

      expect(result.success).toBe(true);
      expect(PermissionschemeService.deletePermissionSchemeEntity).toHaveBeenCalledWith(10, 1);
    });

    it('handles errors', async () => {
      (PermissionschemeService.getPermissionScheme as Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getPermissionScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });
  describe('application roles', () => {
    it('gets all application roles', async () => {
      const mockRoles = [{ key: 'jira-software', name: 'JIRA Software' }];
      (ApplicationroleService.getAll as Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getApplicationRoles();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(ApplicationroleService.getAll).toHaveBeenCalledWith();
    });

    it('gets a single application role by key', async () => {
      const mockRole = { key: 'jira-software', name: 'JIRA Software' };
      (ApplicationroleService.get4 as Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getApplicationRole('jira-software');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(ApplicationroleService.get4).toHaveBeenCalledWith('jira-software');
    });

    it('handles errors', async () => {
      (ApplicationroleService.getAll as Mock).mockRejectedValue(new Error('The current user is not an administrator'));

      const result = await jiraService.getApplicationRoles();

      expect(result.success).toBe(false);
      expect(result.error).toBe('The current user is not an administrator');
    });
  });
  describe('workflows and workflow schemes', () => {
    it('gets all workflows', async () => {
      const mockWorkflows = [{ name: 'jira' }];
      (WorkflowService.getAllWorkflows as Mock).mockResolvedValue(mockWorkflows);

      const result = await jiraService.getWorkflows();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorkflows);
      expect(WorkflowService.getAllWorkflows).toHaveBeenCalledWith(undefined);
    });

    it('gets a workflow scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default Workflow Scheme' };
      (WorkflowschemeService.getById as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getWorkflowScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.getById).toHaveBeenCalledWith(1, undefined);
    });

    it('gets the default workflow for a scheme', async () => {
      const mockDefault = { defaultWorkflow: 'jira' };
      (WorkflowschemeService.getDefault as Mock).mockResolvedValue(mockDefault);

      const result = await jiraService.getWorkflowSchemeDefault(1, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDefault);
      expect(WorkflowschemeService.getDefault).toHaveBeenCalledWith(1, true);
    });

    it('gets the issue type mapping for a scheme', async () => {
      const mockMapping = { issueType: '10001', workflow: 'jira' };
      (WorkflowschemeService.getIssueType as Mock).mockResolvedValue(mockMapping);

      const result = await jiraService.getWorkflowSchemeIssueTypeMapping(1, '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMapping);
      expect(WorkflowschemeService.getIssueType).toHaveBeenCalledWith('10001', 1, undefined);
    });

    it('gets the workflow mapping for a scheme', async () => {
      const mockMapping = { issueTypes: ['10001'], workflow: 'jira' };
      (WorkflowschemeService.getWorkflow as Mock).mockResolvedValue(mockMapping);

      const result = await jiraService.getWorkflowSchemeWorkflowMapping(1, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMapping);
      expect(WorkflowschemeService.getWorkflow).toHaveBeenCalledWith(1, 'jira', undefined);
    });

    it('handles errors', async () => {
      (WorkflowschemeService.getById as Mock).mockRejectedValue(new Error('The workflow scheme does not exist'));

      const result = await jiraService.getWorkflowScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The workflow scheme does not exist');
    });

    it('creates a workflow scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (WorkflowschemeService.createScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.createWorkflowScheme('New Scheme', 'A new scheme', 'jira', { '10001': 'jira' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.createScheme).toHaveBeenCalledWith({
        name: 'New Scheme',
        description: 'A new scheme',
        defaultWorkflow: 'jira',
        issueTypeMappings: { '10001': 'jira' },
      });
    });

    it('handles errors creating a workflow scheme', async () => {
      (WorkflowschemeService.createScheme as Mock).mockRejectedValue(new Error('A scheme with that name already exists'));

      const result = await jiraService.createWorkflowScheme('New Scheme');

      expect(result.success).toBe(false);
      expect(result.error).toBe('A scheme with that name already exists');
    });

    it('updates a workflow scheme', async () => {
      const mockScheme = { id: 2, name: 'Renamed Scheme' };
      (WorkflowschemeService.update as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.updateWorkflowScheme(2, 'Renamed Scheme');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.update).toHaveBeenCalledWith(2, {
        name: 'Renamed Scheme',
        description: undefined,
        defaultWorkflow: undefined,
        issueTypeMappings: undefined,
        updateDraftIfNeeded: undefined,
      });
    });

    it('handles errors updating a workflow scheme', async () => {
      (WorkflowschemeService.update as Mock).mockRejectedValue(new Error('The requested scheme does not exist'));

      const result = await jiraService.updateWorkflowScheme(999, 'Renamed Scheme');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested scheme does not exist');
    });

    it('deletes a workflow scheme', async () => {
      (WorkflowschemeService.deleteScheme as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteWorkflowScheme(2);

      expect(result.success).toBe(true);
      expect(WorkflowschemeService.deleteScheme).toHaveBeenCalledWith(2);
    });

    it('handles errors deleting a workflow scheme', async () => {
      (WorkflowschemeService.deleteScheme as Mock).mockRejectedValue(new Error('The requested scheme is active'));

      const result = await jiraService.deleteWorkflowScheme(2);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested scheme is active');
    });

    it('sets a workflow scheme issue type mapping', async () => {
      const mockScheme = { id: 2, issueTypeMappings: { '10001': 'jira' } };
      (WorkflowschemeService.setIssueType as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.setWorkflowSchemeIssueTypeMapping(2, '10001', 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.setIssueType).toHaveBeenCalledWith('10001', 2, { issueType: '10001', workflow: 'jira', updateDraftIfNeeded: undefined });
    });

    it('handles errors setting a workflow scheme issue type mapping', async () => {
      (WorkflowschemeService.setIssueType as Mock).mockRejectedValue(new Error('The requested issue type does not exist'));

      const result = await jiraService.setWorkflowSchemeIssueTypeMapping(2, '99999', 'jira');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested issue type does not exist');
    });

    it('deletes a workflow scheme issue type mapping', async () => {
      const mockScheme = { id: 2 };
      (WorkflowschemeService.deleteIssueType as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.deleteWorkflowSchemeIssueTypeMapping(2, '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.deleteIssueType).toHaveBeenCalledWith('10001', 2, undefined);
    });

    it('handles errors deleting a workflow scheme issue type mapping', async () => {
      (WorkflowschemeService.deleteIssueType as Mock).mockRejectedValue(new Error('The requested mapping does not exist'));

      const result = await jiraService.deleteWorkflowSchemeIssueTypeMapping(2, '99999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested mapping does not exist');
    });

    it('sets a workflow scheme workflow mapping', async () => {
      const mockScheme = { id: 2 };
      (WorkflowschemeService.updateWorkflowMapping as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.setWorkflowSchemeWorkflowMapping(2, 'jira', ['10001'], true, undefined, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.updateWorkflowMapping).toHaveBeenCalledWith(
        2,
        { workflow: 'jira', issueTypes: ['10001'], defaultMapping: true, updateDraftIfNeeded: undefined },
        'jira',
      );
    });

    it('handles errors setting a workflow scheme workflow mapping', async () => {
      (WorkflowschemeService.updateWorkflowMapping as Mock).mockRejectedValue(new Error('The currently authenticated user does not have permission'));

      const result = await jiraService.setWorkflowSchemeWorkflowMapping(2, 'jira');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The currently authenticated user does not have permission');
    });

    it('deletes a workflow scheme workflow mapping', async () => {
      const mockScheme = { id: 2 };
      (WorkflowschemeService.deleteWorkflowMapping as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.deleteWorkflowSchemeWorkflowMapping(2, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.deleteWorkflowMapping).toHaveBeenCalledWith(2, undefined, 'jira');
    });

    it('handles errors deleting a workflow scheme workflow mapping', async () => {
      (WorkflowschemeService.deleteWorkflowMapping as Mock).mockRejectedValue(new Error('The requested scheme or workflow does not exist'));

      const result = await jiraService.deleteWorkflowSchemeWorkflowMapping(2, 'missing-workflow');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested scheme or workflow does not exist');
    });
  });
  describe('notification schemes', () => {
    it('gets a paginated list of notification schemes', async () => {
      const mockSchemes = { values: [{ id: 1, name: 'Default Notification Scheme' }] };
      (NotificationschemeService.getNotificationSchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getNotificationSchemes('all', 50, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(NotificationschemeService.getNotificationSchemes).toHaveBeenCalledWith('all', 50, 0);
    });

    it('gets a notification scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default Notification Scheme' };
      (NotificationschemeService.getNotificationScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getNotificationScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(NotificationschemeService.getNotificationScheme).toHaveBeenCalledWith(1, undefined);
    });

    it('handles errors', async () => {
      (NotificationschemeService.getNotificationScheme as Mock).mockRejectedValue(new Error('The notification scheme does not exist'));

      const result = await jiraService.getNotificationScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The notification scheme does not exist');
    });
  });
  describe('security levels and schemes', () => {
    it('gets a security level by id', async () => {
      const mockLevel = { id: '10000', name: 'Confidential' };
      (SecuritylevelService.getIssuesecuritylevel as Mock).mockResolvedValue(mockLevel);

      const result = await jiraService.getSecurityLevel('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLevel);
      expect(SecuritylevelService.getIssuesecuritylevel).toHaveBeenCalledWith('10000');
    });

    it('gets all issue security schemes', async () => {
      const mockSchemes = { issueSecuritySchemes: [{ id: '1', name: 'Default Scheme' }] };
      (IssuesecurityschemesService.getIssueSecuritySchemes as Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getIssueSecuritySchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(IssuesecurityschemesService.getIssueSecuritySchemes).toHaveBeenCalledWith();
    });

    it('gets an issue security scheme by id', async () => {
      const mockScheme = { id: '1', name: 'Default Scheme' };
      (IssuesecurityschemesService.getIssueSecurityScheme as Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getIssueSecurityScheme('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(IssuesecurityschemesService.getIssueSecurityScheme).toHaveBeenCalledWith('1');
    });

    it('handles errors', async () => {
      (SecuritylevelService.getIssuesecuritylevel as Mock).mockRejectedValue(new Error('The security level does not exist'));

      const result = await jiraService.getSecurityLevel('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The security level does not exist');
    });
  });
});
