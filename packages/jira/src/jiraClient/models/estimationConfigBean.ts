import { z } from 'zod';
import { EstimationFieldBeanSchema, type EstimationFieldBean } from './estimationFieldBean.js';

export type EstimationConfigBean = {
    field?: EstimationFieldBean;
    type?: string;
};

export const EstimationConfigBeanSchema = z.lazy(() => z.looseObject({
  field: EstimationFieldBeanSchema.optional(),
  type: z.string().optional(),
})) as unknown as z.ZodType<EstimationConfigBean>;
