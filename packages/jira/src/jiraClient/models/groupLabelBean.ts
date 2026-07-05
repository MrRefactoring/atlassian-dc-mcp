import { z } from 'zod';

export type GroupLabelBean = {
    text?: string;
    title?: string;
    type?: GroupLabelBean.type;
};

export namespace GroupLabelBean {
    export enum type {
        ADMIN = 'ADMIN',
        SINGLE = 'SINGLE',
        MULTIPLE = 'MULTIPLE',
    }
}

const GroupLabelBean_typeSchema = z.enum(['ADMIN', 'SINGLE', 'MULTIPLE']);

export const GroupLabelBeanSchema = z.looseObject({
  text: z.string().optional(),
  title: z.string().optional(),
  type: GroupLabelBean_typeSchema.optional(),
}) as unknown as z.ZodType<GroupLabelBean>;
