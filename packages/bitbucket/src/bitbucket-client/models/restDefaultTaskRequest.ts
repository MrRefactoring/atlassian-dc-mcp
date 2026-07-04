/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestDefaultTaskRequest = {
    description?: string;
    sourceMatcher?: {
        displayId?: string;
        id?: string;
        type?: {
            id?: RestDefaultTaskRequest.id;
            name?: string;
        };
    };
    targetMatcher?: {
        displayId?: string;
        id?: string;
        type?: {
            id?: RestDefaultTaskRequest.id;
            name?: string;
        };
    };
};
export namespace RestDefaultTaskRequest {
    export enum id {
        ANY_REF = 'ANY_REF',
        BRANCH = 'BRANCH',
        PATTERN = 'PATTERN',
        MODEL_CATEGORY = 'MODEL_CATEGORY',
        MODEL_BRANCH = 'MODEL_BRANCH',
    }
}

