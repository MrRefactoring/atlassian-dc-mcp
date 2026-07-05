import { z } from 'zod';
import { EntityPropertyBeanSchema, type EntityPropertyBean } from './entityPropertyBean.js';
import { FieldOperationSchema, type FieldOperation } from './fieldOperation.js';
import { HistoryMetadataSchema, type HistoryMetadata } from './historyMetadata.js';
import { TransitionBeanSchema, type TransitionBean } from './transitionBean.js';

export type IssueUpdateBean = {
  fields?: Record<string, string | Record<string, any>>;
  historyMetadata?: HistoryMetadata;
  properties?: Array<EntityPropertyBean>;
  transition?: TransitionBean;
  update?: Record<string, Array<FieldOperation>>;
};

export const IssueUpdateBeanSchema = z.lazy(() => z.looseObject({
  fields: z.record(z.string(), z.union([z.string(), z.record(z.string(), z.any())])).optional(),
  historyMetadata: HistoryMetadataSchema.optional(),
  properties: z.array(EntityPropertyBeanSchema).optional(),
  transition: TransitionBeanSchema.optional(),
  update: z.record(z.string(), z.array(FieldOperationSchema)).optional(),
})) as unknown as z.ZodType<IssueUpdateBean>;
