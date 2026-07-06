import { z } from 'zod';
import { TransitionBeanSchema, type TransitionBean } from './transitionBean.js';

export type TransitionsMetaBean = {
  transitions?: Array<TransitionBean>;
};

export const TransitionsMetaBeanSchema = z.lazy(() => z.looseObject({
  transitions: z.array(TransitionBeanSchema).optional(),
})) as unknown as z.ZodType<TransitionsMetaBean>;
