/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReindexRequestBean = {
    completionTime?: string;
    id?: number;
    requestTime?: string;
    startTime?: string;
    status?: ReindexRequestBean.status;
    type?: ReindexRequestBean.type;
};
export namespace ReindexRequestBean {
    export enum status {
        PENDING = 'PENDING',
        ACTIVE = 'ACTIVE',
        RUNNING = 'RUNNING',
        FAILED = 'FAILED',
        COMPLETE = 'COMPLETE',
    }
    export enum type {
        IMMEDIATE = 'IMMEDIATE',
        DELAYED = 'DELAYED',
    }
}

