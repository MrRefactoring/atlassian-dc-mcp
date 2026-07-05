import { z } from 'zod';

export const MultipartFormDataSchema = z.looseObject({
  branch: z.string().optional(),
  content: z.string().optional(),
  message: z.string().optional(),
  sourceBranch: z.string().optional(),
  sourceCommitId: z.string().optional(),
});

export type MultipartFormData = z.infer<typeof MultipartFormDataSchema>;
