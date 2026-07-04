/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestApplicationUser } from './restApplicationUser.js';
import type { RestReviewerGroup } from './restReviewerGroup.js';
export type RestDefaultReviewersRequest = {
    requiredApprovals?: number;
    reviewerGroups?: Array<RestReviewerGroup>;
    reviewers?: Array<RestApplicationUser>;
    sourceMatcher?: {
        displayId?: string;
        id?: string;
        type?: {
            id?: RestDefaultReviewersRequest.id;
            name?: string;
        };
    };
    targetMatcher?: {
        displayId?: string;
        id?: string;
        type?: {
            id?: RestDefaultReviewersRequest.id;
            name?: string;
        };
    };
};
export namespace RestDefaultReviewersRequest {
    export enum id {
        ANY_REF = 'ANY_REF',
        BRANCH = 'BRANCH',
        PATTERN = 'PATTERN',
        MODEL_CATEGORY = 'MODEL_CATEGORY',
        MODEL_BRANCH = 'MODEL_BRANCH',
    }
}


