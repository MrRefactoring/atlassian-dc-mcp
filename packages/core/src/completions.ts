/**
 * The MCP spec caps a completion response at 100 values; keep our own suggestion
 * lists comfortably under that so a single page is never truncated by the SDK.
 */
export const DEFAULT_COMPLETION_LIMIT = 50;

/**
 * Filter a list of candidate completion values against the partial input the user
 * has typed so far. Matching is case-insensitive and substring-based, and the
 * result is capped so completion responses stay within the MCP limit.
 *
 * An empty input returns the first `max` candidates (useful for "show me the
 * options" behaviour before the user has typed anything).
 */
export function filterCompletions(candidates: string[], value: string, max: number = DEFAULT_COMPLETION_LIMIT): string[] {
  const needle = value.toLowerCase();
  const matched = needle ? candidates.filter((candidate) => candidate.toLowerCase().includes(needle)) : candidates;

  return matched.slice(0, max);
}
