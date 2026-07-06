import { z } from 'zod';

export type ProjectPickerItem = {
  avatar?: string;
  html?: string;
  id?: string;
  key?: string;
  name?: string;
};

export const ProjectPickerItemSchema = z.looseObject({
  avatar: z.string().optional(),
  html: z.string().optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
}) as unknown as z.ZodType<ProjectPickerItem>;
