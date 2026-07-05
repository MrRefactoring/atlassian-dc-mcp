import { z } from 'zod';
import { FieldBeanSchema, type FieldBean } from './fieldBean.js';
import { GroupJsonBeanSchema, type GroupJsonBean } from './groupJsonBean.js';
import { ProjectRoleBeanSchema, type ProjectRoleBean } from './projectRoleBean.js';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';

export type PermissionHolderBean = {
    field?: FieldBean;
    group?: GroupJsonBean;
    parameter?: string;
    projectRole?: ProjectRoleBean;
    type?: string;
    user?: UserJsonBean;
};

export const PermissionHolderBeanSchema = z.lazy(() => z.looseObject({
  field: FieldBeanSchema.optional(),
  group: GroupJsonBeanSchema.optional(),
  parameter: z.string().optional(),
  projectRole: ProjectRoleBeanSchema.optional(),
  type: z.string().optional(),
  user: UserJsonBeanSchema.optional(),
})) as unknown as z.ZodType<PermissionHolderBean>;
