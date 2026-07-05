import { z } from 'zod';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';
import { VisibilityJsonBeanSchema, type VisibilityJsonBean } from './visibilityJsonBean.js';

export type worklog = {
    author?: UserJsonBean;
    comment?: string;
    created?: string;
    id?: string;
    issueId?: string;
    self?: string;
    started?: string;
    timeSpent?: string;
    timeSpentSeconds?: number;
    updateAuthor?: UserJsonBean;
    updated?: string;
    visibility?: VisibilityJsonBean;
};

export const worklogSchema = z.lazy(() => z.looseObject({
  author: UserJsonBeanSchema.optional(),
  comment: z.string().optional(),
  created: z.string().optional(),
  id: z.string().optional(),
  issueId: z.string().optional(),
  self: z.string().optional(),
  started: z.string().optional(),
  timeSpent: z.string().optional(),
  timeSpentSeconds: z.number().optional(),
  updateAuthor: UserJsonBeanSchema.optional(),
  updated: z.string().optional(),
  visibility: VisibilityJsonBeanSchema.optional(),
})) as unknown as z.ZodType<worklog>;
