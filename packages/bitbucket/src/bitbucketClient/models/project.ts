import { z } from 'zod';

export const ProjectSchema = z.looseObject({
  key: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  public: z.boolean().optional(),
  type: z.string().optional(),
  links: z.looseObject({
    self: z.array(z.looseObject({
      href: z.string().optional(),
    })).optional(),
  }).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
