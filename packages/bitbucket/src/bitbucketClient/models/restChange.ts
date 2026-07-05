import { z } from 'zod';

export const RestChangeSchema = z.looseObject({
  fromHash: z.string().optional(),
  toHash: z.string().optional(),
  properties: z.looseObject({
    changeScope: z.string().optional(),
  }).optional(),
  values: z.array(z.looseObject({
    contentId: z.string().optional(),
    fromContentId: z.string().optional(),
    path: z.looseObject({
      components: z.array(z.string()).optional(),
      parent: z.string().optional(),
      name: z.string().optional(),
      extension: z.string().optional(),
      toString: z.string().optional(),
    }).optional(),
    executable: z.boolean().optional(),
    percentUnchanged: z.number().optional(),
    type: z.string().optional(),
    nodeType: z.string().optional(),
    links: z.looseObject({
      self: z.array(z.unknown()).optional(),
    }).optional(),
    properties: z.looseObject({
      gitChangeType: z.string().optional(),
    }).optional(),
  })).optional(),
  size: z.number().optional(),
  isLastPage: z.boolean().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
  nextPageStart: z.unknown().nullable().optional(),
});

export type RestChange = z.infer<typeof RestChangeSchema>;
