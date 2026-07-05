import { z } from 'zod';
import { SecurityLevelJsonBeanSchema, type SecurityLevelJsonBean } from './securityLevelJsonBean.js';

export type SecuritySchemeJsonBean = {
    defaultSecurityLevelId?: number;
    description?: string;
    id?: number;
    levels?: Array<SecurityLevelJsonBean>;
    name?: string;
    self?: string;
};

export const SecuritySchemeJsonBeanSchema = z.lazy(() => z.looseObject({
  defaultSecurityLevelId: z.number().optional(),
  description: z.string().optional(),
  id: z.number().optional(),
  levels: z.array(SecurityLevelJsonBeanSchema).optional(),
  name: z.string().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<SecuritySchemeJsonBean>;
