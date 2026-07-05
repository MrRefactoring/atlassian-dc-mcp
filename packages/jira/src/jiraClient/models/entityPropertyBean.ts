import { z } from 'zod';

export type EntityPropertyBean = {
  key?: string;
  value?: any;
};

export const EntityPropertyBeanSchema = z.looseObject({
  key: z.string().optional(),
  // Entity/project property values are arbitrary JSON, not just strings.
  value: z.any().optional(),
}) as unknown as z.ZodType<EntityPropertyBean>;
