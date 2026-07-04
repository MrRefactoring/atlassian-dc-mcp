import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { request as __request } from '../src/jira-client/core/request.js';
import { JiraService } from '../src/jira-service.js';
import {
  IssueService,
  OpenAPI,
  SearchService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/core/request.js', () => ({
  request: vi.fn(),
  resolve: vi.fn(async (_options: unknown, resolver: unknown) =>
    typeof resolver === 'function' ? (resolver as () => unknown)() : resolver
  ),
}));

vi.mock('../src/jira-client/index.js', () => ({
  SearchService: {
    searchUsingSearchRequest: vi.fn(),
  },
  IssueService: {
    getIssue: vi.fn(),
    getComments: vi.fn(),
    createIssues: vi.fn(),
    archiveIssues: vi.fn(),
    archiveIssue: vi.fn(),
    restoreIssue: vi.fn(),
    rankIssues: vi.fn(),
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
    vi.clearAllMocks();
  });

  describe('token optimization paths', () => {
    it('uses the default field profile and page size for search', async () => {
      const mockSearchResults = { issues: [] };
      (SearchService.searchUsingSearchRequest as Mock).mockResolvedValue(mockSearchResults);

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
      (SearchService.searchUsingSearchRequest as Mock).mockResolvedValue(mockSearchResults);

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
      (IssueService.getIssue as Mock).mockResolvedValue(mockIssue);

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
      (IssueService.getIssue as Mock).mockResolvedValue({ key: mockIssueKey });

      await jiraService.getIssue(mockIssueKey, 'renderedFields', ['summary', 'status']);

      expect(IssueService.getIssue).toHaveBeenCalledWith(mockIssueKey, 'renderedFields', ['summary', 'status']);
    });

    it('uses the package default page size for issue comments', async () => {
      const mockComments = { comments: [] };
      (IssueService.getComments as Mock).mockResolvedValue(mockComments);

      const result = await jiraService.getIssueComments(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComments);
      expect(IssueService.getComments).toHaveBeenCalledWith(mockIssueKey, undefined, '25', undefined, undefined);
    });

    it('forwards explicit issue comment pagination', async () => {
      (IssueService.getComments as Mock).mockResolvedValue({ comments: [] });

      await jiraService.getIssueComments(mockIssueKey, 'renderedBody', 10, 20);

      expect(IssueService.getComments).toHaveBeenCalledWith(mockIssueKey, 'renderedBody', '10', undefined, '20');
    });
  });
  describe('getIssueDevelopmentInfo', () => {
    it('resolves the numeric issue id then requests pull requests by default', async () => {
      const mockDevInfo = { detail: [{ pullRequests: [] }] };
      (IssueService.getIssue as Mock).mockResolvedValue({ id: '1314681', key: mockIssueKey });
      (__request as Mock).mockResolvedValue(mockDevInfo);

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
      (IssueService.getIssue as Mock).mockResolvedValue({ id: '42' });
      (__request as Mock).mockResolvedValue({});

      await jiraService.getIssueDevelopmentInfo(mockIssueKey, 'repository', 'github');

      expect(__request).toHaveBeenCalledWith(OpenAPI, {
        method: 'GET',
        url: '/dev-status/1.0/issue/detail',
        query: { issueId: '42', applicationType: 'github', dataType: 'repository' },
      });
    });

    it('fails without calling dev-status when the numeric id is missing', async () => {
      (IssueService.getIssue as Mock).mockResolvedValue({ key: mockIssueKey });

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe(`Could not resolve numeric id for issue ${mockIssueKey}`);
      expect(__request).not.toHaveBeenCalled();
    });

    it('surfaces dev-status request errors', async () => {
      (IssueService.getIssue as Mock).mockResolvedValue({ id: '1314681' });
      (__request as Mock).mockRejectedValue(new Error('View Development Tools permission required'));

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('View Development Tools permission required');
    });
  });
  describe('bulk and rank operations', () => {
    it('bulk creates issues', async () => {
      const mockResponse = { issues: [{ id: '10001', key: 'PROJ-1' }] };
      (IssueService.createIssues as Mock).mockResolvedValue(mockResponse);

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
      (IssueService.archiveIssues as Mock).mockResolvedValue({ numberOfIssuesUpdated: 3 });

      const result = await jiraService.archiveIssues('project = TEST AND resolution = Fixed');

      expect(result.success).toBe(true);
      expect(IssueService.archiveIssues).toHaveBeenCalledWith(undefined, 'project = TEST AND resolution = Fixed');
    });

    it('archives a single issue', async () => {
      (IssueService.archiveIssue as Mock).mockResolvedValue(undefined);

      const result = await jiraService.archiveIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(IssueService.archiveIssue).toHaveBeenCalledWith(mockIssueKey, undefined);
    });

    it('restores an archived issue', async () => {
      (IssueService.restoreIssue as Mock).mockResolvedValue(undefined);

      const result = await jiraService.restoreIssue(mockIssueKey, true);

      expect(result.success).toBe(true);
      expect(IssueService.restoreIssue).toHaveBeenCalledWith(mockIssueKey, 'true');
    });

    it('handles errors restoring an archived issue', async () => {
      (IssueService.restoreIssue as Mock).mockRejectedValue(new Error('The issue is not archived'));

      const result = await jiraService.restoreIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The issue is not archived');
    });

    it('ranks issues', async () => {
      (IssueService.rankIssues as Mock).mockResolvedValue({ success: true });

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
      (IssueService.rankIssues as Mock).mockRejectedValue(new Error('User does not have permission to rank'));

      const result = await jiraService.rankIssues(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to rank');
    });
  });
});
