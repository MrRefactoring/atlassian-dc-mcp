import { z } from 'zod';
import { GroupSuggestionBeanSchema, type GroupSuggestionBean } from './groupSuggestionBean.js';

export type GroupSuggestionsBean = {
  groups?: Array<GroupSuggestionBean>;
  header?: string;
  total?: number;
};

export const GroupSuggestionsBeanSchema = z.lazy(() => z.looseObject({
  groups: z.array(GroupSuggestionBeanSchema).optional(),
  header: z.string().optional(),
  total: z.number().optional(),
})) as unknown as z.ZodType<GroupSuggestionsBean>;
