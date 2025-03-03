/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueAssignRequestBean } from '../models/IssueAssignRequestBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class BacklogService {
    /**
     * Update issues to move them to the backlog
     * Move issues to the backlog. This operation is equivalent to remove future and active sprints from a given set of issues. At most 50 issues may be moved at once.
     * @param requestBody The issues to move to the backlog.
     * @returns void
     * @throws ApiError
     */
    public static moveIssuesToBacklog(
        requestBody: IssueAssignRequestBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/backlog/issue',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if user does not a have valid license or does not have permission to assign issues.`,
                404: `Returned if sprint does not exist or the user cannot view it.`,
            },
        });
    }
}
