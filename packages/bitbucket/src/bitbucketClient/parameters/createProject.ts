import { z } from 'zod';
import { ProjectSchema } from '../models/index.js';

export const CreateProjectSchema = z.object({
  ...ProjectSchema.shape,
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;
