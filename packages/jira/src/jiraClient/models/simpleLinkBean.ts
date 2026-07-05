import { z } from 'zod';

export type SimpleLinkBean = {
  href?: string;
  iconClass?: string;
  id?: string;
  label?: string;
  params?: Record<string, string>;
  styleClass?: string;
  title?: string;
  weight?: number;
};

export const SimpleLinkBeanSchema = z.looseObject({
  href: z.string().optional(),
  iconClass: z.string().optional(),
  id: z.string().optional(),
  label: z.string().optional(),
  params: z.record(z.string(), z.string()).optional(),
  styleClass: z.string().optional(),
  title: z.string().optional(),
  weight: z.number().optional(),
}) as unknown as z.ZodType<SimpleLinkBean>;
