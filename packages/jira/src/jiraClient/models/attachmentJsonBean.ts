import { z } from 'zod';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';

export type AttachmentJsonBean = {
  author?: UserJsonBean;
  content?: string;
  created?: string;
  filename?: string;
  id?: string;
  mimeType?: string;
  self?: string;
  size?: number;
  thumbnail?: string;
};

export const AttachmentJsonBeanSchema = z.lazy(() => z.looseObject({
  author: UserJsonBeanSchema.optional(),
  content: z.string().optional(),
  created: z.string().optional(),
  filename: z.string().optional(),
  id: z.string().optional(),
  mimeType: z.string().optional(),
  self: z.string().optional(),
  size: z.number().optional(),
  thumbnail: z.string().optional(),
})) as unknown as z.ZodType<AttachmentJsonBean>;
