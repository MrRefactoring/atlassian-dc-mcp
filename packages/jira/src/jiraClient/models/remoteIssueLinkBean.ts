import { z } from 'zod';

export type RemoteIssueLinkBean = Record<string, any>;

export const RemoteIssueLinkBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<RemoteIssueLinkBean>;
