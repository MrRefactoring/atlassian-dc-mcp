import { z } from 'zod';

export const PullRequestReopenRequestSchema = z.looseObject({
  version: z.number().optional(),
});

export type PullRequestReopenRequest = z.infer<typeof PullRequestReopenRequestSchema>;
