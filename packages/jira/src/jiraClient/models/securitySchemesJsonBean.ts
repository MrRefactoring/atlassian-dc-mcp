import { z } from 'zod';
import { SecuritySchemeJsonBeanSchema, type SecuritySchemeJsonBean } from './securitySchemeJsonBean.js';

export type SecuritySchemesJsonBean = {
    issueSecuritySchemes?: Array<SecuritySchemeJsonBean>;
};

export const SecuritySchemesJsonBeanSchema = z.lazy(() => z.looseObject({
  issueSecuritySchemes: z.array(SecuritySchemeJsonBeanSchema).optional(),
})) as unknown as z.ZodType<SecuritySchemesJsonBean>;
