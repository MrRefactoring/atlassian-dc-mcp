import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
  content: {
    getContentById: vi.fn(),
    search1: vi.fn(),
  },
  request: vi.fn(),
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

describe('ConfluenceService attachment downloads', () => {
  const png = {
    id: 'att-1',
    title: 'diagram.png',
    extensions: { mediaType: 'image/png', fileSize: 4 },
    _links: { download: '/download/attachments/123/diagram.png?version=1&api=v2' },
  };

  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
    conf.request.mockResolvedValue(new Uint8Array([1, 2, 3, 4]));
  });

  it('resolves an attachment by filename and fetches its bytes as arraybuffer', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [png] });

    const result = await service.downloadAttachment('123', undefined, 'diagram.png');

    expect(conf.attachments.getAttachments).toHaveBeenCalledWith({ id: '123', filename: 'diagram.png', limit: '200', start: '0' });
    expect(conf.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/download/attachments/123/diagram.png?version=1&api=v2',
      responseType: 'arraybuffer',
      headers: { Accept: '*/*' },
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      uri: 'confluence://attachment/123/diagram.png',
      filename: 'diagram.png',
      mimeType: 'image/png',
      size: 4,
      bytes: new Uint8Array([1, 2, 3, 4]),
    });
  });

  it('resolves an attachment by id out of the content\'s attachment list', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [{ ...png, id: 'att-other', title: 'other.png' }, png] });

    const result = await service.downloadAttachment('123', 'att-1');

    expect(conf.attachments.getAttachments).toHaveBeenCalledWith({ id: '123', filename: undefined, limit: '200', start: '0' });
    expect(result.data).toMatchObject({ filename: 'diagram.png' });
  });

  it('falls back to the file extension when the attachment has no media type', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [{ ...png, extensions: undefined }] });

    const result = await service.downloadAttachment('123', undefined, 'diagram.png');

    expect(result.data).toMatchObject({ mimeType: 'image/png' });
  });

  it('fails with the available attachment names when the attachment is missing', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [{ ...png, id: 'att-9', title: 'other.png' }] });

    const result = await service.downloadAttachment('123', 'att-1');

    expect(result.success).toBe(false);
    expect(result.error).toContain('att-1');
    expect(result.error).toContain('other.png');
    expect(conf.request).not.toHaveBeenCalled();
  });

  it('fails when neither an attachment id nor a filename is given', async () => {
    const result = await service.downloadAttachment('123');

    expect(result.success).toBe(false);
    expect(result.error).toContain('attachmentId or filename');
    expect(conf.attachments.getAttachments).not.toHaveBeenCalled();
  });

  it('fails when the attachment metadata has no download link', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [{ ...png, _links: {} }] });

    const result = await service.downloadAttachment('123', undefined, 'diagram.png');

    expect(result.success).toBe(false);
    expect(result.error).toContain('download link');
  });

  it('reduces an absolute download link to an instance-relative path', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [{ ...png, _links: { download: 'https://test-host/download/attachments/123/diagram.png?version=1' } }],
    });

    await service.downloadAttachment('123', undefined, 'diagram.png');

    expect(conf.request).toHaveBeenCalledWith(expect.objectContaining({ url: '/download/attachments/123/diagram.png?version=1' }));
  });

  it('strips the instance context path from an absolute download link', async () => {
    const scoped = new ConfluenceService('test-host/confluence', 'test-token');
    conf.attachments.getAttachments.mockResolvedValue({
      results: [{ ...png, _links: { download: 'https://test-host/confluence/download/attachments/123/diagram.png' } }],
    });

    await scoped.downloadAttachment('123', undefined, 'diagram.png');

    expect(conf.request).toHaveBeenCalledWith(expect.objectContaining({ url: '/download/attachments/123/diagram.png' }));
  });

  it('writes the attachment to disk when an outputPath is given', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [png] });
    const dir = await mkdtemp(join(tmpdir(), 'confluence-download-'));

    try {
      const result = await service.downloadAttachment('123', undefined, 'diagram.png', dir);

      expect(result.data).toEqual({
        uri: 'confluence://attachment/123/diagram.png',
        filename: 'diagram.png',
        mimeType: 'image/png',
        size: 4,
        savedTo: join(dir, 'diagram.png'),
      });
      expect(new Uint8Array(await readFile(join(dir, 'diagram.png')))).toEqual(new Uint8Array([1, 2, 3, 4]));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('surfaces a download failure as a normal error envelope', async () => {
    conf.attachments.getAttachments.mockResolvedValue({ results: [png] });
    conf.request.mockRejectedValue(new Error('boom'));

    const result = await service.downloadAttachment('123', undefined, 'diagram.png');

    expect(result.success).toBe(false);
    expect(result.error).toContain('boom');
  });
});

