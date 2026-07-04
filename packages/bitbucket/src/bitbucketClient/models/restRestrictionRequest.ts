/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestApplicationUser } from './restApplicationUser.js';
import type { RestSshAccessKey } from './restSshAccessKey.js';
export type RestRestrictionRequest = {
    accessKeyIds?: Array<number>;
    accessKeys?: Array<RestSshAccessKey>;
    groupNames?: Array<string>;
    groups?: Array<string>;
    readonly id?: number;
    matcher?: {
        displayId?: string;
        id?: string;
        type?: {
            id?: RestRestrictionRequest.id;
            name?: string;
        };
    };
    readonly scope?: {
        resourceId?: number;
        type?: RestRestrictionRequest.type;
    };
    type?: string;
    userSlugs?: Array<string>;
    users?: Array<RestApplicationUser>;
};
export namespace RestRestrictionRequest {
    export enum id {
        ANY_REF = 'ANY_REF',
        BRANCH = 'BRANCH',
        PATTERN = 'PATTERN',
        MODEL_CATEGORY = 'MODEL_CATEGORY',
        MODEL_BRANCH = 'MODEL_BRANCH',
    }
    export enum type {
        GLOBAL = 'GLOBAL',
        PROJECT = 'PROJECT',
        REPOSITORY = 'REPOSITORY',
    }
}


