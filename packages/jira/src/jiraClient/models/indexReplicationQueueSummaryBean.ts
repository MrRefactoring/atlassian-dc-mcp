import { z } from 'zod';
import { IndexReplicationQueueEntryBeanSchema, type IndexReplicationQueueEntryBean } from './indexReplicationQueueEntryBean.js';

export type IndexReplicationQueueSummaryBean = {
    lastConsumedOperation?: IndexReplicationQueueEntryBean;
    lastOperationInQueue?: IndexReplicationQueueEntryBean;
    queueSize?: number;
};

export const IndexReplicationQueueSummaryBeanSchema = z.lazy(() => z.looseObject({
  lastConsumedOperation: IndexReplicationQueueEntryBeanSchema.optional(),
  lastOperationInQueue: IndexReplicationQueueEntryBeanSchema.optional(),
  queueSize: z.number().optional(),
})) as unknown as z.ZodType<IndexReplicationQueueSummaryBean>;