describe('ConfluenceService bulk page attachment downloads', () => {
  const attachment = (title: string, mediaType: string) => ({
    id: `att-${title}`,
    title,
    extensions: { mediaType },
    _links: { download: `/download/attachments/123/${title}` },
  });

  let service: ConfluenceService;
  let dir: string;

  beforeEach(async () => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
    conf.request.mockResolvedValue(new Uint8Array([9]));
    dir = await mkdtemp(join(tmpdir(), 'confluence-bulk-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('writes every attachment into the output directory', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [attachment('a.png', 'image/png'), attachment('b.pdf', 'application/pdf')],
    });

    const result = await service.downloadPageAttachments('123', dir);

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ outputDir: dir, matched: 2, skipped: 0, failed: [] });
    expect(result.data?.downloaded.map((f) => f.savedTo)).toEqual([join(dir, 'a.png'), join(dir, 'b.pdf')]);
    expect(new Uint8Array(await readFile(join(dir, 'a.png')))).toEqual(new Uint8Array([9]));
  });

  it('creates a missing output directory and keeps the files separate in it', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [attachment('a.png', 'image/png'), attachment('b.png', 'image/png')],
    });
    const missingDir = join(dir, 'not', 'created', 'yet');

    const result = await service.downloadPageAttachments('123', missingDir);

    expect(result.data?.downloaded.map((f) => f.savedTo)).toEqual([
      join(missingDir, 'a.png'),
      join(missingDir, 'b.png'),
    ]);
    expect((await readdir(missingDir)).sort()).toEqual(['a.png', 'b.png']);
  });

  it('filters by a media type prefix', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [attachment('a.png', 'image/png'), attachment('b.jpg', 'image/jpeg'), attachment('c.pdf', 'application/pdf')],
    });

    const result = await service.downloadPageAttachments('123', dir, 'image/');

    expect(result.data).toMatchObject({ matched: 2 });
    expect(result.data?.downloaded.map((f) => f.filename)).toEqual(['a.png', 'b.jpg']);
  });

  it('filters by exact file names', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [attachment('a.png', 'image/png'), attachment('b.png', 'image/png')],
    });

    const result = await service.downloadPageAttachments('123', dir, undefined, ['b.png']);

    expect(result.data?.downloaded.map((f) => f.filename)).toEqual(['b.png']);
  });

  it('caps the number of files written and reports the remainder as skipped', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [attachment('a.png', 'image/png'), attachment('b.png', 'image/png'), attachment('c.png', 'image/png')],
    });

    const result = await service.downloadPageAttachments('123', dir, undefined, undefined, 2);

    expect(result.data).toMatchObject({ matched: 3, skipped: 1 });
    expect(result.data?.downloaded).toHaveLength(2);
  });

  it('records a per-file failure without aborting the rest', async () => {
    conf.attachments.getAttachments.mockResolvedValue({
      results: [attachment('a.png', 'image/png'), attachment('b.png', 'image/png')],
    });
    conf.request.mockRejectedValueOnce(new Error('gone')).mockResolvedValue(new Uint8Array([9]));

    const result = await service.downloadPageAttachments('123', dir);

    expect(result.success).toBe(true);
    expect(result.data?.failed).toEqual([{ filename: 'a.png', error: 'gone' }]);
    expect(result.data?.downloaded.map((f) => f.filename)).toEqual(['b.png']);
  });

  it('fails up front when the output directory is not absolute', async () => {
    const result = await service.downloadPageAttachments('123', 'relative/dir');

    expect(result.success).toBe(false);
    expect(result.error).toContain('absolute path');
    expect(conf.attachments.getAttachments).not.toHaveBeenCalled();
  });
});

