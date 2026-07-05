/**
 * Tagged-template URL path builder.
 *
 * Interpolated values are encoded with `encodeURI` (not `encodeURIComponent`) so `/` is
 * preserved — file-path parameters like `browse/{path}` must keep their separators. Call
 * sites write ``route`/api/latest/projects/${projectKey}/repos/${slug}` `` instead of
 * wrapping every segment by hand.
 */
export const route = (strings: TemplateStringsArray, ...values: (string | number)[]): string =>
  strings.reduce((out, str, i) => out + str + (i < values.length ? encodeURI(String(values[i])) : ''), '');

/**
 * Build a request body from a flat parameters object.
 *
 * Endpoint parameters are flat: path, query and body fields sit side by side. This
 * selects just the body subset — either an explicit list of keys, or the keys of a
 * Zod object's `.shape` (typically a body model schema, optionally `.omit()`-ed of
 * keys that collide with a path/query param) — keeping only defined values.
 */
export const pickBody = <T extends object>(
  source: T,
  keys: readonly string[] | { readonly shape: Record<string, unknown> },
): Record<string, unknown> => {
  const list = 'shape' in keys ? Object.keys(keys.shape) : keys;
  const record = source as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const key of list) {
    if (record[key] !== undefined) {
      out[key] = record[key];
    }
  }

  return out;
};
