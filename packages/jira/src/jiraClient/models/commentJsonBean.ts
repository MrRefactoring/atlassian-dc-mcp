import { z } from 'zod';
import { EntityPropertyBeanSchema, type EntityPropertyBean } from './entityPropertyBean.js';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';
import { VisibilityJsonBeanSchema, type VisibilityJsonBean } from './visibilityJsonBean.js';

export type CommentJsonBean = {
  author?: UserJsonBean;
  body?: string;
  created?: string;
  id?: string;
  properties?: Array<EntityPropertyBean>;
  renderedBody?: string;
  self?: string;
  updateAuthor?: UserJsonBean;
  updated?: string;
  visibility?: VisibilityJsonBean;
};

export const CommentJsonBeanSchema = z.lazy(() => z.looseObject({
  author: UserJsonBeanSchema.optional(),
  body: z.string().optional(),
  created: z.string().optional(),
  id: z.string().optional(),
  properties: z.array(EntityPropertyBeanSchema).optional(),
  renderedBody: z.string().optional(),
  self: z.string().optional(),
  updateAuthor: UserJsonBeanSchema.optional(),
  updated: z.string().optional(),
  visibility: VisibilityJsonBeanSchema.optional(),
})) as unknown as z.ZodType<CommentJsonBean>;
