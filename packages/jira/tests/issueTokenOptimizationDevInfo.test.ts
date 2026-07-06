import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const jira = vi.hoisted(() => {
  const group = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return { issues: group(), projects: group(), users: group(), workflows: group(), agile: group(), admin: group(), request: vi.fn() };
});
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient: () => jira }));

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
      (jira.issues.searchByJql as Mock).mockResolvedValue(mockSearchResults);

      const result = await jiraService.searchIssues('project = TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSearchResults);
      expect(jira.issues.searchByJql).toHaveBeenCalledWith({ requestBody: {
        jql: 'project = TEST',
        maxResults: 25,
        fields: ['summary', 'description', 'status', 'assignee', 'reporter', 'priority', 'issuetype', 'labels', 'updated'],
        expand: undefined,
        startAt: undefined,
      } });
    });

    it('honors explicit search fields and maxResults', async () => {
      const mockSearchResults = { issues: [] };
      (jira.issues.searchByJql as Mock).mockResolvedValue(mockSearchResults);

      await jiraService.searchIssues('project = TEST', 20, ['changelog'], 5, ['summary', 'status']);

      expect(jira.issues.searchByJql).toHaveBeenCalledWith({ requestBody: {
        jql: 'project = TEST',
        maxResults: 5,
        fields: ['summary', 'status'],
        expand: ['changelog'],
        startAt: 20,
      } });
    });

    it('uses the richer default field profile for single issue reads', async () => {
      const mockIssue = { key: mockIssueKey };
      (jira.issues.getIssue as Mock).mockResolvedValue(mockIssue);

      const result = await jiraService.getIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIssue);
      expect(jira.issues.getIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, fields: [
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
      ] });
    });

    it('honors explicit issue fields', async () => {
      (jira.issues.getIssue as Mock).mockResolvedValue({ key: mockIssueKey });

      await jiraService.getIssue(mockIssueKey, 'renderedFields', ['summary', 'status']);

      expect(jira.issues.getIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, expand: 'renderedFields', fields: ['summary', 'status'] });
    });

    it('uses the package default page size for issue comments', async () => {
      const mockComments = { comments: [] };
      (jira.issues.getComments as Mock).mockResolvedValue(mockComments);

      const result = await jiraService.getIssueComments(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComments);
      expect(jira.issues.getComments).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, maxResults: '25' });
    });

    it('forwards explicit issue comment pagination', async () => {
      (jira.issues.getComments as Mock).mockResolvedValue({ comments: [] });

      await jiraService.getIssueComments(mockIssueKey, 'renderedBody', 10, 20);

      expect(jira.issues.getComments).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, expand: 'renderedBody', maxResults: '10', startAt: '20' });
    });
  });
  describe('getIssueDevelopmentInfo', () => {
    it('resolves the numeric issue id then requests pull requests by default', async () => {
      const mockDevInfo = { detail: [{ pullRequests: [] }] };
      (jira.issues.getIssue as Mock).mockResolvedValue({ id: '1314681', key: mockIssueKey });
      (jira.request as Mock).mockResolvedValue(mockDevInfo);

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDevInfo);
      expect(jira.issues.getIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, fields: ['id'] });
      expect(jira.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/dev-status/1.0/issue/detail',
        searchParams: { issueId: '1314681', applicationType: 'stash', dataType: 'pullrequest' },
      });
    });

    it('honors explicit dataType and applicationType', async () => {
      (jira.issues.getIssue as Mock).mockResolvedValue({ id: '42' });
      (jira.request as Mock).mockResolvedValue({});

      await jiraService.getIssueDevelopmentInfo(mockIssueKey, 'repository', 'github');

      expect(jira.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/dev-status/1.0/issue/detail',
        searchParams: { issueId: '42', applicationType: 'github', dataType: 'repository' },
      });
    });

    it('fails without calling dev-status when the numeric id is missing', async () => {
      (jira.issues.getIssue as Mock).mockResolvedValue({ key: mockIssueKey });

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe(`Could not resolve numeric id for issue ${mockIssueKey}`);
      expect(jira.request).not.toHaveBeenCalled();
    });

    it('surfaces dev-status request errors', async () => {
      (jira.issues.getIssue as Mock).mockResolvedValue({ id: '1314681' });
      (jira.request as Mock).mockRejectedValue(new Error('View Development Tools permission required'));

      const result = await jiraService.getIssueDevelopmentInfo(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('View Development Tools permission required');
    });
  });
  describe('bulk and rank operations', () => {
    it('bulk creates issues', async () => {
      const mockResponse = { issues: [{ id: '10001', key: 'PROJ-1' }] };
      (jira.issues.createIssues as Mock).mockResolvedValue(mockResponse);

      const result = await jiraService.createIssues([
        { projectId: 'TEST', summary: 'First', description: 'desc', issueTypeId: '10001' },
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResponse);
      expect(jira.issues.createIssues).toHaveBeenCalledWith({ requestBody: {
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
      } });
    });

    it('bulk archives issues by JQL', async () => {
      (jira.issues.archiveIssues as Mock).mockResolvedValue({ numberOfIssuesUpdated: 3 });

      const result = await jiraService.archiveIssues('project = TEST AND resolution = Fixed');

      expect(result.success).toBe(true);
      expect(jira.issues.archiveIssues).toHaveBeenCalledWith({ requestBody: 'project = TEST AND resolution = Fixed' });
    });

    it('archives a single issue', async () => {
      (jira.issues.archiveIssue as Mock).mockResolvedValue(undefined);

      const result = await jiraService.archiveIssue(mockIssueKey);

      expect(result.success).toBe(true);
      expect(jira.issues.archiveIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('restores an archived issue', async () => {
      (jira.issues.restoreIssue as Mock).mockResolvedValue(undefined);

      const result = await jiraService.restoreIssue(mockIssueKey, true);

      expect(result.success).toBe(true);
      expect(jira.issues.restoreIssue).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, notifyUsers: 'true' });
    });

    it('handles errors restoring an archived issue', async () => {
      (jira.issues.restoreIssue as Mock).mockRejectedValue(new Error('The issue is not archived'));

      const result = await jiraService.restoreIssue(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The issue is not archived');
    });

    it('ranks issues', async () => {
      (jira.issues.rankIssues as Mock).mockResolvedValue({ success: true });

      const result = await jiraService.rankIssues(['PROJ-1', 'PROJ-2'], 'PROJ-3');

      expect(result.success).toBe(true);
      expect(jira.issues.rankIssues).toHaveBeenCalledWith({ requestBody: {
        issues: ['PROJ-1', 'PROJ-2'],
        rankBeforeIssue: 'PROJ-3',
        rankAfterIssue: undefined,
        rankCustomFieldId: undefined,
      } });
    });

    it('handles errors', async () => {
      (jira.issues.rankIssues as Mock).mockRejectedValue(new Error('User does not have permission to rank'));

      const result = await jiraService.rankIssues(['PROJ-1']);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User does not have permission to rank');
    });
  });
});
