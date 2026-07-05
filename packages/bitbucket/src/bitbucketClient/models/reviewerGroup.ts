import { z } from 'zod';

export const ReviewerGroupSchema = z.looseObject({
  id: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  avatarUrl: z.string().optional(),
  scope: z.looseObject({}).optional(),
  users: z.array(z.looseObject({})).optional(),
});

export type ReviewerGroup = z.infer<typeof ReviewerGroupSchema>;
