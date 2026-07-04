import { afterEach, beforeEach, describe, expect, it, vi, type Mock, type MockInstance } from 'vitest';
import { JiraService } from '../src/jiraService.js';
import {
  AttachmentService,
  IssueLinkService,
  IssueLinkTypeService,
  IssueService,
  WorklogService,
} from '../src/jiraClient/index.js';

vi.mock('../src/jiraClient/index.js', () => ({
  IssueService: {
    getIssueWorklog: vi.fn(),
    addWorklog: vi.fn(),
    getWorklog: vi.fn(),
    updateWorklog: vi.fn(),
    deleteWorklog: vi.fn(),
    addAttachment: vi.fn(),
    getRemoteIssueLinks: vi.fn(),
    getRemoteIssueLinkById: vi.fn(),
    createOrUpdateRemoteIssueLink: vi.fn(),
    updateRemoteIssueLink: vi.fn(),
    deleteRemoteIssueLinkById: vi.fn(),
    deleteRemoteIssueLinkByGlobalId: vi.fn(),
  },
  WorklogService: {
    getIdsOfWorklogsDeletedSince: vi.fn(),
    getIdsOfWorklogsModifiedSince: vi.fn(),
    getWorklogsForIds: vi.fn(),
  },
  AttachmentService: {
    getAttachmentMeta: vi.fn(),
    getAttachment: vi.fn(),
    removeAttachment: vi.fn(),
  },
  IssueLinkService: {
    linkIssues: vi.fn(),
    getIssueLink: vi.fn(),
    deleteIssueLink: vi.fn(),
  },
  IssueLinkTypeService: {
    getIssueLinkTypes: vi.fn(),
    createIssueLinkType: vi.fn(),
    updateIssueLinkType: vi.fn(),
    deleteIssueLinkType: vi.fn(),
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

  describe('worklogs', () => {
    it('gets all worklogs for an issue', async () => {
      const mockWorklogs = { worklogs: [{ id: '100', timeSpent: '3h' }] };
      (IssueService.getIssueWorklog as Mock).mockResolvedValue(mockWorklogs);

      const result = await jiraService.getIssueWorklogs(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklogs);
      expect(IssueService.getIssueWorklog).toHaveBeenCalledWith(mockIssueKey);
    });

    it('adds a worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '3h' };
      (IssueService.addWorklog as Mock).mockResolvedValue(mockWorklog);

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
      (IssueService.getWorklog as Mock).mockResolvedValue(mockWorklog);

      const result = await jiraService.getIssueWorklog(mockIssueKey, '100');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklog);
      expect(IssueService.getWorklog).toHaveBeenCalledWith(mockIssueKey, '100');
    });

    it('updates a worklog entry', async () => {
      const mockWorklog = { id: '100', timeSpent: '4h' };
      (IssueService.updateWorklog as Mock).mockResolvedValue(mockWorklog);

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
      (IssueService.deleteWorklog as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueWorklog(mockIssueKey, '100');

      expect(result.success).toBe(true);
      expect(IssueService.deleteWorklog).toHaveBeenCalledWith(mockIssueKey, '100');
    });

    it('handles errors', async () => {
      (IssueService.addWorklog as Mock).mockRejectedValue(new Error('Time tracking is disabled'));

      const result = await jiraService.addIssueWorklog(mockIssueKey, '3h');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Time tracking is disabled');
    });
  });
  describe('bulk worklog sync', () => {
    it('gets ids of worklogs deleted since a given time', async () => {
      const mockChanges = { values: [{ worklogId: 100, updatedTime: 123 }], lastPage: true };
      (WorklogService.getIdsOfWorklogsDeletedSince as Mock).mockResolvedValue(mockChanges);

      const result = await jiraService.getWorklogsDeletedSince(1000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChanges);
      expect(WorklogService.getIdsOfWorklogsDeletedSince).toHaveBeenCalledWith(1000);
    });

    it('handles errors getting ids of worklogs deleted since a given time', async () => {
      (WorklogService.getIdsOfWorklogsDeletedSince as Mock).mockRejectedValue(new Error('Invalid since parameter'));

      const result = await jiraService.getWorklogsDeletedSince(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid since parameter');
    });

    it('gets ids of worklogs modified since a given time', async () => {
      const mockChanges = { values: [{ worklogId: 100, updatedTime: 123 }], lastPage: true };
      (WorklogService.getIdsOfWorklogsModifiedSince as Mock).mockResolvedValue(mockChanges);

      const result = await jiraService.getWorklogsModifiedSince(1000);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChanges);
      expect(WorklogService.getIdsOfWorklogsModifiedSince).toHaveBeenCalledWith(1000);
    });

    it('handles errors getting ids of worklogs modified since a given time', async () => {
      (WorklogService.getIdsOfWorklogsModifiedSince as Mock).mockRejectedValue(new Error('Invalid since parameter'));

      const result = await jiraService.getWorklogsModifiedSince(-1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid since parameter');
    });

    it('gets worklogs for a batch of ids', async () => {
      const mockWorklogs = [{ id: '100', timeSpent: '3h' }];
      (WorklogService.getWorklogsForIds as Mock).mockResolvedValue(mockWorklogs);

      const result = await jiraService.getWorklogsForIds([100, 101]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockWorklogs);
      expect(WorklogService.getWorklogsForIds).toHaveBeenCalledWith({ ids: [100, 101] });
    });

    it('handles errors getting worklogs for a batch of ids', async () => {
      (WorklogService.getWorklogsForIds as Mock).mockRejectedValue(new Error('The request contains more than 1000 ids'));

      const result = await jiraService.getWorklogsForIds([100]);

      expect(result.success).toBe(false);
      expect(result.error).toBe('The request contains more than 1000 ids');
    });
  });
  describe('attachments', () => {
    it('adds an attachment with the file wrapped as a File', async () => {
      const mockAttachment = [{ id: '10001', filename: 'test.txt' }];
      (IssueService.addAttachment as Mock).mockResolvedValue(mockAttachment);

      const result = await jiraService.addIssueAttachment(mockIssueKey, 'test.txt', Buffer.from('hello').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAttachment);
      const [calledIssueKey, calledFormData] = (IssueService.addAttachment as Mock).mock.calls[0];
      expect(calledIssueKey).toBe(mockIssueKey);
      expect((calledFormData as { file: File }).file).toBeInstanceOf(File);
      expect((calledFormData as { file: File }).file.name).toBe('test.txt');
    });

    it('gets attachment capabilities', async () => {
      const mockMeta = { enabled: true, uploadLimit: 10485760 };
      (AttachmentService.getAttachmentMeta as Mock).mockResolvedValue(mockMeta);

      const result = await jiraService.getAttachmentMeta();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMeta);
    });

    it('gets attachment metadata by id', async () => {
      const mockAttachment = { id: '10001', filename: 'test.txt' };
      (AttachmentService.getAttachment as Mock).mockResolvedValue(mockAttachment);

      const result = await jiraService.getAttachment('10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAttachment);
      expect(AttachmentService.getAttachment).toHaveBeenCalledWith('10001');
    });

    it('deletes an attachment', async () => {
      (AttachmentService.removeAttachment as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAttachment('10001');

      expect(result.success).toBe(true);
      expect(AttachmentService.removeAttachment).toHaveBeenCalledWith('10001');
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
        (AttachmentService.getAttachment as Mock).mockResolvedValue(mockAttachment);
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
        (AttachmentService.getAttachment as Mock).mockResolvedValue({ id: '10001', filename: 'test.txt' });

        const result = await jiraService.getAttachmentContent('10001');

        expect(result.success).toBe(false);
        expect(result.error).toBe('Attachment metadata did not include a content URL');
        expect(fetchSpy).not.toHaveBeenCalled();
      });

      it('fails when the download request is not ok', async () => {
        (AttachmentService.getAttachment as Mock).mockResolvedValue({
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
      (IssueService.addAttachment as Mock).mockRejectedValue(new Error('Attachments are disabled'));

      const result = await jiraService.addIssueAttachment(mockIssueKey, 'test.txt', 'aGVsbG8=');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Attachments are disabled');
    });
  });
  describe('issue links', () => {
    it('links two issues', async () => {
      (IssueLinkService.linkIssues as Mock).mockResolvedValue(undefined);

      const result = await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'Blocks');

      expect(result.success).toBe(true);
      expect(IssueLinkService.linkIssues).toHaveBeenCalledWith({
        inwardIssue: { key: 'PROJ-1' },
        outwardIssue: { key: 'PROJ-2' },
        type: { name: 'Blocks' },
      });
    });

    it('includes an optional comment', async () => {
      (IssueLinkService.linkIssues as Mock).mockResolvedValue(undefined);

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
      (IssueLinkService.getIssueLink as Mock).mockResolvedValue(mockLink);

      const result = await jiraService.getIssueLink('1000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(IssueLinkService.getIssueLink).toHaveBeenCalledWith('1000');
    });

    it('deletes an issue link', async () => {
      (IssueLinkService.deleteIssueLink as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueLink('1000');

      expect(result.success).toBe(true);
      expect(IssueLinkService.deleteIssueLink).toHaveBeenCalledWith('1000');
    });

    it('handles errors when the link type is unknown', async () => {
      (IssueLinkService.linkIssues as Mock).mockRejectedValue(new Error('Could not find issue link type'));

      const result = await jiraService.linkIssues('PROJ-1', 'PROJ-2', 'NoSuchType');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Could not find issue link type');
    });
  });
  describe('remote issue links', () => {
    it('gets remote issue links for an issue', async () => {
      const mockLinks = [{ id: 1, object: { url: 'https://example.com' } }];
      (IssueService.getRemoteIssueLinks as Mock).mockResolvedValue(mockLinks);

      const result = await jiraService.getRemoteIssueLinks(mockIssueKey);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLinks);
      expect(IssueService.getRemoteIssueLinks).toHaveBeenCalledWith(mockIssueKey, undefined);
    });

    it('filters remote issue links by globalId', async () => {
      (IssueService.getRemoteIssueLinks as Mock).mockResolvedValue([]);

      await jiraService.getRemoteIssueLinks(mockIssueKey, 'system=https://example.com');

      expect(IssueService.getRemoteIssueLinks).toHaveBeenCalledWith(mockIssueKey, 'system=https://example.com');
    });

    it('gets a single remote issue link by id', async () => {
      const mockLink = { id: 1, object: { url: 'https://example.com' } };
      (IssueService.getRemoteIssueLinkById as Mock).mockResolvedValue(mockLink);

      const result = await jiraService.getRemoteIssueLink(mockIssueKey, '1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(IssueService.getRemoteIssueLinkById).toHaveBeenCalledWith('1', mockIssueKey);
    });

    it('creates a remote issue link with the minimal fields', async () => {
      const mockLink = { id: 1 };
      (IssueService.createOrUpdateRemoteIssueLink as Mock).mockResolvedValue(mockLink);

      const result = await jiraService.createOrUpdateRemoteIssueLink(mockIssueKey, {
        url: 'https://example.com/page',
        title: 'Example page',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockLink);
      expect(IssueService.createOrUpdateRemoteIssueLink).toHaveBeenCalledWith(mockIssueKey, {
        object: { url: 'https://example.com/page', title: 'Example page' },
      });
    });

    it('creates a remote issue link with all optional fields', async () => {
      (IssueService.createOrUpdateRemoteIssueLink as Mock).mockResolvedValue({ id: 1 });

      await jiraService.createOrUpdateRemoteIssueLink(mockIssueKey, {
        url: 'https://example.com/page',
        title: 'Example page',
        summary: 'A summary',
        globalId: 'system=https://example.com',
        relationship: 'documented by',
        applicationName: 'My App',
        applicationType: 'com.example.app',
      });

      expect(IssueService.createOrUpdateRemoteIssueLink).toHaveBeenCalledWith(mockIssueKey, {
        globalId: 'system=https://example.com',
        relationship: 'documented by',
        object: { url: 'https://example.com/page', title: 'Example page', summary: 'A summary' },
        application: { name: 'My App', type: 'com.example.app' },
      });
    });

    it('updates a remote issue link by id', async () => {
      (IssueService.updateRemoteIssueLink as Mock).mockResolvedValue(undefined);

      const result = await jiraService.updateRemoteIssueLink(mockIssueKey, '1', {
        url: 'https://example.com/page',
        title: 'Updated title',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ updated: true, linkId: '1' });
      expect(IssueService.updateRemoteIssueLink).toHaveBeenCalledWith('1', mockIssueKey, {
        object: { url: 'https://example.com/page', title: 'Updated title' },
      });
    });

    it('deletes a remote issue link by id', async () => {
      (IssueService.deleteRemoteIssueLinkById as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRemoteIssueLink(mockIssueKey, '1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, linkId: '1' });
      expect(IssueService.deleteRemoteIssueLinkById).toHaveBeenCalledWith('1', mockIssueKey);
    });

    it('deletes a remote issue link by globalId', async () => {
      (IssueService.deleteRemoteIssueLinkByGlobalId as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteRemoteIssueLinkByGlobalId(mockIssueKey, 'system=https://example.com');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, globalId: 'system=https://example.com' });
      expect(IssueService.deleteRemoteIssueLinkByGlobalId).toHaveBeenCalledWith(mockIssueKey, 'system=https://example.com');
    });

    it('handles API errors', async () => {
      (IssueService.getRemoteIssueLinks as Mock).mockRejectedValue(new Error('Issue linking is disabled'));

      const result = await jiraService.getRemoteIssueLinks(mockIssueKey);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Issue linking is disabled');
    });
  });
  describe('issue link types', () => {
    it('gets issue link types', async () => {
      const mockTypes = { issueLinkTypes: [{ id: '10000', name: 'Blocks' }] };
      (IssueLinkTypeService.getIssueLinkTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getIssueLinkTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
    });

    it('creates an issue link type', async () => {
      const mockType = { id: '10000', name: 'Blocks' };
      (IssueLinkTypeService.createIssueLinkType as Mock).mockResolvedValue(mockType);

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
      (IssueLinkTypeService.updateIssueLinkType as Mock).mockResolvedValue(mockType);

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
      (IssueLinkTypeService.deleteIssueLinkType as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteIssueLinkType('10000');

      expect(result.success).toBe(true);
      expect(IssueLinkTypeService.deleteIssueLinkType).toHaveBeenCalledWith('10000');
    });

    it('handles errors', async () => {
      (IssueLinkTypeService.deleteIssueLinkType as Mock).mockRejectedValue(new Error('No issue link type with the given id exists'));

      const result = await jiraService.deleteIssueLinkType('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No issue link type with the given id exists');
    });
  });
});
