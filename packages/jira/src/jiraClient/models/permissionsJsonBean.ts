import { z } from 'zod';
import { PermissionJsonBeanSchema, type PermissionJsonBean } from './permissionJsonBean.js';

export type PermissionsJsonBean = {
  /**
     * A map of permission keys to permission objects.
     */
  permissions?: Record<string, PermissionJsonBean>;
};

export const PermissionsJsonBeanSchema = z.lazy(() => z.looseObject({
  permissions: z.record(z.string(), PermissionJsonBeanSchema).optional(),
})) as unknown as z.ZodType<PermissionsJsonBean>;
