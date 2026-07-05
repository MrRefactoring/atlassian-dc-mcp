import { z } from 'zod';
import { RoleActorBeanSchema, type RoleActorBean } from './roleActorBean.js';

export type ProjectRoleActorsBean = {
    actors?: Array<RoleActorBean>;
};

export const ProjectRoleActorsBeanSchema = z.lazy(() => z.looseObject({
  actors: z.array(RoleActorBeanSchema).optional(),
})) as unknown as z.ZodType<ProjectRoleActorsBean>;
