/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PersonalSpaceDetailsForCreation } from '../models/personalSpaceDetailsForCreation.js';
import type { Space } from '../models/space.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AdminSpaceService {
    /**
     * Creates personal Space for a User.
     * Creates a personal space for a user.
     *
     * Example request URI:
     *
     * `http://example.com/confluence/rest/api/admin/space/personal/morganlee`
     * @param username the username of the user to create personal space for.
     * @param requestBody The personal space to be created
     * @returns Space Returns a full JSON representation of a space.
     * @throws ApiError
     */
    public static createPersonalSpace(
        username: string,
        requestBody: PersonalSpaceDetailsForCreation,
    ): CancelablePromise<Space> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/admin/space/personal/{username}',
            path: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there is invalid space description.`,
                403: `Returned if current user does not have correct permission.`,
                404: `Returned if target user not found by username.`,
                409: `Returned if personal space already exists for target user.`,
            },
        });
    }
}


