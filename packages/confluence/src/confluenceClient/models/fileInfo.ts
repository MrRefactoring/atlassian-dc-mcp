/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FileInfo = {
    name?: string;
    creationTime?: string;
    size?: number;
    jobScope?: FileInfo.jobScope;
};
export namespace FileInfo {
    export enum jobScope {
        SPACE = 'SPACE',
        SITE = 'SITE',
    }
}

