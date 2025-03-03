/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NodeBuildInfo } from './NodeBuildInfo.js';
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

