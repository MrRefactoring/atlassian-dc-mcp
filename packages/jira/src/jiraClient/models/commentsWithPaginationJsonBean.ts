import { z } from 'zod';
import { CommentJsonBeanSchema, type CommentJsonBean } from './commentJsonBean.js';

export type CommentsWithPaginationJsonBean = {
    comments?: Array<CommentJsonBean>;
    maxResults?: number;
    startAt?: number;
    total?: number;
};

export const CommentsWithPaginationJsonBeanSchema = z.lazy(() => z.looseObject({
  comments: z.array(CommentJsonBeanSchema).optional(),
  maxResults: z.number().optional(),
  startAt: z.number().optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<CommentsWithPaginationJsonBean>;
