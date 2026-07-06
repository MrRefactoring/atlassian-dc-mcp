import { z } from 'zod';

export type Property = {
  example?: string;
  key?: string;
  value?: string;
};

export const PropertySchema = z.looseObject({
  example: z.string().optional(),
  key: z.string().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<Property>;
