/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DefaultBean } from '../models/DefaultBean.js';
import type { IssueTypeMappingBean } from '../models/IssueTypeMappingBean.js';
import type { WorkflowMappingBean } from '../models/WorkflowMappingBean.js';
import type { WorkflowSchemeBean } from '../models/WorkflowSchemeBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class WorkflowschemeService {
    /**
     * Create a new workflow scheme
     * Create a new workflow scheme. The body contains a representation of the new scheme. Values not passed are assumed to be set to their defaults.
     * @param requestBody The body contains a representation of the new scheme. Values not passed are assumed to be set to their defaults.
     * @returns any The newly created scheme.
     * @throws ApiError
     */
    public static createScheme(
        requestBody: WorkflowSchemeBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/workflowscheme',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
            },
        });
    }
    /**
     * Get requested workflow scheme by ID
     * Returns the requested workflow scheme to the caller.
     * @param id
     * @param returnDraftIfExists
     * @returns WorkflowSchemeBean Returned if the scheme exists and the caller has permission to see it.
     * @throws ApiError
     */
    public static getById(
        id: number,
        returnDraftIfExists: boolean = false,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}',
            path: {
                'id': id,
            },
            query: {
                'returnDraftIfExists': returnDraftIfExists,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme does not exist.`,
            },
        });
    }
    /**
     * Update a specified workflow scheme
     * Update the passed workflow scheme. The body of the request is a representation of the workflow scheme. Values not passed are assumed to indicate no change for that field.
     * The passed representation can have its updateDraftIfNeeded flag set to true to indicate that the draft
     * should be created and/or updated when the actual scheme cannot be edited (e.g. when the scheme is being used by
     * a project). Values not appearing the body will not be touched.
     * @param id
     * @param requestBody The body of the request is a representation of the workflow scheme. Values not passed are assumed to indicate no change for that field.
     * @returns WorkflowSchemeBean The updated scheme.
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: WorkflowSchemeBean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme does not exist.`,
            },
        });
    }
    /**
     * Delete the specified workflow scheme
     * Delete the passed workflow scheme.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteScheme(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Returned if the requested scheme is active (i.e. being used by Jira).`,
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme does not exist.`,
            },
        });
    }
    /**
     * Create a draft for a workflow scheme
     * Create a draft for the passed scheme. The draft will be a copy of the state of the parent.
     * @param id
     * @returns WorkflowSchemeBean The newly created scheme.
     * @throws ApiError
     */
    public static createDraftForParent(
        id: number,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/workflowscheme/{id}/createdraft',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme does not exist.`,
            },
        });
    }
    /**
     * Get default workflow for a scheme
     * Return the default workflow from the passed workflow scheme.
     * @param id
     * @param returnDraftIfExists
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static getDefault(
        id: number,
        returnDraftIfExists: boolean = false,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/default',
            path: {
                'id': id,
            },
            query: {
                'returnDraftIfExists': returnDraftIfExists,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the workflow scheme does not exist.`,
            },
        });
    }
    /**
     * Update default workflow for a scheme
     * Set the default workflow for the passed workflow scheme. The passed representation can have its
     * updateDraftIfNeeded flag set to true to indicate that the draft should be created/updated when the actual scheme
     * cannot be edited.
     * @param id
     * @param requestBody The new default.
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static updateDefault(
        id: number,
        requestBody: DefaultBean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/default',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the scheme does not exist.`,
            },
        });
    }
    /**
     * Remove default workflow from a scheme
     * Remove the default workflow from the passed workflow scheme.
     * @param id
     * @param updateDraftIfNeeded
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static deleteDefault(
        id: number,
        updateDraftIfNeeded?: boolean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/default',
            path: {
                'id': id,
            },
            query: {
                'updateDraftIfNeeded': updateDraftIfNeeded,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the scheme does not exist.`,
            },
        });
    }
    /**
     * Get requested draft workflow scheme by ID
     * Returns the requested draft workflow scheme to the caller.
     * @param id
     * @returns WorkflowSchemeBean Returned if the scheme exists and the caller has permission to see it.
     * @throws ApiError
     */
    public static getDraftById(
        id: number,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/draft',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested draft scheme does not exist.`,
            },
        });
    }
    /**
     * Update a draft workflow scheme
     * Update a draft workflow scheme. The draft will created if necessary. The body of the request is a representation of the workflow scheme. Values not passed are assumed to indicate no change for that field.
     * @param id
     * @param requestBody The body of the request is a representation of the workflow scheme. Values not passed are assumed to indicate no change for that field.
     * @returns WorkflowSchemeBean The updated/created scheme.
     * @throws ApiError
     */
    public static updateDraft(
        id: number,
        requestBody: WorkflowSchemeBean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/draft',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme does not exist.`,
            },
        });
    }
    /**
     * Delete the specified draft workflow scheme
     * Delete the passed draft workflow scheme.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteDraftById(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/draft',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested draft scheme or parent scheme does not exist.`,
            },
        });
    }
    /**
     * Get default workflow for a draft scheme
     * Return the default workflow from the passed draft workflow scheme to the caller.
     * @param id
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static getDraftDefault(
        id: number,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/draft/default',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the workflow scheme does not exist.`,
            },
        });
    }
    /**
     * Update default workflow for a draft scheme
     * Set the default workflow for the passed draft workflow scheme.
     * @param id
     * @param requestBody The new default.
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static updateDraftDefault(
        id: number,
        requestBody: DefaultBean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/draft/default',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the scheme does not exist.`,
            },
        });
    }
    /**
     * Remove default workflow from a draft scheme
     * Remove the default workflow from the passed draft workflow scheme.
     * @param id
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static deleteDraftDefault(
        id: number,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/draft/default',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the scheme does not exist.`,
            },
        });
    }
    /**
     * Get issue type mapping for a draft scheme
     * Returns the issue type mapping for the passed draft workflow scheme.
     * @param issueType
     * @param id
     * @returns IssueTypeMappingBean Returned on success.
     * @throws ApiError
     */
    public static getDraftIssueType(
        issueType: string,
        id: number,
    ): CancelablePromise<IssueTypeMappingBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/draft/issuetype/{issueType}',
            path: {
                'issueType': issueType,
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or issue type does not exist.`,
            },
        });
    }
    /**
     * Set an issue type mapping for a draft scheme
     * Set the issue type mapping for the passed draft scheme. The passed representation can have its updateDraftIfNeeded flag set to true to indicate that
     * the draft should be created/updated when the actual scheme cannot be edited.
     * @param issueType
     * @param id
     * @param requestBody The new mapping for the issue type.
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static setDraftIssueType(
        issueType: string,
        id: number,
        requestBody: IssueTypeMappingBean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/draft/issuetype/{issueType}',
            path: {
                'issueType': issueType,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or issue type does not exist.`,
            },
        });
    }
    /**
     * Delete an issue type mapping from a draft scheme
     * Remove the specified issue type mapping from the draft scheme.
     * @param issueType
     * @param id
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static deleteDraftIssueType(
        issueType: string,
        id: number,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/draft/issuetype/{issueType}',
            path: {
                'issueType': issueType,
                'id': id,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or issue type does not exist.`,
            },
        });
    }
    /**
     * Get draft workflow mappings
     * Returns the draft workflow mappings or requested mapping to the caller.
     * @param id
     * @param workflowName
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static getDraftWorkflow(
        id: number,
        workflowName?: string,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/draft/workflow',
            path: {
                'id': id,
            },
            query: {
                'workflowName': workflowName,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or workflow does not exist.`,
            },
        });
    }
    /**
     * Update a workflow mapping in a draft scheme
     * Update the draft scheme to include the passed mapping. The body is a representation of the workflow mapping. Values not passed are assumed to indicate no change for that field.
     * @param id
     * @param requestBody The body is a representation of the workflow mapping. Values not passed are assumed to indicate no change for that field.
     * @param workflowName
     * @returns WorkflowSchemeBean The updated scheme.
     * @throws ApiError
     */
    public static updateDraftWorkflowMapping(
        id: number,
        requestBody: WorkflowMappingBean,
        workflowName?: string,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/draft/workflow',
            path: {
                'id': id,
            },
            query: {
                'workflowName': workflowName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
            },
        });
    }
    /**
     * Delete a workflow mapping from a draft scheme
     * Delete the passed workflow from the draft workflow scheme.
     * @param id
     * @param workflowName
     * @returns WorkflowSchemeBean The scheme with the workflow deleted.
     * @throws ApiError
     */
    public static deleteDraftWorkflowMapping(
        id: number,
        workflowName?: string,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/draft/workflow',
            path: {
                'id': id,
            },
            query: {
                'workflowName': workflowName,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme or workflow does not exist.`,
            },
        });
    }
    /**
     * Get issue type mapping for a scheme
     * Returns the issue type mapping for the passed workflow scheme.
     * @param issueType
     * @param id
     * @param returnDraftIfExists
     * @returns IssueTypeMappingBean Returned on success.
     * @throws ApiError
     */
    public static getIssueType(
        issueType: string,
        id: number,
        returnDraftIfExists: boolean = false,
    ): CancelablePromise<IssueTypeMappingBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/issuetype/{issueType}',
            path: {
                'issueType': issueType,
                'id': id,
            },
            query: {
                'returnDraftIfExists': returnDraftIfExists,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or issue type does not exist.`,
            },
        });
    }
    /**
     * Set an issue type mapping for a scheme
     * Set the issue type mapping for the passed scheme. The passed representation can have its updateDraftIfNeeded flag set to true to indicate that
     * the draft should be created/updated when the actual scheme cannot be edited.
     * @param issueType
     * @param id
     * @param requestBody The new mapping for the issue type.
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static setIssueType(
        issueType: string,
        id: number,
        requestBody: IssueTypeMappingBean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/issuetype/{issueType}',
            path: {
                'issueType': issueType,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or issue type does not exist.`,
            },
        });
    }
    /**
     * Delete an issue type mapping from a scheme
     * Remove the specified issue type mapping from the scheme.
     * @param issueType
     * @param id
     * @param updateDraftIfNeeded
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static deleteIssueType(
        issueType: string,
        id: number,
        updateDraftIfNeeded?: boolean,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/issuetype/{issueType}',
            path: {
                'issueType': issueType,
                'id': id,
            },
            query: {
                'updateDraftIfNeeded': updateDraftIfNeeded,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or issue type does not exist.`,
            },
        });
    }
    /**
     * Get workflow mappings for a scheme
     * Returns the workflow mappings or requested mapping to the caller for the passed scheme.
     * @param id
     * @param workflowName
     * @param returnDraftIfExists
     * @returns WorkflowSchemeBean Returned on success.
     * @throws ApiError
     */
    public static getWorkflow(
        id: number,
        workflowName?: string,
        returnDraftIfExists: boolean = false,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/workflowscheme/{id}/workflow',
            path: {
                'id': id,
            },
            query: {
                'workflowName': workflowName,
                'returnDraftIfExists': returnDraftIfExists,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if either the requested scheme or workflow does not exist.`,
            },
        });
    }
    /**
     * Update a workflow mapping in a scheme
     * Update the scheme to include the passed mapping. The body is a representation of the workflow mapping. Values not passed are assumed to indicate no change for that field.
     * The passed representation can have its updateDraftIfNeeded flag set to true to indicate that the draft
     * should be created/updated when the actual scheme cannot be edited.
     * @param id
     * @param requestBody The body is a representation of the workflow mapping. Values not passed are assumed to indicate no change for that field.
     * @param workflowName
     * @returns WorkflowSchemeBean The updated scheme.
     * @throws ApiError
     */
    public static updateWorkflowMapping(
        id: number,
        requestBody: WorkflowMappingBean,
        workflowName?: string,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/workflowscheme/{id}/workflow',
            path: {
                'id': id,
            },
            query: {
                'workflowName': workflowName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
            },
        });
    }
    /**
     * Delete a workflow mapping from a scheme
     * Delete the passed workflow from the workflow scheme.
     * @param id
     * @param updateDraftIfNeeded
     * @param workflowName
     * @returns WorkflowSchemeBean The scheme with the workflow deleted.
     * @throws ApiError
     */
    public static deleteWorkflowMapping(
        id: number,
        updateDraftIfNeeded?: boolean,
        workflowName?: string,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/workflowscheme/{id}/workflow',
            path: {
                'id': id,
            },
            query: {
                'updateDraftIfNeeded': updateDraftIfNeeded,
                'workflowName': workflowName,
            },
            errors: {
                401: `Returned if there is no user or if the user has not entered a websudo session.`,
                404: `Returned if the requested scheme or workflow does not exist.`,
            },
        });
    }
}
