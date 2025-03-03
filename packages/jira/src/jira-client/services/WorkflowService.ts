/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class WorkflowService {
    /**
     * Get all workflows
     * Returns all workflows. The “lastModifiedDate” is returned in Jira Complete Date/Time Format (dd/MMM/yy h:mm by default), but can also be returned as a relative date.
     * @param workflowName an optional String containing workflow name. If not passed then all workflows are returned
     * @returns any Returned if the currently authenticated user has administration permission. Contains a full representation of every workflow.
     * @throws ApiError
     */
    public static getAllWorkflows(
        workflowName?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflow',
            query: {
                'workflowName': workflowName,
            },
            errors: {
                401: `Returned if the currently authenticated user does not have administration permission.`,
            },
        });
    }
}
