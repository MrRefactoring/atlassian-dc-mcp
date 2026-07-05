import { z } from 'zod';
import { FieldMetaBeanSchema, type FieldMetaBean } from './fieldMetaBean.js';

export type CreateMetaIssueTypeBean = {
  avatarId?: number;
  description?: string;
  fields?: Record<string, FieldMetaBean>;
  iconUrl?: string;
  id?: string;
  name?: string;
  self?: string;
  subtask?: boolean;
};

export const CreateMetaIssueTypeBeanSchema = z.lazy(() => z.looseObject({
  avatarId: z.number().optional(),
  description: z.string().optional(),
  fields: z.record(z.string(), FieldMetaBeanSchema).optional(),
  iconUrl: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  subtask: z.boolean().optional(),
})) as unknown as z.ZodType<CreateMetaIssueTypeBean>;
