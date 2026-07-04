/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestGitTagCreateRequest = {
    force?: boolean;
    message?: string;
    name?: string;
    startPoint?: string;
    type?: RestGitTagCreateRequest.type;
};
export namespace RestGitTagCreateRequest {
    export enum type {
        ANNOTATED = 'ANNOTATED',
        LIGHTWEIGHT = 'LIGHTWEIGHT',
    }
}

