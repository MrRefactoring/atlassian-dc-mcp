import { z } from 'zod';

export const DeleteProjectSchema = z.object({
  projectKey: z.string(),
});

export type DeleteProject = z.infer<typeof DeleteProjectSchema>;
