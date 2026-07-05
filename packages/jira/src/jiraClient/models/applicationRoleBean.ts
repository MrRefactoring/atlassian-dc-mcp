import { z } from 'zod';

export type ApplicationRoleBean = {
    defaultGroups?: Array<string>;
    defined?: boolean;
    groups?: Array<string>;
    hasUnlimitedSeats?: boolean;
    key?: string;
    name?: string;
    numberOfSeats?: number;
    platform?: boolean;
    remainingSeats?: number;
    selectedByDefault?: boolean;
    userCount?: number;
    userCountDescription?: string;
};

export const ApplicationRoleBeanSchema = z.looseObject({
  defaultGroups: z.array(z.string()).optional(),
  defined: z.boolean().optional(),
  groups: z.array(z.string()).optional(),
  hasUnlimitedSeats: z.boolean().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  numberOfSeats: z.number().optional(),
  platform: z.boolean().optional(),
  remainingSeats: z.number().optional(),
  selectedByDefault: z.boolean().optional(),
  userCount: z.number().optional(),
  userCountDescription: z.string().optional(),
}) as unknown as z.ZodType<ApplicationRoleBean>;
