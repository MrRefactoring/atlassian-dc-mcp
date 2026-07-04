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
}

