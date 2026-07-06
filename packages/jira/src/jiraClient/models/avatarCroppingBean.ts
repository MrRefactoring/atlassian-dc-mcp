import { z } from 'zod';

export type AvatarCroppingBean = {
  cropperOffsetX?: number;
  cropperOffsetY?: number;
  cropperWidth?: number;
  needsCropping?: boolean;
  url?: string;
};

export const AvatarCroppingBeanSchema = z.looseObject({
  cropperOffsetX: z.number().optional(),
  cropperOffsetY: z.number().optional(),
  cropperWidth: z.number().optional(),
  needsCropping: z.boolean().optional(),
  url: z.string().optional(),
}) as unknown as z.ZodType<AvatarCroppingBean>;
