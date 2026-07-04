/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentVersionService {
    /**
     * Delete content history
     * Delete a historical version of a page or a blogpost. Current user must have edit permission on content, or it will throw a permission exception.
     * @param id The id of the content
     * @param versionNumber version number starts from 1 up to current version.
     * @returns void
     * @throws ApiError
     */
    public static deleteContentHistory(
        id: string,
        versionNumber: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}/version/{versionNumber}',
            path: {
                'id': id,
                'versionNumber': versionNumber,
            },
            errors: {
                400: `Returned if versionNumber is less than 1, does not exist or has already been deleted.`,
                403: `Returned if the calling user doesn't have permission to edit the content.`,
                404: `Returned if the contentId cannot be found.`,
            },
        });
    }
}


