import { z } from 'zod';

export type SprintBean = {
    activatedDate?: string;
    autoStartStop?: boolean;
    completeDate?: string;
    endDate?: string;
    goal?: string;
    id?: number;
    incompleteIssuesDestinationId?: number;
    name?: string;
    originBoardId?: number;
    self?: string;
    startDate?: string;
    state?: string;
    synced?: boolean;
};

export const SprintBeanSchema = z.looseObject({
  activatedDate: z.string().optional(),
  autoStartStop: z.boolean().optional(),
  completeDate: z.string().optional(),
  endDate: z.string().optional(),
  goal: z.string().optional(),
  id: z.number().optional(),
  incompleteIssuesDestinationId: z.number().optional(),
  name: z.string().optional(),
  originBoardId: z.number().optional(),
  self: z.string().optional(),
  startDate: z.string().optional(),
  state: z.string().optional(),
  synced: z.boolean().optional(),
}) as unknown as z.ZodType<SprintBean>;
