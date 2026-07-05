import { z } from 'zod';
import { ListWrapperCallbackUserJsonBeanSchema, type ListWrapperCallbackUserJsonBean } from './listWrapperCallbackUserJsonBean.js';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';

export type PagedListWrapperUserJsonBeanApplicationUser = {
    backingListSize?: number;
    callback?: ListWrapperCallbackUserJsonBean;
    items?: Array<UserJsonBean>;
    maxResults?: number;
    pagingCallback?: ListWrapperCallbackUserJsonBean;
    size?: number;
};

export const PagedListWrapperUserJsonBeanApplicationUserSchema = z.lazy(() => z.looseObject({
  backingListSize: z.number().optional(),
  callback: ListWrapperCallbackUserJsonBeanSchema.optional(),
  items: z.array(UserJsonBeanSchema).optional(),
  maxResults: z.number().optional(),
  pagingCallback: ListWrapperCallbackUserJsonBeanSchema.optional(),
  size: z.number().optional(),
})) as unknown as z.ZodType<PagedListWrapperUserJsonBeanApplicationUser>;
