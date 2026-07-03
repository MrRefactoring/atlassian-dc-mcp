/**
 * Helper for auto-paginating startAt/isLast-style listing endpoints.
 */
export interface PageResult<T> {
  /** Items returned by this page. */
  items: T[];
  /** Whether this was the last page — the generated clients expose this directly on paged responses (e.g. `isLast`, `isLastPage`), or it can be computed from `startAt + items.length >= total`. */
  isLast: boolean;
  /** Absolute offset to request for the next page, if it isn't simply `previousStartAt + items.length` (e.g. Bitbucket's `nextPageStart`). */
  nextStart?: number;
}

export interface PaginateAllOptions {
  /** Zero-based offset to start from (default: 0). */
  startAt?: number;
  /** Safety cap on the total number of items collected across all pages (default: 1000). */
  maxItems?: number;
  /** Safety cap on the number of page fetches (default: 50). */
  maxPages?: number;
}

const DEFAULT_MAX_ITEMS = 1000;
const DEFAULT_MAX_PAGES = 50;

/**
 * Fetch every page of a startAt-paged listing endpoint and return the
 * concatenated items, so a service method (and the agent calling its tool)
 * doesn't have to hand-roll a startAt loop.
 *
 * Only wrap endpoints whose full result set is naturally small and bounded
 * (e.g. a project's versions, a page's labels or watchers). Do NOT use this
 * for open-ended search endpoints (JQL/CQL search, repository listings)
 * where the full result set could be arbitrarily large — those should stay
 * single-page and agent-driven, so a broad query can't flood the
 * conversation with an unbounded amount of data. `maxItems`/`maxPages` are a
 * safety net for the intended use case, not a substitute for that judgment
 * call.
 *
 * @example
 * ```ts
 * const versions = await paginateAll(async (startAt) => {
 *   const page = await ProjectService.getProjectVersions(projectId, startAt, pageSize);
 *   return { items: page.values, isLast: page.isLast, nextStart: page.nextPage ? startAt + page.values.length : undefined };
 * });
 * ```
 *
 * @param fetchPage Fetches one page given the offset to start from.
 */
export async function paginateAll<T>(
  fetchPage: (startAt: number) => Promise<PageResult<T>>,
  options: PaginateAllOptions = {}
): Promise<T[]> {
  const maxItems = options.maxItems ?? DEFAULT_MAX_ITEMS;
  const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES;
  const items: T[] = [];
  let startAt = options.startAt ?? 0;

  for (let page = 0; page < maxPages && items.length < maxItems; page++) {
    const result = await fetchPage(startAt);
    items.push(...result.items);
    if (result.isLast || result.items.length === 0) {
      break;
    }
    startAt = result.nextStart ?? startAt + result.items.length;
  }

  return items.length > maxItems ? items.slice(0, maxItems) : items;
}
