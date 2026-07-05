import { z } from 'zod';

export type NodeBean = {
    alive?: boolean;
    cacheListenerPort?: number;
    ip?: string;
    lastStateChangeTimestamp?: number;
    nodeBuildNumber?: number;
    nodeId?: string;
    nodeVersion?: string;
    state?: NodeBean.state;
};

export namespace NodeBean {
    export enum state {
        ACTIVE = 'ACTIVE',
        PASSIVE = 'PASSIVE',
        ACTIVATING = 'ACTIVATING',
        PASSIVATING = 'PASSIVATING',
        OFFLINE = 'OFFLINE',
    }
}

const NodeBean_stateSchema = z.enum(['ACTIVE', 'PASSIVE', 'ACTIVATING', 'PASSIVATING', 'OFFLINE']);

export const NodeBeanSchema = z.looseObject({
  alive: z.boolean().optional(),
  cacheListenerPort: z.number().optional(),
  ip: z.string().optional(),
  lastStateChangeTimestamp: z.number().optional(),
  nodeBuildNumber: z.number().optional(),
  nodeId: z.string().optional(),
  nodeVersion: z.string().optional(),
  state: NodeBean_stateSchema.optional(),
}) as unknown as z.ZodType<NodeBean>;
