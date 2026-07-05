import { z } from 'zod';

export type RoleActorBean = {
    avatarUrl?: string;
    name?: string;
};

export const RoleActorBeanSchema = z.looseObject({
  avatarUrl: z.string().optional(),
  name: z.string().optional(),
}) as unknown as z.ZodType<RoleActorBean>;
