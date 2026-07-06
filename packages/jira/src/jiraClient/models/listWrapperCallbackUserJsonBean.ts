import { z } from 'zod';

export type ListWrapperCallbackUserJsonBean = Record<string, any>;

export const ListWrapperCallbackUserJsonBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<ListWrapperCallbackUserJsonBean>;
