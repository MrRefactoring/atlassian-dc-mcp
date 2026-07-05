import { z } from 'zod';

export const RestTagSchema = z.looseObject({
  id: z.string().optional(),
  displayId: z.string().optional(),
  type: z.string().optional(),
  latestCommit: z.string().optional(),
  latestChangeset: z.string().optional(),
  hash: z.string().optional(),
});

export type RestTag = z.infer<typeof RestTagSchema>;
