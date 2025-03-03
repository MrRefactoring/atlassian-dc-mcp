/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { issueLinks } from '../models/issueLinks.js';
import type { LinkIssueRequestJsonBean } from '../models/LinkIssueRequestJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IssueLinkService {
    /**
     * Create an issue link between two issues
     * Creates an issue link between two issues.
     * @param requestBody All information about the link relationship. Which issues to link, which issue link type to use and an optional comment that will be added to the first issue.
     * @returns any Returned if the issue link was created successfully.
     * @throws ApiError
     */
    public static linkIssues(
        requestBody: LinkIssueRequestJsonBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issueLink',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if it can't create the supplied comment.`,
                401: `Returned if the user does not have the link issue permission for the issue, which will be linked to another issue.`,
                404: `Returned if issue linking is disabled or it failed to find one of the issues (issue might exist, but it is not visible for this user) or it failed to find the specified issue link type.`,
                500: `Returned if an error occurred when creating the issue link or the comment.`,
            },
        });
    }
    /**
     * Get an issue link with the specified id
     * Returns an issue link with the specified id.
     * @param linkId The issue link id.
     * @returns issueLinks Returned if the request was successful.
     * @throws ApiError
     */
    public static getIssueLink(
        linkId: string,
    ): CancelablePromise<issueLinks> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issueLink/{linkId}',
            path: {
                'linkId': linkId,
            },
            errors: {
                400: `Returned if the specified issue link id is invalid.`,
                401: `Returned if the user does not have the link issue permission for the issue, which will be linked to another issue.`,
                404: `Returned if issue linking is disabled or it failed to find an issue link with the specified id. Either because none exists with this id, or the user doesn't have the permission to see one of the linked issues.`,
                500: `Returned if an error occurred when creating the issue link or the comment.`,
            },
        });
    }
    /**
     * Delete an issue link with the specified id
     * Deletes an issue link with the specified id.
     * @param linkId The issue link id.
     * @returns void
     * @throws ApiError
     */
    public static deleteIssueLink(
        linkId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issueLink/{linkId}',
            path: {
                'linkId': linkId,
            },
            errors: {
                400: `Returned if the specified issue link id is invalid.`,
                401: `Returned if the user does not have the link issue permission for the source or destination issue of the issue link.`,
                404: `Returned if issue linking is disabled or it failed to find an issue link with the specified id. Either because none exists with this id, or the user doesn't have the permission to see one of the linked issues.`,
                500: `Returned if an error occurred when deleting the issue link or the comment.`,
            },
        });
    }
}
