import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  attachments: {
    getAttachments: vi.fn(),
    createAttachments: vi.fn(),
    update: vi.fn(),
    updateData: vi.fn(),
    move: vi.fn(),
    removeAttachment: vi.fn(),
    removeAttachmentVersion: vi.fn(),
  },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService attachments', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('lists attachments with the default page-size limit and filters', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [] });

    await service.getAttachments('123', 'version', 'diagram.png', undefined, undefined, 'image/png');

    expect(conf.attachments.getAttachments).toHaveBeenCalledWith({ id: '123', expand: 'version', filename: 'diagram.png', limit: '25', start: undefined, mediaType: 'image/png' });
  });

  it('removes an attachment', async () => {
    conf.attachments.removeAttachment.mockResolvedValue(undefined);

    const result = await service.removeAttachment('att-1', '123');

    expect(conf.attachments.removeAttachment).toHaveBeenCalledWith({ attachmentId: 'att-1', id: '123' });
    expect(result.success).toBe(true);
  });

  it('lists attachments with the package default page size', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [] });

    const result = await service.getAttachments('123');

    expect(result.success).toBe(true);
    expect(conf.attachments.getAttachments).toHaveBeenCalledWith({ id: '123', expand: undefined, filename: undefined, limit: '25', start: undefined, mediaType: undefined });
  });

  it('forwards explicit paging and filters when listing attachments', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [] });

    await service.getAttachments('123', 'version', 'report.pdf', 5, 10, 'application/pdf');

    expect(conf.attachments.getAttachments).toHaveBeenCalledWith({ id: '123', expand: 'version', filename: 'report.pdf', limit: '5', start: '10', mediaType: 'application/pdf' });
  });

  it('creates an attachment from base64 content as multipart form data', async () => {
    conf.attachments.createAttachments.mockResolvedValue({ id: 'att1' });

    const result = await service.createAttachment('123', 'notes.txt', Buffer.from('hello').toString('base64'), 'a comment', true);

    expect(result.success).toBe(true);
    expect(conf.attachments.createAttachments).toHaveBeenCalledWith({
      id: '123',
      expand: undefined,
      allowDuplicated: undefined,
      status: undefined,
      formData: expect.objectContaining({ comment: 'a comment', minorEdit: true, hidden: undefined }),
    });
    const { formData } = (conf.attachments.createAttachments as Mock).mock.calls[0][0];
    expect(formData.file).toBeInstanceOf(File);
    expect(formData.file.name).toBe('notes.txt');
  });

  it('passes allowDuplicated as a string flag when creating an attachment', async () => {
    conf.attachments.createAttachments.mockResolvedValue({ id: 'att1' });

    await service.createAttachment('123', 'notes.txt', 'aGVsbG8=', undefined, undefined, undefined, true, 'current', 'version');

    expect(conf.attachments.createAttachments).toHaveBeenCalledWith({
      id: '123',
      expand: 'version',
      allowDuplicated: 'true',
      status: 'current',
      formData: expect.anything(),
    });
  });

  it('updates attachment metadata with an incremented version', async () => {
    conf.attachments.update.mockResolvedValue({ id: 'att1' });

    const result = await service.updateAttachmentMeta('123', 'att1', 2, 'renamed.txt', 'renaming', 'text/plain', 'new comment');

    expect(result.success).toBe(true);
    expect(conf.attachments.update).toHaveBeenCalledWith({
      attachmentId: 'att1',
      id: '123',
      requestBody: {
        id: 'att1',
        type: 'attachment',
        version: { number: 2, message: 'renaming', minorEdit: undefined },
        title: 'renamed.txt',
        metadata: { mediaType: 'text/plain', comment: 'new comment' },
      },
    });
  });

  it('replaces attachment binary data as multipart form data', async () => {
    conf.attachments.updateData.mockResolvedValue({ id: 'att1' });

    const result = await service.updateAttachmentData('123', 'att1', 'notes-v2.txt', 'aGVsbG8=', 'updated');

    expect(result.success).toBe(true);
    expect(conf.attachments.updateData).toHaveBeenCalledWith({
      attachmentId: 'att1',
      id: '123',
      formData: expect.objectContaining({ comment: 'updated' }),
    });
    const { formData } = (conf.attachments.updateData as Mock).mock.calls[0][0];
    expect(formData.file.name).toBe('notes-v2.txt');
  });

  it('moves an attachment to a new content container and renames it', async () => {
    conf.attachments.move.mockResolvedValue(undefined);

    const result = await service.moveAttachment('123', 'att1', '789', 'new-name.txt');

    expect(result.success).toBe(true);
    expect(conf.attachments.move).toHaveBeenCalledWith({ attachmentId: 'att1', id: '123', newName: 'new-name.txt', newContentId: '789' });
  });

  it('deletes an attachment', async () => {
    conf.attachments.removeAttachment.mockResolvedValue(undefined);

    const result = await service.deleteAttachment('123', 'att1');

    expect(result.success).toBe(true);
    expect(conf.attachments.removeAttachment).toHaveBeenCalledWith({ attachmentId: 'att1', id: '123' });
  });

  it('deletes a specific attachment version', async () => {
    conf.attachments.removeAttachmentVersion.mockResolvedValue(undefined);

    const result = await service.deleteAttachmentVersion('123', 'att1', 2);

    expect(result.success).toBe(true);
    expect(conf.attachments.removeAttachmentVersion).toHaveBeenCalledWith({ attachmentId: 'att1', id: '123', version: 2 });
  });

  it('forwards API errors via handleApiOperation', async () => {
    conf.attachments.getAttachments.mockRejectedValue(new Error('boom'));

    const result = await service.getAttachments('123');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
