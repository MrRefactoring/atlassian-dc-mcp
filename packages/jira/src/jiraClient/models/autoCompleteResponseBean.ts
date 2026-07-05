import { z } from 'zod';

export type AutoCompleteResponseBean = {
    jqlReservedWords?: Array<string>;
    visibleFieldNames?: Array<string>;
    visibleFunctionNames?: Array<string>;
};

export const AutoCompleteResponseBeanSchema = z.looseObject({
  jqlReservedWords: z.array(z.string()).optional(),
  visibleFieldNames: z.array(z.string()).optional(),
  visibleFunctionNames: z.array(z.string()).optional(),
}) as unknown as z.ZodType<AutoCompleteResponseBean>;
