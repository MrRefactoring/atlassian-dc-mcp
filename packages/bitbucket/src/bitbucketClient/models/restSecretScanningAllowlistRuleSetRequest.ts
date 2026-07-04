/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestSecretScanningAllowlistRuleSetRequest = {
    /**
     * Regular expression for matching a secret on a code line
     */
    lineRegex?: string;
    /**
     * Human readable name for the rule
     */
    name?: string;
    /**
     * Regular expression matching file names
     */
    pathRegex?: string;
};

