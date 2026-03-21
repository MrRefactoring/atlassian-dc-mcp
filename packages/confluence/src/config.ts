const FALLBACK_PAGE_SIZE = 25;

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return parsed > 0 ? parsed : undefined;
}

export const DEFAULT_PAGE_SIZE = parsePositiveInteger(process.env.CONFLUENCE_DEFAULT_PAGE_SIZE) ?? FALLBACK_PAGE_SIZE;
