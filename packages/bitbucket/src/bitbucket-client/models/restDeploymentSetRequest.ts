/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestDeploymentEnvironment } from './restDeploymentEnvironment.js';
export type RestDeploymentSetRequest = {
    deploymentSequenceNumber: number;
    description: string;
    displayName: string;
    environment: RestDeploymentEnvironment;
    key: string;
    lastUpdated?: number;
    state: RestDeploymentSetRequest.state;
    url: string;
};
export namespace RestDeploymentSetRequest {
    export enum state {
        PENDING = 'PENDING',
        IN_PROGRESS = 'IN_PROGRESS',
        CANCELLED = 'CANCELLED',
        FAILED = 'FAILED',
        ROLLED_BACK = 'ROLLED_BACK',
        SUCCESSFUL = 'SUCCESSFUL',
        UNKNOWN = 'UNKNOWN',
    }
}


