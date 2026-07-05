import { z } from 'zod';

export type ProjectCategoryBean = {
    description?: string;
    id?: string;
    name?: string;
    self?: string;
};

export const ProjectCategoryBeanSchema = z.looseObject({
  description: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<ProjectCategoryBean>;
