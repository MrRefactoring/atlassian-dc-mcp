import { z } from 'zod';

export type ScreenableFieldBean = {
  id?: string;
  name?: string;
  showWhenEmpty?: boolean;
  type?: string;
};

export const ScreenableFieldBeanSchema = z.looseObject({
  id: z.string().optional(),
  name: z.string().optional(),
  showWhenEmpty: z.boolean().optional(),
  type: z.string().optional(),
}) as unknown as z.ZodType<ScreenableFieldBean>;
