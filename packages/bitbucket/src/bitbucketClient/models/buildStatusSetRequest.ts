import { z } from 'zod';

export const BuildStatusSetRequestSchema = z.looseObject({
  buildNumber: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().optional(),
  key: z.string(),
  lastUpdated: z.number().optional(),
  name: z.string().optional(),
  parent: z.string().optional(),
  ref: z.string().optional(),
  state: z.enum(['CANCELLED', 'FAILED', 'INPROGRESS', 'SUCCESSFUL', 'UNKNOWN']),
  testResults: z.looseObject({
    failed: z.number().optional(),
    skipped: z.number().optional(),
    successful: z.number().optional(),
  }).optional(),
  url: z.string(),
});

export type BuildStatusSetRequest = z.infer<typeof BuildStatusSetRequestSchema>;
