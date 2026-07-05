import { z } from 'zod';
import { LinkGroupBeanSchema, type LinkGroupBean } from './linkGroupBean.js';

export type OpsbarBean = {
    linkGroups?: Array<LinkGroupBean>;
};

export const OpsbarBeanSchema = z.lazy(() => z.looseObject({
  linkGroups: z.array(LinkGroupBeanSchema).optional(),
})) as unknown as z.ZodType<OpsbarBean>;
