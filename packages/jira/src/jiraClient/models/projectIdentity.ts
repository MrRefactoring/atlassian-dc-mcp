import { z } from 'zod';

export type ProjectIdentity = {
    id?: number;
    key?: string;
    self?: string;
};

export const ProjectIdentitySchema = z.looseObject({
  id: z.number().optional(),
  key: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<ProjectIdentity>;
