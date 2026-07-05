import { z } from 'zod';
import { CommentJsonBeanSchema, type CommentJsonBean } from './commentJsonBean.js';

export type PinnedCommentJsonBean = {
    comment?: CommentJsonBean;
    pinnedBy?: string;
    pinnedDate?: string;
};

export const PinnedCommentJsonBeanSchema = z.lazy(() => z.looseObject({
  comment: CommentJsonBeanSchema.optional(),
  pinnedBy: z.string().optional(),
  pinnedDate: z.string().optional(),
})) as unknown as z.ZodType<PinnedCommentJsonBean>;
