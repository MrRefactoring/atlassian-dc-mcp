import { z } from 'zod';

export type UserAnonymizationRequestBean = {
    newOwnerKey?: string;
    userKey?: string;
};

export const UserAnonymizationRequestBeanSchema = z.looseObject({
  newOwnerKey: z.string().optional(),
  userKey: z.string().optional(),
}) as unknown as z.ZodType<UserAnonymizationRequestBean>;
