import { z } from 'zod';

export type IndexSnapshotPromiseBean = {
    futureAbsolutePath?: string;
};

export const IndexSnapshotPromiseBeanSchema = z.looseObject({
  futureAbsolutePath: z.string().optional(),
}) as unknown as z.ZodType<IndexSnapshotPromiseBean>;
