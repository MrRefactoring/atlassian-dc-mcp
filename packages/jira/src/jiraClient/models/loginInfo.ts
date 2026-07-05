import { z } from 'zod';

export type LoginInfo = {
    failedLoginCount?: number;
    lastFailedLoginTime?: string;
    loginCount?: number;
    previousLoginTime?: string;
};

export const LoginInfoSchema = z.looseObject({
  failedLoginCount: z.number().optional(),
  lastFailedLoginTime: z.string().optional(),
  loginCount: z.number().optional(),
  previousLoginTime: z.string().optional(),
}) as unknown as z.ZodType<LoginInfo>;
