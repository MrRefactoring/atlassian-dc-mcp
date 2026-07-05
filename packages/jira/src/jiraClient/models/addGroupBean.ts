import { z } from 'zod';

export type AddGroupBean = {
    name?: string;
};

export const AddGroupBeanSchema = z.looseObject({
  name: z.string().optional(),
}) as unknown as z.ZodType<AddGroupBean>;
