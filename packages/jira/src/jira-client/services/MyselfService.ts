/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasswordBean } from '../models/PasswordBean.js';
import type { UserBean } from '../models/UserBean.js';
import type { UserWriteBean } from '../models/UserWriteBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class MyselfService {
    /**
     * Get currently logged user
     * Returns currently logged user. This resource cannot be accessed anonymously
     * @returns UserBean Returns a full representation of a Jira user in JSON format.
     * @throws ApiError
     */
    public static getUser(): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/myself',
            errors: {
                401: `Returned if the current user is not authenticated.`,
            },
        });
    }
    /**
     * Update currently logged user
     * Modify currently logged user. The 'value' fields present will override the existing value. Fields skipped in request will not be changed. Only email and display name can be change that way. Requires user password.
     * @param requestBody The new user details to be set.
     * @returns UserWriteBean Confirmation that the user was updated.
     * @throws ApiError
     */
    public static updateUser(
        requestBody: UserWriteBean,
    ): CancelablePromise<UserWriteBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/myself',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request is invalid including incorrect password.`,
                401: `The user is not authenticated.`,
                403: `The directory is read-only.`,
                404: `The user could not be found.`,
            },
        });
    }
    /**
     * Update caller password
     * Modify caller password.
     * @param requestBody The new password to be set.
     * @returns void
     * @throws ApiError
     */
    public static changeMyPassword(
        requestBody: PasswordBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/myself/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request is invalid including incorrect password.`,
                401: `The user is not authenticated.`,
                403: `The directory is read-only.`,
                404: `The user could not be found.`,
            },
        });
    }
}
