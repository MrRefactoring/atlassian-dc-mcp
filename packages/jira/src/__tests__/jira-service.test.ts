import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from 'datacenter-mcp-core';
import { JiraService } from '../jira-service.js';
import {
  ApplicationroleService,
  AttachmentService,
  AvatarService,
  BacklogService,
  BoardService,
  ComponentService,
  CustomFieldOptionService,
  CustomFieldsService,
  DashboardService,
  EpicService,
  FieldService,
  FilterService,
  GroupService,
  GroupsService,
  GroupuserpickerService,
  IssueLinkService,
  IssueLinkTypeService,
  IssueService,
  IssuesecurityschemesService,
  IssuetypeschemeService,
  IssuetypeService,
  JqlService,
  MypermissionsService,
  MypreferencesService,
  NotificationschemeService,
  OpenAPI,
  PermissionsService,
  PermissionschemeService,
  PriorityschemesService,
  PriorityService,
  ProjectCategoryService,
  ProjectService,
  ProjectsService,
  ProjectvalidateService,
  ResolutionService,
  RoleService,
  ScreensService,
  SearchService,
  SecuritylevelService,
  SprintService,
  StatusService,
  UniversalAvatarService,
  UserService,
  VersionService,
  WorkflowService,
  WorkflowschemeService,
} from '../jira-client/index.js';
import { request as __request } from '../jira-client/core/request.js';

jest.mock('../jira-client/core/request.js', () => ({
  request: jest.fn(),
}));

