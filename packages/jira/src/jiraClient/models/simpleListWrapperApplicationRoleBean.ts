import { z } from 'zod';
import { ListWrapperCallbackApplicationRoleBeanSchema, type ListWrapperCallbackApplicationRoleBean } from './listWrapperCallbackApplicationRoleBean.js';

export type SimpleListWrapperApplicationRoleBean = {
  callback?: ListWrapperCallbackApplicationRoleBean;
  maxResults?: number;
  pagingCallback?: ListWrapperCallbackApplicationRoleBean;
  size?: number;
};

export const SimpleListWrapperApplicationRoleBeanSchema = z.lazy(() => z.looseObject({
  callback: ListWrapperCallbackApplicationRoleBeanSchema.optional(),
  maxResults: z.number().optional(),
  pagingCallback: ListWrapperCallbackApplicationRoleBeanSchema.optional(),
  size: z.number().optional(),
})) as unknown as z.ZodType<SimpleListWrapperApplicationRoleBean>;
