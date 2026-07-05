import { z } from 'zod';
import { IconSchema, type Icon } from './icon.js';
import { StatusSchema, type Status } from './status.js';

export type RemoteObject = {
  icon?: Icon;
  status?: Status;
  summary?: string;
  title?: string;
  url?: string;
};

export const RemoteObjectSchema = z.lazy(() => z.looseObject({
  icon: IconSchema.optional(),
  status: StatusSchema.optional(),
  summary: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
})) as unknown as z.ZodType<RemoteObject>;
