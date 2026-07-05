import { z } from 'zod';

export const DisableHookSchema = z.object({
  projectKey: z.string(),
  hookKey: z.string(),
  repositorySlug: z.string(),
});

export type DisableHook = z.infer<typeof DisableHookSchema>;
