/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExampleAvatarMultipartFormData } from '../models/exampleAvatarMultipartFormData.js';
import type { ExampleSettings } from '../models/exampleSettings.js';
import type { RestApplicationUser } from '../models/restApplicationUser.js';
import type { RestAutoDeclineSettings } from '../models/restAutoDeclineSettings.js';
import type { RestAutoDeclineSettingsRequest } from '../models/restAutoDeclineSettingsRequest.js';
import type { RestAutoMergeProjectSettingsRequest } from '../models/restAutoMergeProjectSettingsRequest.js';
import type { RestAutoMergeRestrictedSettings } from '../models/restAutoMergeRestrictedSettings.js';
import type { RestBranch } from '../models/restBranch.js';
import type { RestDefaultTask } from '../models/restDefaultTask.js';
import type { RestDefaultTaskRequest } from '../models/restDefaultTaskRequest.js';
import type { RestDetailedGroup } from '../models/restDetailedGroup.js';
import type { RestDetailedInvocation } from '../models/restDetailedInvocation.js';
import type { RestHookScriptConfig } from '../models/restHookScriptConfig.js';
import type { RestHookScriptTriggers } from '../models/restHookScriptTriggers.js';
import type { RestInvocationHistory } from '../models/restInvocationHistory.js';
import type { RestMinimalRef } from '../models/restMinimalRef.js';
import type { RestPermitted } from '../models/restPermitted.js';
import type { RestPermittedGroup } from '../models/restPermittedGroup.js';
import type { RestPermittedUser } from '../models/restPermittedUser.js';
import type { RestProject } from '../models/restProject.js';
import type { RestProjectSettingsRestriction } from '../models/restProjectSettingsRestriction.js';
import type { RestProjectSettingsRestrictionRequest } from '../models/restProjectSettingsRestrictionRequest.js';
import type { RestPullRequestSettings } from '../models/restPullRequestSettings.js';
import type { RestRefRestriction } from '../models/restRefRestriction.js';
import type { RestRepository } from '../models/restRepository.js';
import type { RestRepositoryHook } from '../models/restRepositoryHook.js';
import type { RestRestrictionRequest } from '../models/restRestrictionRequest.js';
import type { RestWebhook } from '../models/restWebhook.js';
import type { RestWebhookCredentials } from '../models/restWebhookCredentials.js';
import type { RestWebhookRequestResponse } from '../models/restWebhookRequestResponse.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ProjectService {
    /**
     * Get projects
     * Retrieve a page of projects.
     *
     * Only projects for which the authenticated user has the <strong>PROJECT_VIEW</strong> permission will be returned.
     * @param name Name to filter by.
     * @param permission Permission to filter by
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of projects.
     * @throws ApiError
     */
    public static getProjects(
        name?: string,
        permission?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestProject>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects',
            query: {
                'name': name,
                'permission': permission,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The permission level is unknown or not related to projects.`,
            },
        });
    }
    /**
     * Create a new project
     * Create a new project.
     *
     * To include a custom avatar for the project, the project definition should contain an additional attribute with the key <code>avatar</code> and the value a data URI containing Base64-encoded image data. The URI should be in the following format: <pre>    data:(content type, e.g. image/png);base64,(data) </pre>If the data is not Base64-encoded, or if a character set is defined in the URI, or the URI is otherwise invalid, <em>project creation will fail</em>.
     *
     * The authenticated user must have <strong>PROJECT_CREATE</strong> permission to call this resource.
     * @param requestBody The project.
     * @returns RestProject The newly created project.
     * @throws ApiError
     */
    public static createProject(
        requestBody?: RestProject,
    ): CancelablePromise<RestProject> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The currently authenticated user has insufficient permissions to update the project.`,
                401: `The currently authenticated user has insufficient permissions to create a project.`,
                409: `The project key or name is already in use.`,
            },
        });
    }
    /**
     * Delete project
     * Delete the project matching the supplied <strong>projectKey</strong>.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project to call this resource.
     * @param projectKey The project key.
     * @returns void
     * @throws ApiError
     */
    public static deleteProject(
        projectKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}',
            path: {
                'projectKey': projectKey,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the project.`,
                404: `The specified project does not exist.`,
                409: `The project can not be deleted as it contains repositories.`,
            },
        });
    }
    /**
     * Get a project
     * Retrieve the project matching the supplied <strong>projectKey</strong>.
     *
     * The authenticated user must have <strong>PROJECT_VIEW</strong> permission for the specified project to call this resource.
     * @param projectKey The project key.
     * @returns RestProject The project matching the supplied <strong>projectKey</strong>.
     * @throws ApiError
     */
    public static getProject(
        projectKey: string,
    ): CancelablePromise<RestProject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}',
            path: {
                'projectKey': projectKey,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to view the project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Update project
     * Update the project matching the <strong>projectKey</strong> supplied in the resource path.
     *
     * To include a custom avatar for the updated project, the project definition should contain an additional attribute with the key <code>avatar</code> and the value a data URI containing Base64-encoded image data. The URI should be in the following format:
     * ```    data:(content type, e.g. image/png);base64,(data)```
     *
     * If the data is not Base64-encoded, or if a character set is defined in the URI, or the URI is otherwise invalid, <em>project creation will fail</em>.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project to call this resource.
     * @param projectKey The project key.
     * @param requestBody Project parameters to update.
     * @returns RestProject The updated project. The project's key <strong>was not</strong> updated.
     * @throws ApiError
     */
    public static updateProject(
        projectKey: string,
        requestBody?: RestProject,
    ): CancelablePromise<RestProject> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}',
            path: {
                'projectKey': projectKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The project was not updated due to a validation error.`,
                401: `The currently authenticated user has insufficient permissions to update the project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Revoke project permissions
     * Revoke all permissions for the specified project for the given groups and users.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project or a higher global permission to call this resource.
     *
     * In addition, a user may not revoke a group's permission if their own permission would be revoked as a result, nor may they revoke their own permission unless they have a global permission that already implies that permission.
     * @param projectKey The project key
     * @param user The names of the users
     * @param group The names of the groups
     * @returns void
     * @throws ApiError
     */
    public static revokePermissions(
        projectKey: string,
        user?: string,
        group?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/permissions',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'user': user,
                'group': group,
            },
            errors: {
                400: `No permissions were revoked because the request was invalid. No users or groups were provided.`,
                401: `The currently authenticated user is not an administrator for the specifiedspecified project.`,
                404: `The specified project does not exist, or one or more of the users or groups provided does not exist.`,
                409: `The action was disallowed as it would revoke the currently authenticated user's permission on the project.`,
            },
        });
    }
    /**
     * Get groups with permission to project
     * Retrieve a page of groups that have been granted at least one permission for the specified project.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project or a higher global permission to call this resource.
     * @param projectKey The project key
     * @param filter If specified only group names containing the supplied string will be returned
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of groups and their highest permissions for the specified project.
     * @throws ApiError
     */
    public static getGroupsWithAnyPermission1(
        projectKey: string,
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
            url: '/api/latest/projects/{projectKey}/permissions/groups',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a project administrator for the specified project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Update group project permission
     * Promote or demote a group's permission level for the specified project.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project or a higher global permission to call this resource. In addition, a user may not demote a group's permission level if theirown permission level would be reduced as a result.
     * @param projectKey The project key
     * @param name The names of the groups
     * @param permission The permission to grant.See the [permissions documentation](https://confluence.atlassian.com/display/BitbucketServer/Using+project+permissions)for a detailed explanation of what each permission entails. Available project permissions are:
     *
     * - PROJECT_READ
     * - PROJECT_WRITE
     * - PROJECT_ADMIN
     *
     *
     *
     * @returns void
     * @throws ApiError
     */
    public static setPermissionForGroups1(
        projectKey: string,
        name?: string,
        permission?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/permissions/groups',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'name': name,
                'permission': permission,
            },
            errors: {
                400: `The request was malformed or the specified permission does not exist.`,
                401: `The currently authenticated user is not an administrator for the specifiedspecified project.`,
                403: `The action was disallowed as it would reduce the currently authenticated user'spermission level.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Get users with permission to project
     * Retrieve a page of users that have been granted at least one permission for the specified project.
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project or a higher global permission to call this resource.
     * @param projectKey The project key
     * @param filter If specified only user names containing the supplied string will be returned
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of users and their highest permissions for the specified project.
     * @throws ApiError
     */
    public static getUsersWithAnyPermission1(
        projectKey: string,
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
            url: '/api/latest/projects/{projectKey}/permissions/users',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not a project administrator for thespecified project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Update user project permission
     * Promote or demote a user's permission level for the specified project.
     *
     *
     * The authenticated user must have <strong>PROJECT_ADMIN</strong> permission for the specified project or a higher global permission to call this resource. In addition, a user may not reduce their own permission level unless they have a global permission that already implies that permission.
     * @param projectKey The project key
     * @param name The names of the users
     * @param permission The permission to grant.See the [permissions documentation](https://confluence.atlassian.com/display/BitbucketServer/Using+project+permissions)for a detailed explanation of what each permission entails. Available project permissions are:
     *
     * - PROJECT_READ
     * - PROJECT_WRITE
     * - PROJECT_ADMIN
     *
     *
     *
     * @returns void
     * @throws ApiError
     */
    public static setPermissionForUsers1(
        projectKey: string,
        name?: string,
        permission?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/permissions/users',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'name': name,
                'permission': permission,
            },
            errors: {
                400: `The request was malformed or the specified permission does not exist.`,
                401: `The currently authenticated user is not an administrator for the specifiedspecified project.`,
                403: `The action was disallowed as it would reduce the currently authenticated user'spermission level.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Get repositories for project
     * Retrieve repositories from the project corresponding to the supplied <strong>projectKey</strong>.
     *
     * The authenticated user must have <strong>PROJECT_READ</strong> permission for the specified project to call this resource.
     * @param projectKey The project key.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any The repositories matching the supplied <strong>projectKey</strong>.
     * @throws ApiError
     */
    public static getRepositories(
        projectKey: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestRepository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to see the specified project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Create repository
     * Create a new repository. Requires an existing project in which this repository will be created. The only parameters which will be used are name and scmId.
     *
     * The authenticated user must have <strong>REPO_CREATE</strong> permission or higher, for the context project to call this resource.
     * @param projectKey The project key.
     * @param requestBody The repository
     * @returns RestRepository The newly created repository.
     * @throws ApiError
     */
    public static createRepository(
        projectKey: string,
        requestBody?: RestRepository,
    ): CancelablePromise<RestRepository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos',
            path: {
                'projectKey': projectKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The repository was not created due to a validation error.`,
                401: `The currently authenticated user has insufficient permissions to create a repository.`,
                409: `A repository with same name already exists.`,
            },
        });
    }
    /**
     * Delete repository
     * Schedule the repository matching the supplied <strong>projectKey</strong> and <strong>repositorySlug</strong> to be deleted.
     *
     * The authenticated user must have sufficient permissions specified by the repository delete policy to call this resource. The default permission required is <strong>REPO_ADMIN</strong> permission.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @returns any The repository has been scheduled for deletion.
     * @throws ApiError
     */
    public static deleteRepository(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the repository.`,
            },
        });
    }
    /**
     * Get repository
     * Retrieve the repository matching the supplied <strong>projectKey</strong> and <strong>repositorySlug</strong>.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @returns RestRepository The repository which matches the supplied <strong>projectKey</strong> and <strong>repositorySlug</strong>.
     * @throws ApiError
     */
    public static getRepository(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<RestRepository> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to see the specified repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Fork repository
     * Create a new repository forked from an existing repository.
     *
     * The JSON body for this <code>POST</code> is not required to contain <i>any</i> properties. Even the name may be omitted. The following properties will be used, if provided:
     *
     * - <code>"name":"Fork name"</code> - Specifies the forked repository's name
     * - Defaults to the name of the origin repository if not specified
     * - <code>"defaultBranch":"main"</code> - Specifies the forked repository's default branch
     * - Defaults to the origin repository's default branch if not specified
     * - <code>"project":{"key":"TARGET_KEY"}</code> - Specifies the forked repository's target project by key
     * - Defaults to the current user's personal project if not specified
     *
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository and <strong>PROJECT_ADMIN</strong> on the target project to call this resource. Note that users <i>always</i> have <b>PROJECT_ADMIN</b> permission on their personal projects.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The rest fork.
     * @returns RestRepository The newly created fork.
     * @throws ApiError
     */
    public static forkRepository(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestRepository,
    ): CancelablePromise<RestRepository> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `A validation error prevented the fork from being created. Possible validation errors include: The name or slug for the fork collides with another repository in the target project; an SCM type was specified in the JSON body; a project was specified in the JSON body without a "key" property.`,
                401: `The currently authenticated user has insufficient permissions to create a fork.`,
                404: `The specified repository does not exist, or, if a target project was specified, the target project does not exist.`,
            },
        });
    }
    /**
     * Update repository
     * Update the repository matching the <strong>repositorySlug</strong> supplied in the resource path.
     *
     * The repository's slug is derived from its name. If the name changes the slug may also change.
     *
     * This resource can be used to change the repository's default branch by specifying a new default branch in the request. For example: <code>"defaultBranch":"main"</code>
     *
     * This resource can be used to move the repository to a different project by specifying a new project in the request. For example: <code>"project":{"key":"NEW_KEY"}</code>
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The updated repository.
     * @returns RestRepository The updated repository.
     * @throws ApiError
     */
    public static updateRepository(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestRepository,
    ): CancelablePromise<RestRepository> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The repository was not updated due to a validation error.`,
                401: `The currently authenticated user has insufficient permissions to update a repository.`,
                403: `Cannot archive repository because it has open pull requests.`,
                404: `The specified repository does not exist.`,
                409: `A repository with the same name as the target already exists, or the repository is archived.`,
            },
        });
    }
    /**
     * Update default branch for repository
     * Update the default branch of a repository.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The branch to set as default
     * @returns void
     * @throws ApiError
     */
    public static setDefaultBranch2(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestBranch,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/default-branch',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The authenticated user does not have permission to modify the default branch.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Get repository forks
     * Retrieve repositories which have been forked from this one. Unlike #getRelatedRepositories(Repository, PageRequest) related repositories, this only looks at a given repository's direct forks. If those forks have themselves been the origin of more forks, such "grandchildren" repositories will not be retrieved.
     *
     * Only repositories to which the authenticated user has <b>REPO_READ</b> permission will be included, even if other repositories have been forked from this one.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of repositories related to the request repository.
     * @throws ApiError
     */
    public static getForkedRepositories(
        projectKey: string,
        repositorySlug: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestRepository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/forks',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to see the request repository.`,
                404: `The request repository does not exist.`,
            },
        });
    }
    }

