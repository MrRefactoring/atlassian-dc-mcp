import { z } from 'zod';

export type ReindexRequestBean = {
    completionTime?: string;
    id?: number;
    requestTime?: string;
    startTime?: string;
    status?: ReindexRequestBean.status;
    type?: ReindexRequestBean.type;
};

export namespace ReindexRequestBean {
    export enum status {
        PENDING = 'PENDING',
        ACTIVE = 'ACTIVE',
        RUNNING = 'RUNNING',
        FAILED = 'FAILED',
        COMPLETE = 'COMPLETE',
    }
    export enum type {
        IMMEDIATE = 'IMMEDIATE',
        DELAYED = 'DELAYED',
    }
}

const ReindexRequestBean_statusSchema = z.enum(['PENDING', 'ACTIVE', 'RUNNING', 'FAILED', 'COMPLETE']);
const ReindexRequestBean_typeSchema = z.enum(['IMMEDIATE', 'DELAYED']);

export const ReindexRequestBeanSchema = z.looseObject({
  completionTime: z.string().optional(),
  id: z.number().optional(),
  requestTime: z.string().optional(),
  startTime: z.string().optional(),
  status: ReindexRequestBean_statusSchema.optional(),
  type: ReindexRequestBean_typeSchema.optional(),
}) as unknown as z.ZodType<ReindexRequestBean>;
