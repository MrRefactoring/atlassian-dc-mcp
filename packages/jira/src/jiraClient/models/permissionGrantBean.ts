import { z } from 'zod';
import { PermissionHolderBeanSchema, type PermissionHolderBean } from './permissionHolderBean.js';

export type PermissionGrantBean = {
    holder?: PermissionHolderBean;
    id?: number;
    permission?: string;
    self?: string;
};

export const PermissionGrantBeanSchema = z.lazy(() => z.looseObject({
  holder: PermissionHolderBeanSchema.optional(),
  id: z.number().optional(),
  permission: z.string().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<PermissionGrantBean>;
