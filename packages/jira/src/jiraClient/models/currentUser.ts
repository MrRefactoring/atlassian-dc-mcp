import { z } from 'zod';

export type CurrentUser = Record<string, any>;

export const CurrentUserSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<CurrentUser>;
