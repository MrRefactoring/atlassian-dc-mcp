import { z } from 'zod';

export type SprintCreateBean = {
  autoStartStop?: boolean;
  endDate?: string;
  goal?: string;
  incompleteIssuesDestinationId?: number;
  name?: string;
  originBoardId?: number;
  startDate?: string;
  synced?: boolean;
  userProfileTimeZone?: string;
};

export const SprintCreateBeanSchema = z.looseObject({
  autoStartStop: z.boolean().optional(),
  endDate: z.string().optional(),
  goal: z.string().optional(),
  incompleteIssuesDestinationId: z.number().optional(),
  name: z.string().optional(),
  originBoardId: z.number().optional(),
  startDate: z.string().optional(),
  synced: z.boolean().optional(),
  userProfileTimeZone: z.string().optional(),
}) as unknown as z.ZodType<SprintCreateBean>;
