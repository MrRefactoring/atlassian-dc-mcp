import { z } from 'zod';

export type ProjectCategoryJsonBean = {
    description?: string;
    id?: string;
    name?: string;
    self?: string;
};

export const ProjectCategoryJsonBeanSchema = z.looseObject({
  description: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<ProjectCategoryJsonBean>;
