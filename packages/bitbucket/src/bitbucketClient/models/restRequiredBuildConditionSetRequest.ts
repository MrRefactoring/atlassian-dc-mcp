/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestRefMatcher } from './restRefMatcher.js';
export type RestRequiredBuildConditionSetRequest = {
    /**
     * A non-empty list of build parent keys that require green builds for this merge check to pass
     */
    buildParentKeys: Array<string>;
    exemptRefMatcher?: {
        displayId?: string;
        id?: string;
        type?: {
            id?: RestRequiredBuildConditionSetRequest.id;
            name?: string;
        };
    };
    refMatcher: RestRefMatcher;
};
export namespace RestRequiredBuildConditionSetRequest {
    export enum id {
        ANY_REF = 'ANY_REF',
        BRANCH = 'BRANCH',
        PATTERN = 'PATTERN',
        MODEL_CATEGORY = 'MODEL_CATEGORY',
        MODEL_BRANCH = 'MODEL_BRANCH',
    }
}


