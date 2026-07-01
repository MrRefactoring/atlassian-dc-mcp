import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from '@mrrefactoring/atlassian-dc-mcp-core';
import { JiraService } from '../jira-service.js';
import {
  AttachmentService,
  IssueLinkService,
  IssueService,
  IssuetypeService,
  OpenAPI,
  PriorityService,
  ProjectService,
  ProjectsService,
  ResolutionService,
  SearchService,
  StatusService,
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
  SearchService: {
    searchUsingSearchRequest: jest.fn(),
  },
  ProjectService: {
    getAllProjects: jest.fn(),
    getProject: jest.fn(),
    getProjectComponents: jest.fn(),
    getProjectVersions: jest.fn(),
  },
  ProjectsService: {
    searchForProjects: jest.fn(),
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

    it('should return missing vars when JIRA_API_TOKEN is missing', () => {
      delete process.env.JIRA_API_TOKEN;
      process.env.JIRA_HOST = 'test-host';

      const missingVars = JiraService.validateConfig();
      expect(missingVars).toContain('JIRA_API_TOKEN');
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
