import { z } from 'zod';
import { ProjectSchema } from '../models/index.js';

export const UpdateProjectSchema = z.object({
  projectKey: z.string(),
  ...ProjectSchema.shape,
});

export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
