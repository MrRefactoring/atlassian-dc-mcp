import { z } from 'zod';

export type WatchersBean = Record<string, any>;

export const WatchersBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<WatchersBean>;
