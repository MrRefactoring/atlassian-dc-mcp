import { z } from 'zod';

export type AvatarBean = {
  id?: string;
  owner?: string;
  selected?: boolean;
};

export const AvatarBeanSchema = z.looseObject({
  id: z.string().optional(),
  owner: z.string().optional(),
  selected: z.boolean().optional(),
}) as unknown as z.ZodType<AvatarBean>;
