import { z } from 'zod';

export type StringList = Record<string, any>;

export const StringListSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<StringList>;
