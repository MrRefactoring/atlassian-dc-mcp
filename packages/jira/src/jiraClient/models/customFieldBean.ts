import { z } from 'zod';

export type CustomFieldBean = {
    description?: string;
    id?: string;
    isAllProjects?: boolean;
    isLocked?: boolean;
    isManaged?: boolean;
    isTrusted?: boolean;
    issueTypeIds?: Array<string>;
    issuesWithValue?: number;
    lastValueUpdate?: string;
    name?: string;
    numericId?: number;
    projectIds?: Array<number>;
    projectsCount?: number;
    screensCount?: number;
    searcherKey?: string;
    self?: string;
    type?: string;
};

export const CustomFieldBeanSchema = z.looseObject({
  description: z.string().optional(),
  id: z.string().optional(),
  isAllProjects: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  isManaged: z.boolean().optional(),
  isTrusted: z.boolean().optional(),
  issueTypeIds: z.array(z.string()).optional(),
  issuesWithValue: z.number().optional(),
  lastValueUpdate: z.string().optional(),
  name: z.string().optional(),
  numericId: z.number().optional(),
  projectIds: z.array(z.number()).optional(),
  projectsCount: z.number().optional(),
  screensCount: z.number().optional(),
  searcherKey: z.string().optional(),
  self: z.string().optional(),
  type: z.string().optional(),
}) as unknown as z.ZodType<CustomFieldBean>;