jest.mock('../jira-client/index.js', () => ({
  IssueService: {
    getTransitions: jest.fn(),
    doTransition: jest.fn(),
    getIssue: jest.fn(),
    editIssue: jest.fn(),
    createIssue: jest.fn(),
    getComments: jest.fn(),
    addComment: jest.fn(),
    getCreateIssueMetaProjectIssueTypes: jest.fn(),
    getCreateIssueMetaFields: jest.fn(),
    getEditIssueMeta: jest.fn(),
    deleteIssue: jest.fn(),
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
    getIssueWatchers: jest.fn(),
    addWatcher1: jest.fn(),
    removeWatcher1: jest.fn(),
    getVotes: jest.fn(),
    addVote: jest.fn(),
    removeVote: jest.fn(),
    getIssueWorklog: jest.fn(),
    addWorklog: jest.fn(),
    getWorklog: jest.fn(),
    updateWorklog: jest.fn(),
    deleteWorklog: jest.fn(),
    addAttachment: jest.fn(),
    assign: jest.fn(),
    createIssues: jest.fn(),
    archiveIssues: jest.fn(),
    archiveIssue: jest.fn(),
    rankIssues: jest.fn(),
  },
  AttachmentService: {
    getAttachmentMeta: jest.fn(),
    getAttachment: jest.fn(),
    removeAttachment: jest.fn(),
  },
  IssueLinkService: {
    linkIssues: jest.fn(),
    getIssueLink: jest.fn(),
    deleteIssueLink: jest.fn(),
  },
  IssueLinkTypeService: {
    getIssueLinkTypes: jest.fn(),
    createIssueLinkType: jest.fn(),
    updateIssueLinkType: jest.fn(),
    deleteIssueLinkType: jest.fn(),
  },
  BoardService: {
    getAllBoards: jest.fn(),
    getBoard: jest.fn(),
    getConfiguration: jest.fn(),
    getIssuesForBoard: jest.fn(),
    getAllSprints: jest.fn(),
    getAllVersions: jest.fn(),
    getIssuesForBacklog: jest.fn(),
    getEpics: jest.fn(),
    getIssuesWithoutEpic: jest.fn(),
    getIssuesForEpic: jest.fn(),
  },
  BacklogService: {
    moveIssuesToBacklog: jest.fn(),
  },
  SprintService: {
    createSprint: jest.fn(),
    getSprint: jest.fn(),
    updateSprint: jest.fn(),
    deleteSprint: jest.fn(),
    getIssuesForSprint1: jest.fn(),
    moveIssuesToSprint: jest.fn(),
  },
  EpicService: {
    getEpic: jest.fn(),
    partiallyUpdateEpic: jest.fn(),
    getIssuesForEpic1: jest.fn(),
    moveIssuesToEpic: jest.fn(),
    rankEpics: jest.fn(),
  },
  ComponentService: {
    createComponent: jest.fn(),
    getPaginatedComponents: jest.fn(),
    getComponent: jest.fn(),
    updateComponent: jest.fn(),
    delete: jest.fn(),
    getComponentRelatedIssues: jest.fn(),
  },
  FilterService: {
    createFilter: jest.fn(),
    getFilter: jest.fn(),
    editFilter: jest.fn(),
    deleteFilter: jest.fn(),
    getFavouriteFilters: jest.fn(),
  },
  DashboardService: {
    list: jest.fn(),
    getDashboard: jest.fn(),
  },
  UserService: {
    getUser1: jest.fn(),
    findUsers: jest.fn(),
    findAssignableUsers1: jest.fn(),
    createUser: jest.fn(),
    removeUser: jest.fn(),
    changeUserPassword: jest.fn(),
    validateUserAnonymization: jest.fn(),
    scheduleUserAnonymization: jest.fn(),
    getProgress1: jest.fn(),
  },
  GroupService: {
    createGroup: jest.fn(),
    removeGroup: jest.fn(),
    getUsersFromGroup: jest.fn(),
    addUserToGroup: jest.fn(),
    removeUserFromGroup: jest.fn(),
  },
  GroupsService: {
    findGroups: jest.fn(),
  },
  GroupuserpickerService: {
    findUsersAndGroups: jest.fn(),
  },
  VersionService: {
    createVersion: jest.fn(),
    getPaginatedVersions: jest.fn(),
    getVersion: jest.fn(),
    updateVersion: jest.fn(),
    delete1: jest.fn(),
    merge: jest.fn(),
    moveVersion: jest.fn(),
    getVersionRelatedIssues: jest.fn(),
    getVersionUnresolvedIssues: jest.fn(),
  },
  SearchService: {
    searchUsingSearchRequest: jest.fn(),
  },
  ProjectService: {
    getAllProjects: jest.fn(),
    getProject: jest.fn(),
    getProjectComponents: jest.fn(),
    getProjectVersions: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    archiveProject: jest.fn(),
    restoreProject: jest.fn(),
    getProjectRoles: jest.fn(),
    getProjectRole: jest.fn(),
    setActors: jest.fn(),
    addActorUsers: jest.fn(),
    deleteActor: jest.fn(),
  },
  ProjectsService: {
    searchForProjects: jest.fn(),
  },
  ProjectCategoryService: {
    getAllProjectCategories: jest.fn(),
    createProjectCategory: jest.fn(),
    getProjectCategoryById: jest.fn(),
    updateProjectCategory: jest.fn(),
    removeProjectCategory: jest.fn(),
  },
  ProjectvalidateService: {
    getProject1: jest.fn(),
  },
  IssuetypeService: {
    getIssueAllTypes: jest.fn(),
  },
  PriorityService: {
    getPriorities: jest.fn(),
  },
  ResolutionService: {
    getResolutions: jest.fn(),
  },
  StatusService: {
    getStatuses: jest.fn(),
  },
  RoleService: {
    getProjectRoles1: jest.fn(),
    createProjectRole: jest.fn(),
    getProjectRolesById: jest.fn(),
    fullyUpdateProjectRole: jest.fn(),
    partialUpdateProjectRole: jest.fn(),
    deleteProjectRole: jest.fn(),
    getProjectRoleActorsForRole: jest.fn(),
    addProjectRoleActorsToRole: jest.fn(),
    deleteProjectRoleActorsFromRole: jest.fn(),
  },
  IssuetypeschemeService: {
    getAllIssueTypeSchemes: jest.fn(),
    createIssueTypeScheme: jest.fn(),
    getIssueTypeScheme: jest.fn(),
    updateIssueTypeScheme: jest.fn(),
    deleteIssueTypeScheme: jest.fn(),
    getAssociatedProjects: jest.fn(),
    setProjectAssociationsForScheme: jest.fn(),
    addProjectAssociationsToScheme: jest.fn(),
    removeAllProjectAssociations: jest.fn(),
    removeProjectAssociation: jest.fn(),
  },
  PriorityschemesService: {
    getPrioritySchemes: jest.fn(),
    createPriorityScheme: jest.fn(),
    getPriorityScheme: jest.fn(),
    updatePriorityScheme: jest.fn(),
    deletePriorityScheme: jest.fn(),
  },
  PermissionschemeService: {
    getPermissionSchemes: jest.fn(),
    getPermissionScheme: jest.fn(),
    createPermissionScheme: jest.fn(),
    updatePermissionScheme: jest.fn(),
    deletePermissionScheme: jest.fn(),
    getPermissionSchemeGrants: jest.fn(),
    createPermissionGrant: jest.fn(),
    deletePermissionSchemeEntity: jest.fn(),
  },
  ApplicationroleService: {
    getAll: jest.fn(),
    get4: jest.fn(),
  },
  MypreferencesService: {
    getPreference: jest.fn(),
    setPreference: jest.fn(),
    removePreference: jest.fn(),
  },
  WorkflowService: {
    getAllWorkflows: jest.fn(),
  },
  WorkflowschemeService: {
    getById: jest.fn(),
    getDefault: jest.fn(),
    getIssueType: jest.fn(),
    getWorkflow: jest.fn(),
  },
  NotificationschemeService: {
    getNotificationSchemes: jest.fn(),
    getNotificationScheme: jest.fn(),
  },
  SecuritylevelService: {
    getIssuesecuritylevel: jest.fn(),
  },
  IssuesecurityschemesService: {
    getIssueSecuritySchemes: jest.fn(),
    getIssueSecurityScheme: jest.fn(),
  },
  CustomFieldsService: {
    getCustomFields: jest.fn(),
    bulkDeleteCustomFields: jest.fn(),
    getCustomFieldOptions: jest.fn(),
  },
  CustomFieldOptionService: {
    getCustomFieldOption: jest.fn(),
  },
  FieldService: {
    createCustomField: jest.fn(),
  },
  AvatarService: {
    getAllSystemAvatars: jest.fn(),
  },
  MypermissionsService: {
    getPermissions: jest.fn(),
  },
  PermissionsService: {
    getAllPermissions: jest.fn(),
  },
  JqlService: {
    getAutoComplete: jest.fn(),
    getFieldAutoCompleteForQueryString: jest.fn(),
  },
  UniversalAvatarService: {
    getAvatars: jest.fn(),
    storeTemporaryAvatarUsingMultiPart2: jest.fn(),
    createAvatarFromTemporary3: jest.fn(),
    deleteAvatar1: jest.fn(),
  },
  ScreensService: {
    getAllScreens: jest.fn(),
    addFieldToDefaultScreen: jest.fn(),
    getFieldsToAdd: jest.fn(),
    getAllTabs: jest.fn(),
    addTab: jest.fn(),
    renameTab: jest.fn(),
    deleteTab: jest.fn(),
    getAllFields: jest.fn(),
    addField: jest.fn(),
    removeField: jest.fn(),
    moveField: jest.fn(),
    updateShowWhenEmptyIndicator: jest.fn(),
    moveTab: jest.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('JiraService', () => {
  let jiraService: JiraService;
  const mockIssueKey = 'PROJ-123';

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    jest.clearAllMocks();
  });

  describe('getTransitions', () => {
    it('should successfully get available transitions for an issue', async () => {
      const mockTransitionsData = {
        transitions: [
          {
            id: '21',
            name: 'Start Progress',
            to: {
              id: '3',
              name: 'In Progress',
              statusCategory: { name: 'In Progress' },
            },
          },
          {
            id: '31',
            name: 'Done',
            to: {
              id: '4',
              name: 'Done',
              statusCategory: { name: 'Done' },
            },
          },
        ],
      };
      (IssueService.getTransitions as jest.Mock).mockResolvedValue(mockTransitionsData);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTransitionsData);
      expect(IssueService.getTransitions).toHaveBeenCalledWith(mockIssueKey);
    });

    it('should return empty transitions array when no transitions available', async () => {
      const mockTransitionsData = {
        transitions: [],
      };
      (IssueService.getTransitions as jest.Mock).mockResolvedValue(mockTransitionsData);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTransitionsData);
      expect(result.data?.transitions).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Issue not found');
      (IssueService.getTransitions as jest.Mock).mockRejectedValue(mockError);

      const result = await jiraService.getTransitions(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue not found');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('Insufficient permissions to view transitions');
      (IssueService.getTransitions as jest.Mock).mockRejectedValue(mockError);

      const result = await jiraService.getTransitions('RESTRICTED-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insufficient permissions to view transitions');
    });
  });

  describe('token optimization paths', () => {
    it('uses the default field profile and page size for search', async () => {
      const mockSearchResults = { issues: [] };
      (SearchService.searchUsingSearchRequest as jest.Mock).mockResolvedValue(mockSearchResults);

      const result = await jiraService.searchIssues('project = TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSearchResults);
      expect(SearchService.searchUsingSearchRequest).toHaveBeenCalledWith({
        jql: 'project = TEST',
        maxResults: 25,
        fields: ['summary', 'description', 'status', 'assignee', 'reporter', 'priority', 'issuetype', 'labels', 'updated'],
        expand: undefined,
        startAt: undefined,
      });
    });

    it('honors explicit search fields and maxResults', async () => {
      const mockSearchResults = { issues: [] };
      (SearchService.searchUsingSearchRequest as jest.Mock).mockResolvedValue(mockSearchResults);

      await jiraService.searchIssues('project = TEST', 20, ['changelog'], 5, ['summary', 'status']);

      expect(SearchService.searchUsingSearchRequest).toHaveBeenCalledWith({
        jql: 'project = TEST',
        maxResults: 5,
        fields: ['summary', 'status'],
        expand: ['changelog'],
        startAt: 20,
      });
    });

    it('uses the richer default field profile for single issue reads', async () => {
      const mockIssue = { key: mockIssueKey };
      (IssueService.getIssue as jest.Mock).mockResolvedValue(mockIssue);

      const result = await jiraService.getIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssue);
      expect(IssueService.getIssue).toHaveBeenCalledWith(mockIssueKey, undefined, [
        'summary',
        'description',
        'status',
        'assignee',
        'reporter',
        'priority',
        'issuetype',
        'labels',
        'updated',
        'parent',
        'subtasks',
      ]);
    });

    it('honors explicit issue fields', async () => {
      (IssueService.getIssue as jest.Mock).mockResolvedValue({ key: mockIssueKey });

      await jiraService.getIssue(mockIssueKey, 'renderedFields', ['summary', 'status']);

      expect(IssueService.getIssue).toHaveBeenCalledWith(mockIssueKey, 'renderedFields', ['summary', 'status']);
    });

    it('uses the package default page size for issue comments', async () => {
      const mockComments = { comments: [] };
      (IssueService.getComments as jest.Mock).mockResolvedValue(mockComments);

      const result = await jiraService.getIssueComments(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComments);
      expect(IssueService.getComments).toHaveBeenCalledWith(mockIssueKey, undefined, '25', undefined, undefined);
    });

    it('forwards explicit issue comment pagination', async () => {
      (IssueService.getComments as jest.Mock).mockResolvedValue({ comments: [] });

      await jiraService.getIssueComments(mockIssueKey, 'renderedBody', 10, 20);

      expect(IssueService.getComments).toHaveBeenCalledWith(mockIssueKey, 'renderedBody', '10', undefined, '20');
    });
  });

  describe('getIssueDevelopmentInfo', () => {
    it('resolves the numeric issue id then requests pull requests by default', async () => {
      const mockDevInfo = { detail: [{ pullRequests: [] }] };
      (IssueService.getIssue as jest.Mock).mockResolvedValue({ id: '1314681', key: mockIssueKey });
      (__request as jest.Mock).mockResolvedValue(mockDevInfo);

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDevInfo);
      expect(IssueService.getIssue).toHaveBeenCalledWith(mockIssueKey, undefined, ['id']);
      expect(__request).toHaveBeenCalledWith(OpenAPI, {
        method: 'GET',
        url: '/dev-status/1.0/issue/detail',
        query: { issueId: '1314681', applicationType: 'stash', dataType: 'pullrequest' },
      });
    });

    it('honors explicit dataType and applicationType', async () => {
      (IssueService.getIssue as jest.Mock).mockResolvedValue({ id: '42' });
      (__request as jest.Mock).mockResolvedValue({});

      await jiraService.getIssueDevelopmentInfo(mockIssueKey, 'repository', 'github');

      expect(__request).toHaveBeenCalledWith(OpenAPI, {
        method: 'GET',
        url: '/dev-status/1.0/issue/detail',
        query: { issueId: '42', applicationType: 'github', dataType: 'repository' },
      });
    });

    it('fails without calling dev-status when the numeric id is missing', async () => {
      (IssueService.getIssue as jest.Mock).mockResolvedValue({ key: mockIssueKey });

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe(`Could not resolve numeric id for issue ${mockIssueKey}`);
      expect(__request).not.toHaveBeenCalled();
    });

    it('surfaces dev-status request errors', async () => {
      (IssueService.getIssue as jest.Mock).mockResolvedValue({ id: '1314681' });
      (__request as jest.Mock).mockRejectedValue(new Error('View Development Tools permission required'));

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('View Development Tools permission required');
    });
  });

  describe('transitionIssue', () => {
    it('should successfully transition an issue to a new status', async () => {
      (IssueService.doTransition as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '21',
      });

      expect(result.success).toBe(true);
      expect(IssueService.doTransition).toHaveBeenCalledWith(mockIssueKey, {
        transition: { id: '21' },
      });
    });

    it('should successfully transition with additional fields', async () => {
      (IssueService.doTransition as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '31',
        fields: {
          resolution: { name: 'Done' },
          comment: { body: 'Closing this issue' },
        },
      });

      expect(result.success).toBe(true);
      expect(IssueService.doTransition).toHaveBeenCalledWith(mockIssueKey, {
        transition: { id: '31' },
        fields: {
          resolution: { name: 'Done' },
          comment: { body: 'Closing this issue' },
        },
      });
    });

    it('should handle invalid transition ID errors', async () => {
      const mockError = new Error('Invalid transition ID');
      (IssueService.doTransition as jest.Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '999',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid transition ID');
    });

    it('should handle missing required fields errors', async () => {
      const mockError = new Error('Resolution field is required');
      (IssueService.doTransition as jest.Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: mockIssueKey,
        transitionId: '31',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Resolution field is required');
    });

    it('should handle permission errors', async () => {
      const mockError = new Error('User does not have permission to transition this issue');
      (IssueService.doTransition as jest.Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: 'RESTRICTED-1',
        transitionId: '21',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to transition this issue');
    });

    it('should handle issue not found errors', async () => {
      const mockError = new Error('Issue does not exist');
      (IssueService.doTransition as jest.Mock).mockRejectedValue(mockError);

      const result = await jiraService.transitionIssue({
        issueKey: 'NONEXISTENT-999',
        transitionId: '21',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue does not exist');
    });
  });

  describe('getProjects', () => {
    it('gets all visible projects', async () => {
      const mockProjects = [{ key: 'TEST' }];
      (ProjectService.getAllProjects as jest.Mock).mockResolvedValue(mockProjects);

      const result = await jiraService.getProjects();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProjects);
      expect(ProjectService.getAllProjects).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('forwards includeArchived, expand, and recent', async () => {
      (ProjectService.getAllProjects as jest.Mock).mockResolvedValue([]);

      await jiraService.getProjects(true, 'lead', 5);

      expect(ProjectService.getAllProjects).toHaveBeenCalledWith(true, 'lead', 5);
    });

    it('handles API errors', async () => {
      (ProjectService.getAllProjects as jest.Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getProjects();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('searchProjects', () => {
    it('searches projects by query', async () => {
      const mockResult = { total: 1 };
      (ProjectsService.searchForProjects as jest.Mock).mockResolvedValue(mockResult);

      const result = await jiraService.searchProjects('TES');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(ProjectsService.searchForProjects).toHaveBeenCalledWith(undefined, 'TES', undefined);
    });
  });

  describe('getProject', () => {
    it('gets a single project by id or key', async () => {
      const mockProject = { key: 'TEST' };
      (ProjectService.getProject as jest.Mock).mockResolvedValue(mockProject);

      const result = await jiraService.getProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(ProjectService.getProject).toHaveBeenCalledWith('TEST', undefined);
    });

    it('handles project not found errors', async () => {
      (ProjectService.getProject as jest.Mock).mockRejectedValue(new Error('Project not found'));

      const result = await jiraService.getProject('MISSING');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project not found');
    });
  });

  describe('getProjectComponents', () => {
    it('gets project components', async () => {
      const mockComponents = [{ name: 'Backend' }];
      (ProjectService.getProjectComponents as jest.Mock).mockResolvedValue(mockComponents);

      const result = await jiraService.getProjectComponents('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponents);
      expect(ProjectService.getProjectComponents).toHaveBeenCalledWith('TEST');
    });
  });

  describe('getProjectVersions', () => {
    it('gets project versions', async () => {
      const mockVersions = [{ name: '1.0' }];
      (ProjectService.getProjectVersions as jest.Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getProjectVersions('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
      expect(ProjectService.getProjectVersions).toHaveBeenCalledWith('TEST', undefined);
    });
  });

  describe('createProject', () => {
    it('creates a project', async () => {
      const mockIdentity = { id: 10001, key: 'TEST', self: 'https://jira.example.com/rest/api/2/project/10001' };
      (ProjectService.createProject as jest.Mock).mockResolvedValue(mockIdentity);

      const result = await jiraService.createProject({ key: 'TEST', name: 'Test Project' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIdentity);
      expect(ProjectService.createProject).toHaveBeenCalledWith({ key: 'TEST', name: 'Test Project' });
    });

    it('handles API errors', async () => {
      (ProjectService.createProject as jest.Mock).mockRejectedValue(new Error('Project key already exists'));

      const result = await jiraService.createProject({ key: 'TEST', name: 'Test Project' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project key already exists');
    });
  });

  describe('updateProject', () => {
    it('updates a project', async () => {
      const mockProject = { key: 'TEST', name: 'Renamed Project' };
      (ProjectService.updateProject as jest.Mock).mockResolvedValue(mockProject);

      const result = await jiraService.updateProject('TEST', { name: 'Renamed Project' });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(ProjectService.updateProject).toHaveBeenCalledWith('TEST', { name: 'Renamed Project' }, undefined);
    });

    it('forwards expand', async () => {
      (ProjectService.updateProject as jest.Mock).mockResolvedValue({});

      await jiraService.updateProject('TEST', { description: 'New description' }, 'lead');

      expect(ProjectService.updateProject).toHaveBeenCalledWith('TEST', { description: 'New description' }, 'lead');
    });

    it('handles API errors', async () => {
      (ProjectService.updateProject as jest.Mock).mockRejectedValue(new Error('Project not found'));

      const result = await jiraService.updateProject('MISSING', { name: 'X' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project not found');
    });
  });

  describe('deleteProject', () => {
    it('deletes a project and returns an acknowledgement', async () => {
      (ProjectService.deleteProject as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, projectIdOrKey: 'TEST' });
      expect(ProjectService.deleteProject).toHaveBeenCalledWith('TEST');
    });

    it('handles API errors', async () => {
      (ProjectService.deleteProject as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await jiraService.deleteProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });

  describe('archiveProject', () => {
    it('archives a project and returns an acknowledgement', async () => {
      (ProjectService.archiveProject as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.archiveProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ archived: true, projectIdOrKey: 'TEST' });
      expect(ProjectService.archiveProject).toHaveBeenCalledWith('TEST');
    });

    it('handles API errors', async () => {
      (ProjectService.archiveProject as jest.Mock).mockRejectedValue(new Error('Already archived'));

      const result = await jiraService.archiveProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already archived');
    });
  });

  describe('restoreProject', () => {
    it('restores an archived project', async () => {
      const mockProject = { key: 'TEST' };
      (ProjectService.restoreProject as jest.Mock).mockResolvedValue(mockProject);

      const result = await jiraService.restoreProject('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProject);
      expect(ProjectService.restoreProject).toHaveBeenCalledWith('TEST');
    });

    it('handles API errors', async () => {
      (ProjectService.restoreProject as jest.Mock).mockRejectedValue(new Error('Already active'));

      const result = await jiraService.restoreProject('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Already active');
    });
  });

  describe('reference data lookups', () => {
    it('gets issue types', async () => {
      const mockTypes = [{ name: 'Bug' }];
      (IssuetypeService.getIssueAllTypes as jest.Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getIssueTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
    });

    it('gets priorities', async () => {
      const mockPriorities = [{ name: 'High' }];
      (PriorityService.getPriorities as jest.Mock).mockResolvedValue(mockPriorities);

      const result = await jiraService.getPriorities();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPriorities);
    });

    it('gets resolutions', async () => {
      const mockResolutions = [{ name: 'Fixed' }];
      (ResolutionService.getResolutions as jest.Mock).mockResolvedValue(mockResolutions);

      const result = await jiraService.getResolutions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResolutions);
    });

    it('gets statuses', async () => {
      const mockStatuses = [{ name: 'Open' }];
      (StatusService.getStatuses as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await jiraService.getStatuses();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatuses);
    });
  });

  describe('getCreateIssueMetaIssueTypes', () => {
    it('gets issue types available for creating an issue', async () => {
      const mockTypes = { values: [{ id: '10001', name: 'Bug' }] };
      (IssueService.getCreateIssueMetaProjectIssueTypes as jest.Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getCreateIssueMetaIssueTypes('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
      expect(IssueService.getCreateIssueMetaProjectIssueTypes).toHaveBeenCalledWith('TEST', undefined, undefined);
    });

    it('forwards pagination as strings', async () => {
      (IssueService.getCreateIssueMetaProjectIssueTypes as jest.Mock).mockResolvedValue({});

      await jiraService.getCreateIssueMetaIssueTypes('TEST', 10, 5);

      expect(IssueService.getCreateIssueMetaProjectIssueTypes).toHaveBeenCalledWith('TEST', '10', '5');
    });
  });

  describe('getCreateIssueMetaFields', () => {
    it('gets fields available for creating an issue of a given type', async () => {
      const mockFields = { values: [{ fieldId: 'summary', required: true }] };
      (IssueService.getCreateIssueMetaFields as jest.Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getCreateIssueMetaFields('TEST', '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(IssueService.getCreateIssueMetaFields).toHaveBeenCalledWith('10001', 'TEST', undefined, undefined);
    });
  });

  describe('getEditIssueMeta', () => {
    it('gets fields available for editing an issue', async () => {
      const mockMeta = { fields: { summary: { required: true } } };
      (IssueService.getEditIssueMeta as jest.Mock).mockResolvedValue(mockMeta);

      const result = await jiraService.getEditIssueMeta(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMeta);
      expect(IssueService.getEditIssueMeta).toHaveBeenCalledWith(mockIssueKey);
    });

    it('handles permission errors', async () => {
      (IssueService.getEditIssueMeta as jest.Mock).mockRejectedValue(new Error('Issue does not exist'));

      const result = await jiraService.getEditIssueMeta('MISSING-1');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue does not exist');
    });
  });

  describe('deleteIssue', () => {
    it('deletes an issue', async () => {
      (IssueService.deleteIssue as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.deleteIssue).toHaveBeenCalledWith(mockIssueKey, undefined);
    });

    it('forwards deleteSubtasks as a string', async () => {
      (IssueService.deleteIssue as jest.Mock).mockResolvedValue(undefined);

      await jiraService.deleteIssue(mockIssueKey, true);

      expect(IssueService.deleteIssue).toHaveBeenCalledWith(mockIssueKey, 'true');
    });

    it('handles permission errors', async () => {
      (IssueService.deleteIssue as jest.Mock).mockRejectedValue(new Error('User does not have permission to delete this issue'));

      const result = await jiraService.deleteIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to delete this issue');
    });
  });

  describe('updateIssueComment', () => {
    it('updates a comment', async () => {
      const mockComment = { id: '10000', body: 'Updated text' };
      (IssueService.updateComment as jest.Mock).mockResolvedValue(mockComment);

      const result = await jiraService.updateIssueComment(mockIssueKey, '10000', 'Updated text');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComment);
      expect(IssueService.updateComment).toHaveBeenCalledWith(mockIssueKey, '10000', undefined, { body: 'Updated text' });
    });

    it('handles comment not found errors', async () => {
      (IssueService.updateComment as jest.Mock).mockRejectedValue(new Error('Comment does not exist'));

      const result = await jiraService.updateIssueComment(mockIssueKey, 'missing', 'text');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Comment does not exist');
    });
  });

  describe('deleteIssueComment', () => {
    it('deletes a comment', async () => {
      (IssueService.deleteComment as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueComment(mockIssueKey, '10000');

      expect(result.success).toBe(true);
      expect(IssueService.deleteComment).toHaveBeenCalledWith(mockIssueKey, '10000');
    });

    it('handles permission errors', async () => {
      (IssueService.deleteComment as jest.Mock).mockRejectedValue(new Error('User does not have permission to delete this comment'));

      const result = await jiraService.deleteIssueComment(mockIssueKey, '10000');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to delete this comment');
    });
  });

  describe('watchers', () => {
    it('gets issue watchers', async () => {
      const mockWatchers = { watchCount: 1, watchers: [{ name: 'john.doe' }] };
      (IssueService.getIssueWatchers as jest.Mock).mockResolvedValue(mockWatchers);

      const result = await jiraService.getIssueWatchers(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWatchers);
      expect(IssueService.getIssueWatchers).toHaveBeenCalledWith(mockIssueKey);
    });

    it('adds a watcher', async () => {
      (IssueService.addWatcher1 as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueWatcher(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(IssueService.addWatcher1).toHaveBeenCalledWith(mockIssueKey, undefined, 'john.doe');
    });

    it('removes a watcher', async () => {
      (IssueService.removeWatcher1 as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueWatcher(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(IssueService.removeWatcher1).toHaveBeenCalledWith(mockIssueKey, 'john.doe');
    });
  });

  describe('votes', () => {
    it('gets issue votes', async () => {
      const mockVotes = { votes: 3, hasVoted: false };
      (IssueService.getVotes as jest.Mock).mockResolvedValue(mockVotes);

      const result = await jiraService.getIssueVotes(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVotes);
    });

    it('adds a vote', async () => {
      (IssueService.addVote as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueVote(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.addVote).toHaveBeenCalledWith(mockIssueKey);
    });

    it('removes a vote', async () => {
      (IssueService.removeVote as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueVote(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.removeVote).toHaveBeenCalledWith(mockIssueKey);
    });

    it('handles errors when voting is disabled', async () => {
      (IssueService.addVote as jest.Mock).mockRejectedValue(new Error('Voting is disabled'));

      const result = await jiraService.addIssueVote(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Voting is disabled');
    });
  });

  describe('worklogs', () => {
    it('gets all worklogs for an issue', async () => {
      const mockWorklogs = { worklogs: [{ id: '100', timeSpent: '3h' }] };
      (IssueService.getIssueWorklog as jest.Mock).mockResolvedValue(mockWorklogs);

      const result = await jiraService.getIssueWorklogs(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklogs);
      expect(IssueService.getIssueWorklog).toHaveBeenCalledWith(mockIssueKey);
    });

    it('adds a worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '3h' };
      (IssueService.addWorklog as jest.Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.addIssueWorklog(mockIssueKey, '3h', 'Fixed the bug');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(IssueService.addWorklog).toHaveBeenCalledWith(mockIssueKey, undefined, undefined, undefined, {
        timeSpent: '3h',
        comment: 'Fixed the bug',
        started: undefined,
      });
    });

    it('gets a single worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '3h' };
      (IssueService.getWorklog as jest.Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.getIssueWorklog(mockIssueKey, '100');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(IssueService.getWorklog).toHaveBeenCalledWith(mockIssueKey, '100');
    });

    it('updates a worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '4h' };
      (IssueService.updateWorklog as jest.Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.updateIssueWorklog(mockIssueKey, '100', '4h');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(IssueService.updateWorklog).toHaveBeenCalledWith(mockIssueKey, '100', undefined, undefined, {
        timeSpent: '4h',
        comment: undefined,
        started: undefined,
      });
    });

    it('deletes a worklog entry', async () => {
      (IssueService.deleteWorklog as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueWorklog(mockIssueKey, '100');

      expect(result.success).toBe(true);
      expect(IssueService.deleteWorklog).toHaveBeenCalledWith(mockIssueKey, '100');
    });

    it('handles errors', async () => {
      (IssueService.addWorklog as jest.Mock).mockRejectedValue(new Error('Time tracking is disabled'));

      const result = await jiraService.addIssueWorklog(mockIssueKey, '3h');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Time tracking is disabled');
    });
  });

  describe('attachments', () => {
    it('adds an attachment with the file wrapped as a File', async () => {
      const mockAttachment = [{ id: '10001', filename: 'test.txt' }];
      (IssueService.addAttachment as jest.Mock).mockResolvedValue(mockAttachment);

      const result = await jiraService.addIssueAttachment(mockIssueKey, 'test.txt', Buffer.from('hello').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAttachment);
      const [calledIssueKey, calledFormData] = (IssueService.addAttachment as jest.Mock).mock.calls[0];
      expect(calledIssueKey).toBe(mockIssueKey);
      expect((calledFormData as { file: File }).file).toBeInstanceOf(File);
      expect((calledFormData as { file: File }).file.name).toBe('test.txt');
    });

    it('gets attachment capabilities', async () => {
      const mockMeta = { enabled: true, uploadLimit: 10485760 };
      (AttachmentService.getAttachmentMeta as jest.Mock).mockResolvedValue(mockMeta);

      const result = await jiraService.getAttachmentMeta();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMeta);
    });

    it('gets attachment metadata by id', async () => {
      const mockAttachment = { id: '10001', filename: 'test.txt' };
      (AttachmentService.getAttachment as jest.Mock).mockResolvedValue(mockAttachment);

      const result = await jiraService.getAttachment('10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAttachment);
      expect(AttachmentService.getAttachment).toHaveBeenCalledWith('10001');
    });

    it('deletes an attachment', async () => {
      (AttachmentService.removeAttachment as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAttachment('10001');

      expect(result.success).toBe(true);
      expect(AttachmentService.removeAttachment).toHaveBeenCalledWith('10001');
    });

    it('handles errors when attachments are disabled', async () => {
      (IssueService.addAttachment as jest.Mock).mockRejectedValue(new Error('Attachments are disabled'));

      const result = await jiraService.addIssueAttachment(mockIssueKey, 'test.txt', 'aGVsbG8=');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Attachments are disabled');
    });
  });

  describe('issue links', () => {
    it('links two issues', async () => {
      (IssueLinkService.linkIssues as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'Blocks');

      expect(result.success).toBe(true);
      expect(IssueLinkService.linkIssues).toHaveBeenCalledWith({
        inwardIssue: { key: 'PROJ-1' },
        outwardIssue: { key: 'PROJ-2' },
        type: { name: 'Blocks' },
      });
    });

    it('includes an optional comment', async () => {
      (IssueLinkService.linkIssues as jest.Mock).mockResolvedValue(undefined);

      await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'Blocks', 'Linked during triage');

      expect(IssueLinkService.linkIssues).toHaveBeenCalledWith({
        inwardIssue: { key: 'PROJ-1' },
        outwardIssue: { key: 'PROJ-2' },
        type: { name: 'Blocks' },
        comment: { body: 'Linked during triage' },
      });
    });

    it('gets an issue link', async () => {
      const mockLink = { id: '1000', type: { name: 'Blocks' } };
      (IssueLinkService.getIssueLink as jest.Mock).mockResolvedValue(mockLink);

      const result = await jiraService.getIssueLink('1000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(IssueLinkService.getIssueLink).toHaveBeenCalledWith('1000');
    });

    it('deletes an issue link', async () => {
      (IssueLinkService.deleteIssueLink as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueLink('1000');

      expect(result.success).toBe(true);
      expect(IssueLinkService.deleteIssueLink).toHaveBeenCalledWith('1000');
    });

    it('handles errors when the link type is unknown', async () => {
      (IssueLinkService.linkIssues as jest.Mock).mockRejectedValue(new Error('Could not find issue link type'));

      const result = await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'NoSuchType');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Could not find issue link type');
    });
  });

  describe('assignIssue', () => {
    it('assigns an issue to a user', async () => {
      (IssueService.assign as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.assignIssue(mockIssueKey, 'john.doe');

      expect(result.success).toBe(true);
      expect(IssueService.assign).toHaveBeenCalledWith(mockIssueKey, { name: 'john.doe' });
    });

    it('unassigns an issue when username is null', async () => {
      (IssueService.assign as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.assignIssue(mockIssueKey, null);

      expect(result.success).toBe(true);
      expect(IssueService.assign).toHaveBeenCalledWith(mockIssueKey, { name: null });
    });

    it('handles permission errors', async () => {
      (IssueService.assign as jest.Mock).mockRejectedValue(new Error('User does not have permission to assign the issue'));

      const result = await jiraService.assignIssue(mockIssueKey, 'john.doe');

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to assign the issue');
    });
  });

  describe('components', () => {
    it('creates a component', async () => {
      const mockComponent = { id: '10000', name: 'Backend' };
      (ComponentService.createComponent as jest.Mock).mockResolvedValue(mockComponent);

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
      (ComponentService.getPaginatedComponents as jest.Mock).mockResolvedValue(mockPage);

      const result = await jiraService.getComponents();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPage);
      expect(ComponentService.getPaginatedComponents).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('gets a single component', async () => {
      const mockComponent = { id: '10000', name: 'Backend' };
      (ComponentService.getComponent as jest.Mock).mockResolvedValue(mockComponent);

      const result = await jiraService.getComponent('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComponent);
      expect(ComponentService.getComponent).toHaveBeenCalledWith('10000');
    });

    it('updates a component', async () => {
      const mockComponent = { id: '10000', name: 'Backend v2' };
      (ComponentService.updateComponent as jest.Mock).mockResolvedValue(mockComponent);

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
      (ComponentService.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteComponent('10000');

      expect(result.success).toBe(true);
      expect(ComponentService.delete).toHaveBeenCalledWith('10000', undefined);
    });

    it('gets component related issue counts', async () => {
      const mockCounts = { issueCount: 5 };
      (ComponentService.getComponentRelatedIssues as jest.Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getComponentRelatedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });
  });

  describe('versions', () => {
    it('creates a version', async () => {
      const mockVersion = { id: '10000', name: '1.0' };
      (VersionService.createVersion as jest.Mock).mockResolvedValue(mockVersion);

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
      (VersionService.getPaginatedVersions as jest.Mock).mockResolvedValue(mockPage);

      const result = await jiraService.getVersions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPage);
      expect(VersionService.getPaginatedVersions).toHaveBeenCalledWith(100, '', undefined, undefined);
    });

    it('gets a single version', async () => {
      const mockVersion = { id: '10000', name: '1.0' };
      (VersionService.getVersion as jest.Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.getVersion('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(VersionService.getVersion).toHaveBeenCalledWith('10000', undefined);
    });

    it('updates a version', async () => {
      (VersionService.updateVersion as jest.Mock).mockResolvedValue({ id: '10000', released: true });

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
      (VersionService.delete1 as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAndReplaceVersion('10000', 10001, 10002);

      expect(result.success).toBe(true);
      expect(VersionService.delete1).toHaveBeenCalledWith('10000', {
        moveFixIssuesTo: 10001,
        moveAffectedIssuesTo: 10002,
      });
    });

    it('merges a version into another', async () => {
      (VersionService.merge as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.mergeVersion('10000', '10001');

      expect(result.success).toBe(true);
      expect(VersionService.merge).toHaveBeenCalledWith('10001', '10000');
    });

    it('moves a version', async () => {
      const mockVersion = { id: '10000' };
      (VersionService.moveVersion as jest.Mock).mockResolvedValue(mockVersion);

      const result = await jiraService.moveVersion('10000', 'First');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersion);
      expect(VersionService.moveVersion).toHaveBeenCalledWith('10000', { position: 'First', after: undefined });
    });

    it('gets version related issue counts', async () => {
      const mockCounts = { issuesFixedCount: 3 };
      (VersionService.getVersionRelatedIssues as jest.Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getVersionRelatedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });

    it('gets version unresolved issue counts', async () => {
      const mockCounts = { issuesUnresolvedCount: 1 };
      (VersionService.getVersionUnresolvedIssues as jest.Mock).mockResolvedValue(mockCounts);

      const result = await jiraService.getVersionUnresolvedIssues('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCounts);
    });

    it('handles errors', async () => {
      (VersionService.getVersion as jest.Mock).mockRejectedValue(new Error('Version does not exist'));

      const result = await jiraService.getVersion('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Version does not exist');
    });
  });

  describe('project roles', () => {
    it('gets project roles', async () => {
      const mockRoles = { Developers: 'https://jira/rest/api/2/project/TEST/role/10000' };
      (ProjectService.getProjectRoles as jest.Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getProjectRoles('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(ProjectService.getProjectRoles).toHaveBeenCalledWith('TEST');
    });

    it('gets a single project role', async () => {
      const mockRole = { id: 10000, name: 'Developers', actors: [] };
      (ProjectService.getProjectRole as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getProjectRole('TEST', 10000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(ProjectService.getProjectRole).toHaveBeenCalledWith('TEST', 10000);
    });

    it('replaces all actors for a role', async () => {
      const mockRole = { id: 10000, name: 'Developers' };
      (ProjectService.setActors as jest.Mock).mockResolvedValue(mockRole);

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
      (ProjectService.addActorUsers as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.addProjectRoleActors('TEST', 10000, ['john.doe'], ['admins']);

      expect(result.success).toBe(true);
      expect(ProjectService.addActorUsers).toHaveBeenCalledWith('TEST', 10000, {
        user: ['john.doe'],
        group: ['admins'],
      });
    });

    it('deletes an actor from a role', async () => {
      (ProjectService.deleteActor as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectRoleActor('TEST', 10000, 'john.doe');

      expect(result.success).toBe(true);
      expect(ProjectService.deleteActor).toHaveBeenCalledWith('TEST', 10000, 'john.doe', undefined);
    });

    it('handles errors', async () => {
      (ProjectService.getProjectRole as jest.Mock).mockRejectedValue(new Error('Project or role not found'));

      const result = await jiraService.getProjectRole('TEST', 99999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Project or role not found');
    });
  });

  describe('users and groups', () => {
    it('gets a user by username', async () => {
      const mockUser = { name: 'john.doe', displayName: 'John Doe' };
      (UserService.getUser1 as jest.Mock).mockResolvedValue(mockUser);

      const result = await jiraService.getUser('john.doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(UserService.getUser1).toHaveBeenCalledWith(undefined, undefined, 'john.doe');
    });

    it('finds users by query', async () => {
      const mockUsers = [{ name: 'john.doe' }];
      (UserService.findUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await jiraService.findUsers('john');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUsers);
      expect(UserService.findUsers).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, 'john');
    });

    it('finds assignable users for a project', async () => {
      const mockUsers = [{ name: 'john.doe' }];
      (UserService.findAssignableUsers1 as jest.Mock).mockResolvedValue(mockUsers);

      const result = await jiraService.findAssignableUsers('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUsers);
      expect(UserService.findAssignableUsers1).toHaveBeenCalledWith(undefined, 50, 'TEST', undefined, undefined);
    });

    it('creates a group', async () => {
      const mockGroup = { name: 'developers' };
      (GroupService.createGroup as jest.Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.createGroup('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGroup);
      expect(GroupService.createGroup).toHaveBeenCalledWith({ name: 'developers' });
    });

    it('deletes a group', async () => {
      (GroupService.removeGroup as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteGroup('developers');

      expect(result.success).toBe(true);
      expect(GroupService.removeGroup).toHaveBeenCalledWith('developers', undefined);
    });

    it('gets group members', async () => {
      const mockMembers = { values: [{ name: 'john.doe' }] };
      (GroupService.getUsersFromGroup as jest.Mock).mockResolvedValue(mockMembers);

      const result = await jiraService.getGroupUsers('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMembers);
    });

    it('adds a user to a group', async () => {
      const mockGroup = { name: 'developers' };
      (GroupService.addUserToGroup as jest.Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.addUserToGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(GroupService.addUserToGroup).toHaveBeenCalledWith('developers', { name: 'john.doe' });
    });

    it('removes a user from a group', async () => {
      (GroupService.removeUserFromGroup as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUserFromGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(GroupService.removeUserFromGroup).toHaveBeenCalledWith('developers', 'john.doe');
    });

    it('finds groups matching a query', async () => {
      const mockSuggestions = { groups: [{ name: 'developers', html: '<b>dev</b>elopers' }] };
      (GroupsService.findGroups as jest.Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.findGroups('dev', 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(GroupsService.findGroups).toHaveBeenCalledWith('10', 'dev', undefined, undefined);
    });

    it('finds users and groups matching a query', async () => {
      const mockMatches = { users: { users: [{ name: 'john.doe' }] }, groups: { groups: [{ name: 'developers' }] } };
      (GroupuserpickerService.findUsersAndGroups as jest.Mock).mockResolvedValue(mockMatches);

      const result = await jiraService.findUsersAndGroups('jo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMatches);
      expect(GroupuserpickerService.findUsersAndGroups).toHaveBeenCalledWith(undefined, undefined, 'jo', undefined, undefined, undefined);
    });

    it('handles errors', async () => {
      (UserService.getUser1 as jest.Mock).mockRejectedValue(new Error('The requested user is not found'));

      const result = await jiraService.getUser('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested user is not found');
    });
  });

  describe('filters', () => {
    it('creates a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (FilterService.createFilter as jest.Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.createFilter('My open issues', 'assignee = currentUser() AND resolution = Unresolved');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(FilterService.createFilter).toHaveBeenCalledWith(undefined, {
        name: 'My open issues',
        jql: 'assignee = currentUser() AND resolution = Unresolved',
        description: undefined,
        favourite: undefined,
      });
    });

    it('gets a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (FilterService.getFilter as jest.Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.getFilter('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(FilterService.getFilter).toHaveBeenCalledWith('10000', undefined);
    });

    it('updates a filter', async () => {
      const mockFilter = { id: '10000', name: 'Renamed' };
      (FilterService.editFilter as jest.Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.updateFilter('10000', 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(FilterService.editFilter).toHaveBeenCalledWith('10000', undefined, {
        name: 'Renamed',
        jql: undefined,
        description: undefined,
        favourite: undefined,
      });
    });

    it('deletes a filter', async () => {
      (FilterService.deleteFilter as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteFilter('10000');

      expect(result.success).toBe(true);
      expect(FilterService.deleteFilter).toHaveBeenCalledWith('10000');
    });

    it('gets favourite filters', async () => {
      const mockFilters = [{ id: '10000', name: 'My open issues' }];
      (FilterService.getFavouriteFilters as jest.Mock).mockResolvedValue(mockFilters);

      const result = await jiraService.getFavouriteFilters();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilters);
    });

    it('handles errors', async () => {
      (FilterService.createFilter as jest.Mock).mockRejectedValue(new Error('Filter name was not provided'));

      const result = await jiraService.createFilter('', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Filter name was not provided');
    });
  });

  describe('dashboards', () => {
    it('gets a list of dashboards', async () => {
      const mockDashboards = { dashboards: [{ id: '10000', name: 'My Dashboard' }] };
      (DashboardService.list as jest.Mock).mockResolvedValue(mockDashboards);

      const result = await jiraService.getDashboards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboards);
      expect(DashboardService.list).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('gets a single dashboard', async () => {
      const mockDashboard = { id: '10000', name: 'My Dashboard' };
      (DashboardService.getDashboard as jest.Mock).mockResolvedValue(mockDashboard);

      const result = await jiraService.getDashboard('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboard);
      expect(DashboardService.getDashboard).toHaveBeenCalledWith('10000');
    });

    it('handles errors', async () => {
      (DashboardService.getDashboard as jest.Mock).mockRejectedValue(new Error('No dashboard with the specified id'));

      const result = await jiraService.getDashboard('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No dashboard with the specified id');
    });
  });

  describe('issue link types', () => {
    it('gets issue link types', async () => {
      const mockTypes = { issueLinkTypes: [{ id: '10000', name: 'Blocks' }] };
      (IssueLinkTypeService.getIssueLinkTypes as jest.Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getIssueLinkTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
    });

    it('creates an issue link type', async () => {
      const mockType = { id: '10000', name: 'Blocks' };
      (IssueLinkTypeService.createIssueLinkType as jest.Mock).mockResolvedValue(mockType);

      const result = await jiraService.createIssueLinkType('Blocks', 'is blocked by', 'blocks');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockType);
      expect(IssueLinkTypeService.createIssueLinkType).toHaveBeenCalledWith({
        name: 'Blocks',
        inward: 'is blocked by',
        outward: 'blocks',
      });
    });

    it('updates an issue link type', async () => {
      const mockType = { id: '10000', name: 'Blocks v2' };
      (IssueLinkTypeService.updateIssueLinkType as jest.Mock).mockResolvedValue(mockType);

      const result = await jiraService.updateIssueLinkType('10000', 'Blocks v2');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockType);
      expect(IssueLinkTypeService.updateIssueLinkType).toHaveBeenCalledWith('10000', {
        name: 'Blocks v2',
        inward: undefined,
        outward: undefined,
      });
    });

    it('deletes an issue link type', async () => {
      (IssueLinkTypeService.deleteIssueLinkType as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueLinkType('10000');

      expect(result.success).toBe(true);
      expect(IssueLinkTypeService.deleteIssueLinkType).toHaveBeenCalledWith('10000');
    });

    it('handles errors', async () => {
      (IssueLinkTypeService.deleteIssueLinkType as jest.Mock).mockRejectedValue(new Error('No issue link type with the given id exists'));

      const result = await jiraService.deleteIssueLinkType('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No issue link type with the given id exists');
    });
  });

  describe('bulk and rank operations', () => {
    it('bulk creates issues', async () => {
      const mockResponse = { issues: [{ id: '10001', key: 'PROJ-1' }] };
      (IssueService.createIssues as jest.Mock).mockResolvedValue(mockResponse);

      const result = await jiraService.createIssues([
        { projectId: 'TEST', summary: 'First', description: 'desc', issueTypeId: '10001' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResponse);
      expect(IssueService.createIssues).toHaveBeenCalledWith({
        issueUpdates: [
          {
            fields: {
              project: { key: 'TEST' },
              summary: 'First',
              description: 'desc',
              issuetype: { id: '10001' },
            },
          },
        ],
      });
    });

    it('bulk archives issues by JQL', async () => {
      (IssueService.archiveIssues as jest.Mock).mockResolvedValue({ numberOfIssuesUpdated: 3 });

      const result = await jiraService.archiveIssues('project = TEST AND resolution = Fixed');

      expect(result.success).toBe(true);
      expect(IssueService.archiveIssues).toHaveBeenCalledWith(undefined, 'project = TEST AND resolution = Fixed');
    });

    it('archives a single issue', async () => {
      (IssueService.archiveIssue as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.archiveIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.archiveIssue).toHaveBeenCalledWith(mockIssueKey, undefined);
    });

    it('ranks issues', async () => {
      (IssueService.rankIssues as jest.Mock).mockResolvedValue({ success: true });

      const result = await jiraService.rankIssues(['PROJ-1', 'PROJ-2'], 'PROJ-3');

      expect(result.success).toBe(true);
      expect(IssueService.rankIssues).toHaveBeenCalledWith({
        issues: ['PROJ-1', 'PROJ-2'],
        rankBeforeIssue: 'PROJ-3',
        rankAfterIssue: undefined,
        rankCustomFieldId: undefined,
      });
    });

    it('handles errors', async () => {
      (IssueService.rankIssues as jest.Mock).mockRejectedValue(new Error('User does not have permission to rank'));

      const result = await jiraService.rankIssues(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to rank');
    });
  });

  describe('agile boards', () => {
    it('gets boards', async () => {
      const mockBoards = { values: [{ id: 1, name: 'Scrum Board' }] };
      (BoardService.getAllBoards as jest.Mock).mockResolvedValue(mockBoards);

      const result = await jiraService.getBoards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoards);
      expect(BoardService.getAllBoards).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined);
    });

    it('gets a single board', async () => {
      const mockBoard = { id: 1, name: 'Scrum Board' };
      (BoardService.getBoard as jest.Mock).mockResolvedValue(mockBoard);

      const result = await jiraService.getBoard(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBoard);
      expect(BoardService.getBoard).toHaveBeenCalledWith(1);
    });

    it('gets board configuration', async () => {
      const mockConfig = { id: 1, columnConfig: {} };
      (BoardService.getConfiguration as jest.Mock).mockResolvedValue(mockConfig);

      const result = await jiraService.getBoardConfiguration(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockConfig);
    });

    it('gets board issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (BoardService.getIssuesForBoard as jest.Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssues(1, 'status = Open');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(BoardService.getIssuesForBoard).toHaveBeenCalledWith(1, undefined, 'status = Open', undefined, undefined, undefined, undefined);
    });

    it('gets board sprints', async () => {
      const mockSprints = { values: [{ id: 1, name: 'Sprint 1' }] };
      (BoardService.getAllSprints as jest.Mock).mockResolvedValue(mockSprints);

      const result = await jiraService.getBoardSprints(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprints);
      expect(BoardService.getAllSprints).toHaveBeenCalledWith(1, undefined, undefined, undefined);
    });

    it('gets board versions', async () => {
      const mockVersions = { values: [{ id: 1, name: '1.0' }] };
      (BoardService.getAllVersions as jest.Mock).mockResolvedValue(mockVersions);

      const result = await jiraService.getBoardVersions(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockVersions);
    });

    it('handles errors', async () => {
      (BoardService.getBoard as jest.Mock).mockRejectedValue(new Error('The board does not exist'));

      const result = await jiraService.getBoard(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The board does not exist');
    });
  });

  describe('backlog and epics', () => {
    it('gets board backlog issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (BoardService.getIssuesForBacklog as jest.Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardBacklogIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(BoardService.getIssuesForBacklog).toHaveBeenCalledWith(1, undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('gets board epics', async () => {
      const mockEpics = { values: [{ id: 1, name: 'Epic 1' }] };
      (BoardService.getEpics as jest.Mock).mockResolvedValue(mockEpics);

      const result = await jiraService.getBoardEpics(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpics);
      expect(BoardService.getEpics).toHaveBeenCalledWith(1, undefined, undefined, undefined);
    });

    it('gets board issues without an epic', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (BoardService.getIssuesWithoutEpic as jest.Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardIssuesWithoutEpic(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
    });

    it('gets board epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-3' }] };
      (BoardService.getIssuesForEpic as jest.Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getBoardEpicIssues(1, 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(BoardService.getIssuesForEpic).toHaveBeenCalledWith(10, 1, undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('moves issues to backlog', async () => {
      (BacklogService.moveIssuesToBacklog as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(BacklogService.moveIssuesToBacklog).toHaveBeenCalledWith({ issues: ['PROJ-1', 'PROJ-2'] });
    });

    it('handles errors', async () => {
      (BacklogService.moveIssuesToBacklog as jest.Mock).mockRejectedValue(new Error('Sprint does not exist'));

      const result = await jiraService.moveIssuesToBacklog(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sprint does not exist');
    });
  });

  describe('sprints', () => {
    it('creates a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (SprintService.createSprint as jest.Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.createSprint('Sprint 1', 1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(SprintService.createSprint).toHaveBeenCalledWith({
        name: 'Sprint 1',
        originBoardId: 1,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
      });
    });

    it('gets a sprint', async () => {
      const mockSprint = { id: 1, name: 'Sprint 1' };
      (SprintService.getSprint as jest.Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.getSprint(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(SprintService.getSprint).toHaveBeenCalledWith(1);
    });

    it('updates a sprint to start it', async () => {
      const mockSprint = { id: 1, state: 'active' };
      (SprintService.updateSprint as jest.Mock).mockResolvedValue(mockSprint);

      const result = await jiraService.updateSprint(1, undefined, undefined, undefined, undefined, 'active');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSprint);
      expect(SprintService.updateSprint).toHaveBeenCalledWith(1, {
        name: undefined,
        startDate: undefined,
        endDate: undefined,
        goal: undefined,
        state: 'active',
      });
    });

    it('deletes a sprint', async () => {
      (SprintService.deleteSprint as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(true);
      expect(SprintService.deleteSprint).toHaveBeenCalledWith(1);
    });

    it('gets sprint issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-1' }] };
      (SprintService.getIssuesForSprint1 as jest.Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getSprintIssues(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(SprintService.getIssuesForSprint1).toHaveBeenCalledWith(1, undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('moves issues into a sprint', async () => {
      (SprintService.moveIssuesToSprint as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToSprint(1, ['PROJ-1', 'PROJ-2']);

      expect(result.success).toBe(true);
      expect(SprintService.moveIssuesToSprint).toHaveBeenCalledWith(1, { issues: ['PROJ-1', 'PROJ-2'] });
    });

    it('handles errors', async () => {
      (SprintService.deleteSprint as jest.Mock).mockRejectedValue(new Error('The sprint is active or completed'));

      const result = await jiraService.deleteSprint(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The sprint is active or completed');
    });
  });

  describe('epics', () => {
    it('gets an epic', async () => {
      const mockEpic = { id: 1, key: 'PROJ-1', name: 'Epic 1' };
      (EpicService.getEpic as jest.Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.getEpic('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(EpicService.getEpic).toHaveBeenCalledWith('PROJ-1');
    });

    it('updates an epic', async () => {
      const mockEpic = { id: 1, done: true };
      (EpicService.partiallyUpdateEpic as jest.Mock).mockResolvedValue(mockEpic);

      const result = await jiraService.updateEpic('PROJ-1', undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockEpic);
      expect(EpicService.partiallyUpdateEpic).toHaveBeenCalledWith('PROJ-1', {
        name: undefined,
        summary: undefined,
        done: true,
      });
    });

    it('gets epic issues', async () => {
      const mockIssues = { issues: [{ key: 'PROJ-2' }] };
      (EpicService.getIssuesForEpic1 as jest.Mock).mockResolvedValue(mockIssues);

      const result = await jiraService.getEpicIssues('PROJ-1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssues);
      expect(EpicService.getIssuesForEpic1).toHaveBeenCalledWith('PROJ-1', undefined, undefined, undefined, undefined, undefined, undefined);
    });

    it('moves issues into an epic', async () => {
      (EpicService.moveIssuesToEpic as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveIssuesToEpic('PROJ-1', ['PROJ-2', 'PROJ-3']);

      expect(result.success).toBe(true);
      expect(EpicService.moveIssuesToEpic).toHaveBeenCalledWith('PROJ-1', { issues: ['PROJ-2', 'PROJ-3'] });
    });

    it('ranks an epic', async () => {
      (EpicService.rankEpics as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.rankEpic('PROJ-1', 'PROJ-4');

      expect(result.success).toBe(true);
      expect(EpicService.rankEpics).toHaveBeenCalledWith('PROJ-1', {
        rankBeforeEpic: 'PROJ-4',
        rankAfterEpic: undefined,
        rankCustomFieldId: undefined,
      });
    });

    it('handles errors', async () => {
      (EpicService.getEpic as jest.Mock).mockRejectedValue(new Error('The epic does not exist'));

      const result = await jiraService.getEpic('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The epic does not exist');
    });
  });

  describe('issue type schemes', () => {
    it('gets all issue type schemes', async () => {
      const mockSchemes = { schemes: [{ id: '1', name: 'Default' }] };
      (IssuetypeschemeService.getAllIssueTypeSchemes as jest.Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getIssueTypeSchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(IssuetypeschemeService.getAllIssueTypeSchemes).toHaveBeenCalledWith();
    });

    it('creates an issue type scheme', async () => {
      const mockScheme = { id: '2', name: 'New Scheme' };
      (IssuetypeschemeService.createIssueTypeScheme as jest.Mock).mockResolvedValue(mockScheme);

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
      (IssuetypeschemeService.getIssueTypeScheme as jest.Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getIssueTypeScheme('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(IssuetypeschemeService.getIssueTypeScheme).toHaveBeenCalledWith('1');
    });

    it('updates an issue type scheme', async () => {
      const mockScheme = { id: '1', name: 'Renamed' };
      (IssuetypeschemeService.updateIssueTypeScheme as jest.Mock).mockResolvedValue(mockScheme);

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
      (IssuetypeschemeService.deleteIssueTypeScheme as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueTypeScheme('1');

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.deleteIssueTypeScheme).toHaveBeenCalledWith('1');
    });

    it('gets projects associated with an issue type scheme', async () => {
      const mockProjects = { values: [{ id: '10000', key: 'TEST' }] };
      (IssuetypeschemeService.getAssociatedProjects as jest.Mock).mockResolvedValue(mockProjects);

      const result = await jiraService.getIssueTypeSchemeProjects('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProjects);
      expect(IssuetypeschemeService.getAssociatedProjects).toHaveBeenCalledWith('1', undefined);
    });

    it('sets project associations for an issue type scheme', async () => {
      (IssuetypeschemeService.setProjectAssociationsForScheme as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.setIssueTypeSchemeProjects('1', ['TEST']);

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.setProjectAssociationsForScheme).toHaveBeenCalledWith('1', { idsOrKeys: ['TEST'] });
    });

    it('adds project associations to an issue type scheme', async () => {
      (IssuetypeschemeService.addProjectAssociationsToScheme as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.addIssueTypeSchemeProjects('1', ['TEST']);

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.addProjectAssociationsToScheme).toHaveBeenCalledWith('1', { idsOrKeys: ['TEST'] });
    });

    it('removes all project associations from an issue type scheme', async () => {
      (IssuetypeschemeService.removeAllProjectAssociations as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueTypeSchemeProjects('1');

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.removeAllProjectAssociations).toHaveBeenCalledWith('1');
    });

    it('removes a single project association from an issue type scheme', async () => {
      (IssuetypeschemeService.removeProjectAssociation as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeIssueTypeSchemeProject('1', 'TEST');

      expect(result.success).toBe(true);
      expect(IssuetypeschemeService.removeProjectAssociation).toHaveBeenCalledWith('TEST', '1');
    });

    it('handles errors', async () => {
      (IssuetypeschemeService.getIssueTypeScheme as jest.Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getIssueTypeScheme('999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });

  describe('priority schemes', () => {
    it('gets all priority schemes', async () => {
      const mockSchemes = { schemes: [{ id: 1, name: 'Default' }] };
      (PriorityschemesService.getPrioritySchemes as jest.Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getPrioritySchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(PriorityschemesService.getPrioritySchemes).toHaveBeenCalledWith(undefined, undefined);
    });

    it('creates a priority scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (PriorityschemesService.createPriorityScheme as jest.Mock).mockResolvedValue(mockScheme);

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
      (PriorityschemesService.getPriorityScheme as jest.Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getPriorityScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PriorityschemesService.getPriorityScheme).toHaveBeenCalledWith(1);
    });

    it('updates a priority scheme', async () => {
      const mockScheme = { id: 1, name: 'Renamed' };
      (PriorityschemesService.updatePriorityScheme as jest.Mock).mockResolvedValue(mockScheme);

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
      (PriorityschemesService.deletePriorityScheme as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePriorityScheme(1);

      expect(result.success).toBe(true);
      expect(PriorityschemesService.deletePriorityScheme).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (PriorityschemesService.getPriorityScheme as jest.Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getPriorityScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });

  describe('project categories', () => {
    it('gets all project categories', async () => {
      const mockCategories = [{ id: '1', name: 'Category 1' }];
      (ProjectCategoryService.getAllProjectCategories as jest.Mock).mockResolvedValue(mockCategories);

      const result = await jiraService.getProjectCategories();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategories);
      expect(ProjectCategoryService.getAllProjectCategories).toHaveBeenCalledWith();
    });

    it('creates a project category', async () => {
      const mockCategory = { id: '2', name: 'New Category' };
      (ProjectCategoryService.createProjectCategory as jest.Mock).mockResolvedValue(mockCategory);

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
      (ProjectCategoryService.getProjectCategoryById as jest.Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.getProjectCategory(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(ProjectCategoryService.getProjectCategoryById).toHaveBeenCalledWith(1);
    });

    it('updates a project category', async () => {
      const mockCategory = { id: '1', name: 'Renamed' };
      (ProjectCategoryService.updateProjectCategory as jest.Mock).mockResolvedValue(mockCategory);

      const result = await jiraService.updateProjectCategory(1, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCategory);
      expect(ProjectCategoryService.updateProjectCategory).toHaveBeenCalledWith(1, {
        name: 'Renamed',
        description: undefined,
      });
    });

    it('deletes a project category', async () => {
      (ProjectCategoryService.removeProjectCategory as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteProjectCategory(1);

      expect(result.success).toBe(true);
      expect(ProjectCategoryService.removeProjectCategory).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (ProjectCategoryService.getProjectCategoryById as jest.Mock).mockRejectedValue(new Error('The category does not exist'));

      const result = await jiraService.getProjectCategory(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The category does not exist');
    });
  });

  describe('role definitions', () => {
    it('gets all role definitions', async () => {
      const mockRoles = [{ id: 10, name: 'Administrators' }];
      (RoleService.getProjectRoles1 as jest.Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getRoleDefinitions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(RoleService.getProjectRoles1).toHaveBeenCalledWith();
    });

    it('creates a role definition', async () => {
      const mockRole = { id: 11, name: 'New Role' };
      (RoleService.createProjectRole as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.createRoleDefinition('New Role', 'A role');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.createProjectRole).toHaveBeenCalledWith({ name: 'New Role', description: 'A role' });
    });

    it('gets a role definition by id', async () => {
      const mockRole = { id: 10, name: 'Administrators' };
      (RoleService.getProjectRolesById as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getRoleDefinition(10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.getProjectRolesById).toHaveBeenCalledWith(10);
    });

    it('fully updates a role definition', async () => {
      const mockRole = { id: 10, name: 'Renamed', description: 'Updated' };
      (RoleService.fullyUpdateProjectRole as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.updateRoleDefinition(10, 'Renamed', 'Updated');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.fullyUpdateProjectRole).toHaveBeenCalledWith(10, { name: 'Renamed', description: 'Updated' });
    });

    it('partially updates a role definition', async () => {
      const mockRole = { id: 10, name: 'Renamed' };
      (RoleService.partialUpdateProjectRole as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.partialUpdateRoleDefinition(10, 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(RoleService.partialUpdateProjectRole).toHaveBeenCalledWith(10, { name: 'Renamed', description: undefined });
    });

    it('deletes a role definition', async () => {
      (RoleService.deleteProjectRole as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRoleDefinition(10, 11);

      expect(result.success).toBe(true);
      expect(RoleService.deleteProjectRole).toHaveBeenCalledWith(10, 11);
    });

    it('gets role definition actors', async () => {
      const mockActors = { id: 10, actors: [] };
      (RoleService.getProjectRoleActorsForRole as jest.Mock).mockResolvedValue(mockActors);

      const result = await jiraService.getRoleDefinitionActors(10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(RoleService.getProjectRoleActorsForRole).toHaveBeenCalledWith(10);
    });

    it('adds role definition actors', async () => {
      const mockActors = { id: 10, actors: [] };
      (RoleService.addProjectRoleActorsToRole as jest.Mock).mockResolvedValue(mockActors);

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
      (RoleService.deleteProjectRoleActorsFromRole as jest.Mock).mockResolvedValue(mockActors);

      const result = await jiraService.deleteRoleDefinitionActor(10, 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockActors);
      expect(RoleService.deleteProjectRoleActorsFromRole).toHaveBeenCalledWith(10, 'jsmith', undefined);
    });

    it('handles errors', async () => {
      (RoleService.getProjectRolesById as jest.Mock).mockRejectedValue(new Error('The role does not exist'));

      const result = await jiraService.getRoleDefinition(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The role does not exist');
    });
  });

  describe('permission schemes', () => {
    it('gets all permission schemes', async () => {
      const mockSchemes = { permissionSchemes: [{ id: 1, name: 'Default' }] };
      (PermissionschemeService.getPermissionSchemes as jest.Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getPermissionSchemes('permissions');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(PermissionschemeService.getPermissionSchemes).toHaveBeenCalledWith('permissions');
    });

    it('gets a permission scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default' };
      (PermissionschemeService.getPermissionScheme as jest.Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getPermissionScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(PermissionschemeService.getPermissionScheme).toHaveBeenCalledWith(1, undefined);
    });

    it('creates a permission scheme', async () => {
      const mockScheme = { id: 2, name: 'New Scheme' };
      (PermissionschemeService.createPermissionScheme as jest.Mock).mockResolvedValue(mockScheme);

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
      (PermissionschemeService.updatePermissionScheme as jest.Mock).mockResolvedValue(mockScheme);

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
      (PermissionschemeService.deletePermissionScheme as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePermissionScheme(1);

      expect(result.success).toBe(true);
      expect(PermissionschemeService.deletePermissionScheme).toHaveBeenCalledWith(1);
    });

    it('gets permission scheme grants', async () => {
      const mockGrants = { permissions: [{ id: 10, permission: 'BROWSE_PROJECTS' }] };
      (PermissionschemeService.getPermissionSchemeGrants as jest.Mock).mockResolvedValue(mockGrants);

      const result = await jiraService.getPermissionSchemeGrants(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGrants);
      expect(PermissionschemeService.getPermissionSchemeGrants).toHaveBeenCalledWith(1, undefined);
    });

    it('creates a permission grant', async () => {
      const mockGrant = { id: 10, permission: 'BROWSE_PROJECTS' };
      (PermissionschemeService.createPermissionGrant as jest.Mock).mockResolvedValue(mockGrant);

      const result = await jiraService.createPermissionGrant(1, 'BROWSE_PROJECTS', 'group', 'jira-users');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGrant);
      expect(PermissionschemeService.createPermissionGrant).toHaveBeenCalledWith(1, undefined, {
        permission: 'BROWSE_PROJECTS',
        holder: { type: 'group', parameter: 'jira-users' },
      });
    });

    it('deletes a permission grant', async () => {
      (PermissionschemeService.deletePermissionSchemeEntity as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deletePermissionGrant(1, 10);

      expect(result.success).toBe(true);
      expect(PermissionschemeService.deletePermissionSchemeEntity).toHaveBeenCalledWith(10, 1);
    });

    it('handles errors', async () => {
      (PermissionschemeService.getPermissionScheme as jest.Mock).mockRejectedValue(new Error('The scheme does not exist'));

      const result = await jiraService.getPermissionScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The scheme does not exist');
    });
  });

  describe('application roles', () => {
    it('gets all application roles', async () => {
      const mockRoles = [{ key: 'jira-software', name: 'JIRA Software' }];
      (ApplicationroleService.getAll as jest.Mock).mockResolvedValue(mockRoles);

      const result = await jiraService.getApplicationRoles();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRoles);
      expect(ApplicationroleService.getAll).toHaveBeenCalledWith();
    });

    it('gets a single application role by key', async () => {
      const mockRole = { key: 'jira-software', name: 'JIRA Software' };
      (ApplicationroleService.get4 as jest.Mock).mockResolvedValue(mockRole);

      const result = await jiraService.getApplicationRole('jira-software');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRole);
      expect(ApplicationroleService.get4).toHaveBeenCalledWith('jira-software');
    });

    it('handles errors', async () => {
      (ApplicationroleService.getAll as jest.Mock).mockRejectedValue(new Error('The current user is not an administrator'));

      const result = await jiraService.getApplicationRoles();

      expect(result.success).toBe(false);
      expect(result.error).toBe('The current user is not an administrator');
    });
  });

  describe('workflows and workflow schemes', () => {
    it('gets all workflows', async () => {
      const mockWorkflows = [{ name: 'jira' }];
      (WorkflowService.getAllWorkflows as jest.Mock).mockResolvedValue(mockWorkflows);

      const result = await jiraService.getWorkflows();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorkflows);
      expect(WorkflowService.getAllWorkflows).toHaveBeenCalledWith(undefined);
    });

    it('gets a workflow scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default Workflow Scheme' };
      (WorkflowschemeService.getById as jest.Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getWorkflowScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(WorkflowschemeService.getById).toHaveBeenCalledWith(1, undefined);
    });

    it('gets the default workflow for a scheme', async () => {
      const mockDefault = { defaultWorkflow: 'jira' };
      (WorkflowschemeService.getDefault as jest.Mock).mockResolvedValue(mockDefault);

      const result = await jiraService.getWorkflowSchemeDefault(1, true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDefault);
      expect(WorkflowschemeService.getDefault).toHaveBeenCalledWith(1, true);
    });

    it('gets the issue type mapping for a scheme', async () => {
      const mockMapping = { issueType: '10001', workflow: 'jira' };
      (WorkflowschemeService.getIssueType as jest.Mock).mockResolvedValue(mockMapping);

      const result = await jiraService.getWorkflowSchemeIssueTypeMapping(1, '10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMapping);
      expect(WorkflowschemeService.getIssueType).toHaveBeenCalledWith('10001', 1, undefined);
    });

    it('gets the workflow mapping for a scheme', async () => {
      const mockMapping = { issueTypes: ['10001'], workflow: 'jira' };
      (WorkflowschemeService.getWorkflow as jest.Mock).mockResolvedValue(mockMapping);

      const result = await jiraService.getWorkflowSchemeWorkflowMapping(1, 'jira');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMapping);
      expect(WorkflowschemeService.getWorkflow).toHaveBeenCalledWith(1, 'jira', undefined);
    });

    it('handles errors', async () => {
      (WorkflowschemeService.getById as jest.Mock).mockRejectedValue(new Error('The workflow scheme does not exist'));

      const result = await jiraService.getWorkflowScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The workflow scheme does not exist');
    });
  });

  describe('notification schemes', () => {
    it('gets a paginated list of notification schemes', async () => {
      const mockSchemes = { values: [{ id: 1, name: 'Default Notification Scheme' }] };
      (NotificationschemeService.getNotificationSchemes as jest.Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getNotificationSchemes('all', 50, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(NotificationschemeService.getNotificationSchemes).toHaveBeenCalledWith('all', 50, 0);
    });

    it('gets a notification scheme by id', async () => {
      const mockScheme = { id: 1, name: 'Default Notification Scheme' };
      (NotificationschemeService.getNotificationScheme as jest.Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getNotificationScheme(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(NotificationschemeService.getNotificationScheme).toHaveBeenCalledWith(1, undefined);
    });

    it('handles errors', async () => {
      (NotificationschemeService.getNotificationScheme as jest.Mock).mockRejectedValue(new Error('The notification scheme does not exist'));

      const result = await jiraService.getNotificationScheme(999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The notification scheme does not exist');
    });
  });

  describe('security levels and schemes', () => {
    it('gets a security level by id', async () => {
      const mockLevel = { id: '10000', name: 'Confidential' };
      (SecuritylevelService.getIssuesecuritylevel as jest.Mock).mockResolvedValue(mockLevel);

      const result = await jiraService.getSecurityLevel('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLevel);
      expect(SecuritylevelService.getIssuesecuritylevel).toHaveBeenCalledWith('10000');
    });

    it('gets all issue security schemes', async () => {
      const mockSchemes = { issueSecuritySchemes: [{ id: '1', name: 'Default Scheme' }] };
      (IssuesecurityschemesService.getIssueSecuritySchemes as jest.Mock).mockResolvedValue(mockSchemes);

      const result = await jiraService.getIssueSecuritySchemes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchemes);
      expect(IssuesecurityschemesService.getIssueSecuritySchemes).toHaveBeenCalledWith();
    });

    it('gets an issue security scheme by id', async () => {
      const mockScheme = { id: '1', name: 'Default Scheme' };
      (IssuesecurityschemesService.getIssueSecurityScheme as jest.Mock).mockResolvedValue(mockScheme);

      const result = await jiraService.getIssueSecurityScheme('1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScheme);
      expect(IssuesecurityschemesService.getIssueSecurityScheme).toHaveBeenCalledWith('1');
    });

    it('handles errors', async () => {
      (SecuritylevelService.getIssuesecuritylevel as jest.Mock).mockRejectedValue(new Error('The security level does not exist'));

      const result = await jiraService.getSecurityLevel('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The security level does not exist');
    });
  });

  describe('custom fields admin', () => {
    it('gets custom fields with filters', async () => {
      const mockFields = { values: [{ id: 'customfield_10001', name: 'Story Points' }] };
      (CustomFieldsService.getCustomFields as jest.Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getCustomFields(undefined, ['textfield'], 'Story', 25, undefined, undefined, undefined, undefined, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(CustomFieldsService.getCustomFields).toHaveBeenCalledWith(
        undefined, 'textfield', 'Story', '25', undefined, undefined, undefined, undefined, '0'
      );
    });

    it('deletes custom fields in bulk', async () => {
      (CustomFieldsService.bulkDeleteCustomFields as jest.Mock).mockResolvedValue({ deletedCustomFields: ['customfield_10001'] });

      const result = await jiraService.deleteCustomFields(['customfield_10001', 'customfield_10002']);

      expect(result.success).toBe(true);
      expect(CustomFieldsService.bulkDeleteCustomFields).toHaveBeenCalledWith('customfield_10001,customfield_10002');
    });

    it('gets custom field options', async () => {
      const mockOptions = { values: [{ id: '10001', value: 'Option A' }] };
      (CustomFieldsService.getCustomFieldOptions as jest.Mock).mockResolvedValue(mockOptions);

      const result = await jiraService.getCustomFieldOptions('customfield_10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOptions);
      expect(CustomFieldsService.getCustomFieldOptions).toHaveBeenCalledWith(
        'customfield_10001', undefined, undefined, undefined, undefined, undefined, undefined, undefined
      );
    });

    it('gets a custom field option by id', async () => {
      const mockOption = { id: '10001', value: 'Option A' };
      (CustomFieldOptionService.getCustomFieldOption as jest.Mock).mockResolvedValue(mockOption);

      const result = await jiraService.getCustomFieldOption('10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOption);
      expect(CustomFieldOptionService.getCustomFieldOption).toHaveBeenCalledWith('10001');
    });

    it('creates a custom field', async () => {
      const mockField = { id: 'customfield_10099', name: 'Story Points' };
      (FieldService.createCustomField as jest.Mock).mockResolvedValue(mockField);

      const result = await jiraService.createCustomField(
        'Story Points',
        'com.atlassian.jira.plugin.system.customfieldtypes:float'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockField);
      expect(FieldService.createCustomField).toHaveBeenCalledWith({
        name: 'Story Points',
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
        description: undefined,
        searcherKey: undefined,
        issueTypeIds: undefined,
        projectIds: undefined,
      });
    });

    it('handles errors', async () => {
      (FieldService.createCustomField as jest.Mock).mockRejectedValue(new Error('Invalid custom field type'));

      const result = await jiraService.createCustomField('Bad Field', 'not-a-real-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid custom field type');
    });
  });

  describe('user admin', () => {
    it('creates a user', async () => {
      const mockUser = { name: 'jdoe', emailAddress: 'jdoe@example.com' };
      (UserService.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await jiraService.createUser('jdoe', 'jdoe@example.com', 'John Doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(UserService.createUser).toHaveBeenCalledWith({
        name: 'jdoe',
        emailAddress: 'jdoe@example.com',
        displayName: 'John Doe',
        password: undefined,
        notification: undefined,
      });
    });

    it('removes a user', async () => {
      (UserService.removeUser as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUser(undefined, 'jdoe');

      expect(result.success).toBe(true);
      expect(UserService.removeUser).toHaveBeenCalledWith(undefined, 'jdoe');
    });

    it('changes a user password', async () => {
      (UserService.changeUserPassword as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.changeUserPassword('new-pass', undefined, undefined, 'jdoe');

      expect(result.success).toBe(true);
      expect(UserService.changeUserPassword).toHaveBeenCalledWith(
        { password: 'new-pass', currentPassword: undefined },
        undefined,
        'jdoe'
      );
    });

    it('validates user anonymization', async () => {
      const mockValidation = { username: 'jdoe', errors: {} };
      (UserService.validateUserAnonymization as jest.Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateUserAnonymization('jdoe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockValidation);
      expect(UserService.validateUserAnonymization).toHaveBeenCalledWith(undefined, 'jdoe');
    });

    it('schedules user anonymization', async () => {
      const mockSchedule = { status: 'IN_PROGRESS' };
      (UserService.scheduleUserAnonymization as jest.Mock).mockResolvedValue(mockSchedule);

      const result = await jiraService.scheduleUserAnonymization('jdoe', 'admin');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchedule);
      expect(UserService.scheduleUserAnonymization).toHaveBeenCalledWith({ userKey: 'jdoe', newOwnerKey: 'admin' });
    });

    it('gets user anonymization progress', async () => {
      const mockProgress = { status: 'IN_PROGRESS', currentProgress: 50 };
      (UserService.getProgress1 as jest.Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getUserAnonymizationProgress(123);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(UserService.getProgress1).toHaveBeenCalledWith(123);
    });

    it('handles errors', async () => {
      (UserService.createUser as jest.Mock).mockRejectedValue(new Error('A user with that username already exists'));

      const result = await jiraService.createUser('jdoe', 'jdoe@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('A user with that username already exists');
    });
  });

  describe('avatars', () => {
    it('gets system avatars for a type', async () => {
      const mockAvatars = { system: [{ id: '1', owner: 'jira' }] };
      (AvatarService.getAllSystemAvatars as jest.Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getSystemAvatars('project');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(AvatarService.getAllSystemAvatars).toHaveBeenCalledWith('project');
    });

    it('gets avatars for a type and owner', async () => {
      const mockAvatars = { system: [], custom: [{ id: '10001' }] };
      (UniversalAvatarService.getAvatars as jest.Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getAvatars('project', 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(UniversalAvatarService.getAvatars).toHaveBeenCalledWith('project', 'TEST');
    });

    it('uploads a temporary avatar', async () => {
      const mockCropping = { url: 'https://jira.example.com/temp/avatar.png', needsCropping: true };
      (UniversalAvatarService.storeTemporaryAvatarUsingMultiPart2 as jest.Mock).mockResolvedValue(mockCropping);

      const result = await jiraService.uploadTemporaryAvatar('project', 'TEST', 'avatar.png', Buffer.from('img').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCropping);
      const [calledType, calledOwner, calledFormData] = (UniversalAvatarService.storeTemporaryAvatarUsingMultiPart2 as jest.Mock).mock.calls[0];
      expect(calledType).toBe('project');
      expect(calledOwner).toBe('TEST');
      expect((calledFormData as { file: File }).file).toBeInstanceOf(File);
      expect((calledFormData as { file: File }).file.name).toBe('avatar.png');
    });

    it('creates an avatar from a temporary avatar', async () => {
      const mockAvatar = { id: '10001', owner: 'TEST' };
      (UniversalAvatarService.createAvatarFromTemporary3 as jest.Mock).mockResolvedValue(mockAvatar);

      const result = await jiraService.createAvatarFromTemporary('project', 'TEST', 0, 0, 48, true, 'https://jira.example.com/temp/avatar.png');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatar);
      expect(UniversalAvatarService.createAvatarFromTemporary3).toHaveBeenCalledWith('project', 'TEST', {
        cropperOffsetX: 0,
        cropperOffsetY: 0,
        cropperWidth: 48,
        needsCropping: true,
        url: 'https://jira.example.com/temp/avatar.png',
      });
    });

    it('deletes an avatar', async () => {
      (UniversalAvatarService.deleteAvatar1 as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAvatar(10001, 'project', 'TEST');

      expect(result.success).toBe(true);
      expect(UniversalAvatarService.deleteAvatar1).toHaveBeenCalledWith(10001, 'project', 'TEST');
    });

    it('handles errors', async () => {
      (AvatarService.getAllSystemAvatars as jest.Mock).mockRejectedValue(new Error('Invalid avatar type'));

      const result = await jiraService.getSystemAvatars('not-a-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid avatar type');
    });
  });

  describe('getMyPermissions', () => {
    it('gets permissions for the logged in user with no context', async () => {
      const mockPermissions = { permissions: { ADMINISTER: { id: '0', key: 'ADMINISTER', name: 'Administer', havePermission: true } } };
      (MypermissionsService.getPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(MypermissionsService.getPermissions).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
    });

    it('gets permissions scoped to a project and issue', async () => {
      const mockPermissions = { permissions: {} };
      (MypermissionsService.getPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions('TEST', '10000', 'TEST-1', '10001');

      expect(result.success).toBe(true);
      expect(MypermissionsService.getPermissions).toHaveBeenCalledWith('10001', 'TEST', 'TEST-1', '10000');
    });

    it('handles errors', async () => {
      (MypermissionsService.getPermissions as jest.Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getMyPermissions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('getAllPermissions', () => {
    it('gets the full permission catalog', async () => {
      const mockPermissions = {
        permissions: {
          ADMINISTER: { id: '0', key: 'ADMINISTER', name: 'Administer Jira', type: 'GLOBAL' },
          BROWSE: { id: '10', key: 'BROWSE', name: 'Browse Projects', type: 'PROJECT' },
        },
      };
      (PermissionsService.getAllPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(PermissionsService.getAllPermissions).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (PermissionsService.getAllPermissions as jest.Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('getJqlAutocompleteData', () => {
    it('gets JQL reserved words and function names', async () => {
      const mockAutoComplete = {
        jqlReservedWords: ['AND', 'OR', 'NOT'],
        visibleFieldNames: ['assignee', 'status'],
        visibleFunctionNames: ['currentUser()', 'now()'],
      };
      (JqlService.getAutoComplete as jest.Mock).mockResolvedValue(mockAutoComplete);

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAutoComplete);
      expect(JqlService.getAutoComplete).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (JqlService.getAutoComplete as jest.Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('getJqlFieldAutocomplete', () => {
    it('gets value suggestions for a JQL field', async () => {
      const mockSuggestions = { results: [{ value: 'In Progress', displayName: 'In Progress' }] };
      (JqlService.getFieldAutoCompleteForQueryString as jest.Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.getJqlFieldAutocomplete('status', 'In', 'in', undefined);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(JqlService.getFieldAutoCompleteForQueryString).toHaveBeenCalledWith(undefined, 'in', 'status', 'In');
    });

    it('handles errors', async () => {
      (JqlService.getFieldAutoCompleteForQueryString as jest.Mock).mockRejectedValue(new Error('Bad request'));

      const result = await jiraService.getJqlFieldAutocomplete('status');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad request');
    });
  });

  describe('validateProjectKey', () => {
    it('returns an empty error collection for a valid key', async () => {
      const mockValidation = { errorMessages: [], errors: {} };
      (ProjectvalidateService.getProject1 as jest.Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateProjectKey('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockValidation);
      expect(ProjectvalidateService.getProject1).toHaveBeenCalledWith('TEST');
    });

    it('returns validation errors for an invalid key', async () => {
      const mockValidation = { errorMessages: [], errors: { projectKey: 'A project with that key already exists.' } };
      (ProjectvalidateService.getProject1 as jest.Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateProjectKey('EXIST');

      expect(result.success).toBe(true);
      expect(result.data?.errors).toEqual({ projectKey: 'A project with that key already exists.' });
    });

    it('handles errors', async () => {
      (ProjectvalidateService.getProject1 as jest.Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.validateProjectKey('TEST');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('my preferences', () => {
    it('gets a preference by key', async () => {
      (MypreferencesService.getPreference as jest.Mock).mockResolvedValue('dark');

      const result = await jiraService.getMyPreference('theme');

      expect(result.success).toBe(true);
      expect(result.data).toBe('dark');
      expect(MypreferencesService.getPreference).toHaveBeenCalledWith('theme');
    });

    it('sets a preference by key', async () => {
      (MypreferencesService.setPreference as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.setMyPreference('theme', 'dark');

      expect(result.success).toBe(true);
      expect(MypreferencesService.setPreference).toHaveBeenCalledWith('theme', 'dark');
    });

    it('deletes a preference by key', async () => {
      (MypreferencesService.removePreference as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteMyPreference('theme');

      expect(result.success).toBe(true);
      expect(MypreferencesService.removePreference).toHaveBeenCalledWith('theme');
    });

    it('handles errors', async () => {
      (MypreferencesService.getPreference as jest.Mock).mockRejectedValue(new Error('Key not found.'));

      const result = await jiraService.getMyPreference('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Key not found.');
    });
  });

  describe('screens and default screen fields', () => {
    it('gets all screens with filters', async () => {
      const mockScreens = { values: [{ id: 1, name: 'Default Screen' }] };
      (ScreensService.getAllScreens as jest.Mock).mockResolvedValue(mockScreens);

      const result = await jiraService.getAllScreens('Default', 'names', 25, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScreens);
      expect(ScreensService.getAllScreens).toHaveBeenCalledWith('Default', 'names', '25', '0');
    });

    it('adds a field to the default screen', async () => {
      (ScreensService.addFieldToDefaultScreen as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.addFieldToDefaultScreen('customfield_10001');

      expect(result.success).toBe(true);
      expect(ScreensService.addFieldToDefaultScreen).toHaveBeenCalledWith('customfield_10001');
    });

    it('gets available fields for a screen', async () => {
      const mockFields = [{ id: 'customfield_10002', name: 'Epic Link' }];
      (ScreensService.getFieldsToAdd as jest.Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getScreenAvailableFields(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(ScreensService.getFieldsToAdd).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (ScreensService.getAllScreens as jest.Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getAllScreens();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });

  describe('screen tabs', () => {
    it('gets all tabs for a screen', async () => {
      const mockTabs = [{ id: 10, name: 'Field Tab' }];
      (ScreensService.getAllTabs as jest.Mock).mockResolvedValue(mockTabs);

      const result = await jiraService.getScreenTabs(1, 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTabs);
      expect(ScreensService.getAllTabs).toHaveBeenCalledWith(1, 'TEST');
    });

    it('adds a tab to a screen', async () => {
      const mockTab = { id: 11, name: 'New Tab' };
      (ScreensService.addTab as jest.Mock).mockResolvedValue(mockTab);

      const result = await jiraService.addScreenTab(1, 'New Tab');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTab);
      expect(ScreensService.addTab).toHaveBeenCalledWith(1, { name: 'New Tab' });
    });

    it('renames a tab on a screen', async () => {
      const mockTab = { id: 10, name: 'Renamed Tab' };
      (ScreensService.renameTab as jest.Mock).mockResolvedValue(mockTab);

      const result = await jiraService.renameScreenTab(1, 10, 'Renamed Tab');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTab);
      expect(ScreensService.renameTab).toHaveBeenCalledWith(10, 1, { name: 'Renamed Tab' });
    });

    it('deletes a tab from a screen', async () => {
      (ScreensService.deleteTab as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteScreenTab(1, 10);

      expect(result.success).toBe(true);
      expect(ScreensService.deleteTab).toHaveBeenCalledWith(10, 1);
    });

    it('moves a tab on a screen', async () => {
      (ScreensService.moveTab as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveScreenTab(1, 10, 2);

      expect(result.success).toBe(true);
      expect(ScreensService.moveTab).toHaveBeenCalledWith(10, 1, 2);
    });

    it('handles errors', async () => {
      (ScreensService.deleteTab as jest.Mock).mockRejectedValue(
        new Error('Tab can not be deleted, there has to be at least one tab left')
      );

      const result = await jiraService.deleteScreenTab(1, 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Tab can not be deleted, there has to be at least one tab left');
    });
  });

  describe('screen tab fields', () => {
    it('gets all fields for a tab', async () => {
      const mockFields = [{ id: 'summary', name: 'Summary' }];
      (ScreensService.getAllFields as jest.Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getScreenTabFields(1, 10, 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(ScreensService.getAllFields).toHaveBeenCalledWith(10, 1, 'TEST');
    });

    it('adds a field to a tab', async () => {
      const mockField = { id: 'customfield_10001', name: 'Story Points' };
      (ScreensService.addField as jest.Mock).mockResolvedValue(mockField);

      const result = await jiraService.addFieldToScreenTab(1, 10, 'customfield_10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockField);
      expect(ScreensService.addField).toHaveBeenCalledWith(10, 1, { fieldId: 'customfield_10001' });
    });

    it('removes a field from a tab', async () => {
      (ScreensService.removeField as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeFieldFromScreenTab(1, 10, 'customfield_10001');

      expect(result.success).toBe(true);
      expect(ScreensService.removeField).toHaveBeenCalledWith(10, 1, 'customfield_10001');
    });

    it('moves a field on a tab', async () => {
      (ScreensService.moveField as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveScreenTabField(1, 10, 'customfield_10001', undefined, 'Last');

      expect(result.success).toBe(true);
      expect(ScreensService.moveField).toHaveBeenCalledWith(10, 1, 'customfield_10001', {
        after: undefined,
        position: 'Last',
      });
    });

    it("updates a field's show-when-empty indicator", async () => {
      (ScreensService.updateShowWhenEmptyIndicator as jest.Mock).mockResolvedValue(undefined);

      const result = await jiraService.updateScreenTabFieldShowWhenEmpty(1, 10, 'customfield_10001', true);

      expect(result.success).toBe(true);
      expect(ScreensService.updateShowWhenEmptyIndicator).toHaveBeenCalledWith(10, 1, true, 'customfield_10001');
    });

    it('handles errors', async () => {
      (ScreensService.addField as jest.Mock).mockRejectedValue(new Error('Field does not exist'));

      const result = await jiraService.addFieldToScreenTab(1, 10, 'not-a-field');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Field does not exist');
    });
  });

  describe('constructor base URL resolution', () => {
    it('builds BASE from host + default /rest when apiBasePath is missing', () => {
      new JiraService('jira.example.com', 'test-token');
      expect(OpenAPI.BASE).toBe('https://jira.example.com/rest');
    });

    it('strips accidentally-included /api/2 suffix from saved apiBasePath', () => {
      new JiraService('jira.example.com', 'test-token', '/rest/api/2');
      expect(OpenAPI.BASE).toBe('https://jira.example.com/rest');
    });

    it('accepts a fully-qualified apiBasePath as an override', () => {
      new JiraService('ignored.example.com', 'test-token', 'https://real.example.com/rest');
      expect(OpenAPI.BASE).toBe('https://real.example.com/rest');
    });
  });

  describe('validateConfig', () => {
    const originalEnv = process.env;
    const originalPlatform = process.platform;
    let tempDir: string;
    let tempHome: string;
    let homedirSpy: jest.SpyInstance;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.ATLASSIAN_DC_MCP_CONFIG_FILE;
      delete process.env.JIRA_API_TOKEN;
      delete process.env.JIRA_HOST;
      delete process.env.JIRA_API_BASE_PATH;
      delete process.env.JIRA_DEFAULT_PAGE_SIZE;
      tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-validate-config-home-'));
      homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tempHome);
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jira-validate-config-'));
      initializeRuntimeConfig({ cwd: tempDir });
    });

    afterEach(() => {
      homedirSpy.mockRestore();
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
      fs.rmSync(tempHome, { recursive: true, force: true });
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return empty array when all required env vars are present', () => {
      process.env.JIRA_API_TOKEN = 'test-token';
      process.env.JIRA_HOST = 'test-host';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should allow anonymous access when JIRA_API_TOKEN is missing', () => {
      delete process.env.JIRA_API_TOKEN;
      process.env.JIRA_HOST = 'test-host';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should return missing vars when both host options are missing', () => {
      process.env.JIRA_API_TOKEN = 'test-token';
      delete process.env.JIRA_HOST;
      delete process.env.JIRA_API_BASE_PATH;

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toContain('JIRA_HOST or JIRA_API_BASE_PATH');
    });

    it('should accept JIRA_API_BASE_PATH as alternative to JIRA_HOST', () => {
      process.env.JIRA_API_TOKEN = 'test-token';
      delete process.env.JIRA_HOST;
      process.env.JIRA_API_BASE_PATH = 'https://test-host/rest';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });

    it('should accept required config from the shared config file', () => {
      const sharedConfigPath = path.join(tempDir, 'shared.env');
      fs.writeFileSync(sharedConfigPath, 'JIRA_HOST=file-host\nJIRA_API_TOKEN=file-token\n');
      process.env.ATLASSIAN_DC_MCP_CONFIG_FILE = sharedConfigPath;

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toEqual([]);
    });
  });
});
