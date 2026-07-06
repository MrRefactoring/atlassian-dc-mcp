import { z } from 'zod';

export type ListWrapperCallbackUserBean = Record<string, any>;

export const ListWrapperCallbackUserBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<ListWrapperCallbackUserBean>;
