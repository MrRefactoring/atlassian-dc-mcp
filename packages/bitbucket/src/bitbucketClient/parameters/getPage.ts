import { z } from 'zod';

export const GetPageSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  withAttributes: z.string().optional(),
  at: z.string().optional(),
  withProperties: z.string().optional(),
  draft: z.string().optional(),
  filterText: z.string().optional(),
  state: z.string().optional(),
  order: z.string().optional(),
  direction: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetPage = z.infer<typeof GetPageSchema>;
