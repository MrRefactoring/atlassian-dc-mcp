import { z } from 'zod';

export type VersionMoveBean = {
    after?: string;
    position?: VersionMoveBean.position;
};

export namespace VersionMoveBean {
    export enum position {
        EARLIER = 'Earlier',
        LATER = 'Later',
        FIRST = 'First',
        LAST = 'Last',
    }
}

const VersionMoveBean_positionSchema = z.enum(['Earlier', 'Later', 'First', 'Last']);

export const VersionMoveBeanSchema = z.looseObject({
  after: z.string().optional(),
  position: VersionMoveBean_positionSchema.optional(),
}) as unknown as z.ZodType<VersionMoveBean>;
