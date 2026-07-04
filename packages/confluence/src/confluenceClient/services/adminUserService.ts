/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Credentials } from '../models/credentials.js';
import type { LongTaskSubmission } from '../models/longTaskSubmission.js';
import type { UserDetailsForCreation } from '../models/userDetailsForCreation.js';
import type { UserDetailsForUpdate } from '../models/userDetailsForUpdate.js';
import type { UserKey } from '../models/userKey.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AdminUserService {
    /**
     * Change password
     * Change the password for the user identified by the username.
     *
     * **Validation rules** :
     *
     * - The new password should not be null or blank.
     *
     *
     * @param username the username identifying the given user
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static changePassword(
        username: string,
        requestBody?: Credentials,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/admin/user/{username}/password',
            path: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `returned if any error occurs while changing user password. Refer to the validation rules above.`,
                403: `returned if user does not have enough permission to change another user's password. User should be a System admin`,
                404: `returned if user with specified userName not found`,
            },
        });
    }
    /**
     * Create user
     * One of the following options could be used:
     *
     * 1. Create a user with a specified password. The userName, fullName, email and password needs to be specified.
     *
     * 2. Create a user with an email notification to the user. The userName, fullName, email and notifyViaEmail (true) needs to be specified.
     *
     * **Requirements**:
     *
     * - The userName should not be null or blank
     *
     * - The userName should not contain any of these characters \ , + < > ' "
     *
     * - The userName should not contain any whitespace characters
     *
     * - The userName should not be "anonymous"
     *
     * - The userName should not contain any upper case characters
     *
     * - The fullName should not be null or blank
     *
     * - The fullName should not contain any of these characters
     *
     * - The fullName should not be "anonymous"
     *
     * - The email should not be null or blank
     *
     * - The email should be a valid email address
     *
     * - If notifyViaEmail is false then the password should not be null or blank
     *
     * - If notifyViaEmail is true then the password should not be specified
     * @param requestBody Details of the user to be created
     * @returns UserKey returns a response with generated UserKey for the created user.
     * @throws ApiError
     */
    public static createUser(
        requestBody?: UserDetailsForCreation,
    ): CancelablePromise<UserKey> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/admin/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `returned if any error occurs while creating the user`,
                401: `returned if an anonymous (or unauthenticated) user tries to create a user`,
                402: `returned if no more licenses available to create a user`,
                403: `returned if user does not have enough permission to create a user`,
                409: `returned if the user with the same userName already exists`,
            },
        });
    }
    /**
     * Update user
     * Updates the user identified by the username. The following fields can be updated: email, full name.
     * "**Requirements**:
     * - The fullName should not be blank
     * - The fullName should not contain any forbidden characters (< or >)
     * - The fullName should not be anonymous (in english or other system locale)
     * - The email should not be blank
     * - The email should be a valid email address
     *
     * @param username
     * @param requestBody Details of the user to be updated
     * @returns void
     * @throws ApiError
     */
    public static updateUser(
        username: string,
        requestBody?: UserDetailsForUpdate,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/admin/user/{username}',
            path: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `returned if any error occurs while updating the user`,
                401: `returned if an anonymous (or unauthenticated) user tries to update a user`,
                403: `returned if user does not have enough permission to update a user`,
            },
        });
    }
    /**
     * Delete user
     * Deletes the given User identified by username. This action is processed asynchronously.
     * @param username the username identifying the given user
     * @returns LongTaskSubmission Produces a HTTP Accept 202 response from some other resource pointing to this class's LongTaskStatus resource.
     * @throws ApiError
     */
    public static delete1(
        username: string,
    ): CancelablePromise<LongTaskSubmission> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/admin/user/{username}',
            path: {
                'username': username,
            },
            errors: {
                401: `The calling user is not authenticated or does not have the <b>LICENSED</b> permission.`,
                403: `The calling user does not have permission to perform this action.`,
                404: `No User exists for the provided username.`,
            },
        });
    }
    /**
     * Disable user
     * Disables the given User identified by username. This method is idempotent i.e. if the user is already disabled then no action will be taken.
     * @param username the username identifying the given user
     * @returns void
     * @throws ApiError
     */
    public static disable(
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/admin/user/{username}/disable',
            path: {
                'username': username,
            },
            errors: {
                401: `The calling user is not authenticated or does not have the <b>LICENSED</b> permission.`,
                403: `The calling user does not have permission to perform this action.`,
                404: `No User exists for the provided username.`,
            },
        });
    }
    /**
     * Enable user
     * Enables the given User identified by username. This method is idempotent i.e. if the user is already enabled then no action will be taken.
     * @param username the username identifying the given user
     * @returns void
     * @throws ApiError
     */
    public static enable(
        username: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/admin/user/{username}/enable',
            path: {
                'username': username,
            },
            errors: {
                401: `The calling user is not authenticated or does not have the <b>LICENSED</b> permission.`,
                403: `The calling user does not have permission to perform this action.`,
                404: `No User exists for the provided username.`,
            },
        });
    }
}


