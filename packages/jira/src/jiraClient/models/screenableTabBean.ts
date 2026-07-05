import { z } from 'zod';

export type ScreenableTabBean = {
    id?: number;
    name?: string;
};

export const ScreenableTabBeanSchema = z.looseObject({
  id: z.number().optional(),
  name: z.string().optional(),
}) as unknown as z.ZodType<ScreenableTabBean>;
