import { z } from 'zod';

export type PermissionJsonBean = {
  description?: string;
  id?: string;
  key?: string;
  name?: string;
  type?: PermissionJsonBean.type;
};

export namespace PermissionJsonBean {
  export enum type {
    GLOBAL = 'GLOBAL',
    PROJECT = 'PROJECT',
  }
}

const PermissionJsonBean_typeSchema = z.enum(['GLOBAL', 'PROJECT']);

export const PermissionJsonBeanSchema = z.looseObject({
  description: z.string().optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  type: PermissionJsonBean_typeSchema.optional(),
}) as unknown as z.ZodType<PermissionJsonBean>;
