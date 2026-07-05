import { z } from 'zod';

export const RestPullRequestReopenRequestSchema = z.looseObject({
  version: z.number().optional(),
});

export type RestPullRequestReopenRequest = z.infer<typeof RestPullRequestReopenRequestSchema>;
