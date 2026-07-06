import { z } from 'zod';

export type IssueLinkTypesBean = Record<string, any>;

export const IssueLinkTypesBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<IssueLinkTypesBean>;
