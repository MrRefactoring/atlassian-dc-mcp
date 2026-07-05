import { z } from 'zod';

export type ActorInputBean = {
  group?: Array<string>;
  user?: Array<string>;
};

export const ActorInputBeanSchema = z.looseObject({
  group: z.array(z.string()).optional(),
  user: z.array(z.string()).optional(),
}) as unknown as z.ZodType<ActorInputBean>;
