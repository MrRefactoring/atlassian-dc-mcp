import { z } from 'zod';

export const EnableHookSchema = z.object({
  projectKey: z.string(),
  hookKey: z.string(),
  repositorySlug: z.string(),
  contentLength: z.string().optional(),
});

export type EnableHook = z.infer<typeof EnableHookSchema>;
