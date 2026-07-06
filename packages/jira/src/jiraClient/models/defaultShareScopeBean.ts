import { z } from 'zod';

export type DefaultShareScopeBean = {
  scope?: string;
};

export const DefaultShareScopeBeanSchema = z.looseObject({
  scope: z.string().optional(),
}) as unknown as z.ZodType<DefaultShareScopeBean>;
