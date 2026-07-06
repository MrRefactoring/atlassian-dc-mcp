import { z } from 'zod';

export type ProjectRoleActorsUpdateBean = {
  categorisedActors?: Record<string, Array<string>>;
  id?: number;
};

export const ProjectRoleActorsUpdateBeanSchema = z.looseObject({
  categorisedActors: z.record(z.string(), z.array(z.string())).optional(),
  id: z.number().optional(),
}) as unknown as z.ZodType<ProjectRoleActorsUpdateBean>;
