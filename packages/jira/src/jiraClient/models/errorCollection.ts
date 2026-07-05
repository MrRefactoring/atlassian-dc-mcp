import { z } from 'zod';

export type ErrorCollection = {
  errorMessages?: Array<string>;
  errors?: Record<string, string>;
};

export const ErrorCollectionSchema = z.looseObject({
  errorMessages: z.array(z.string()).optional(),
  errors: z.record(z.string(), z.string()).optional(),
}) as unknown as z.ZodType<ErrorCollection>;
