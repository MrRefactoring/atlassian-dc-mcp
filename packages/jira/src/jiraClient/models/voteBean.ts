import { z } from 'zod';

export type VoteBean = Record<string, any>;

export const VoteBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<VoteBean>;
