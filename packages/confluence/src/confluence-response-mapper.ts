export type ConfluenceBodyMode = 'storage' | 'text' | 'none';
export type ConfluenceMutationOutputMode = 'ack' | 'full';

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&(nbsp|amp|lt|gt|quot);|&#39;/g, match => ENTITY_MAP[match] ?? match)
    .replace(/&#(\d+);/g, (_, code) => {
      const parsed = Number.parseInt(code, 10);
      return Number.isNaN(parsed) ? '' : String.fromCodePoint(parsed);
    });
}

function truncateText(value: string, maxBodyChars?: number): { value: string; truncated?: boolean; originalLength?: number } {
  if (maxBodyChars === undefined || maxBodyChars < 1 || value.length <= maxBodyChars) {
    return { value };
  }

  return {
    value: value.slice(0, maxBodyChars).trimEnd(),
    truncated: true,
    originalLength: value.length,
  };
}

export function confluenceStorageToText(storageValue: string): string {
  const withLineBreaks = storageValue
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/(?:p|div|h[1-6]|li|tr|td|th|blockquote|pre|ul|ol|table|section|article)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  return decodeHtmlEntities(withLineBreaks)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function getContentUrl(content: any): string | undefined {
  const self = content?._links?.self;
  if (typeof self === 'string') {
    return self;
  }

  const base = content?._links?.base;
  const webui = content?._links?.webui;
  if (typeof base === 'string' && typeof webui === 'string') {
    return `${base}${webui}`;
  }

  return undefined;
}

export function shapeConfluenceContent(content: any, bodyMode: ConfluenceBodyMode = 'storage', maxBodyChars?: number) {
  if (!content || typeof content !== 'object' || bodyMode === 'storage') {
    return content;
  }

  const { body, ...rest } = content as Record<string, any>;

  if (bodyMode === 'none') {
    return rest;
  }

  const storageValue = typeof body?.storage?.value === 'string' ? body.storage.value : undefined;
  if (storageValue === undefined) {
    return rest;
  }

  const textBody = truncateText(confluenceStorageToText(storageValue), maxBodyChars);
  return {
    ...rest,
    body: {
      text: {
        value: textBody.value,
        representation: 'text',
        ...(textBody.truncated ? { truncated: true, originalLength: textBody.originalLength } : {}),
      },
    },
  };
}

export function shapeConfluenceMutationAck(content: any) {
  const url = getContentUrl(content);

  return {
    ...(content?.id !== undefined ? { id: content.id } : {}),
    ...(typeof content?.type === 'string' ? { type: content.type } : {}),
    ...(typeof content?.title === 'string' ? { title: content.title } : {}),
    ...(typeof content?.space?.key === 'string' ? { spaceKey: content.space.key } : {}),
    ...(content?.version?.number !== undefined ? { version: content.version.number } : {}),
    ...(url ? { url } : {}),
  };
}
