import { z } from 'zod';

/**
 * Bitbucket's standard paged-response envelope, wrapping an item schema.
 *
 * Loose so unknown envelope fields never fail validation. Use as an endpoint's
 * response schema, e.g. `restPage(RestCommitSchema)`.
 */
export const restPage = <T extends z.ZodType>(item: T) =>
  z.looseObject({
    size: z.number().optional(),
    limit: z.number().optional(),
    isLastPage: z.boolean().optional(),
    start: z.number().optional(),
    // Bitbucket returns `null` (not just omits it) on the last page for some
    // paged endpoints; accept it but normalize to `undefined`.
    nextPageStart: z.number().nullish().transform((v) => v ?? undefined),
    values: z.array(item).optional(),
  });
