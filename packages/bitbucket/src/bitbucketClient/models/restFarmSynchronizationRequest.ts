/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestFarmSynchronizationRequest = {
    attempt?: number;
    createdAt?: string;
    externalRepoId?: string;
    type?: RestFarmSynchronizationRequest.type;
};
export namespace RestFarmSynchronizationRequest {
    export enum type {
        INCREMENTAL = 'incremental',
        SNAPSHOT = 'snapshot',
    }
}

