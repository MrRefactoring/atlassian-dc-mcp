import { z } from 'zod';

export type PasswordBean = {
  currentPassword?: string;
  password?: string;
};

export const PasswordBeanSchema = z.looseObject({
  currentPassword: z.string().optional(),
  password: z.string().optional(),
}) as unknown as z.ZodType<PasswordBean>;
