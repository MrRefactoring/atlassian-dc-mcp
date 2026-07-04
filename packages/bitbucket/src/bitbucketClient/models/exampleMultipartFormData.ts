/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExampleMultipartFormData = {
    /**
     * The branch on which the <code>path</code> should be modified or created.
     */
    branch?: string;
    /**
     * The full content of the file at <code>path</code>.
     */
    content?: string;
    /**
     * The message associated with this change, to be used as the commit message. Or null if the default message should be used.
     */
    message?: string;
    /**
     * The starting point for <code>branch</code>. If provided and different from <code>branch</code>, <code>branch</code> will be created as a new branch, branching off from <code>sourceBranch</code>.
     */
    sourceBranch?: string;
    /**
     * The commit ID of the file before it was edited, used to identify if content has changed. Or null if this is a new file
     */
    sourceCommitId?: string;
};

