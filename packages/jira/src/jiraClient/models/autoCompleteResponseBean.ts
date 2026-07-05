import { z } from 'zod';

export type AutoCompleteFieldRef = {
  value?: string;
  displayName?: string;
  orderable?: string;
  searchable?: string;
  cfid?: string;
  auto?: string;
  operators?: Array<string>;
  types?: Array<string>;
};

export type AutoCompleteFunctionRef = {
  value?: string;
  displayName?: string;
  isList?: string;
  types?: Array<string>;
};

export type AutoCompleteResponseBean = {
  jqlReservedWords?: Array<string>;
  visibleFieldNames?: Array<AutoCompleteFieldRef>;
  visibleFunctionNames?: Array<AutoCompleteFunctionRef>;
};

export const AutoCompleteFieldRefSchema = z.looseObject({
  value: z.string().optional(),
  displayName: z.string().optional(),
  orderable: z.string().optional(),
  searchable: z.string().optional(),
  cfid: z.string().optional(),
  auto: z.string().optional(),
  operators: z.array(z.string()).optional(),
  types: z.array(z.string()).optional(),
}) as unknown as z.ZodType<AutoCompleteFieldRef>;

export const AutoCompleteFunctionRefSchema = z.looseObject({
  value: z.string().optional(),
  displayName: z.string().optional(),
  isList: z.string().optional(),
  types: z.array(z.string()).optional(),
}) as unknown as z.ZodType<AutoCompleteFunctionRef>;

export const AutoCompleteResponseBeanSchema = z.looseObject({
  jqlReservedWords: z.array(z.string()).optional(),
  visibleFieldNames: z.array(AutoCompleteFieldRefSchema).optional(),
  visibleFunctionNames: z.array(AutoCompleteFunctionRefSchema).optional(),
}) as unknown as z.ZodType<AutoCompleteResponseBean>;
