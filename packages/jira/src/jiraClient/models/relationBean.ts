import { z } from 'zod';

export type RelationBean = {
  id?: string;
  self?: string;
};

export const RelationBeanSchema = z.looseObject({
  id: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<RelationBean>;
