/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPasswordUpdate } from '../models/adminPasswordUpdate.js';
import type { GroupAndUsers } from '../models/groupAndUsers.js';
import type { GroupPickerContext } from '../models/groupPickerContext.js';
import type { RestApplicationUser } from '../models/restApplicationUser.js';
import type { RestDetailedGroup } from '../models/restDetailedGroup.js';
import type { RestDetailedUser } from '../models/restDetailedUser.js';
import type { RestErasedUser } from '../models/restErasedUser.js';
import type { RestPermittedGroup } from '../models/restPermittedGroup.js';
import type { RestPermittedUser } from '../models/restPermittedUser.js';
import type { RestUserDirectory } from '../models/restUserDirectory.js';
import type { UserAndGroups } from '../models/userAndGroups.js';
import type { UserPickerContext } from '../models/userPickerContext.js';
import type { UserRename } from '../models/userRename.js';
import type { UserUpdate } from '../models/userUpdate.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class PermissionManagementService {
    /**
     * Remove group
     * Deletes the specified group, removing them from the system. This also removes any permissions that may have been granted to the group.
     *
     * A user may not delete the last group that is granting them administrative permissions, or a group with greater permissions than themselves.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param name The name identifying the group to delete.
     * @returns RestDetailedGroup The deleted group.
     * @throws ApiError
     */
    public static deleteGroup(
        name: string,
    ): CancelablePromise<RestDetailedGroup> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/groups',
            query: {
                'name': name,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as the authenticated user has a lower permission level than the group being deleted.`,
                404: `The specified group does not exist.`,
                409: `The action was disallowed as it would lower the authenticated user's permission level.`,
            },
        });
    }
    /**
     * Get groups
     * Retrieve a page of groups.
     *
     * The authenticated user must have <strong>LICENSED_USER</strong> permission or higher to call this resource.
     * @param filter If specified only group names containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups.
     * @throws ApiError
     */
    public static getGroups1(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/groups',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a licensed user.`,
            },
        });
    }
    /**
     * Create group
     * Create a new group.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param name Name of the group.
     * @returns RestDetailedGroup The newly created group.
     * @throws ApiError
     */
    public static createGroup(
        name: string,
    ): CancelablePromise<RestDetailedGroup> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/groups',
            query: {
                'name': name,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The currently authenticated user is not an administrator.`,
                409: `A group with this name already exists.`,
            },
        });
    }
    /**
     * @deprecated
     * Add user to group
     * <strong>Deprecated since 2.10</strong>. Use /rest/users/add-groups instead.
     *
     * Add a user to a group.
     *
     * In the request entity, the <em>context</em> attribute is the group and the <em>itemName</em> is the user.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns any The user was added to the group.
     * @throws ApiError
     */
    public static addUserToGroup(
        requestBody?: UserPickerContext,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/groups/add-user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as it would exceed the server's licensing limit, or the groups permissions exceed the authenticated user's permission level.`,
                404: `The specified user or group does not exist.`,
            },
        });
    }
    /**
     * Add multiple users to group
     * Add multiple users to a group.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns any <em>All</em> the users were added to the group
     * @throws ApiError
     */
    public static addUsersToGroup(
        requestBody?: GroupAndUsers,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/groups/add-users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as it would exceed the server's licensing limit, or the groups permissions exceed the authenticated user's permission level.`,
                404: `The specified user or group does not exist.`,
            },
        });
    }
    /**
     * Get group members
     * Retrieves a list of users that are members of a specified group. <p>The authenticated user must have the <strong>LICENSED_USER</strong> permission to call this resource.
     * @param context The group which should be used to locate members.
     * @param filter If specified only users with usernames, display names or email addresses containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users.
     * @throws ApiError
     */
    public static findUsersInGroup(
        context: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/groups/more-members',
            query: {
                'filter': filter,
                'context': context,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a licensed user.`,
            },
        });
    }
    /**
     * Get members not in group
     * Retrieves a list of users that are <em>not</em> members of a specified group. <p>The authenticated user must have the <strong>LICENSED_USER</strong> permission to call this resource.
     * @param context The group which should be used to locate members.
     * @param filter If specified only users with usernames, display names or email addresses containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users.
     * @throws ApiError
     */
    public static findUsersNotInGroup(
        context: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/groups/more-non-members',
            query: {
                'filter': filter,
                'context': context,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a licensed user.`,
            },
        });
    }
    /**
     * @deprecated
     * Remove user from group
     * <strong>Deprecated since 2.10</strong>. Use /rest/users/remove-groups instead.
     *
     * Remove a user from a group.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     *
     * In the request entity, the <em>context</em> attribute is the group and the <em>itemName</em> is the user.
     * @param requestBody
     * @returns any The user was removed from the group.
     * @throws ApiError
     */
    public static removeUserFromGroup(
        requestBody?: UserPickerContext,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/groups/remove-user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as the group has a higher permission level than the context user.`,
                404: `The specified user or group does not exist.`,
            },
        });
    }
    /**
     * Revoke all global permissions for group
     * Revoke all global permissions for a group.
     *
     *
     *
     * The authenticated user must have:
     *
     *
     * - <strong>ADMIN</strong> permission or higher; and
     * - greater or equal permissions than the current permission level of the group (a user may not demote the     permission level of a group with higher permissions than them)
     *
     *
     * to call this resource. In addition, a user may not revoke a group's permissions if their own permission level
     * would be reduced as a result.
     * @param name The name of the group
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsForGroup(
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/permissions/groups',
            query: {
                'name': name,
            },
            errors: {
                401: `TThe currently authenticated user is not an administrator.`,
                404: `The specified group does not exist.`,
                409: `The action was disallowed as it would reduce the currently authenticated user's
                permission level or the currently authenticated user has a lower permission
                level than the group they are attempting to modify.`,
            },
        });
    }
    /**
     * Get groups with a global permission
     * Retrieve a page of groups that have been granted at least one global permission.
     *
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param filter If specified only group names containing the supplied string will be returned
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups and their highest global permissions.
     * @throws ApiError
     */
    public static getGroupsWithAnyPermission(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestPermittedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/permissions/groups',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not an administrator.`,
            },
        });
    }
    /**
     * Update global permission for group
     * Promote or demote a group's global permission level. Available global permissions are:
     *
     *
     * - LICENSED_USER
     * - PROJECT_CREATE
     * - ADMIN
     * - SYS_ADMIN
     *
     * See the <a href="https://confluence.atlassian.com/display/BitbucketServer/Global+permissions">Bitbucket Data Center documentation</a> for a detailed explanation of what each permission entails.
     *
     *
     * The authenticated user must have:
     *
     *
     * - <strong>ADMIN</strong> permission or higher; and
     * - the permission they are attempting to grant or higher; and
     * - greater or equal permissions than the current permission level of the group (a user may not demote the     permission level of a group with higher permissions than them)
     *
     *
     * to call this resource. In addition, a user may not demote a group's permission level if their own permission
     * level would be reduced as a result.
     * @param name The names of the groups
     * @param permission The permission to grant
     * @returns void
     * @throws ApiError
     */
    public static setPermissionForGroups(
        name: Array<string>,
        permission: 'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN',
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/permissions/groups',
            query: {
                'name': name,
                'permission': permission,
            },
            errors: {
                400: `The request was malformed or the specified permission does not exist.`,
                401: `The currently authenticated user is not an administrator or doesn't have the
                specified permission they are attempting to grant.`,
                403: `The action was disallowed as it would exceed the server's license limits.`,
                404: `The specified group does not exist.`,
                409: `The action was disallowed as it would reduce the currently authenticated user's
                permission level or the currently authenticated user has a lower permission
                level than the group they are attempting to modify.`,
            },
        });
    }
    /**
     * Get groups with no global permission
     * Retrieve a page of groups that have no granted global permissions.
     *
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param filter If specified only user names containing the supplied string will be returned
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups that have not been granted any global permissions.
     * @throws ApiError
     */
    public static getGroupsWithoutAnyPermission(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/permissions/groups/none',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not an administrator.`,
            },
        });
    }
    /**
     * Revoke all global permissions for user
     * Revoke all global permissions for a user.
     *
     *
     * The authenticated user must have:
     *
     *
     * - <strong>ADMIN</strong> permission or higher; and
     * - greater or equal permissions than the current permission level of the user (a user may not demote the     permission level of a user with higher permissions than them)
     *
     *
     * to call this resource. In addition, a user may not demote their own permission level.
     * @param name The name of the user
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsForUser(
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/permissions/users',
            query: {
                'name': name,
            },
            errors: {
                401: `The currently authenticated user is not an administrator.`,
                404: `The specified user does not exist.`,
                409: `The action was disallowed as it would reduce the currently authenticated user's
                permission level or the currently authenticated user has a lower permission
                level than the user they are attempting to modify.`,
            },
        });
    }
    /**
     * Get users with a global permission
     * Retrieve a page of users that have been granted at least one global permission.
     *
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param filter If specified only user names containing the supplied string will be returned
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users and their highest global permissions.
     * @throws ApiError
     */
    public static getUsersWithAnyPermission(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestPermittedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/permissions/users',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not an administrator.`,
            },
        });
    }
    /**
     * Update global permission for user
     * Promote or demote the global permission level of a user. Available global permissions are:
     *
     *
     * - LICENSED_USER
     * - PROJECT_CREATE
     * - ADMIN
     * - SYS_ADMIN
     *
     *
     * See the <a href="https://confluence.atlassian.com/display/BitbucketServer/Global+permissions">Bitbucket Data Center documentation</a> for a detailed explanation of what each permission entails.
     *
     *
     * The authenticated user must have:
     *
     *
     * - <strong>ADMIN</strong> permission or higher; and
     * - the permission they are attempting to grant; and
     * - greater or equal permissions than the current permission level of the user (a user may not demote the     permission level of a user with higher permissions than them)
     *
     *
     * to call this resource. In addition, a user may not demote their own permission level.
     * @param name The names of the users
     * @param permission The permission to grant
     * @returns void
     * @throws ApiError
     */
    public static setPermissionForUsers(
        name: Array<string>,
        permission: 'LICENSED_USER' | 'PROJECT_CREATE' | 'ADMIN' | 'SYS_ADMIN',
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/permissions/users',
            query: {
                'name': name,
                'permission': permission,
            },
            errors: {
                400: `The request was malformed or the specified permission does not exist.`,
                401: `The currently authenticated user is not an administrator or doesn't have the
                specified permission they are attempting to grant.`,
                403: `The action was disallowed as it would exceed the server's license limits.`,
                404: `The specified user does not exist.`,
                409: `The action was disallowed as it would reduce the currently authenticated user's
                permission level or the currently authenticated user has a lower permission
                level than the user they are attempting to modify.`,
            },
        });
    }
    /**
     * Get users with no global permission
     * Retrieve a page of users that have no granted global permissions.
     *
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param filter If specified only user names containing the supplied string will be returned
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users that have not been granted any global permissions.
     * @throws ApiError
     */
    public static getUsersWithoutAnyPermission(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestApplicationUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/permissions/users/none',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not an administrator.`,
            },
        });
    }
    /**
     * Get directories
     * Retrieve a list of active directories.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param includeInactive Set <code>true</code> to include inactive directories; otherwise, <code>false</code> to only return active directories.
     * @returns RestUserDirectory A list of directories
     * @throws ApiError
     */
    public static getUserDirectories(
        includeInactive?: string,
    ): CancelablePromise<RestUserDirectory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/user-directories',
            query: {
                'includeInactive': includeInactive,
            },
            errors: {
                401: `The currently authenticated user is not an administrator`,
            },
        });
    }
    /**
     * Remove user
     * Deletes the specified user, removing them from the system. This also removes any permissions that may have been granted to the user.
     *
     * A user may not delete themselves, and a user with <strong>ADMIN</strong> permissions may not delete a user with <strong>SYS_ADMIN</strong>permissions.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param name The username identifying the user to delete.
     * @returns RestDetailedUser The deleted user.
     * @throws ApiError
     */
    public static deleteUser(
        name: string,
    ): CancelablePromise<RestDetailedUser> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/users',
            query: {
                'name': name,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as the authenticated user has a lower permission level than the user being deleted.`,
                404: `The specified user does not exist.`,
                409: `The action was disallowed as a user can not delete themselves.`,
            },
        });
    }
    /**
     * Get users
     * Retrieve a page of users.
     *
     * The authenticated user must have the <strong>LICENSED_USER</strong> permission to call this resource.
     * @param filter If specified only users with usernames, display name or email addresses containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users.
     * @throws ApiError
     */
    public static getUsers1(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/users',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a licensed user.`,
            },
        });
    }
    /**
     * Create user
     * Creates a new user from the assembled query parameters.
     *
     * The default group can be used to control initial permissions for new users, such as granting users the ability to login or providing read access to certain projects or repositories. If the user is not added to the default group, they may not be able to login after their account is created until explicit permissions are configured.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param emailAddress The e-mail address for the new user.
     * @param displayName The display name for the new user.
     * @param name The username for the new user.
     * @param password The password for the new user. Required if the <code>notify</code> parameter is not present or is set to <code>false</false>
     * @param addToDefaultGroup Set <code>true</code> to add the user to the default group, which can be used to grant them a set of initial permissions; otherwise, <code>false</code> to not add them to a group.
     * @param notify If present and not <code>false</code> instead of requiring a password, the create user will be notified via email their account has been created and requires a password to be reset. This option can only be used if a mail server has been configured.
     * @returns void
     * @throws ApiError
     */
    public static createUser(
        emailAddress: string,
        displayName: string,
        name: string,
        password?: string,
        addToDefaultGroup: boolean = true,
        notify?: boolean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/users',
            query: {
                'emailAddress': emailAddress,
                'password': password,
                'addToDefaultGroup': addToDefaultGroup,
                'displayName': displayName,
                'name': name,
                'notify': notify,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user is not an administrator.`,
                403: `Adding the user to the default group would exceed the server's license limit.`,
                409: `Another user with the same name already exists.`,
            },
        });
    }
    /**
     * Update user details
     * Update a user's details.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns RestDetailedUser The updated user.
     * @throws ApiError
     */
    public static updateUserDetails(
        requestBody?: UserUpdate,
    ): CancelablePromise<RestDetailedUser> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission or has a lower permission level than the user being updated.`,
                404: `The specified user does not exist.`,
            },
        });
    }
    /**
     * @deprecated
     * Add user to group
     * <strong>Deprecated since 2.10</strong>. Use /rest/users/add-groups instead.
     *
     * Add a user to a group. This is very similar to <code>groups/add-user</code>, but with the <em>context</em> and <em>itemName</em> attributes of the supplied request entity reversed. On the face of it this may appear redundant, but it facilitates a specific UI component in the application.
     *
     * In the request entity, the <em>context</em> attribute is the user and the <em>itemName</em> is the group.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns any The user was added to the group
     * @throws ApiError
     */
    public static addGroupToUser(
        requestBody?: GroupPickerContext,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/users/add-group',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as it would exceed the server's licensing limit, or the groups permissions exceed the authenticated user's permission level.`,
                404: `The specified user or group does not exist.`,
            },
        });
    }
    /**
     * Add user to groups
     * Add a user to one or more groups.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns any The user was added to <em>all</em> the groups
     * @throws ApiError
     */
    public static addUserToGroups(
        requestBody?: UserAndGroups,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/users/add-groups',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as it would exceed the server's licensing limit, or the groups permissions exceed the authenticated user's permission level.`,
                404: `The specified user or group does not exist.`,
            },
        });
    }
    /**
     * Clear CAPTCHA for user
     * Clears any CAPTCHA challenge that may constrain the user with the supplied username when they authenticate. Additionally any counter or metric that contributed towards the user being issued the CAPTCHA challenge (for instance too many consecutive failed logins) will also be reset.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource, and may not clear the CAPTCHA of a user with greater permissions than themselves.
     * @param name The username
     * @returns void
     * @throws ApiError
     */
    public static clearUserCaptchaChallenge(
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/users/captcha',
            query: {
                'name': name,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as the authenticated user has a lower permission level than the user to clear captcha for.`,
                404: `The specified user does not exist.`,
            },
        });
    }
    /**
     * Set password for user
     * Update a user's password.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource, and may not update the password of a user with greater permissions than themselves.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static updateUserPassword(
        requestBody?: AdminPasswordUpdate,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/users/credentials',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission or has a lower permission level than the user having their password updated.`,
                404: `The specified user does not exist.`,
            },
        });
    }
    /**
     * Check user removal
     * Validate if a user can be erased.
     *
     * A username is only valid for erasure if it exists as the username of a deleted user. This endpoint will return an appropriate error response if the supplied username is invalid for erasure.
     *
     * This endpoint does <strong>not</strong> perform the actual user erasure, and will not modify the application in any way.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param name The username of the user to validate erasability for.
     * @returns void
     * @throws ApiError
     */
    public static validateErasable(
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/users/erasure',
            query: {
                'name': name,
            },
            errors: {
                400: `The request was malformed (e.g. if no username was supplied).`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission or has a lower permission level than the user being erased.`,
                404: `The requested username does not exist.`,
                409: `The requested username is the username of a not deleted user.`,
            },
        });
    }
    /**
     * Erase user information
     * Erases personally identifying user data for a deleted user.
     *
     * References in the application to the original username will be either removed or updated to a new non-identifying username. Refer to the <a href="https://confluence.atlassian.com/gdpr/bitbucket-right-to-erasure-949770560.html">support guide</a> for details about what data is and isn't erased.
     *
     * User erasure can only be performed on a deleted user. If the user has not been deleted first then this endpoint will return a bad request and no erasure will be performed.
     *
     * Erasing user data is <strong>irreversible</strong> and may lead to a degraded user experience. This method should not be used as part of a standard user deletion and cleanup process.
     *
     * Plugins can participate in user erasure by defining a <code>&lt;user-erasure-handler&gt;</code> module. If one or more plugin modules fail, an error summary of the failing modules is returned.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param name The username identifying the user to erase.
     * @returns RestErasedUser The identifier of the erased user.
     * @throws ApiError
     */
    public static eraseUser(
        name: string,
    ): CancelablePromise<RestErasedUser> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/users/erasure',
            query: {
                'name': name,
            },
            errors: {
                400: `The request was malformed (e.g. if no username was supplied).`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission or has a lower permission level than the user being erased.`,
                404: `The requested username does not exist.`,
                409: `The requested username is the username of a not deleted user.`,
            },
        });
    }
    /**
     * Get groups for user
     * Retrieves a list of users that are <em>not</em> members of a specified group. <p>The authenticated user must have the <strong>LICENSED_USER</strong> permission to call this resource.
     * @param context The group which should be used to locate members.
     * @param filter If specified only users with usernames, display names or email addresses containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users.
     * @throws ApiError
     */
    public static findGroupsForUser(
        context: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/users/more-members',
            query: {
                'filter': filter,
                'context': context,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a licensed user.`,
            },
        });
    }
    /**
     * Find other groups for user
     * Retrieves a list of groups the specified user is <em>not</em> a member of. <p>The authenticated user must have the <strong>LICENSED_USER</strong> permission to call this resource.
     * @param context The user which should be used to locate groups.
     * @param filter If specified only groups with names containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups.
     * @throws ApiError
     */
    public static findOtherGroupsForUser(
        context: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/users/more-non-members',
            query: {
                'filter': filter,
                'context': context,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a licensed user.`,
            },
        });
    }
    /**
     * Remove user from group
     * Remove a user from a group. This is very similar to <code>groups/remove-user</code>, but with the <em>context</em> and <em>itemName</em> attributes of the supplied request entity reversed. On the face of it this may appear redundant, but it facilitates a specific UI component in the application.
     *
     * In the request entity, the <em>context</em> attribute is the user and the <em>itemName</em> is the group.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns any The user was removed from the group.
     * @throws ApiError
     */
    public static removeGroupFromUser(
        requestBody?: GroupPickerContext,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/users/remove-group',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission.`,
                403: `The action was disallowed as the group has a higher permission level than the context user.`,
                404: `The specified user or group does not exist.`,
            },
        });
    }
    /**
     * Rename user
     * Rename a user.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns RestDetailedUser The renamed user.
     * @throws ApiError
     */
    public static renameUser(
        requestBody?: UserRename,
    ): CancelablePromise<RestDetailedUser> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/users/rename',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
                401: `The authenticated user does not have the <strong>ADMIN</strong> permission or has a lower permission level than the user being renamed.`,
                404: `The specified user does not exist.`,
            },
        });
    }
    /**
     * Get group names
     * Retrieve a page of group names.
     *
     * The authenticated user must have <strong>LICENSED_USER</strong> permission or higher to call this resource.
     * @param filter
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of group names.
     * @throws ApiError
     */
    public static getGroups(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/groups',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a project administrator.`,
            },
        });
    }
    /**
     * Revoke all repository permissions for users and groups
     * Revoke all permissions for the specified repository for the given groups and users.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified repository or a higher global permission to call this resource.
     *
     * In addition, a user may not revoke a group's permission if their own permission would be revoked as a result, nor may they revoke their own permission unless they have a global permission that already implies that permission.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param user The names of the users
     * @param group The names of the groups
     * @returns void
     * @throws ApiError
     */
    public static revokePermissions1(
        projectKey: string,
        repositorySlug: string,
        user?: string,
        group?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'user': user,
                'group': group,
            },
            errors: {
                400: `No permissions were revoked because the request was invalid. No users or groups were provided.`,
                401: `The currently authenticated user is not an administrator for the specified repository.`,
                404: `The specified repository does not exist, or one or more of the users or groups provided does not exist.`,
                409: `The action was disallowed as it would revoke the currently authenticated user's permission on the repository.`,
            },
        });
    }
    /**
     * Revoke group repository permission
     * Revoke all permissions for the specified repository for a group.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource.
     *
     * In addition, a user may not revoke a group's permissions if it will reduce their own permission level.
     * @param projectKey The project key.
     * @param name The name of the group.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsForGroup2(
        projectKey: string,
        name: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'name': name,
            },
            errors: {
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                404: `The specified repository does not exist.`,
                409: `The action was disallowed as it would reduce the currently authenticated user's permission level.`,
            },
        });
    }
    /**
     * Get groups with permission to repository
     * Retrieve a page of groups that have been granted at least one permission for the specified repository.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter If specified only group names containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups and their highest permissions for the specified repository.
     * @throws ApiError
     */
    public static getGroupsWithAnyPermission2(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestPermittedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Update group repository permission
     * Promote or demote a group's permission level for the specified repository. Available repository permissions are:
     *
     * - REPO_READ
     * - REPO_WRITE
     * - REPO_ADMIN
     *
     *
     * See the <a href="https://confluence.atlassian.com/display/BitbucketServer/Using+repository+permissions">Bitbucket Data Center documentation</a> for a detailed explanation of what each permission entails.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource. In addition, a user may not demote a group's permission level if their own permission level would be reduced as a result.
     * @param projectKey The project key.
     * @param name The names of the groups.
     * @param permission The permission to grant
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static setPermissionForGroup(
        projectKey: string,
        name: Array<string>,
        permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN',
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'name': name,
                'permission': permission,
            },
            errors: {
                400: `The request was malformed or the specified permission does not exist.`,
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                403: `The action was disallowed as it would reduce the currently authenticated user's permission level.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Get groups without repository permission
     * Retrieve a page of groups that have no granted permissions for the specified repository.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter If specified only group names containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups that have not been granted any permissions for the specified repository.
     * @throws ApiError
     */
    public static getGroupsWithoutAnyPermission2(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDetailedGroup>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/groups/none',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Search repository permissions
     * Search direct and implied permissions of users and groups. This endpoint returns a superset of the results returned by the /users and /groups endpoints because it allows filtering by project and global permissions too.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project/global permission to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param permission Permissions to filter by. See the [permissions documentation](https://confluence.atlassian.com/display/BitbucketServer/Using+repository+permissions)for a detailed explanation of what each permission entails. This parameter can be specified multiple times to filter by more than one permission, and can contain repository, project, and global permissions.
     *
     *
     * @param filterText Name of the user or group to filter the name of
     * @param type Type of entity (user or group)Valid entity types are:
     *
     * - USER- GROUP
     * @returns any default response
     * @throws ApiError
     */
    public static searchPermissions1(
        projectKey: string,
        repositorySlug: string,
        permission?: string,
        filterText?: string,
        type?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/search',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'permission': permission,
                'filterText': filterText,
                'type': type,
            },
        });
    }
    /**
     * Revoke user repository permission
     * Revoke all permissions for the specified repository for a user.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource.
     *
     * In addition, a user may not revoke their own repository permissions if they do not have a higher project or global permission.
     * @param projectKey The project key.
     * @param name The name of the user.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static revokePermissionsForUser2(
        projectKey: string,
        name: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'name': name,
            },
            errors: {
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                404: `The specified repository does not exist.`,
                409: `The action was disallowed as it would reduce the currently authenticated user's permission level.`,
            },
        });
    }
    /**
     * Get users with permission to repository
     * Retrieve a page of users that have been granted at least one permission for the specified repository.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter If specified only user names containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users and their highest permissions for the specified repository.
     * @throws ApiError
     */
    public static getUsersWithAnyPermission2(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestPermittedUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Update user repository permission
     * Promote or demote a user's permission level for the specified repository. Available repository permissions are:
     *
     * - REPO_READ</li>- REPO_WRITE</li>- REPO_ADMIN</li></ul>See the <a href="https://confluence.atlassian.com/display/BitbucketServer/Using+repository+permissions">Bitbucket Data Center documentation</a> for a detailed explanation of what each permission entails.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource. In addition, a user may not reduce their own permission level unless they have a project or global permission that already implies that permission.
     * @param projectKey The project key.
     * @param name The names of the users.
     * @param permission The permission to grant
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static setPermissionForUser(
        projectKey: string,
        name: Array<string>,
        permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN',
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'name': name,
                'permission': permission,
            },
            errors: {
                400: `The request was malformed or the specified permission does not exist.`,
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                403: `The action was disallowed as it would reduce the currently authenticated user's permission level.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Get users without repository permission
     * Retrieve a page of <i>licensed</i> users that have no granted permissions for the specified repository.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository or a higher project or global permission to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter If specified only user names containing the supplied string will be returned.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users that have not been granted any permissions for the specified repository.
     * @throws ApiError
     */
    public static getUsersWithoutPermission1(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestApplicationUser>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/permissions/users/none',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a repository administrator for the specified repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
}

