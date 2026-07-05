import { z } from 'zod';

export type AuthParams = {
    password?: string;
    username?: string;
};

export const AuthParamsSchema = z.looseObject({
  password: z.string().optional(),
  username: z.string().optional(),
}) as unknown as z.ZodType<AuthParams>;