describe('ConfluenceService embedded page image downloads', () => {
  const attachment = (title: string) => ({
    id: `att-${title}`,
    title,
    extensions: { mediaType: 'image/png' },
    _links: { download: `/download/attachments/123/${title}` },
  });
  const body = (storage: string) => ({ body: { storage: { value: storage } } });

  let service: ConfluenceService;
  let dir: string;

  beforeEach(async () => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
    conf.request.mockResolvedValue(new Uint8Array([7]));
    dir = await mkdtemp(join(tmpdir(), 'confluence-images-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('downloads the images the page embeds', async () => {
    conf.content.getContentById.mockResolvedValue(body('<ac:image><ri:attachment ri:filename="one.png" /></ac:image><ac:image><ri:attachment ri:filename="two.png" /></ac:image>'));
    // The real endpoint filters on `filename`; mirror that so each embedded image resolves to
    // its own attachment rather than always to the first result.
    const all = [attachment('one.png'), attachment('two.png')];
    conf.attachments.getAttachments.mockImplementation(({ filename }: { filename?: string }) =>
      Promise.resolve({ results: filename ? all.filter((a) => a.title === filename) : all }));
    const missingDir = join(dir, 'images-not-created-yet');

    const result = await service.downloadPageImages('123', missingDir);

    expect(conf.content.getContentById).toHaveBeenCalledWith({ id: '123', expand: 'body.storage' });
    expect(result.data).toMatchObject({ outputDir: missingDir, found: 2, skipped: 0, failed: [], external: [] });
    expect(result.data?.downloaded.map((f) => f.savedTo)).toEqual([
      join(missingDir, 'one.png'),
      join(missingDir, 'two.png'),
    ]);
    expect((await readdir(missingDir)).sort()).toEqual(['one.png', 'two.png']);
  });

  it('reports external images without downloading them', async () => {
    conf.content.getContentById.mockResolvedValue(body('<ac:image><ri:url ri:value="https://example.com/logo.png" /></ac:image>'));

    const result = await service.downloadPageImages('123', dir);

    expect(result.data).toMatchObject({ found: 0, external: ['https://example.com/logo.png'] });
    expect(conf.request).not.toHaveBeenCalled();
  });

  it('resolves an image attached to another page by title and space', async () => {
    conf.content.getContentById.mockResolvedValue(body('<ac:image><ri:attachment ri:filename="shared.png"><ri:page ri:content-title="Design Notes" ri:space-key="DEV" /></ri:attachment></ac:image>'));
    // Real search response shape: the matched page is nested under `content`.
    conf.content.search1.mockResolvedValue({ results: [{ content: { id: '999', title: 'Design Notes' } }] });
    conf.attachments.getAttachments.mockResolvedValue({ results: [attachment('shared.png')] });

    const result = await service.downloadPageImages('123', dir);

    expect(conf.content.search1).toHaveBeenCalledWith({
      cql: 'type=page AND title="Design Notes" AND space="DEV"',
      limit: '1',
    });
    expect(conf.attachments.getAttachments).toHaveBeenCalledWith({ id: '999', filename: 'shared.png', limit: '200', start: '0' });
    expect(result.data?.downloaded).toHaveLength(1);
  });

  it('records a failure for an image whose source page cannot be found', async () => {
    conf.content.getContentById.mockResolvedValue(body('<ac:image><ri:attachment ri:filename="shared.png"><ri:page ri:content-title="Gone" /></ri:attachment></ac:image>'));
    conf.content.search1.mockResolvedValue({ results: [] });

    const result = await service.downloadPageImages('123', dir);

    expect(result.success).toBe(true);
    expect(result.data?.failed).toEqual([{ filename: 'shared.png', error: 'Page \'Gone\' referenced by an embedded image was not found' }]);
  });

  it('fails when the content has no storage body', async () => {
    conf.content.getContentById.mockResolvedValue({ id: '123' });

    const result = await service.downloadPageImages('123', dir);

    expect(result.success).toBe(false);
    expect(result.error).toContain('no storage-format body');
  });

  it('caps the number of images written', async () => {
    conf.content.getContentById.mockResolvedValue(body(
      '<ac:image><ri:attachment ri:filename="one.png" /></ac:image><ac:image><ri:attachment ri:filename="two.png" /></ac:image>',
    ));
    conf.attachments.getAttachments.mockResolvedValue({ results: [attachment('one.png'), attachment('two.png')] });

    const result = await service.downloadPageImages('123', dir, 1);

    expect(result.data).toMatchObject({ found: 2, skipped: 1 });
    expect(result.data?.downloaded).toHaveLength(1);
  });

  it('fails up front when the output directory is not absolute', async () => {
    const result = await service.downloadPageImages('123', 'relative/dir');

    expect(result.success).toBe(false);
    expect(result.error).toContain('absolute path');
    expect(conf.content.getContentById).not.toHaveBeenCalled();
  });
});
