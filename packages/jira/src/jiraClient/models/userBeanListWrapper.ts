import { z } from 'zod';
import { ListWrapperCallbackUserBeanSchema, type ListWrapperCallbackUserBean } from './listWrapperCallbackUserBean.js';
import { UserBeanSchema, type UserBean } from './userBean.js';

export type UserBeanListWrapper = {
    backingListSize?: number;
    callback?: ListWrapperCallbackUserBean;
    items?: Array<UserBean>;
    maxResults?: number;
    pagingCallback?: ListWrapperCallbackUserBean;
    size?: number;
};

export const UserBeanListWrapperSchema = z.lazy(() => z.looseObject({
  backingListSize: z.number().optional(),
  callback: ListWrapperCallbackUserBeanSchema.optional(),
  items: z.array(UserBeanSchema).optional(),
  maxResults: z.number().optional(),
  pagingCallback: ListWrapperCallbackUserBeanSchema.optional(),
  size: z.number().optional(),
})) as unknown as z.ZodType<UserBeanListWrapper>;
