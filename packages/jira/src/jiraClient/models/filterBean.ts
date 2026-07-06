import { z } from 'zod';
import { FilterPermissionBeanSchema, type FilterPermissionBean } from './filterPermissionBean.js';
import { UserBeanSchema, type UserBean } from './userBean.js';
import { UserBeanListWrapperSchema, type UserBeanListWrapper } from './userBeanListWrapper.js';

export type FilterBean = {
  description?: string;
  editable?: boolean;
  favourite?: boolean;
  id?: string;
  jql?: string;
  name?: string;
  owner?: UserBean;
  searchUrl?: string;
  self?: string;
  sharePermissions?: Array<FilterPermissionBean>;
  sharedUsers?: UserBeanListWrapper;
  viewUrl?: string;
};

export const FilterBeanSchema = z.lazy(() => z.looseObject({
  description: z.string().optional(),
  editable: z.boolean().optional(),
  favourite: z.boolean().optional(),
  id: z.string().optional(),
  jql: z.string().optional(),
  name: z.string().optional(),
  owner: UserBeanSchema.optional(),
  searchUrl: z.string().optional(),
  self: z.string().optional(),
  sharePermissions: z.array(FilterPermissionBeanSchema).optional(),
  sharedUsers: UserBeanListWrapperSchema.optional(),
  viewUrl: z.string().optional(),
})) as unknown as z.ZodType<FilterBean>;
