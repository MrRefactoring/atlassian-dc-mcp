import { z } from 'zod';

export type AttachmentBean = Record<string, any>;

export const AttachmentBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<AttachmentBean>;
