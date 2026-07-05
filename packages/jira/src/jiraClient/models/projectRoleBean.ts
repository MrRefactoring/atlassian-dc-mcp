import { z } from 'zod';
import { RoleActorBeanSchema, type RoleActorBean } from './roleActorBean.js';

export type ProjectRoleBean = {
    actors?: Array<RoleActorBean>;
    description?: string;
    id?: number;
    name?: string;
    self?: string;
};

export const ProjectRoleBeanSchema = z.lazy(() => z.looseObject({
  actors: z.array(RoleActorBeanSchema).optional(),
  description: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<ProjectRoleBean>;
