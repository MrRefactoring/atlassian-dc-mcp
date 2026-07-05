import { z } from 'zod';

export type AssociateProjectsBean = {
    idsOrKeys?: Array<string>;
};

export const AssociateProjectsBeanSchema = z.looseObject({
  idsOrKeys: z.array(z.string()).optional(),
}) as unknown as z.ZodType<AssociateProjectsBean>;
