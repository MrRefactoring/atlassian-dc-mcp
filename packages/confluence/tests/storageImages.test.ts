import { describe, expect, it } from 'vitest';
import { extractStorageImages } from '../src/storageImages.js';

describe('extractStorageImages', () => {
  it('returns nothing for a body without images', () => {
    expect(extractStorageImages('<p>Just text</p>')).toEqual({ attachments: [], external: [] });
  });

  it('extracts an attachment image on this page', () => {
    const storage = '<p>See</p><ac:image ac:height="250"><ri:attachment ri:filename="diagram.png" ri:version-at-save="1" /></ac:image>';

    expect(extractStorageImages(storage)).toEqual({
      attachments: [{ filename: 'diagram.png', contentTitle: undefined, spaceKey: undefined }],
      external: [],
    });
  });

  it('extracts an attachment image stored on another page', () => {
    const storage = '<ac:image><ri:attachment ri:filename="shared.png"><ri:page ri:content-title="Design Notes" ri:space-key="DEV" /></ri:attachment></ac:image>';

    expect(extractStorageImages(storage).attachments).toEqual([
      { filename: 'shared.png', contentTitle: 'Design Notes', spaceKey: 'DEV' },
    ]);
  });

  it('reports external images separately instead of as attachments', () => {
    const storage = '<ac:image><ri:url ri:value="https://example.com/logo.png" /></ac:image>';

    expect(extractStorageImages(storage)).toEqual({
      attachments: [],
      external: ['https://example.com/logo.png'],
    });
  });

  it('decodes XML entities in file names and URLs', () => {
    const storage = '<ac:image><ri:attachment ri:filename="a &amp; b.png" /></ac:image>'
      + '<ac:image><ri:url ri:value="https://example.com/x?a=1&amp;b=2" /></ac:image>';
    const { attachments, external } = extractStorageImages(storage);

    expect(attachments[0].filename).toBe('a & b.png');
    expect(external).toEqual(['https://example.com/x?a=1&b=2']);
  });

  it('deduplicates the same image embedded more than once', () => {
    const image = '<ac:image><ri:attachment ri:filename="diagram.png" /></ac:image>';
    const url = '<ac:image><ri:url ri:value="https://example.com/logo.png" /></ac:image>';

    expect(extractStorageImages(image + image + url + url)).toEqual({
      attachments: [{ filename: 'diagram.png', contentTitle: undefined, spaceKey: undefined }],
      external: ['https://example.com/logo.png'],
    });
  });

  it('keeps same-named attachments from different pages apart', () => {
    const storage = '<ac:image><ri:attachment ri:filename="shot.png" /></ac:image>'
      + '<ac:image><ri:attachment ri:filename="shot.png"><ri:page ri:content-title="Other" ri:space-key="DEV" /></ri:attachment></ac:image>';

    expect(extractStorageImages(storage).attachments).toHaveLength(2);
  });

  it('ignores attachment links, which are not embedded images', () => {
    const storage = '<ac:link><ri:attachment ri:filename="spec.pdf" /></ac:link>';

    expect(extractStorageImages(storage).attachments).toEqual([]);
  });

  it('skips an image whose attachment reference has no file name', () => {
    const storage = '<ac:image><ri:attachment ri:version-at-save="1" /></ac:image>';

    expect(extractStorageImages(storage).attachments).toEqual([]);
  });

  it('handles several images in one body, in document order', () => {
    const storage = '<ac:image><ri:attachment ri:filename="one.png" /></ac:image>'
      + '<p>between</p>'
      + '<ac:image ac:align="center"><ri:attachment ri:filename="two.jpg" /></ac:image>';

    expect(extractStorageImages(storage).attachments.map((a) => a.filename)).toEqual(['one.png', 'two.jpg']);
  });
});
