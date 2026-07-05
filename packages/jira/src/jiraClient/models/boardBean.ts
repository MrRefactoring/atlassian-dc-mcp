import { z } from 'zod';

export type BoardBean = {
  id?: number;
  name?: string;
  self?: string;
  type?: string;
};

export const BoardBeanSchema = z.looseObject({
  id: z.number().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  type: z.string().optional(),
}) as unknown as z.ZodType<BoardBean>;
