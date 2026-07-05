import { z } from 'zod';

export type CreateUpdateRoleRequestBean = {
    description?: string;
    name?: string;
};

export const CreateUpdateRoleRequestBeanSchema = z.looseObject({
  description: z.string().optional(),
  name: z.string().optional(),
}) as unknown as z.ZodType<CreateUpdateRoleRequestBean>;
