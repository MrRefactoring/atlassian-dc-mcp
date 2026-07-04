/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExamplePostMultipartFormData = {
    /**
     * The hook script contents.
     */
    content?: string;
    /**
     * A description of the hook script (useful when querying registered hook scripts).
     */
    description?: string;
    /**
     * The name of the hook script (useful when querying registered hook scripts).
     */
    name?: string;
    /**
     * The type of hook script; supported values are "PRE" for pre-receive hooks and "POST" for post-receive hooks.
     */
    type?: string;
};

