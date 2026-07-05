import { z } from 'zod';

export type IssueTypeJsonBean = {
    avatarId?: number;
    description?: string;
    iconUrl?: string;
    id?: string;
    name?: string;
    self?: string;
    subtask?: boolean;
};

export const IssueTypeJsonBeanSchema = z.looseObject({
  avatarId: z.number().optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  subtask: z.boolean().optional(),
}) as unknown as z.ZodType<IssueTypeJsonBean>;
