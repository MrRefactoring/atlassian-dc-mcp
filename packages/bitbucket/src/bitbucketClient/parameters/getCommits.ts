import { z } from 'zod';

export const GetCommitsSchema = z.object({
  projectKey: z.string(),
  repositorySlug: z.string(),
  avatarScheme: z.string().optional(),
  path: z.string().optional(),
  withCounts: z.string().optional(),
  followRenames: z.string().optional(),
  until: z.string().optional(),
  avatarSize: z.string().optional(),
  since: z.string().optional(),
  merges: z.string().optional(),
  ignoreMissing: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetCommits = z.infer<typeof GetCommitsSchema>;
