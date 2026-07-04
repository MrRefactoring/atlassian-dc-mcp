/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestAutoMergeProjectSettingsRequest = {
    enabled?: boolean;
    restrictionAction?: RestAutoMergeProjectSettingsRequest.restrictionAction;
};
export namespace RestAutoMergeProjectSettingsRequest {
    export enum restrictionAction {
        CREATE = 'CREATE',
        DELETE = 'DELETE',
        NONE = 'NONE',
    }
}

