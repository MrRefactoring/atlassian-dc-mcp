/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestBuildStatusSetRequest = {
    buildNumber?: string;
    description?: string;
    duration?: number;
    key: string;
    lastUpdated?: number;
    name?: string;
    parent?: string;
    ref?: string;
    state: RestBuildStatusSetRequest.state;
    testResults?: {
        failed?: number;
        skipped?: number;
        successful?: number;
    };
    url: string;
};
export namespace RestBuildStatusSetRequest {
    export enum state {
        CANCELLED = 'CANCELLED',
        FAILED = 'FAILED',
        INPROGRESS = 'INPROGRESS',
        SUCCESSFUL = 'SUCCESSFUL',
        UNKNOWN = 'UNKNOWN',
    }
}

