import { z } from 'zod';

export type PropertiesBean = {
    properties?: Record<string, string>;
};

export const PropertiesBeanSchema = z.looseObject({
  properties: z.record(z.string(), z.string()).optional(),
}) as unknown as z.ZodType<PropertiesBean>;
