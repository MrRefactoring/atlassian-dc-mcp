/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasswordChangeDetails } from '../models/passwordChangeDetails.js';
import type { Person } from '../models/person.js';
import type { UserDetailsForUpdate } from '../models/userDetailsForUpdate.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class UserService {
    /**
     * Change password
     * Change the password for the current user.
     *
     * Validation Rules:
     *
     * - New password supplied cannot be null or blank
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/current/password`
     * @param requestBody password change details
     * @returns void
     * @throws ApiError
     */
    public static changePassword1(
        requestBody?: PasswordChangeDetails,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/user/current/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` returned if any error occurs while changing user password. Refer the validation rules above.`,
                401: `returned if the user is not authenticated.`,
                403: `returned if current password is wrong or if the user has exceeded number of allowed failed login attempts
                .`,
            },
        });
    }
    /**
     * Get information about anonymous user type
     * Get information about how anonymous is represented in Confluence. Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/anonymous`
     * @param expand properties to expand on the user.
     * @returns Person Returns a full JSON representation of a user.
     * @throws ApiError
     */
    public static getAnonymous(
        expand?: string,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user/anonymous',
            query: {
                'expand': expand,
            },
            errors: {
                403: `Returned if the calling user does not have permission to use confluence.`,
            },
        });
    }
    /**
     * Get current user
     * Get information about the current logged in user. Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/current`
     * @param expand properties to expand on the user.
     * @returns Person Returns a full JSON representation of a user.
     * @throws ApiError
     */
    public static getCurrent(
        expand?: string,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user/current',
            query: {
                'expand': expand,
            },
            errors: {
                403: `Returned if the calling user does not have permission to use confluence.`,
            },
        });
    }
    /**
     * Update details of the current user
     * Change the current user's details.
     *
     * Validation Rules:
     * - Full name cannot be blank, containing <> characters or be reserved by Confluence.
     * - Email must be a valid email address.
     * - Current password must be supplied for changing email address.
     *
     * Example PUT request URI(s):
     * `http://example.com/confluence/rest/api/user/current`
     *
     * @param requestBody User details
     * @returns void
     * @throws ApiError
     */
    public static updateUser1(
        requestBody?: UserDetailsForUpdate,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/user/current',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` Returned if any error occurs while updating user details. Refer the validation rules above.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if current password is wrong or if the user has exceeded number of allowed failed login attempts
                .`,
            },
        });
    }
    /**
     * Get groups
     * Get a paginated collection of groups that the given user is a member of. Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/memberof?username=jblogs`
     * `http://example.com/confluence/rest/api/user/memberof?key=402880824ff933a4014ff9345d7c0002`
     * @param expand properties to expand on the user.
     * @param limit the limit of the number of users to return, this may be restricted by fixed system limits.
     * @param start the start point of the collection to return. This must be non-negative. Default value is 0.
     * @param key userkey of the user to request from this resource
     * @param username userName of the user to get the groups for.
     * @returns any Returns a full JSON representation of a user.
     * @throws ApiError
     */
    public static getGroups1(
        expand?: string,
        limit?: string,
        start?: string,
        key?: string,
        username?: string,
    ): CancelablePromise<{
        results?: Array<Person>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user/memberof',
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
                'key': key,
                'username': username,
            },
            errors: {
                403: `Returned if the calling user does not have permission to use confluence.`,
            },
        });
    }
    /**
     * Get user
     * Get information about a user identified by either user key or username. Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user?username=jblogs`
     * `http://example.com/confluence/rest/api/user?key=402880824ff933a4014ff9345d7c0002`
     * @param expand properties to expand on the user.
     * @param key userkey of the user to request from this resource.
     * @param username userName of the user to create the new watcher for.
     * @returns Person Returns a full JSON representation of a user
     * @throws ApiError
     */
    public static getUser(
        expand?: string,
        key?: string,
        username?: string,
    ): CancelablePromise<Person> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user',
            query: {
                'expand': expand,
                'key': key,
                'username': username,
            },
            errors: {
                403: `Returned if the calling user does not have permission to view users.`,
                404: `Returned if a user with the given username or userkey does not exist.`,
            },
        });
    }
    /**
     * Get registered users
     * Gets a paginated collection of all registered users, including but not limited to:
     *
     * - Disabled users
     * - Enabled users
     * - Enabled users which count towards the license count on the site
     * - Enabled users which do not count towards the license count on the site
     * - Enabled users which have "can use" global permissions
     * - Enabled users which do not have "can use" global permissions
     *
     * Example request URI(s):
     *
     * `http://example.com/confluence/rest/api/user/list`
     * `http://example.com/confluence/rest/api/user/list?start=0`
     * `http://example.com/confluence/rest/api/user/list?start=0&limit=100`
     * `http://example.com/confluence/rest/api/user/list?start=0&limit=100&expand=status`
     * @param expand properties to expand on the user.
     * @param limit the limit of the number of users to return, this may be restricted by fixed system limits.
     * @param start the start point of the collection to return. This must be non-negative. Default value is 0.
     * @returns any returns a paginated collection of users.
     * @throws ApiError
     */
    public static getUsers(
        expand?: string,
        limit?: string,
        start?: string,
    ): CancelablePromise<{
        results?: Array<Person>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/user/list',
            query: {
                'expand': expand,
                'limit': limit,
                'start': start,
            },
            errors: {
                403: `Returned if the calling user does not have permission to view users. This is possible for anonymous or un-licensed users.`,
            },
        });
    }
}


