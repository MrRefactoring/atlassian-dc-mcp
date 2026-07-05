import { z } from 'zod';

export type VisibilityJsonBean = {
    type?: VisibilityJsonBean.type;
    value?: string;
};

export namespace VisibilityJsonBean {
    export enum type {
        GROUP = 'group',
        ROLE = 'role',
    }
}

const VisibilityJsonBean_typeSchema = z.enum(['group', 'role']);

export const VisibilityJsonBeanSchema = z.looseObject({
  type: VisibilityJsonBean_typeSchema.optional(),
  value: z.string().optional(),
}) as unknown as z.ZodType<VisibilityJsonBean>;
