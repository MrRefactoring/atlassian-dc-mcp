import { z } from 'zod';
import { NodeBuildInfoSchema, type NodeBuildInfo } from './nodeBuildInfo.js';

export type ClusterState = {
  build?: NodeBuildInfo;
  state?: ClusterState.state;
};

export namespace ClusterState {
  export enum state {
    STABLE = 'STABLE',
    READY_TO_UPGRADE = 'READY_TO_UPGRADE',
    MIXED = 'MIXED',
    READY_TO_RUN_UPGRADE_TASKS = 'READY_TO_RUN_UPGRADE_TASKS',
    RUNNING_UPGRADE_TASKS = 'RUNNING_UPGRADE_TASKS',
    UPGRADE_TASKS_FAILED = 'UPGRADE_TASKS_FAILED',
  }
}

const ClusterState_stateSchema = z.enum(['STABLE', 'READY_TO_UPGRADE', 'MIXED', 'READY_TO_RUN_UPGRADE_TASKS', 'RUNNING_UPGRADE_TASKS', 'UPGRADE_TASKS_FAILED']);

export const ClusterStateSchema = z.lazy(() => z.looseObject({
  build: NodeBuildInfoSchema.optional(),
  state: ClusterState_stateSchema.optional(),
})) as unknown as z.ZodType<ClusterState>;
