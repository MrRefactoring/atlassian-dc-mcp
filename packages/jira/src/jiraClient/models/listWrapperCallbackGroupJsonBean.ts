import { z } from 'zod';

export type ListWrapperCallbackGroupJsonBean = Record<string, any>;

export const ListWrapperCallbackGroupJsonBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<ListWrapperCallbackGroupJsonBean>;
