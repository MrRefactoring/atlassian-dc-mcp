import { z } from 'zod';

export type EditMetaBean = Record<string, any>;

export const EditMetaBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<EditMetaBean>;
