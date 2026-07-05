import { z } from 'zod';

export type UserWriteBean = {
  active?: boolean;
  applicationKeys?: Array<string>;
  displayName?: string;
  emailAddress?: string;
  key?: string;
  name?: string;
  notification?: string;
  password?: string;
  self?: string;
};

export const UserWriteBeanSchema = z.looseObject({
  active: z.boolean().optional(),
  applicationKeys: z.array(z.string()).optional(),
  displayName: z.string().optional(),
  emailAddress: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  notification: z.string().optional(),
  password: z.string().optional(),
  self: z.string().optional(),
}) as unknown as z.ZodType<UserWriteBean>;
