import { z } from 'zod';

export type NodeBuildInfo = {
  buildNumber?: number;
  version?: string;
};

export const NodeBuildInfoSchema = z.looseObject({
  buildNumber: z.number().optional(),
  version: z.string().optional(),
}) as unknown as z.ZodType<NodeBuildInfo>;
