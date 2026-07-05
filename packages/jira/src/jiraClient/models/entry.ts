import { z } from 'zod';

export type Entry = {
    errors?: Array<string>;
    issueId?: number;
    issueKey?: string;
    status?: number;
};

export const EntrySchema = z.looseObject({
  errors: z.array(z.string()).optional(),
  issueId: z.number().optional(),
  issueKey: z.string().optional(),
  status: z.number().optional(),
}) as unknown as z.ZodType<Entry>;
