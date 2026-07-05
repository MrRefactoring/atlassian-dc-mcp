import { z } from 'zod';

export type SessionInfo = {
  name?: string;
  value?: string;
};

export const SessionInfoSchema = z.looseObject({
  name: z.string().optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<SessionInfo>;
