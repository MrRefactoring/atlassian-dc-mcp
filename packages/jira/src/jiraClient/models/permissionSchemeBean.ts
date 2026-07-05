import { z } from 'zod';
import { PermissionGrantBeanSchema, type PermissionGrantBean } from './permissionGrantBean.js';

export type PermissionSchemeBean = {
    description?: string;
    expand?: string;
    id?: number;
    name?: string;
    permissions?: Array<PermissionGrantBean>;
    self?: string;
};

export const PermissionSchemeBeanSchema = z.lazy(() => z.looseObject({
  description: z.string().optional(),
  expand: z.string().optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  permissions: z.array(PermissionGrantBeanSchema).optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<PermissionSchemeBean>;
