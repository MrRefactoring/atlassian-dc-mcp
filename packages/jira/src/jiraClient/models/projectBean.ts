import { z } from 'zod';

export type ProjectBean = {
  archived?: boolean;
  avatarUrls?: Record<string, string>;
  description?: string;
  id?: string;
  key?: string;
  name?: string;
  self?: string;
};

export const ProjectBeanSchema = z.looseObject({
  archived: z.boolean().optional(),
  avatarUrls: z.record(z.string(), z.string()).optional(),
  description: z.string().optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<ProjectBean>;
