import { z } from 'zod';

export type ProjectInputBean = {
    assigneeType?: ProjectInputBean.assigneeType;
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
    workflowSchemeId?: number;
};

export namespace ProjectInputBean {
    export enum assigneeType {
        PROJECT_LEAD = 'PROJECT_LEAD',
        UNASSIGNED = 'UNASSIGNED',
    }
}

const ProjectInputBean_assigneeTypeSchema = z.enum(['PROJECT_LEAD', 'UNASSIGNED']);

export const ProjectInputBeanSchema = z.looseObject({
  assigneeType: ProjectInputBean_assigneeTypeSchema.optional(),
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
  workflowSchemeId: z.number().optional(),
}) as unknown as z.ZodType<ProjectInputBean>;
