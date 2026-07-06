import { z } from 'zod';
import { SimpleListWrapperApplicationRoleBeanSchema, type SimpleListWrapperApplicationRoleBean } from './simpleListWrapperApplicationRoleBean.js';
import { SimpleListWrapperGroupJsonBeanSchema, type SimpleListWrapperGroupJsonBean } from './simpleListWrapperGroupJsonBean.js';

export type UserBean = {
  active?: boolean;
  applicationRoles?: SimpleListWrapperApplicationRoleBean;
  avatarUrls?: Record<string, string>;
  deleted?: boolean;
  displayName?: string;
  emailAddress?: string;
  expand?: string;
  groups?: SimpleListWrapperGroupJsonBean;
  key?: string;
  lastLoginTime?: string;
  locale?: string;
  name?: string;
  self?: string;
  timeZone?: string;
};

export const UserBeanSchema = z.lazy(() => z.looseObject({
  active: z.boolean().optional(),
  applicationRoles: SimpleListWrapperApplicationRoleBeanSchema.optional(),
  avatarUrls: z.record(z.string(), z.string()).optional(),
  deleted: z.boolean().optional(),
  displayName: z.string().optional(),
  emailAddress: z.string().optional(),
  expand: z.string().optional(),
  groups: SimpleListWrapperGroupJsonBeanSchema.optional(),
  key: z.string().optional(),
  lastLoginTime: z.string().optional(),
  locale: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  timeZone: z.string().optional(),
})) as unknown as z.ZodType<UserBean>;
