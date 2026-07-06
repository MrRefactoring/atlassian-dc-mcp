import { z } from 'zod';

export type ReindexBean = {
  currentProgress?: number;
  currentSubTask?: string;
  finishTime?: string;
  progressUrl?: string;
  startTime?: string;
  submittedTime?: string;
  success?: boolean;
  type?: ReindexBean.type;
};

export namespace ReindexBean {
  export enum type {
    FOREGROUND = 'FOREGROUND',
    BACKGROUND = 'BACKGROUND',
    BACKGROUND_PREFFERED = 'BACKGROUND_PREFFERED',
    BACKGROUND_PREFERRED = 'BACKGROUND_PREFERRED',
  }
}

const ReindexBean_typeSchema = z.enum(['FOREGROUND', 'BACKGROUND', 'BACKGROUND_PREFFERED', 'BACKGROUND_PREFERRED']);

export const ReindexBeanSchema = z.looseObject({
  currentProgress: z.number().optional(),
  currentSubTask: z.string().optional(),
  finishTime: z.string().optional(),
  progressUrl: z.string().optional(),
  startTime: z.string().optional(),
  submittedTime: z.string().optional(),
  success: z.boolean().optional(),
  type: ReindexBean_typeSchema.optional(),
}) as unknown as z.ZodType<ReindexBean>;
