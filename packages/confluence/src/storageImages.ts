/**
 * Extracts the images embedded in a page's storage-format body.
 *
 * Confluence wraps every embedded image in `<ac:image>` around a resource identifier: either
 * an `<ri:attachment>` (a file attached to this page, or to another page when it carries a
 * nested `<ri:page>`) or an `<ri:url>` pointing at an arbitrary external address. The markup
 * is scanned rather than parsed — the shape is narrow enough that a dedicated XML dependency
 * would buy nothing, and restricting the scan to `<ac:image>` blocks is what keeps attachment
 * *links* (`<ac:link><ri:attachment/></ac:link>`) out of the results.
 */

/** An image stored as an attachment, on this page unless `contentTitle` names another. */
export interface StorageImageRef {
  filename: string;
  contentTitle?: string;
  spaceKey?: string;
}

export interface StorageImages {
  attachments: StorageImageRef[];
  /** External image URLs, which are not downloaded — they live outside the instance. */
  external: string[];
}

const IMAGE_BLOCK = /<ac:image\b[^>]*>([\s\S]*?)<\/ac:image>/g;
const ATTACHMENT_TAG = /<ri:attachment\b([^>]*)>/;
const PAGE_TAG = /<ri:page\b([^>]*)>/;
const URL_TAG = /<ri:url\b([^>]*)>/;

const XML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': '\'',
};

function decodeEntities(value: string): string {
  return value.replace(/&(?:amp|lt|gt|quot|apos);/g, (entity) => XML_ENTITIES[entity]);
}

function attribute(tagAttributes: string, name: string): string | undefined {
  const match = new RegExp(`\\b${name}="([^"]*)"`).exec(tagAttributes);

  return match ? decodeEntities(match[1]) : undefined;
}

export function extractStorageImages(storage: string): StorageImages {
  const attachments: StorageImageRef[] = [];
  const external: string[] = [];
  const seen = new Set<string>();

  for (const [, block] of storage.matchAll(IMAGE_BLOCK)) {
    const attachmentTag = ATTACHMENT_TAG.exec(block);

    if (attachmentTag) {
      const filename = attribute(attachmentTag[1], 'ri:filename');

      if (!filename) {
        continue;
      }

      const pageTag = PAGE_TAG.exec(block);
      const ref: StorageImageRef = {
        filename,
        contentTitle: pageTag ? attribute(pageTag[1], 'ri:content-title') : undefined,
        spaceKey: pageTag ? attribute(pageTag[1], 'ri:space-key') : undefined,
      };
      const key = `${ref.spaceKey ?? ''}|${ref.contentTitle ?? ''}|${ref.filename}`;

      if (!seen.has(key)) {
        seen.add(key);
        attachments.push(ref);
      }

      continue;
    }

    const urlTag = URL_TAG.exec(block);
    const url = urlTag ? attribute(urlTag[1], 'ri:value') : undefined;

    if (url && !seen.has(url)) {
      seen.add(url);
      external.push(url);
    }
  }

  return { attachments, external };
}
