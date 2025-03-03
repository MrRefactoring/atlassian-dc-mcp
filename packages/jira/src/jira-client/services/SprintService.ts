/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EntityPropertyBean } from '../models/EntityPropertyBean.js';
import type { IssueAssignRequestBean } from '../models/IssueAssignRequestBean.js';
import type { SearchResultsBean } from '../models/SearchResultsBean.js';
import type { SprintBean } from '../models/SprintBean.js';
import type { SprintCreateBean } from '../models/SprintCreateBean.js';
import type { SprintSwapBean } from '../models/SprintSwapBean.js';
import type { StringList } from '../models/StringList.js';
import type { UnmapSprintsBean } from '../models/UnmapSprintsBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SprintService {
    /**
     * Create a future sprint
     * Creates a future sprint. Sprint name and origin board id are required. Start and end date are optional. Notes: The sprint name is trimmed. Only Jira administrators can create synced sprints.
     * @param requestBody The sprint to create.
     * @returns SprintBean Returns the created sprint.
     * @throws ApiError
     */
    public static createSprint(
        requestBody: SprintCreateBean,
    ): CancelablePromise<SprintBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/sprint',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Unmap sprints from being synced
     * Sets the Synced flag to false for all sprints in the provided list.
     * @param requestBody The sprints to unmap.
     * @returns void
     * @throws ApiError
     */
    public static unmapSprints(
        requestBody: UnmapSprintsBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/sprint/unmap',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have permission to unmap sprints.`,
                404: `Returned if at least one sprint does not exist or user does not have permission to view to at least one sprint.`,
            },
        });
    }
    /**
     * Unmap all sprints from being synced
     * Sets the Synced flag to false for all sprints on this Jira instance. This operation is intended for cleanup only. It is highly destructive and not reversible. Use with caution.
     * @returns void
     * @throws ApiError
     */
    public static unmapAllSprints(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/sprint/unmap-all',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have permission to unmap sprints.`,
                404: `Returned if at least one sprint does not exist or user does not have permission to view to at least one sprint.`,
            },
        });
    }
    /**
     * Get sprint by id
     * Returns a single sprint, for a given sprint Id. The sprint will only be returned if the user can view the board that the sprint was created on, or view at least one of the issues in the sprint.
     * @param sprintId
     * @returns SprintBean Returns the requested sprint.
     * @throws ApiError
     */
    public static getSprint(
        sprintId: number,
    ): CancelablePromise<SprintBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/sprint/{sprintId}',
            path: {
                'sprintId': sprintId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the sprint does not exist.`,
            },
        });
    }
    /**
     * Update a sprint fully
     * Performs a full update of a sprint.
     * A full update means that the result will be exactly the same as the request body.
     * Any fields not present in the request JSON will be set to null.
     * Notes:
     * - Sprints that are in a closed state cannot be updated.
     * - A sprint can be started by updating the state to 'active'. This requires the sprint to be in the 'future' state and have a startDate and endDate set.
     * - A sprint can be completed by updating the state to 'closed'. This action requires the sprint to be in the 'active' state. This sets the completeDate to the time of the request.
     * If the sprint has offending issues (those which are complete, but have incomplete subtasks) it cannot be closed.
     * If issues are moved to new sprint user has to have issues edit permissions.
     * - Other changes to state are not allowed.
     * - The completeDate field cannot be updated manually.
     * - Only Jira administrators can edit dates on sprints that are marked as synced.
     * @param sprintId
     * @param requestBody The updated sprint.
     * @returns SprintBean Returns the updated sprint.
     * @throws ApiError
     */
    public static updateSprint(
        sprintId: number,
        requestBody: SprintBean,
    ): CancelablePromise<SprintBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/sprint/{sprintId}',
            path: {
                'sprintId': sprintId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the sprint does not exist.`,
            },
        });
    }
    /**
     * Partially update a sprint
     * Performs a partial update of a sprint.
     * A partial update means that fields not present in the request JSON will not be updated.
     * Notes:
     * - Sprints that are in a closed state cannot be updated.
     * - A sprint can be started by updating the state to 'active'. This requires the sprint to be in the 'future' state and have a startDate and endDate set.
     * - A sprint can be completed by updating the state to 'closed'. This action requires the sprint to be in the 'active' state. This sets the completeDate to the time of the request.
     * If the sprint has offending issues (those which are complete, but have incomplete subtasks) it cannot be closed.
     * If issues are moved to new sprint user has to have issues edit permissions.
     * - Other changes to state are not allowed.
     * - The completeDate field cannot be updated manually.
     * - Sprint goal can be removed by updating it's value to empty string
     * - Only Jira administrators can edit dates on sprints that are marked as synced.
     * @param sprintId
     * @param requestBody The updated sprint.
     * @returns SprintBean Returns the updated sprint.
     * @throws ApiError
     */
    public static partiallyUpdateSprint(
        sprintId: number,
        requestBody: SprintBean,
    ): CancelablePromise<SprintBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/sprint/{sprintId}',
            path: {
                'sprintId': sprintId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the sprint does not exist.`,
            },
        });
    }
    /**
     * Delete a sprint
     * Deletes a sprint. Once a sprint is deleted, all issues in the sprint will be moved to the backlog. To delete a synced sprint, you must unsync it first.
     * @param sprintId
     * @returns void
     * @throws ApiError
     */
    public static deleteSprint(
        sprintId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/agile/1.0/sprint/{sprintId}',
            path: {
                'sprintId': sprintId,
            },
            errors: {
                400: `Returned if the sprint is active or completed.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have permission to delete sprints.`,
                404: `Returned if the sprint does not exist.`,
            },
        });
    }
    /**
     * Get all issues in a sprint
     * Returns all issues in a sprint, for a given sprint Id. This only includes issues that the user has permission to view. By default, the returned issues are ordered by rank.
     * @param sprintId
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns SearchResultsBean Returns the requested issues, at the specified page of the results.
     * @throws ApiError
     */
    public static getIssuesForSprint1(
        sprintId: number,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<SearchResultsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/sprint/{sprintId}/issue',
            path: {
                'sprintId': sprintId,
            },
            query: {
                'expand': expand,
                'jql': jql,
                'maxResults': maxResults,
                'validateQuery': validateQuery,
                'fields': fields,
                'startAt': startAt,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if sprint does not exist or the user cannot view it.`,
            },
        });
    }
    /**
     * Move issues to a sprint
     * Moves issues to a sprint, for a given sprint Id. Issues can only be moved to open or active sprints. The maximum number of issues that can be moved in one operation is 50.
     * @param sprintId
     * @param requestBody The issues to move.
     * @returns void
     * @throws ApiError
     */
    public static moveIssuesToSprint(
        sprintId: number,
        requestBody: IssueAssignRequestBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/sprint/{sprintId}/issue',
            path: {
                'sprintId': sprintId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have permission to assign issues.`,
                404: `Returned if the sprint does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all properties keys for a sprint
     * Returns the keys of all properties for the sprint identified by the id. The user who retrieves the property keys is required to have permissions to view the sprint.
     * @param sprintId
     * @returns EntityPropertiesKeysBean Returns the requested property keys.
     * @throws ApiError
     */
    public static getPropertiesKeys1(
        sprintId: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/sprint/{sprintId}/properties',
            path: {
                'sprintId': sprintId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the calling user does not have permission to view the sprint.`,
                404: `Returned if the sprint does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get a property for a sprint
     * Returns the value of the property with a given key from the sprint identified by the provided id. The user who retrieves the property is required to have permissions to view the sprint.
     * @param propertyKey
     * @param sprintId
     * @returns EntityPropertyBean Returns the requested property.
     * @throws ApiError
     */
    public static getProperty1(
        propertyKey: string,
        sprintId: string,
    ): CancelablePromise<EntityPropertyBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/sprint/{sprintId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'sprintId': sprintId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the calling user does not have permission to view the sprint.`,
                404: `Returned if the sprint does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Update a sprint's property
     * Sets the value of the specified sprint's property. You can use this resource to store a custom data against the sprint identified by the id. The user who stores the data is required to have permissions to modify the sprint.
     * @param propertyKey
     * @param sprintId
     * @returns any Returned if the sprint property is successfully updated.
     * @throws ApiError
     */
    public static setProperty1(
        propertyKey: string,
        sprintId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/sprint/{sprintId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'sprintId': sprintId,
            },
            errors: {
                400: `Returned if the sprintId is invalid (negative or not a number).`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the sprint`,
                404: `Returned if the sprint with given id does not exist.`,
            },
        });
    }
    /**
     * Delete a sprint's property
     * Removes the property from the sprint identified by the id. Ths user removing the property is required to have permissions to modify the sprint.
     * @param propertyKey
     * @param sprintId
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty1(
        propertyKey: string,
        sprintId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/agile/1.0/sprint/{sprintId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'sprintId': sprintId,
            },
            errors: {
                400: `Returned if the sprintId is invalid (negative or not a number).`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to modify the sprint.`,
                404: `Returned if the sprint with given id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Swap the position of two sprints
     * Swap the position of the sprint with the second sprint.
     * @param sprintId
     * @param requestBody The sprint to swap with.
     * @returns void
     * @throws ApiError
     */
    public static swapSprint(
        sprintId: number,
        requestBody: SprintSwapBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/sprint/{sprintId}/swap',
            path: {
                'sprintId': sprintId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have permission to at least one sprint.`,
                404: `Returned if at least one sprint does not exist or user does not have permission to view to at least one sprint.`,
            },
        });
    }
}
