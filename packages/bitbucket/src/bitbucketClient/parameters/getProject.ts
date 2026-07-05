import { z } from 'zod';

export const GetProjectSchema = z.object({
  projectKey: z.string(),
});

export type GetProject = z.infer<typeof GetProjectSchema>;
