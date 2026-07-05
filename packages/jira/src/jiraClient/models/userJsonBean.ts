import { z } from 'zod';

export type UserJsonBean = {
    active?: boolean;
    avatarUrls?: Record<string, string>;
    displayName?: string;
    emailAddress?: string;
    key?: string;
    name?: string;
    self?: string;
    timeZone?: string;
};

export const UserJsonBeanSchema = z.looseObject({
  active: z.boolean().optional(),
  avatarUrls: z.record(z.string(), z.string()).optional(),
  displayName: z.string().optional(),
  emailAddress: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  self: z.string().optional(),
  timeZone: z.string().optional(),
}) as unknown as z.ZodType<UserJsonBean>;
