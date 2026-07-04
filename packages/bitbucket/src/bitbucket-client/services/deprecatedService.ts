/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupPickerContext } from '../models/groupPickerContext.js';
import type { RestBranch } from '../models/restBranch.js';
import type { RestBuildStats } from '../models/restBuildStats.js';
import type { RestBuildStatus } from '../models/restBuildStatus.js';
import type { RestMultipleBuildStats } from '../models/restMultipleBuildStats.js';
import type { RestPullRequestParticipant } from '../models/restPullRequestParticipant.js';
import type { UserPickerContext } from '../models/userPickerContext.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class DeprecatedService {
    /**
     * Get build status statistics for multiple commits
     * Produces a list of the build statistics for multiple commits. Commits <em>without any builds associated with them</em> will not be returned.<br> For example if the commit <code>e00cf62997a027bbf785614a93e2e55bb331d268</code> does not have any build statuses associated with it, it will not be present in the response.
     * @param requestBody full SHA1 of each commit
     * @returns RestMultipleBuildStats The number of successful/failed/in-progress/cancelled/unknown builds for each commit (with the caveat that the commits <em>without any builds associated with them</em> will not be present in the response)
     * @throws ApiError
     */
    public static getMultipleBuildStatusStats(
        requestBody?: Array<string>,
    ): CancelablePromise<RestMultipleBuildStats> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/build-status/latest/commits/stats',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The user is not authenticated or does not have the <strong>LICENSED</strong> permission`,
            },
        });
    }
    /**
     * Get build status statistics for commit
     * Gets statistics regarding the builds associated with a commit
     * @param commitId full SHA1 of the commit
     * @param includeUnique include a unique build result if there is either only one failed build, only one in-progress build or only one successful build
     * @returns RestBuildStats The number of successful/failed/in-progress/cancelled/unknown builds for the commit
     * @throws ApiError
     */
    public static getBuildStatusStats(
        commitId: string,
        includeUnique?: boolean,
    ): CancelablePromise<RestBuildStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/build-status/latest/commits/stats/{commitId}',
            path: {
                'commitId': commitId,
            },
            query: {
                'includeUnique': includeUnique,
            },
            errors: {
                401: `The user is not authenticated or does not have the <b>LICENSED</b> permission.`,
            },
        });
    }
    /**
     * @deprecated
     * Get build statuses for commit
     * Gets build statuses associated with a commit.
     *
     * <strong>Deprecated in 7.14, please use the repository based builds resource instead.</strong>
     * @param commitId Full SHA1 of the commit (ex: <code>e00cf62997a027bbf785614a93e2e55bb331d268</code>)
     * @param orderBy How the results should be ordered. Options are NEWEST, OLDEST, STATUS
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A Page of build statuses associated with the commit <br /> (limited to the most recent 100 build statuses associated with the commit)
     * @throws ApiError
     */
    public static getBuildStatus(
        commitId: string,
        orderBy?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestBuildStatus>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/build-status/latest/commits/{commitId}',
            path: {
                'commitId': commitId,
            },
            query: {
                'orderBy': orderBy,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The user is not authenticated or does not have the <b>LICENSED</b> permission.`,
            },
        });
    }
    /**
     * @deprecated
     * Create build status for commit
     * Associates a build status with a commit.The <code>state</code>, the <code>key</code> and the <code>url</code> fields are mandatory. The <code>name</code> and<code>description</code> fields are optional.All fields (mandatory or optional) are limited to 255 characters, except for the <code>url</code>,which is limited to 450 characters.Supported values for the <code>state</code> are <code>SUCCESSFUL</code>, <code>FAILED</code>and <code>INPROGRESS</code>.The authenticated user must have <strong>LICENSED</strong> permission or higher to call this resource.
     *
     * <strong>Deprecated in 7.14, please use the repository based builds resource instead.</strong>
     * @param commitId full SHA1 of the commit
     * @param requestBody build status to associate with the commit
     * @returns void
     * @throws ApiError
     */
    public static addBuildStatus(
        commitId: string,
        requestBody?: RestBuildStatus,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/build-status/latest/commits/{commitId}',
            path: {
                'commitId': commitId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `An error message if the <code>commitId</code> is not a full 40-characters SHA1, if the build status has a missing mandatory field or if the fields are too large`,
                401: `The user is not authenticated or does not have the <strong>LICENSED</strong> permission`,
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
     * @deprecated
     * Get default branch
     * Retrieves the repository's default branch, if it has been created. If the repository is empty, 204 No Content will be returned. For non-empty repositories, if the configured default branch has not yet been created a 404 Not Found will be returned.
     *
     * This URL is deprecated. Callers should use <code>GET /projects/{key}/repos/{slug}/default-branch</code> instead, which allows retrieving the <i>configured</i> default branch even if the ref has not been created yet.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @returns RestBranch The configured default branch for the repository.
     * @throws ApiError
     */
    public static getDefaultBranch1(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<RestBranch> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/branches/default',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to read the repository.`,
                404: `The specified repository does not exist, or its configured default branch does not exist.`,
            },
        });
    }
    /**
     * @deprecated
     * Update default branch
     * Update the default branch of a repository.
     *
     * This URL is deprecated. Callers should use <code>PUT /projects/{key}/repos/{slug}/default-branch</code> instead.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The branch to set as default
     * @returns void
     * @throws ApiError
     */
    public static setDefaultBranch1(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestBranch,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/branches/default',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The currently authenticated user has insufficient permissions to update the repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * @deprecated
     * Unapprove pull request
     * Remove approval from a pull request as the current user. This does not remove the user as a participant.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
     *
     * <strong>Deprecated since 4.2</strong>. Use /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug} instead
     * @param projectKey The project key.
     * @param pullRequestId The ID of the pull request within the repository
     * @param repositorySlug The repository slug.
     * @returns RestPullRequestParticipant Details of the updated participant.
     * @throws ApiError
     */
    public static withdrawApproval(
        projectKey: string,
        pullRequestId: string,
        repositorySlug: string,
    ): CancelablePromise<RestPullRequestParticipant> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/approve',
            path: {
                'projectKey': projectKey,
                'pullRequestId': pullRequestId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                404: `The specified repository or pull request does not exist or the current user is not a participant on the pull request.`,
                409: `The pull request is not open.`,
            },
        });
    }
    /**
     * @deprecated
     * Approve pull request
     * Approve a pull request as the current user. Implicitly adds the user as a participant if they are not already.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
     *
     * <strong>Deprecated since 4.2</strong>. Use /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug} instead
     * @param projectKey The project key.
     * @param pullRequestId The ID of the pull request within the repository
     * @param repositorySlug The repository slug.
     * @returns RestPullRequestParticipant Details of the new participant.
     * @throws ApiError
     */
    public static approve(
        projectKey: string,
        pullRequestId: string,
        repositorySlug: string,
    ): CancelablePromise<RestPullRequestParticipant> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/approve',
            path: {
                'projectKey': projectKey,
                'pullRequestId': pullRequestId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                404: `The specified repository or pull request does not exist.`,
                409: `The pull request is not open.`,
            },
        });
    }
    /**
     * @deprecated
     * Unassign pull request participant
     * Unassigns a participant from the REVIEWER role they may have been given in a pull request.
     *
     * If the participant has no explicit role this method has no effect.
     *
     * Afterwards, the user will still remain a participant in the pull request but their role will be reduced to PARTICIPANT. This is because once made a participant of a pull request, a user will forever remain a participant. Only their role may be altered.
     *
     * The authenticated user must have <strong>REPO_WRITE</strong> permission for the repository that this pull request targets to call this resource.
     *
     * <strong>Deprecated since 4.2</strong>. Use /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug} instead.
     * @param projectKey The project key.
     * @param pullRequestId The ID of the pull request within the repository
     * @param repositorySlug The repository slug.
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static unassignParticipantRole1(
        projectKey: string,
        pullRequestId: string,
        repositorySlug: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants',
            path: {
                'projectKey': projectKey,
                'pullRequestId': pullRequestId,
                'repositorySlug': repositorySlug,
            },
            query: {
                'username': username,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to update the pull request.`,
                404: `The specified repository or pull request does not exist.`,
                409: `Removing reviewers isn't supported on archived repositories.`,
            },
        });
    }
}

