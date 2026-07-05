import { z } from 'zod';

export const GetProjectsSchema = z.object({
  name: z.string().optional(),
  permission: z.string().optional(),
  start: z.number().optional(),
  limit: z.number().optional(),
});

export type GetProjects = z.infer<typeof GetProjectsSchema>;
