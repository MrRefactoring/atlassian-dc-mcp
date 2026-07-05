import { z } from 'zod';

export type IssueCreateResponse = {
    id?: string;
    key?: string;
    self?: string;
};

export const IssueCreateResponseSchema = z.looseObject({
  id: z.string().optional(),
  key: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<IssueCreateResponse>;
