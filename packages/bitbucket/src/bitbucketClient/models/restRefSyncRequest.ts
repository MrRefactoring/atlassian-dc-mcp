/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Context } from './context.js';
export type RestRefSyncRequest = {
    action?: RestRefSyncRequest.action;
    context?: Context;
    refId?: string;
};
export namespace RestRefSyncRequest {
    export enum action {
        DISCARD = 'DISCARD',
        MERGE = 'MERGE',
        REBASE = 'REBASE',
    }
}


