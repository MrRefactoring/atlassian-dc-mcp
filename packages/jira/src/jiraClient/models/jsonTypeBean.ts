import { z } from 'zod';

export type JsonTypeBean = {
  custom?: string;
  customId?: number;
  items?: string;
  system?: string;
  type?: string;
};

export const JsonTypeBeanSchema = z.looseObject({
  custom: z.string().optional(),
  customId: z.number().optional(),
  items: z.string().optional(),
  system: z.string().optional(),
  type: z.string().optional(),
}) as unknown as z.ZodType<JsonTypeBean>;
