import { z } from 'zod';

export const StreamDiffSchema = z.object({
  commitId: z.string(),
  repositorySlug: z.string(),
  path: z.string(),
  projectKey: z.string(),
  srcPath: z.string().optional(),
  avatarSize: z.string().optional(),
  filter: z.string().optional(),
  avatarScheme: z.string().optional(),
  contextLines: z.string().optional(),
  autoSrcPath: z.string().optional(),
  whitespace: z.string().optional(),
  withComments: z.string().optional(),
  since: z.string().optional(),
});

export type StreamDiff = z.infer<typeof StreamDiffSchema>;
