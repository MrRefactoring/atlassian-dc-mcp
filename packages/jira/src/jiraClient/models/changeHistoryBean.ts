import { z } from 'zod';
import { ChangeItemBeanSchema, type ChangeItemBean } from './changeItemBean.js';
import { HistoryMetadataSchema, type HistoryMetadata } from './historyMetadata.js';
import { UserJsonBeanSchema, type UserJsonBean } from './userJsonBean.js';

export type ChangeHistoryBean = {
    author?: UserJsonBean;
    created?: string;
    historyMetadata?: HistoryMetadata;
    id?: string;
    items?: Array<ChangeItemBean>;
};

export const ChangeHistoryBeanSchema = z.lazy(() => z.looseObject({
  author: UserJsonBeanSchema.optional(),
  created: z.string().optional(),
  historyMetadata: HistoryMetadataSchema.optional(),
  id: z.string().optional(),
  items: z.array(ChangeItemBeanSchema).optional(),
})) as unknown as z.ZodType<ChangeHistoryBean>;
