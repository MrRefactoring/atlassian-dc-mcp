import { z } from 'zod';
import { SimpleLinkBeanSchema, type SimpleLinkBean } from './simpleLinkBean.js';

export type LinkGroupBean = {
  groups?: Array<LinkGroupBean>;
  header?: SimpleLinkBean;
  id?: string;
  links?: Array<SimpleLinkBean>;
  styleClass?: string;
  weight?: number;
};

export const LinkGroupBeanSchema = z.lazy(() => z.looseObject({
  groups: z.array(LinkGroupBeanSchema).optional(),
  header: SimpleLinkBeanSchema.optional(),
  id: z.string().optional(),
  links: z.array(SimpleLinkBeanSchema).optional(),
  styleClass: z.string().optional(),
  weight: z.number().optional(),
})) as unknown as z.ZodType<LinkGroupBean>;
