import { z } from 'zod';
import { PagedListWrapperUserJsonBeanApplicationUserSchema, type PagedListWrapperUserJsonBeanApplicationUser } from './pagedListWrapperUserJsonBeanApplicationUser.js';

export type GroupBean = {
  name?: string;
  self?: string;
  users?: PagedListWrapperUserJsonBeanApplicationUser;
};

export const GroupBeanSchema = z.lazy(() => z.looseObject({
  name: z.string().optional(),
  self: z.string().optional(),
  users: PagedListWrapperUserJsonBeanApplicationUserSchema.optional(),
})) as unknown as z.ZodType<GroupBean>;
