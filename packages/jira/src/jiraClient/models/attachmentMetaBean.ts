import { z } from 'zod';

export type AttachmentMetaBean = {
    enabled?: boolean;
    /**
     * Upload limit in bytes
     */
    uploadLimit?: number;
};

export const AttachmentMetaBeanSchema = z.looseObject({
  enabled: z.boolean().optional(),
  uploadLimit: z.number().optional(),
}) as unknown as z.ZodType<AttachmentMetaBean>;
