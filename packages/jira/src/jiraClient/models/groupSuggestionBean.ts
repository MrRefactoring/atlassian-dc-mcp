import { z } from 'zod';
import { GroupLabelBeanSchema, type GroupLabelBean } from './groupLabelBean.js';

export type GroupSuggestionBean = {
    html?: string;
    labels?: Array<GroupLabelBean>;
    name?: string;
};

export const GroupSuggestionBeanSchema = z.lazy(() => z.looseObject({
  html: z.string().optional(),
  labels: z.array(GroupLabelBeanSchema).optional(),
  name: z.string().optional(),
})) as unknown as z.ZodType<GroupSuggestionBean>;
