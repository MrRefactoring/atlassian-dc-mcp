import { z } from 'zod';

export const StreamRawSchema = z.object({
  path: z.string(),
  projectKey: z.string(),
  repositorySlug: z.string(),
  at: z.string().optional(),
  markup: z.string().optional(),
  htmlEscape: z.string().optional(),
  includeHeadingId: z.string().optional(),
  hardwrap: z.string().optional(),
});

export type StreamRaw = z.infer<typeof StreamRawSchema>;
