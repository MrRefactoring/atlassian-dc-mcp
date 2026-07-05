import { z } from 'zod';

export type EntityPropertyKeyBean = {
  key?: string;
  self?: string;
};

export const EntityPropertyKeyBeanSchema = z.looseObject({
  key: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<EntityPropertyKeyBean>;
