import { z } from 'zod';

export type VersionBean = {
  archived?: boolean;
  description?: string;
  expand?: string;
  id?: string;
  moveUnfixedIssuesTo?: string;
  name?: string;
  overdue?: boolean;
  project?: string;
  projectId?: number;
  releaseDate?: string;
  releaseDateSet?: boolean;
  released?: boolean;
  self?: string;
  startDate?: string;
  startDateSet?: boolean;
  userReleaseDate?: string;
  userStartDate?: string;
};

export const VersionBeanSchema = z.looseObject({
  archived: z.boolean().optional(),
  description: z.string().optional(),
  expand: z.string().optional(),
  id: z.string().optional(),
  moveUnfixedIssuesTo: z.string().optional(),
  name: z.string().optional(),
  overdue: z.boolean().optional(),
  project: z.string().optional(),
  projectId: z.number().optional(),
  releaseDate: z.string().optional(),
  releaseDateSet: z.boolean().optional(),
  released: z.boolean().optional(),
  self: z.string().optional(),
  startDate: z.string().optional(),
  startDateSet: z.boolean().optional(),
  userReleaseDate: z.string().optional(),
  userStartDate: z.string().optional(),
}) as unknown as z.ZodType<VersionBean>;
