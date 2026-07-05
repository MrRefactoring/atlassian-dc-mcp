import { z } from 'zod';

export type AutoCompleteResultWrapper = Record<string, any>;

export const AutoCompleteResultWrapperSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<AutoCompleteResultWrapper>;
