import { z } from 'zod';
import { GroupJsonBeanSchema, type GroupJsonBean } from './groupJsonBean.js';
import { ProjectBeanSchema, type ProjectBean } from './projectBean.js';
import { ProjectRoleBeanSchema, type ProjectRoleBean } from './projectRoleBean.js';
import { UserBeanSchema, type UserBean } from './userBean.js';

export type FilterPermissionBean = {
  edit?: boolean;
  group?: GroupJsonBean;
  id?: number;
  project?: ProjectBean;
  role?: ProjectRoleBean;
  type?: string;
  user?: UserBean;
  view?: boolean;
};

export const FilterPermissionBeanSchema = z.lazy(() => z.looseObject({
  edit: z.boolean().optional(),
  group: GroupJsonBeanSchema.optional(),
  id: z.number().optional(),
  project: ProjectBeanSchema.optional(),
  role: ProjectRoleBeanSchema.optional(),
  type: z.string().optional(),
  user: UserBeanSchema.optional(),
  view: z.boolean().optional(),
})) as unknown as z.ZodType<FilterPermissionBean>;
