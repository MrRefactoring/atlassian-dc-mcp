import { z } from 'zod';

export type ServerInfoBean = Record<string, any>;

export const ServerInfoBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<ServerInfoBean>;
