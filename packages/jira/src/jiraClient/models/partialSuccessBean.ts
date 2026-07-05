import { z } from 'zod';
import { EntrySchema, type Entry } from './entry.js';

export type PartialSuccessBean = {
    entries?: Array<Entry>;
};

export const PartialSuccessBeanSchema = z.lazy(() => z.looseObject({
  entries: z.array(EntrySchema).optional(),
})) as unknown as z.ZodType<PartialSuccessBean>;
