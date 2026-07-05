import { z } from 'zod';

export type MoveFieldBean = {
  after?: string;
  position?: MoveFieldBean.position;
};

export namespace MoveFieldBean {
  export enum position {
    EARLIER = 'Earlier',
    LATER = 'Later',
    FIRST = 'First',
    LAST = 'Last',
  }
}

const MoveFieldBean_positionSchema = z.enum(['Earlier', 'Later', 'First', 'Last']);

export const MoveFieldBeanSchema = z.looseObject({
  after: z.string().optional(),
  position: MoveFieldBean_positionSchema.optional(),
}) as unknown as z.ZodType<MoveFieldBean>;
