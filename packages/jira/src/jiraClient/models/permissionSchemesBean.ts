import { z } from 'zod';
import { PermissionSchemeBeanSchema, type PermissionSchemeBean } from './permissionSchemeBean.js';

export type PermissionSchemesBean = {
  permissionSchemes?: Array<PermissionSchemeBean>;
};

export const PermissionSchemesBeanSchema = z.lazy(() => z.looseObject({
  permissionSchemes: z.array(PermissionSchemeBeanSchema).optional(),
})) as unknown as z.ZodType<PermissionSchemesBean>;
