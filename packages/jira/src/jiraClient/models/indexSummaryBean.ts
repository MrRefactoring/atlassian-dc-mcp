import { z } from 'zod';
import { IndexReplicationQueueSummaryBeanSchema, type IndexReplicationQueueSummaryBean } from './indexReplicationQueueSummaryBean.js';
import { IssueIndexSummaryBeanSchema, type IssueIndexSummaryBean } from './issueIndexSummaryBean.js';

export type IndexSummaryBean = {
    issueIndex?: IssueIndexSummaryBean;
    nodeId?: string;
    replicationQueues?: Record<string, IndexReplicationQueueSummaryBean>;
    reportTime?: string;
};

export const IndexSummaryBeanSchema = z.lazy(() => z.looseObject({
  issueIndex: IssueIndexSummaryBeanSchema.optional(),
  nodeId: z.string().optional(),
  replicationQueues: z.record(z.string(), IndexReplicationQueueSummaryBeanSchema).optional(),
  reportTime: z.string().optional(),
})) as unknown as z.ZodType<IndexSummaryBean>;
