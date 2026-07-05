import { z } from 'zod';
import { PermissionGrantBeanSchema, type PermissionGrantBean } from './permissionGrantBean.js';

export type PermissionGrantsBean = {
    expand?: string;
    permissions?: Array<PermissionGrantBean>;
};

export const PermissionGrantsBeanSchema = z.lazy(() => z.looseObject({
  expand: z.string().optional(),
  permissions: z.array(PermissionGrantBeanSchema).optional(),
})) as unknown as z.ZodType<PermissionGrantsBean>;
