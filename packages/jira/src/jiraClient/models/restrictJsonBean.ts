import { z } from 'zod';
import { GroupJsonBeanSchema, type GroupJsonBean } from './groupJsonBean.js';
import { PermissionJsonBeanSchema, type PermissionJsonBean } from './permissionJsonBean.js';

export type RestrictJsonBean = {
  groups?: Array<GroupJsonBean>;
  permissions?: Array<PermissionJsonBean>;
};

export const RestrictJsonBeanSchema = z.lazy(() => z.looseObject({
  groups: z.array(GroupJsonBeanSchema).optional(),
  permissions: z.array(PermissionJsonBeanSchema).optional(),
})) as unknown as z.ZodType<RestrictJsonBean>;
