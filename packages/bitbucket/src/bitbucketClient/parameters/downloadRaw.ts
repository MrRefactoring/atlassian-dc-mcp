import { z } from 'zod';

export const DownloadRawSchema = z.object({
  path: z.string(),
  projectKey: z.string(),
  repositorySlug: z.string(),
  at: z.string().optional(),
});

export type DownloadRaw = z.infer<typeof DownloadRawSchema>;
