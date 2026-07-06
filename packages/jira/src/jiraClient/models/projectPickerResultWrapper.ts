import { z } from 'zod';
import { ProjectPickerItemSchema, type ProjectPickerItem } from './projectPickerItem.js';

export type ProjectPickerResultWrapper = {
  header?: string;
  projects?: Array<ProjectPickerItem>;
  total?: number;
};

export const ProjectPickerResultWrapperSchema = z.lazy(() => z.looseObject({
  header: z.string().optional(),
  projects: z.array(ProjectPickerItemSchema).optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<ProjectPickerResultWrapper>;
