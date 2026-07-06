import { z } from 'zod';

export type Application = {
  name?: string;
  type?: string;
};

export const ApplicationSchema = z.looseObject({
  name: z.string().optional(),
  type: z.string().optional(),
}) as unknown as z.ZodType<Application>;
