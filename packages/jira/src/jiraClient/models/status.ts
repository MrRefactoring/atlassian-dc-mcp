import { z } from 'zod';
import { IconSchema, type Icon } from './icon.js';

export type Status = {
    icon?: Icon;
    resolved?: boolean;
};

export const StatusSchema = z.lazy(() => z.looseObject({
  icon: IconSchema.optional(),
  resolved: z.boolean().optional(),
})) as unknown as z.ZodType<Status>;
