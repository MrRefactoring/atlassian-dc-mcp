import { z } from 'zod';
import { GroupJsonBeanSchema, type GroupJsonBean } from './groupJsonBean.js';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';

export type ToJsonBean = {
    assignee?: boolean;
    groups?: Array<GroupJsonBean>;
    reporter?: boolean;
    users?: Array<UserJsonBean>;
    voters?: boolean;
    watchers?: boolean;
};

export const ToJsonBeanSchema = z.lazy(() => z.looseObject({
  assignee: z.boolean().optional(),
  groups: z.array(GroupJsonBeanSchema).optional(),
  reporter: z.boolean().optional(),
  users: z.array(UserJsonBeanSchema).optional(),
  voters: z.boolean().optional(),
  watchers: z.boolean().optional(),
})) as unknown as z.ZodType<ToJsonBean>;
