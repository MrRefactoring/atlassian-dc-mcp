/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthParams } from '../models/AuthParams.js';
import type { AuthSuccess } from '../models/AuthSuccess.js';
import type { CurrentUser } from '../models/CurrentUser.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SessionService {
    /**
     * Get current user session information
     * Returns information about the currently authenticated user's session. If the caller is not authenticated they will get a 401 Unauthorized status code.
     * @returns CurrentUser Returned if the currently authenticated user is returned.
     * @throws ApiError
     */
    public static currentUser(): CancelablePromise<CurrentUser> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/1/session',
            errors: {
                401: `Returned if the currently authenticated user is not returned.`,
            },
        });
    }
    /**
     * Create new user session
     * Creates a new session for a user in Jira. Once a session has been successfully created it can be used to access any of Jira's remote APIs and also the web UI by passing the appropriate HTTP Cookie header. Note that it is generally preferrable to use HTTP BASIC authentication with the REST API. However, this resource may be used to mimic the behaviour of Jira's log-in page (e.g. to display log-in errors to a user).
     * @param requestBody the username and password to authenticate
     * @returns AuthSuccess Returned if the caller is authenticated. Contains information about the caller's session.
     * @throws ApiError
     */
    public static login(
        requestBody: AuthParams,
    ): CancelablePromise<AuthSuccess> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/1/session',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the login fails due to invalid credentials.`,
                403: `Returned if the login is denied due to a CAPTCHA requirement, throtting, or any other reason. In case of a 403 status code it is possible that the supplied credentials are valid but the user is not allowed to log in at this point in time.`,
            },
        });
    }
    /**
     * Delete current user session
     * Logs the current user out of Jira, destroying the existing session, if any.
     * @returns void
     * @throws ApiError
     */
    public static logout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/1/session',
            errors: {
                401: `Returned if the caller is not authenticated.`,
            },
        });
    }
}
