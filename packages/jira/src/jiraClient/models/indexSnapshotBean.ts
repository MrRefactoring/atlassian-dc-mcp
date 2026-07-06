import { z } from 'zod';

export type IndexSnapshotBean = {
  absolutePath?: string;
  timestamp?: number;
};

export const IndexSnapshotBeanSchema = z.looseObject({
  absolutePath: z.string().optional(),
  timestamp: z.number().optional(),
}) as unknown as z.ZodType<IndexSnapshotBean>;
