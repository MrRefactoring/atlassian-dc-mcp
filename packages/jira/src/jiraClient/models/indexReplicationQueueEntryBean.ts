import { z } from 'zod';

export type IndexReplicationQueueEntryBean = {
  id?: number;
  replicationTime?: string;
};

export const IndexReplicationQueueEntryBeanSchema = z.looseObject({
  id: z.number().optional(),
  replicationTime: z.string().optional(),
}) as unknown as z.ZodType<IndexReplicationQueueEntryBean>;
