/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GlobalPermission } from '../models/globalPermission.js';
import type { OperationDescription } from '../models/operationDescription.js';
import type { SpacePermissionsForSubject } from '../models/spacePermissionsForSubject.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class GlobalPermissionsService {
    /**
     * Get global permissions
     * Returns list of permissions granted to users and groups.
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions`
     * @returns GlobalPermission Returns a JSON representation of all global permissions granted to users/groups/anonymous user.
     * @throws ApiError
     */
    public static getAllGlobalPermissions(): CancelablePromise<Array<GlobalPermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/permissions',
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Set global permissions to multiple users/groups
     * Sets global permissions to multiple users/groups.
     *
     * Request should contain all permissions that users/groups will have.
     *
     * If permission is absent in the request, but was granted before, it will be revoked.
     *
     * If empty list of permissions passed to users/groups, then all their existing permissions will be revoked.
     *
     * If users/groups not mentioned in the request, their permissions will not be revoked.
     *
     *
     * Maximum 40 different users/groups could be passed in the request by default
     * .
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * application administer
     * * system administer
     * * personal_space create
     * * space create
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Global+Permissions+Overview">Global Permissions documentation</a> for additional information about supported permissions.
     *
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/permissions`
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static setPermissions(
        requestBody?: Array<SpacePermissionsForSubject>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if user or group with specified key not found.`,
            },
        });
    }
    /**
     * Gets the permissions granted to an anonymous user
     * Returns list of permissions granted to anonymous user.
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/anonymous`
     * @returns GlobalPermission Returns a JSON representation of the permissions granted to the group.
     * @throws ApiError
     */
    public static getPermissionsGrantedToAnonymousUsers(): CancelablePromise<Array<GlobalPermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/permissions/anonymous',
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Gets global permissions granted to a group
     * Returns list of permissions granted to group.
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/group/{groupName}}`
     * @param groupName the name of the group to look up.
     * @returns GlobalPermission Returns a JSON representation of the permissions granted to the group.
     * @throws ApiError
     */
    public static getPermissionsGrantedToGroup(
        groupName: string,
    ): CancelablePromise<Array<GlobalPermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/permissions/group/{groupName}',
            path: {
                'groupName': groupName,
            },
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling user does not have necessary permission.`,
                404: `Returned if the user with specified key not found.`,
            },
        });
    }
    /**
     * Gets the permissions granted to an unlicensed users
     * Returns list of permissions granted to unlicensed users.
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/unlicensed`
     * @returns GlobalPermission Returns a JSON representation of the permissions granted to the group.
     * @throws ApiError
     */
    public static getPermissionsGrantedToUnlicensedUsers(): CancelablePromise<Array<GlobalPermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/permissions/unlicensed',
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Gets global permissions granted to a user
     * Returns list of permissions granted to user.
     *
     * Example request URI's:
     *
     * with userKey: `https://example.com/confluence/rest/api/permissions/user/{userKey}`
     *
     * with username: `https://example.com/confluence/rest/api/permissions/user/{username}`
     * @param user the key or username of the user to look up.
     * @returns GlobalPermission Returns a JSON representation of the permissions granted to the user.
     * @throws ApiError
     */
    public static getPermissionsGrantedToUser(
        user: string,
    ): CancelablePromise<Array<GlobalPermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/permissions/user/{user}',
            path: {
                'user': user,
            },
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if the user with specified key not found.`,
            },
        });
    }
    /**
     * Grants global permissions to anonymous users
     * Grant global permissions to anonymous users.
     *
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * read user
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/anonymous/grant`
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToAnonymousUsers(
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/anonymous/grant',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Grants global permissions to a group
     * Grant global permissions to a group.
     *
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * application administer
     * * system administer
     * * personal_space create
     * * space create
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Global+Permissions+Overview">Global Permissions documentation</a> for additional information about supported permissions.
     *
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/group/test-group-name/grant`
     * @param groupName the name of the group to look up.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToGroup(
        groupName: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/group/{groupName}/grant',
            path: {
                'groupName': groupName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if group with specified name not found.`,
            },
        });
    }
    /**
     * Grants global permissions to unlicensed users
     * Grant global permissions to unlicensed users.
     *
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use_unlicensed
     * * read user
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/unlicensed/grant`
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToUnlicensedUsers(
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/unlicensed/grant',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Grants global permissions to a user
     * Grant global permissions to a user.
     *
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * application administer
     * * system administer
     * * personal_space create
     * * space create
     *
     * Example request URI's:
     *
     * with userKey: `https://example.com/confluence/rest/api/permissions/user/{userKey}/grant`
     *
     * with username: `https://example.com/confluence/rest/api/permissions/user/{username}/grant`
     * @param user the key or username of the user to look up.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToUser(
        user: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/user/{user}/grant',
            path: {
                'user': user,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if user with specified user key or user name not found.`,
            },
        });
    }
    /**
     * Revoke global permissions from anonymous users
     * Revoke global permissions from anonymous users.
     *
     * When 'application use' is revoked, all granted permissions will be removed from anonymous users.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * read user
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/anonymous/revoke`
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromAnonymousUsers(
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/anonymous/revoke',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Revoke global permissions from a group
     * Revoke global permissions from a group.
     *
     * When 'application use' is revoked, all granted permissions will be removed from target group.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * application administer
     * * system administer
     * * personal_space create
     * * space create
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Global+Permissions+Overview">Global Permissions documentation</a> for additional information about supported permissions.
     *
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/group/test-group-name/revoke`
     * @param groupName the name of the group to look up.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromGroup(
        groupName: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/group/{groupName}/revoke',
            path: {
                'groupName': groupName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if group with specified name not found.`,
            },
        });
    }
    /**
     * Revoke global permissions from unlicensed users
     * Revoke global permissions from unlicensed users.
     *
     * When 'application use_unlicensed' is revoked, all granted permissions will be removed from unlicensed users.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use_unlicensed
     * * read user
     *
     * Example request URI's:
     *
     * `https://example.com/confluence/rest/api/permissions/unlicensed/revoke`
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromUnlicensedUsers(
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/unlicensed/revoke',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Revoke global permissions from a user
     * Revoke global permissions from a user.
     *
     * When 'application use' is revoked, all granted permissions will be removed from target user.
     *
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     *
     * * application use
     * * application administer
     * * system administer
     * * personal_space create
     * * space create
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Global+Permissions+Overview">Global Permissions documentation</a> for additional information about supported permissions.
     *
     *
     * Example request URI's:
     *
     * with userKey: `https://example.com/confluence/rest/api/permissions/user/{userKey}/revoke`
     *
     * with username: `https://example.com/confluence/rest/api/permissions/user/{username}/revoke`
     * @param user the key or username of the user to look up.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromUser(
        user: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/permissions/user/{user}/revoke',
            path: {
                'user': user,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or space permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if user with specified user key or user name not found.`,
            },
        });
    }
}


