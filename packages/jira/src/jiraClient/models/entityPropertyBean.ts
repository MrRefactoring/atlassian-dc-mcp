import { z } from 'zod';

export type EntityPropertyBean = {
  key?: string;
  value?: string;
};

export const EntityPropertyBeanSchema = z.looseObject({
  key: z.string().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<EntityPropertyBean>;
