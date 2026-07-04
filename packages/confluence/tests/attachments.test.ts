import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { AttachmentsService } from '../src/confluence-client/index.js';
import { ConfluenceService } from '../src/confluence-service.js';

const ATTACHMENTS = AttachmentsService as unknown as Record<string, Mock>;

vi.mock('../src/confluence-client/index.js', () => ({
  AttachmentsService: {
    getAttachments: vi.fn(),
    createAttachments: vi.fn(),
    update: vi.fn(),
    updateData: vi.fn(),
    move: vi.fn(),
    removeAttachment: vi.fn(),
    removeAttachmentVersion: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
}));

describe('ConfluenceService attachments', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('lists attachments with the default page-size limit and filters', async () => {
    ATTACHMENTS.getAttachments.mockResolvedValue({ results: [] });

    await service.getAttachments('123', 'version', 'diagram.png', undefined, undefined, 'image/png');

    expect(ATTACHMENTS.getAttachments).toHaveBeenCalledWith('123', 'version', 'diagram.png', '25', undefined, 'image/png');
  });

  it('removes an attachment', async () => {
    ATTACHMENTS.removeAttachment.mockResolvedValue(undefined);

    const result = await service.removeAttachment('att-1', '123');

    expect(ATTACHMENTS.removeAttachment).toHaveBeenCalledWith('att-1', '123');
    expect(result.success).toBe(true);
  });

  it('sends the X-Atlassian-Token header required by attachment endpoints', async () => {
    const { OpenAPI } = await vi.importMock('../src/confluence-client/index.js') as { OpenAPI: { HEADERS?: Record<string, string> } };
    expect(OpenAPI.HEADERS).toEqual({ 'X-Atlassian-Token': 'no-check' });
  });

  it('lists attachments with the package default page size', async () => {
    (AttachmentsService.getAttachments as Mock).mockResolvedValue({ results: [] });

    const result = await service.getAttachments('123');

    expect(result.success).toBe(true);
    expect(AttachmentsService.getAttachments).toHaveBeenCalledWith('123', undefined, undefined, '25', undefined, undefined);
  });

  it('forwards explicit paging and filters when listing attachments', async () => {
    (AttachmentsService.getAttachments as Mock).mockResolvedValue({ results: [] });

    await service.getAttachments('123', 'version', 'report.pdf', 5, 10, 'application/pdf');

    expect(AttachmentsService.getAttachments).toHaveBeenCalledWith('123', 'version', 'report.pdf', '5', '10', 'application/pdf');
  });

  it('creates an attachment from base64 content as multipart form data', async () => {
    (AttachmentsService.createAttachments as Mock).mockResolvedValue({ id: 'att1' });

    const result = await service.createAttachment('123', 'notes.txt', Buffer.from('hello').toString('base64'), 'a comment', true);

    expect(result.success).toBe(true);
    expect(AttachmentsService.createAttachments).toHaveBeenCalledWith(
      '123',
      undefined,
      undefined,
      undefined,
      expect.objectContaining({ comment: 'a comment', minorEdit: true, hidden: undefined })
    );
    const formData = (AttachmentsService.createAttachments as Mock).mock.calls[0][4];
    expect(formData.file).toBeInstanceOf(File);
    expect(formData.file.name).toBe('notes.txt');
  });

  it('passes allowDuplicated as a string flag when creating an attachment', async () => {
    (AttachmentsService.createAttachments as Mock).mockResolvedValue({ id: 'att1' });

    await service.createAttachment('123', 'notes.txt', 'aGVsbG8=', undefined, undefined, undefined, true, 'current', 'version');

    expect(AttachmentsService.createAttachments).toHaveBeenCalledWith(
      '123',
      'version',
      'true',
      'current',
      expect.anything()
    );
  });

  it('updates attachment metadata with an incremented version', async () => {
    (AttachmentsService.update as Mock).mockResolvedValue({ id: 'att1' });

    const result = await service.updateAttachmentMeta('123', 'att1', 2, 'renamed.txt', 'renaming', 'text/plain', 'new comment');

    expect(result.success).toBe(true);
    expect(AttachmentsService.update).toHaveBeenCalledWith('att1', '123', {
      id: 'att1',
      type: 'attachment',
      version: { number: 2, message: 'renaming', minorEdit: undefined },
      title: 'renamed.txt',
      metadata: { mediaType: 'text/plain', comment: 'new comment' },
    });
  });

  it('replaces attachment binary data as multipart form data', async () => {
    (AttachmentsService.updateData as Mock).mockResolvedValue({ id: 'att1' });

    const result = await service.updateAttachmentData('123', 'att1', 'notes-v2.txt', 'aGVsbG8=', 'updated');

    expect(result.success).toBe(true);
    expect(AttachmentsService.updateData).toHaveBeenCalledWith(
      'att1',
      '123',
      expect.objectContaining({ comment: 'updated' })
    );
    const formData = (AttachmentsService.updateData as Mock).mock.calls[0][2];
    expect(formData.file.name).toBe('notes-v2.txt');
  });

  it('moves an attachment to a new content container and renames it', async () => {
    (AttachmentsService.move as Mock).mockResolvedValue(undefined);

    const result = await service.moveAttachment('123', 'att1', '789', 'new-name.txt');

    expect(result.success).toBe(true);
    expect(AttachmentsService.move).toHaveBeenCalledWith('att1', '123', 'new-name.txt', '789');
  });

  it('deletes an attachment', async () => {
    (AttachmentsService.removeAttachment as Mock).mockResolvedValue(undefined);

    const result = await service.deleteAttachment('123', 'att1');

    expect(result.success).toBe(true);
    expect(AttachmentsService.removeAttachment).toHaveBeenCalledWith('att1', '123');
  });

  it('deletes a specific attachment version', async () => {
    (AttachmentsService.removeAttachmentVersion as Mock).mockResolvedValue(undefined);

    const result = await service.deleteAttachmentVersion('123', 'att1', 2);

    expect(result.success).toBe(true);
    expect(AttachmentsService.removeAttachmentVersion).toHaveBeenCalledWith('att1', '123', 2);
  });

  it('forwards API errors via handleApiOperation', async () => {
    (AttachmentsService.getAttachments as Mock).mockRejectedValue(new Error('boom'));

    const result = await service.getAttachments('123');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
