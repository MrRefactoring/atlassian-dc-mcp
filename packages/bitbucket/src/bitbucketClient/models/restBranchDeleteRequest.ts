/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestBranchDeleteRequest = {
    /**
     * Don't actually delete the ref name, just do a dry run
     */
    dryRun?: boolean;
    /**
     * Commit ID that the provided ref name is expected to point to
     */
    endPoint?: string;
    /**
     * Name of the ref to be deleted
     */
    name?: string;
};

