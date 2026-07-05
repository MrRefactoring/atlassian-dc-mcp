import { z } from 'zod';

export type FilePart = {
    contentType?: string;
    formField?: boolean;
    inputStream?: Record<string, any>;
    name?: string;
    size?: number;
    value?: string;
};

export const FilePartSchema = z.looseObject({
  contentType: z.string().optional(),
  formField: z.boolean().optional(),
  inputStream: z.record(z.string(), z.any()).optional(),
  name: z.string().optional(),
  size: z.number().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<FilePart>;
