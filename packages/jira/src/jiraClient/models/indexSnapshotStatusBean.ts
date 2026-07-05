import { z } from 'zod';

export type IndexSnapshotStatusBean = {
    running?: boolean;
};

export const IndexSnapshotStatusBeanSchema = z.looseObject({
  running: z.boolean().optional(),
}) as unknown as z.ZodType<IndexSnapshotStatusBean>;
