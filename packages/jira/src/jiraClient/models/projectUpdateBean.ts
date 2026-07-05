import { z } from 'zod';

export type ProjectUpdateBean = {
    assigneeType?: ProjectUpdateBean.assigneeType;
    avatarId?: number;
    categoryId?: number;
    description?: string;
    issueSecurityScheme?: number;
    key?: string;
    lead?: string;
    name?: string;
    notificationScheme?: number;
    permissionScheme?: number;
    projectTemplateKey?: string;
    projectTypeKey?: string;
    url?: string;
};

export namespace ProjectUpdateBean {
    export enum assigneeType {
        PROJECT_LEAD = 'PROJECT_LEAD',
        UNASSIGNED = 'UNASSIGNED',
    }
}

const ProjectUpdateBean_assigneeTypeSchema = z.enum(['PROJECT_LEAD', 'UNASSIGNED']);

export const ProjectUpdateBeanSchema = z.looseObject({
  assigneeType: ProjectUpdateBean_assigneeTypeSchema.optional(),
  avatarId: z.number().optional(),
  categoryId: z.number().optional(),
  description: z.string().optional(),
  issueSecurityScheme: z.number().optional(),
  key: z.string().optional(),
  lead: z.string().optional(),
  name: z.string().optional(),
  notificationScheme: z.number().optional(),
  permissionScheme: z.number().optional(),
  projectTemplateKey: z.string().optional(),
  projectTypeKey: z.string().optional(),
  url: z.string().optional(),
}) as unknown as z.ZodType<ProjectUpdateBean>;
