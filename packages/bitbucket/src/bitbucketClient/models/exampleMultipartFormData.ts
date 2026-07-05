import { z } from 'zod';

export const ExampleMultipartFormDataSchema = z.looseObject({
  branch: z.string().optional(),
  content: z.string().optional(),
  message: z.string().optional(),
  sourceBranch: z.string().optional(),
  sourceCommitId: z.string().optional(),
});

export type ExampleMultipartFormData = z.infer<typeof ExampleMultipartFormDataSchema>;
