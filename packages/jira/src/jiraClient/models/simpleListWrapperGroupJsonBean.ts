import { z } from 'zod';
import { ListWrapperCallbackGroupJsonBeanSchema, type ListWrapperCallbackGroupJsonBean } from './listWrapperCallbackGroupJsonBean.js';

export type SimpleListWrapperGroupJsonBean = {
  callback?: ListWrapperCallbackGroupJsonBean;
  maxResults?: number;
  pagingCallback?: ListWrapperCallbackGroupJsonBean;
  size?: number;
};

export const SimpleListWrapperGroupJsonBeanSchema = z.lazy(() => z.looseObject({
  callback: ListWrapperCallbackGroupJsonBeanSchema.optional(),
  maxResults: z.number().optional(),
  pagingCallback: ListWrapperCallbackGroupJsonBeanSchema.optional(),
  size: z.number().optional(),
})) as unknown as z.ZodType<SimpleListWrapperGroupJsonBean>;
