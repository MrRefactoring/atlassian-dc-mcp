import { afterEach, beforeEach, describe, expect, it, vi, type Mock, type MockInstance } from 'vitest';
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

  describe('worklogs', () => {
    it('gets all worklogs for an issue', async () => {
      const mockWorklogs = { worklogs: [{ id: '100', timeSpent: '3h' }] };
      (jira.issues.getIssueWorklog as Mock).mockResolvedValue(mockWorklogs);

      const result = await jiraService.getIssueWorklogs(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklogs);
      expect(jira.issues.getIssueWorklog).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('adds a worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '3h' };
      (jira.issues.addWorklog as Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.addIssueWorklog(mockIssueKey, '3h', 'Fixed the bug');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(jira.issues.addWorklog).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: {
        timeSpent: '3h',
        comment: 'Fixed the bug',
        started: undefined,
      } });
    });

    it('gets a single worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '3h' };
      (jira.issues.getWorklog as Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.getIssueWorklog(mockIssueKey, '100');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(jira.issues.getWorklog).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, id: '100' });
    });

    it('updates a worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '4h' };
      (jira.issues.updateWorklog as Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.updateIssueWorklog(mockIssueKey, '100', '4h');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(jira.issues.updateWorklog).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, id: '100', requestBody: {
        timeSpent: '4h',
        comment: undefined,
        started: undefined,
      } });
    });

    it('deletes a worklog entry', async () => {
      (jira.issues.deleteWorklog as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueWorklog(mockIssueKey, '100');

      expect(result.success).toBe(true);
      expect(jira.issues.deleteWorklog).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, id: '100' });
    });

    it('handles errors', async () => {
      (jira.issues.addWorklog as Mock).mockRejectedValue(new Error('Time tracking is disabled'));

      const result = await jiraService.addIssueWorklog(mockIssueKey, '3h');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Time tracking is disabled');
    });
  });
  describe('bulk worklog sync', () => {
    it('gets ids of worklogs deleted since a given time', async () => {
      const mockChanges = { values: [{ worklogId: 100, updatedTime: 123 }], lastPage: true };
      (jira.issues.getIdsOfWorklogsDeletedSince as Mock).mockResolvedValue(mockChanges);

      const result = await jiraService.getWorklogsDeletedSince(1000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChanges);
      expect(jira.issues.getIdsOfWorklogsDeletedSince).toHaveBeenCalledWith({ since: 1000 });
    });

    it('handles errors getting ids of worklogs deleted since a given time', async () => {
      (jira.issues.getIdsOfWorklogsDeletedSince as Mock).mockRejectedValue(new Error('Invalid since parameter'));

      const result = await jiraService.getWorklogsDeletedSince(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid since parameter');
    });

    it('gets ids of worklogs modified since a given time', async () => {
      const mockChanges = { values: [{ worklogId: 100, updatedTime: 123 }], lastPage: true };
      (jira.issues.getIdsOfWorklogsModifiedSince as Mock).mockResolvedValue(mockChanges);

      const result = await jiraService.getWorklogsModifiedSince(1000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChanges);
      expect(jira.issues.getIdsOfWorklogsModifiedSince).toHaveBeenCalledWith({ since: 1000 });
    });

    it('handles errors getting ids of worklogs modified since a given time', async () => {
      (jira.issues.getIdsOfWorklogsModifiedSince as Mock).mockRejectedValue(new Error('Invalid since parameter'));

      const result = await jiraService.getWorklogsModifiedSince(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid since parameter');
    });

    it('gets worklogs for a batch of ids', async () => {
      const mockWorklogs = [{ id: '100', timeSpent: '3h' }];
      (jira.issues.getWorklogsForIds as Mock).mockResolvedValue(mockWorklogs);

      const result = await jiraService.getWorklogsForIds([100, 101]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklogs);
      expect(jira.issues.getWorklogsForIds).toHaveBeenCalledWith({ requestBody: { ids: [100, 101] } });
    });

    it('handles errors getting worklogs for a batch of ids', async () => {
      (jira.issues.getWorklogsForIds as Mock).mockRejectedValue(new Error('The request contains more than 1000 ids'));

      const result = await jiraService.getWorklogsForIds([100]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The request contains more than 1000 ids');
    });
  });
  describe('attachments', () => {
    it('adds an attachment with the file wrapped as a File', async () => {
      const mockAttachment = [{ id: '10001', filename: 'test.txt' }];
      (jira.issues.addAttachment as Mock).mockResolvedValue(mockAttachment);

      const result = await jiraService.addIssueAttachment(mockIssueKey, 'test.txt', Buffer.from('hello').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAttachment);
      const [params] = (jira.issues.addAttachment as Mock).mock.calls[0] as [{ issueIdOrKey: string; formData: { file: File } }];
      expect(params.issueIdOrKey).toBe(mockIssueKey);
      expect(params.formData.file).toBeInstanceOf(File);
      expect(params.formData.file.name).toBe('test.txt');
    });

    it('gets attachment capabilities', async () => {
      const mockMeta = { enabled: true, uploadLimit: 10485760 };
      (jira.issues.getAttachmentMeta as Mock).mockResolvedValue(mockMeta);

      const result = await jiraService.getAttachmentMeta();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMeta);
    });

    it('gets attachment metadata by id', async () => {
      const mockAttachment = { id: '10001', filename: 'test.txt' };
      (jira.issues.getAttachment as Mock).mockResolvedValue(mockAttachment);

      const result = await jiraService.getAttachment('10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAttachment);
      expect(jira.issues.getAttachment).toHaveBeenCalledWith({ id: '10001' });
    });

    it('deletes an attachment', async () => {
      (jira.issues.removeAttachment as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAttachment('10001');

      expect(result.success).toBe(true);
      expect(jira.issues.removeAttachment).toHaveBeenCalledWith({ id: '10001' });
    });

    describe('getAttachmentContent', () => {
      let fetchSpy: MockInstance<typeof fetch>;

      beforeEach(() => {
        fetchSpy = vi.spyOn(global, 'fetch');
      });

      afterEach(() => {
        fetchSpy.mockRestore();
      });

      it('downloads and base64-encodes the attachment content', async () => {
        const mockAttachment = {
          id: '10001',
          filename: 'test.txt',
          mimeType: 'text/plain',
          size: 5,
          content: 'https://jira.example.com/secure/attachment/10001/test.txt',
        };
        (jira.issues.getAttachment as Mock).mockResolvedValue(mockAttachment);
        fetchSpy.mockResolvedValue({
          ok: true,
          arrayBuffer: async () => Buffer.from('hello'),
        } as unknown as Response);

        const result = await jiraService.getAttachmentContent('10001');

        expect(result.success).toBe(true);
        expect(result.data).toEqual({
          filename: 'test.txt',
          mimeType: 'text/plain',
          size: 5,
          contentBase64: Buffer.from('hello').toString('base64'),
        });
        expect(fetchSpy).toHaveBeenCalledWith(mockAttachment.content, expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }));
      });

      it('fails when the attachment metadata has no content URL', async () => {
        (jira.issues.getAttachment as Mock).mockResolvedValue({ id: '10001', filename: 'test.txt' });

        const result = await jiraService.getAttachmentContent('10001');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Attachment metadata did not include a content URL');
        expect(fetchSpy).not.toHaveBeenCalled();
      });

      it('fails when the download request is not ok', async () => {
        (jira.issues.getAttachment as Mock).mockResolvedValue({
          id: '10001',
          content: 'https://jira.example.com/secure/attachment/10001/test.txt',
        });
        fetchSpy.mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' } as unknown as Response);

        const result = await jiraService.getAttachmentContent('10001');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Failed to download attachment content: 404 Not Found');
      });
    });

    it('handles errors when attachments are disabled', async () => {
      (jira.issues.addAttachment as Mock).mockRejectedValue(new Error('Attachments are disabled'));

      const result = await jiraService.addIssueAttachment(mockIssueKey, 'test.txt', 'aGVsbG8=');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Attachments are disabled');
    });
  });
  describe('issue links', () => {
    it('links two issues', async () => {
      (jira.issues.linkIssues as Mock).mockResolvedValue(undefined);

      const result = await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'Blocks');

      expect(result.success).toBe(true);
      expect(jira.issues.linkIssues).toHaveBeenCalledWith({ requestBody: {
        inwardIssue: { key: 'PROJ-1' },
        outwardIssue: { key: 'PROJ-2' },
        type: { name: 'Blocks' },
      } });
    });

    it('includes an optional comment', async () => {
      (jira.issues.linkIssues as Mock).mockResolvedValue(undefined);

      await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'Blocks', 'Linked during triage');

      expect(jira.issues.linkIssues).toHaveBeenCalledWith({ requestBody: {
        inwardIssue: { key: 'PROJ-1' },
        outwardIssue: { key: 'PROJ-2' },
        type: { name: 'Blocks' },
        comment: { body: 'Linked during triage' },
      } });
    });

    it('gets an issue link', async () => {
      const mockLink = { id: '1000', type: { name: 'Blocks' } };
      (jira.issues.getIssueLink as Mock).mockResolvedValue(mockLink);

      const result = await jiraService.getIssueLink('1000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(jira.issues.getIssueLink).toHaveBeenCalledWith({ linkId: '1000' });
    });

    it('deletes an issue link', async () => {
      (jira.issues.deleteIssueLink as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueLink('1000');

      expect(result.success).toBe(true);
      expect(jira.issues.deleteIssueLink).toHaveBeenCalledWith({ linkId: '1000' });
    });

    it('handles errors when the link type is unknown', async () => {
      (jira.issues.linkIssues as Mock).mockRejectedValue(new Error('Could not find issue link type'));

      const result = await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'NoSuchType');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Could not find issue link type');
    });
  });
  describe('remote issue links', () => {
    it('gets remote issue links for an issue', async () => {
      const mockLinks = [{ id: 1, object: { url: 'https://example.com' } }];
      (jira.issues.getRemoteIssueLinks as Mock).mockResolvedValue(mockLinks);

      const result = await jiraService.getRemoteIssueLinks(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLinks);
      expect(jira.issues.getRemoteIssueLinks).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey });
    });

    it('filters remote issue links by globalId', async () => {
      (jira.issues.getRemoteIssueLinks as Mock).mockResolvedValue([]);

      await jiraService.getRemoteIssueLinks(mockIssueKey, 'system=https://example.com');

      expect(jira.issues.getRemoteIssueLinks).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, globalId: 'system=https://example.com' });
    });

    it('gets a single remote issue link by id', async () => {
      const mockLink = { id: 1, object: { url: 'https://example.com' } };
      (jira.issues.getRemoteIssueLinkById as Mock).mockResolvedValue(mockLink);

      const result = await jiraService.getRemoteIssueLink(mockIssueKey, '1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(jira.issues.getRemoteIssueLinkById).toHaveBeenCalledWith({ linkId: '1', issueIdOrKey: mockIssueKey });
    });

    it('creates a remote issue link with the minimal fields', async () => {
      const mockLink = { id: 1 };
      (jira.issues.createOrUpdateRemoteIssueLink as Mock).mockResolvedValue(mockLink);

      const result = await jiraService.createOrUpdateRemoteIssueLink(mockIssueKey, {
        url: 'https://example.com/page',
        title: 'Example page',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(jira.issues.createOrUpdateRemoteIssueLink).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: {
        object: { url: 'https://example.com/page', title: 'Example page' },
      } });
    });

    it('creates a remote issue link with all optional fields', async () => {
      (jira.issues.createOrUpdateRemoteIssueLink as Mock).mockResolvedValue({ id: 1 });

      await jiraService.createOrUpdateRemoteIssueLink(mockIssueKey, {
        url: 'https://example.com/page',
        title: 'Example page',
        summary: 'A summary',
        globalId: 'system=https://example.com',
        relationship: 'documented by',
        applicationName: 'My App',
        applicationType: 'com.example.app',
      });

      expect(jira.issues.createOrUpdateRemoteIssueLink).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, requestBody: {
        globalId: 'system=https://example.com',
        relationship: 'documented by',
        object: { url: 'https://example.com/page', title: 'Example page', summary: 'A summary' },
        application: { name: 'My App', type: 'com.example.app' },
      } });
    });

    it('updates a remote issue link by id', async () => {
      (jira.issues.updateRemoteIssueLink as Mock).mockResolvedValue(undefined);

      const result = await jiraService.updateRemoteIssueLink(mockIssueKey, '1', {
        url: 'https://example.com/page',
        title: 'Updated title',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ updated: true, linkId: '1' });
      expect(jira.issues.updateRemoteIssueLink).toHaveBeenCalledWith({ linkId: '1', issueIdOrKey: mockIssueKey, requestBody: {
        object: { url: 'https://example.com/page', title: 'Updated title' },
      } });
    });

    it('deletes a remote issue link by id', async () => {
      (jira.issues.deleteRemoteIssueLinkById as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRemoteIssueLink(mockIssueKey, '1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, linkId: '1' });
      expect(jira.issues.deleteRemoteIssueLinkById).toHaveBeenCalledWith({ linkId: '1', issueIdOrKey: mockIssueKey });
    });

    it('deletes a remote issue link by globalId', async () => {
      (jira.issues.deleteRemoteIssueLinkByGlobalId as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRemoteIssueLinkByGlobalId(mockIssueKey, 'system=https://example.com');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, globalId: 'system=https://example.com' });
      expect(jira.issues.deleteRemoteIssueLinkByGlobalId).toHaveBeenCalledWith({ issueIdOrKey: mockIssueKey, globalId: 'system=https://example.com' });
    });

    it('handles API errors', async () => {
      (jira.issues.getRemoteIssueLinks as Mock).mockRejectedValue(new Error('Issue linking is disabled'));

      const result = await jiraService.getRemoteIssueLinks(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue linking is disabled');
    });
  });
  describe('issue link types', () => {
    it('gets issue link types', async () => {
      const mockTypes = { issueLinkTypes: [{ id: '10000', name: 'Blocks' }] };
      (jira.issues.getIssueLinkTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getIssueLinkTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
    });

    it('creates an issue link type', async () => {
      const mockType = { id: '10000', name: 'Blocks' };
      (jira.issues.createIssueLinkType as Mock).mockResolvedValue(mockType);

      const result = await jiraService.createIssueLinkType('Blocks', 'is blocked by', 'blocks');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockType);
      expect(jira.issues.createIssueLinkType).toHaveBeenCalledWith({ requestBody: {
        name: 'Blocks',
        inward: 'is blocked by',
        outward: 'blocks',
      } });
    });

    it('updates an issue link type', async () => {
      const mockType = { id: '10000', name: 'Blocks v2' };
      (jira.issues.updateIssueLinkType as Mock).mockResolvedValue(mockType);

      const result = await jiraService.updateIssueLinkType('10000', 'Blocks v2');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockType);
      expect(jira.issues.updateIssueLinkType).toHaveBeenCalledWith({ issueLinkTypeId: '10000', requestBody: {
        name: 'Blocks v2',
        inward: undefined,
        outward: undefined,
      } });
    });

    it('deletes an issue link type', async () => {
      (jira.issues.deleteIssueLinkType as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueLinkType('10000');

      expect(result.success).toBe(true);
      expect(jira.issues.deleteIssueLinkType).toHaveBeenCalledWith({ issueLinkTypeId: '10000' });
    });

    it('handles errors', async () => {
      (jira.issues.deleteIssueLinkType as Mock).mockRejectedValue(new Error('No issue link type with the given id exists'));

      const result = await jiraService.deleteIssueLinkType('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No issue link type with the given id exists');
    });
  });
});
