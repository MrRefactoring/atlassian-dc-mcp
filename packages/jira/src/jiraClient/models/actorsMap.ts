import { z } from 'zod';

export type ActorsMap = Record<string, Array<string>>;

export const ActorsMapSchema = z.record(z.string(), z.array(z.string())) as unknown as z.ZodType<ActorsMap>;
