/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OperationDescription } from '../models/operationDescription.js';
import type { SpacePermission } from '../models/spacePermission.js';
import type { SpacePermissionsForSubject } from '../models/spacePermissionsForSubject.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SpacePermissionsService {
    /**
     * Get all space permissions
     * Returns list of permissions granted to users and groups in the particular space.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions`
     * @param spaceKey
     * @returns SpacePermission Returns a JSON representation of all permissions granted to users/groups/anonymous user in specified space.
     * @throws ApiError
     */
    public static getAllSpacePermissions(
        spaceKey: string,
    ): CancelablePromise<Array<SpacePermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/permissions',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Set permissions to multiple users/groups/anonymous user in the given space
     * Sets permissions to multiple users/groups in the given space.
     * Request should contain all permissions that user/group/anonymous user will have in a given space.
     * If permission is absent in the request, but was granted before, it will be revoked.
     * If empty list of permissions passed to user/group/anonymous user, then all their existing permissions will be revoked.
     * If user/group/anonymous user not mentioned in the request, their permissions will not be revoked.
     *
     * Maximum 40 different users/groups/anonymous user could be passed in the request.
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions`
     * @param spaceKey
     * @param requestBody
     * @returns any Space permissions successfully set.
     * @throws ApiError
     */
    public static setPermissions1(
        spaceKey: string,
        requestBody?: Array<SpacePermissionsForSubject>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space/{spaceKey}/permissions',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if user or group with specified key not found.`,
            },
        });
    }
    /**
     * Gets the permissions granted to an anonymous user in a space
     * Returns list of permissions granted to anonymous user in the particular space.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/anonymous`
     * @param spaceKey
     * @returns SpacePermission Returns a JSON representation of the space permissions granted to the anonymous user.
     * @throws ApiError
     */
    public static getPermissionsGrantedToAnonymousUsers1(
        spaceKey: string,
    ): CancelablePromise<Array<SpacePermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/permissions/anonymous',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Gets the permissions granted to a group in a space
     * Returns list of permissions granted to a group in the particular space.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/group/test-group-name`
     * @param spaceKey
     * @param groupName
     * @returns SpacePermission Returns a JSON representation of the space permissions granted to the group.
     * @throws ApiError
     */
    public static getPermissionsGrantedToGroup1(
        spaceKey: string,
        groupName: string,
    ): CancelablePromise<Array<SpacePermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/permissions/group/{groupName}',
            path: {
                'spaceKey': spaceKey,
                'groupName': groupName,
            },
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if group with specified name not found.`,
            },
        });
    }
    /**
     * Gets the permissions granted to a user in a space
     * Returns list of permissions granted to user in the particular space.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/user/4028ae289154667d0191546bd5840000`
     * @param spaceKey
     * @param userKey
     * @returns SpacePermission Returns a JSON representation of the space permissions granted to the user.
     * @throws ApiError
     */
    public static getPermissionsGrantedToUser1(
        spaceKey: string,
        userKey: string,
    ): CancelablePromise<Array<SpacePermission>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/permissions/user/{userKey}',
            path: {
                'spaceKey': spaceKey,
                'userKey': userKey,
            },
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if the user with specified key not found.`,
            },
        });
    }
    /**
     * Grants space permissions to anonymous user
     * Grant permissions to anonymous user in the given space.
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     * * space read
     * * space administer
     * * space export
     * * space restrict
     * * space delete_own
     * * space delete_mail
     * * page create
     * * page delete
     * * blogpost create
     * * blogpost delete
     * * comment create
     * * comment delete
     * * attachment create
     * * attachment delete
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/anonymous/grant`
     * @param spaceKey
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToAnonymousUsers1(
        spaceKey: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/permissions/anonymous/grant',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Grants space permissions to a group
     * Grant permissions to a group in the given space.
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     * * space read
     * * space administer
     * * space export
     * * space restrict
     * * space delete_own
     * * space delete_mail
     * * page create
     * * page delete
     * * blogpost create
     * * blogpost delete
     * * comment create
     * * comment delete
     * * attachment create
     * * attachment delete
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/group/test-group-name/grant`
     * @param spaceKey
     * @param groupName
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToGroup1(
        spaceKey: string,
        groupName: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/permissions/group/{groupName}/grant',
            path: {
                'spaceKey': spaceKey,
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
     * Grants space permissions to a user
     * Grant permissions to a user in the given space.
     * Operation doesn't override existing permissions, will only add those one that weren't granted before.
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     * * space read
     * * space administer
     * * space export
     * * space restrict
     * * space delete_own
     * * space delete_mail
     * * page create
     * * page delete
     * * blogpost create
     * * blogpost delete
     * * comment create
     * * comment delete
     * * attachment create
     * * attachment delete
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/user/4028ae289154667d0191546bd5840000/grant`
     * @param spaceKey
     * @param userKey
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static grantPermissionsToUser1(
        spaceKey: string,
        userKey: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/permissions/user/{userKey}/grant',
            path: {
                'spaceKey': spaceKey,
                'userKey': userKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if user with specified key not found.`,
            },
        });
    }
    /**
     * Revoke space permissions from anonymous user
     * Revoke permissions from anonymous user in the given space.
     * If anonymous user doesn't have permissions that we are trying to revoke, those permissions will be silently skipped.
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     * * space read
     * * space administer
     * * space export
     * * space restrict
     * * space delete_own
     * * space delete_mail
     * * page create
     * * page delete
     * * blogpost create
     * * blogpost delete
     * * comment create
     * * comment delete
     * * attachment create
     * * attachment delete
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/anonymous/revoke`
     * @param spaceKey
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromAnonymousUser(
        spaceKey: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/permissions/anonymous/revoke',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
    /**
     * Revoke space permissions from a group
     * Revoke permissions from a group in the given space.
     * If group doesn't have permissions that we are trying to revoke, those permissions will be silently skipped.
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     * * space read
     * * space administer
     * * space export
     * * space restrict
     * * space delete_own
     * * space delete_mail
     * * page create
     * * page delete
     * * blogpost create
     * * blogpost delete
     * * comment create
     * * comment delete
     * * attachment create
     * * attachment delete
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/group/test-group-name/revoke`
     * @param spaceKey
     * @param groupName
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromGroup1(
        spaceKey: string,
        groupName: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/permissions/group/{groupName}/revoke',
            path: {
                'spaceKey': spaceKey,
                'groupName': groupName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if group with specified key not found.`,
            },
        });
    }
    /**
     * Revoke space permissions from a user
     * Revoke permissions from a user in the given space.
     * If user doesn't have permissions that we are trying to revoke, those permissions will be silently skipped.
     * Multiple permissions could be passed in one request. Supported targetType and operationKey pairs:
     * * space read
     * * space administer
     * * space export
     * * space restrict
     * * space delete_own
     * * space delete_mail
     * * page create
     * * page delete
     * * blogpost create
     * * blogpost delete
     * * comment create
     * * comment delete
     * * attachment create
     * * attachment delete
     *
     * See <a href="https://confluence.atlassian.com/display/DOC/Space+Permissions+Overview">Space Permissions documentation</a> for additional information about supported permissions.
     *
     * Example request URI's:
     * `https://example.com/confluence/rest/api/space/TESTSPACE/permissions/user/4028ae289154667d0191546bd5840000/revoke`
     * @param spaceKey
     * @param userKey
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsFromUser1(
        spaceKey: string,
        userKey: string,
        requestBody?: Array<OperationDescription>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/permissions/user/{userKey}/revoke',
            path: {
                'spaceKey': spaceKey,
                'userKey': userKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if incorrect permissions are passed in request (for e.g. non existing operation or global permission).`,
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
                404: `Returned if user with specified key not found.`,
            },
        });
    }
}


