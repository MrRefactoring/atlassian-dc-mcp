import { z } from 'zod';
import { UserBeanSchema, type UserBean } from './userBean.js';

export type ComponentBean = {
  archived?: boolean;
  assigneeType?: ComponentBean.assigneeType;
  deleted?: boolean;
  description?: string;
  id?: string;
  lead?: UserBean;
  leadUserName?: string;
  name?: string;
  project?: string;
  self?: string;
};

export namespace ComponentBean {
  export enum assigneeType {
    PROJECT_DEFAULT = 'PROJECT_DEFAULT',
    COMPONENT_LEAD = 'COMPONENT_LEAD',
    PROJECT_LEAD = 'PROJECT_LEAD',
    UNASSIGNED = 'UNASSIGNED',
  }
}

const ComponentBean_assigneeTypeSchema = z.enum(['PROJECT_DEFAULT', 'COMPONENT_LEAD', 'PROJECT_LEAD', 'UNASSIGNED']);

export const ComponentBeanSchema = z.lazy(() => z.looseObject({
  archived: z.boolean().optional(),
  assigneeType: ComponentBean_assigneeTypeSchema.optional(),
  deleted: z.boolean().optional(),
  description: z.string().optional(),
  id: z.string().optional(),
  lead: UserBeanSchema.optional(),
  leadUserName: z.string().optional(),
  name: z.string().optional(),
  project: z.string().optional(),
  self: z.string().optional(),
})) as unknown as z.ZodType<ComponentBean>;
