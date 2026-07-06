import { z } from 'zod';
import { GroupSuggestionsBeanSchema, type GroupSuggestionsBean } from './groupSuggestionsBean.js';
import { UserPickerResultsBeanSchema, type UserPickerResultsBean } from './userPickerResultsBean.js';

export type UsersAndGroupsBean = {
  groups?: GroupSuggestionsBean;
  users?: UserPickerResultsBean;
};

export const UsersAndGroupsBeanSchema = z.lazy(() => z.looseObject({
  groups: GroupSuggestionsBeanSchema.optional(),
  users: UserPickerResultsBeanSchema.optional(),
})) as unknown as z.ZodType<UsersAndGroupsBean>;
