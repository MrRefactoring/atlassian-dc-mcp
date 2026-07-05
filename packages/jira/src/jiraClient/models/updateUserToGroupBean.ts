import { z } from 'zod';

export type UpdateUserToGroupBean = {
  name?: string;
};

export const UpdateUserToGroupBeanSchema = z.looseObject({
  name: z.string().optional(),
}) as unknown as z.ZodType<UpdateUserToGroupBean>;
