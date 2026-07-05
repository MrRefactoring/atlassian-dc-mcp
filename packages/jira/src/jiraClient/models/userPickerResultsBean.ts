import { z } from 'zod';

export type UserPickerResultsBean = Record<string, any>;

export const UserPickerResultsBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<UserPickerResultsBean>;
