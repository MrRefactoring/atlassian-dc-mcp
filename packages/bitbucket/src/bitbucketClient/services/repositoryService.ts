/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExampleFiles } from '../models/exampleFiles.js';
import type { ExampleMultipartFormData } from '../models/exampleMultipartFormData.js';
import type { ExampleSettings } from '../models/exampleSettings.js';
import type { FileListResource } from '../models/fileListResource.js';
import type { RestAttachmentMetadata } from '../models/restAttachmentMetadata.js';
import type { RestAutoDeclineSettings } from '../models/restAutoDeclineSettings.js';
import type { RestAutoDeclineSettingsRequest } from '../models/restAutoDeclineSettingsRequest.js';
import type { RestAutoMergeRestrictedSettings } from '../models/restAutoMergeRestrictedSettings.js';
import type { RestAutoMergeSettingsRequest } from '../models/restAutoMergeSettingsRequest.js';
import type { RestBranch } from '../models/restBranch.js';
import type { RestBranchCreateRequest } from '../models/restBranchCreateRequest.js';
import type { RestBranchDeleteRequest } from '../models/restBranchDeleteRequest.js';
import type { RestChange } from '../models/restChange.js';
import type { RestComment } from '../models/restComment.js';
import type { RestCommit } from '../models/restCommit.js';
import type { RestCreateBranchRequest } from '../models/restCreateBranchRequest.js';
import type { RestCreateTagRequest } from '../models/restCreateTagRequest.js';
import type { RestDefaultTask } from '../models/restDefaultTask.js';
import type { RestDefaultTaskRequest } from '../models/restDefaultTaskRequest.js';
import type { RestDetailedInvocation } from '../models/restDetailedInvocation.js';
import type { RestDiff } from '../models/restDiff.js';
import type { RestDiffStatsSummary } from '../models/restDiffStatsSummary.js';
import type { RestGitTagCreateRequest } from '../models/restGitTagCreateRequest.js';
import type { RestHookScriptConfig } from '../models/restHookScriptConfig.js';
import type { RestHookScriptTriggers } from '../models/restHookScriptTriggers.js';
import type { RestInvocationHistory } from '../models/restInvocationHistory.js';
import type { RestLabel } from '../models/restLabel.js';
import type { RestMinimalRef } from '../models/restMinimalRef.js';
import type { RestRefRestriction } from '../models/restRefRestriction.js';
import type { RestRefSyncRequest } from '../models/restRefSyncRequest.js';
import type { RestRefSyncStatus } from '../models/restRefSyncStatus.js';
import type { RestRejectedRef } from '../models/restRejectedRef.js';
import type { RestRepository } from '../models/restRepository.js';
import type { RestRepositoryHook } from '../models/restRepositoryHook.js';
import type { RestRepositoryPullRequestSettings } from '../models/restRepositoryPullRequestSettings.js';
import type { RestRepositoryRefChangeActivity } from '../models/restRepositoryRefChangeActivity.js';
import type { RestRestrictionRequest } from '../models/restRestrictionRequest.js';
import type { RestTag } from '../models/restTag.js';
import type { RestUserReaction } from '../models/restUserReaction.js';
import type { RestWebhook } from '../models/restWebhook.js';
import type { RestWebhookCredentials } from '../models/restWebhookCredentials.js';
import type { RestWebhookRequestResponse } from '../models/restWebhookRequestResponse.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class RepositoryService {
    /**
     * Delete branch
     *  Deletes a branch in the specified repository.
     *
     *
     * If the branch does not exist, this operation will not raise an error. In other words after calling this resource
     * and receiving a 204 response the branch provided in the request is guaranteed to not exist in the specified
     * repository any more, regardless of its existence beforehand.
     *
     *
     * The optional 'endPoint' parameter of the request may contain a commit ID that the provided ref name is
     * expected to point to. Should the ref point to a different commit ID, a 400 response will be returned with
     * appropriate error details.
     *
     *
     * The authenticated user must have an effective <strong>REPO_WRITE</strong> permission to call this resource. If
     * branch permissions are set up in the repository, the authenticated user must also have access to the branch name
     * that is to be deleted.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody Branch delete request
     * @returns void
     * @throws ApiError
     */
    public static deleteBranch(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestBranchDeleteRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The branch was not deleted because the request was invalid, e.g. no ref name
                to delete was provided, or the provided ref name points to the default branch
                in the repository that cannot be deleted`,
                401: `The currently authenticated user has insufficient permissions to delete a
                branch. This could be due to insufficient repository permissions, or lack of
                branch permission for the provided ref name.`,
            },
        });
    }
    /**
     * Create branch
     *  Creates a branch in the specified repository.
     *
     *
     * The authenticated user must have an effective <strong>REPO_WRITE</strong> permission to call this resource. If
     * branch permissions are set up in the repository, the authenticated user must also have access to the branch name
     * that is to be created.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody
     * @returns RestBranch JSON representation of the newly created branch
     * @throws ApiError
     */
    public static createBranch(
        projectKey: string,
        repositorySlug: string,
        requestBody: RestBranchCreateRequest,
    ): CancelablePromise<RestBranch> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The branch was not created because the request was invalid, e.g. the provided
                ref name already existed in the repository, or was not a valid ref name in the
                repository`,
                401: `The currently authenticated user has insufficient permissions to create a branch. This could be due to insufficient repository permissions, or lack of branch permission for the provided ref name`,
                409: `The branch name overlapped with an existing branch`,
            },
        });
    }
    /**
     * Get branch
     * Gets the branch information associated with a single commit from a given repository.
     * @param projectKey The project key.
     * @param commitId
     * @param repositorySlug The repository slug.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of branch refs associated with the commit
     * @throws ApiError
     */
    public static findByCommit(
        projectKey: string,
        commitId: any,
        repositorySlug: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestMinimalRef>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/branch-utils/latest/projects/{projectKey}/repos/{repositorySlug}/branches/info/{commitId}',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                500: `The request has timed out processing the branch request`,
            },
        });
    }
    /**
     * Deletes all default tasks for the repository
     * Delete all the default tasks for the supplied repository
     *
     * The authenticated user must have **REPO_ADMIN** permission for this repository to call the resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteAllDefaultTasks1(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/default-tasks/latest/projects/{projectKey}/repos/{repositorySlug}/tasks',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete default tasks`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Get a page of default tasks
     * Retrieves the default tasks for the supplied repository.
     *
     * The authenticated user must have **REPO_VIEW** permission for this repository to call the resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param markup If present or `"true"`, includes a markup-rendered description
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of default tasks
     * @throws ApiError
     */
    public static getDefaultTasks1(
        projectKey: string,
        repositorySlug: string,
        markup?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestDefaultTask>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/default-tasks/latest/projects/{projectKey}/repos/{repositorySlug}/tasks',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'markup': markup,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete default tasks`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Add a default task
     * Creates a default task for the supplied repository.
     *
     * The authenticated user must have **REPO_ADMIN** permission for this repository to call the resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The task to be added
     * @returns RestDefaultTask The default task
     * @throws ApiError
     */
    public static addDefaultTask1(
        projectKey: string,
        repositorySlug: string,
        requestBody: RestDefaultTaskRequest,
    ): CancelablePromise<RestDefaultTask> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/default-tasks/latest/projects/{projectKey}/repos/{repositorySlug}/tasks',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One or more of the following error cases occurred (check the error message for more details):
                - the description is empty- the sourceMatcher or targetMatcher is invalid`,
                401: `The currently authenticated user has insufficient permissions to add a default task`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Delete a specific default task
     * Delete a specific default task for a repository.
     *
     * The authenticated user must have **REPO_ADMIN** permission for this repository to call the resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param taskId The ID of the default task
     * @returns void
     * @throws ApiError
     */
    public static deleteDefaultTask1(
        projectKey: string,
        repositorySlug: string,
        taskId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/default-tasks/latest/projects/{projectKey}/repos/{repositorySlug}/tasks/{taskId}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
                'taskId': taskId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete default tasks`,
                404: `The specified repository or task does not exist`,
            },
        });
    }
    /**
     * Update a default task
     * Updates a default task for the supplied repository.
     *
     * The authenticated user must have **REPO_ADMIN** permission for this repository to call the resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param taskId The ID of the default task
     * @param requestBody The task to be updated
     * @returns RestDefaultTask The default task
     * @throws ApiError
     */
    public static updateDefaultTask1(
        projectKey: string,
        repositorySlug: string,
        taskId: string,
        requestBody: RestDefaultTaskRequest,
    ): CancelablePromise<RestDefaultTask> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/default-tasks/latest/projects/{projectKey}/repos/{repositorySlug}/tasks/{taskId}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
                'taskId': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One or more of the following error cases occurred (check the error message for more details):
                - the provided taskId does not exist- the description is empty- the sourceMatcher or targetMatcher is invalid`,
                401: `The currently authenticated user has insufficient permissions to add a default task`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Create tag
     * Creates a tag in the specified repository.
     *
     * The authenticated user must have an effective <strong>REPO_WRITE</strong> permission to call this resource.
     *
     * 'LIGHTWEIGHT' and 'ANNOTATED' are the two type of tags that can be created. The 'startPoint' can either be a ref or a 'commit'.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The create git tag request.
     * @returns RestTag A JSON representation of the newly created tag.
     * @throws ApiError
     */
    public static createTag(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestGitTagCreateRequest,
    ): CancelablePromise<RestTag> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/git/latest/projects/{projectKey}/repos/{repositorySlug}/tags',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The tag was not created because the request was invalid, e.g. the provided ref name already existed in the repository, or was not a valid ref name in the repository, or the start point is invalid.`,
                401: `The currently authenticated user has insufficient permissions to create a tag. This could be due to insufficient repository permissions.`,
            },
        });
    }
    /**
     * Delete tag
     * Deletes a tag in the specified repository.
     *
     * The authenticated user must have an effective <strong>REPO_WRITE</strong> permission to call this resource.
     * @param projectKey The project key.
     * @param name The name of the tag to be deleted.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteTag(
        projectKey: string,
        name: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/git/latest/projects/{projectKey}/repos/{repositorySlug}/tags/{name}',
            path: {
                'projectKey': projectKey,
                'name': name,
                'repositorySlug': repositorySlug,
            },
            errors: {
                400: `The tag was not deleted because repository is either empty, or is not a git repository.`,
                401: `The currently authenticated user has insufficient permissions to delete a tag. This could be due to insufficient repository permissions.`,
                404: `If the tag doesn't exist in the repository.`,
            },
        });
    }
    /**
     * Remove a reaction from comment
     * Remove an emoticon reaction from a comment
     * @param projectKey The project key.
     * @param commentId The comment id
     * @param commitId The commit id
     * @param emoticon The emoticon to remove
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static unReact(
        projectKey: string,
        commentId: string,
        commitId: string,
        emoticon: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comment-likes/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments/{commentId}/reactions/{emoticon}',
            path: {
                'projectKey': projectKey,
                'commentId': commentId,
                'commitId': commitId,
                'emoticon': emoticon,
                'repositorySlug': repositorySlug,
            },
        });
    }
    /**
     * React to a comment
     * Add an emoticon reaction to a comment
     * @param projectKey The project key.
     * @param commentId The comment id
     * @param commitId The commit id
     * @param emoticon The emoticon to add
     * @param repositorySlug The repository slug.
     * @returns RestUserReaction The added reaction
     * @throws ApiError
     */
    public static react(
        projectKey: string,
        commentId: string,
        commitId: string,
        emoticon: string,
        repositorySlug: string,
    ): CancelablePromise<RestUserReaction> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/comment-likes/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments/{commentId}/reactions/{emoticon}',
            path: {
                'projectKey': projectKey,
                'commentId': commentId,
                'commitId': commitId,
                'emoticon': emoticon,
                'repositorySlug': repositorySlug,
            },
        });
    }
    /**
     * Search for ref restrictions
     * Search for restrictions using the supplied parameters.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission or higher to call this resource. Only authenticated users may call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param matcherType Matcher type to filter on
     * @param matcherId Matcher id to filter on. Requires the matcherType parameter to be specified also.
     * @param type Types of restrictions to filter on.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A response containing a page of restrictions.
     * @throws ApiError
     */
    public static getRestrictions1(
        projectKey: string,
        repositorySlug: string,
        matcherType?: 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH',
        matcherId?: string,
        type?: 'read-only' | 'no-deletes' | 'fast-forward-only' | 'pull-request-only' | 'no-creates',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestRefRestriction>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'matcherType': matcherType,
                'matcherId': matcherId,
                'type': type,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request has failed validation.`,
                401: `The currently authenticated user is not permitted to get restrictions on the provided project`,
                404: `No restriction exists for the provided ID.`,
            },
        });
    }
    /**
     * Create multiple ref restrictions
     * Allows creating multiple restrictions at once.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The request containing a list of the details of the restrictions to create.
     * @returns RestRefRestriction Response contains the ref restriction that was just created.
     * @throws ApiError
     */
    public static createRestrictions1(
        projectKey: string,
        repositorySlug: string,
        requestBody?: Array<RestRestrictionRequest>,
    ): CancelablePromise<RestRefRestriction> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/vnd.atl.bitbucket.bulk+json',
            errors: {
                400: `The request has failed validation.`,
                401: `The currently authenticated user has insufficient permissions to perform this operation.`,
            },
        });
    }
    /**
     * Delete a ref restriction
     * Deletes a restriction as specified by a restriction id.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission or higher to call this resource. Only authenticated users may call this resource.
     * @param projectKey The project key.
     * @param id The restriction id.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteRestriction1(
        projectKey: string,
        id: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                400: `The request has failed validation.`,
                401: `The currently authenticated user is not permitted to delete restrictions on the provided project`,
            },
        });
    }
    /**
     * Get a ref restriction
     * Returns a restriction as specified by a restriction id.
     *
     * The authenticated user must have <strong>REPO_ADMIN</strong> permission or higher to call this resource. Only authenticated users may call this resource.
     * @param projectKey The project key.
     * @param id The restriction id.
     * @param repositorySlug The repository slug.
     * @returns RestRefRestriction A response containing the restriction.
     * @throws ApiError
     */
    public static getRestriction1(
        projectKey: string,
        id: string,
        repositorySlug: string,
    ): CancelablePromise<RestRefRestriction> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/branch-permissions/latest/projects/{projectKey}/repos/{repositorySlug}/restrictions/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                400: `The request has failed validation.`,
                401: `The currently authenticated user is not permitted to get restrictions on the provided project`,
                404: `No restriction exists for the provided ID.`,
            },
        });
    }
    /**
     * Get synchronization status
     * Retrieves the synchronization status for the specified repository. In addition to listing refs which cannot be synchronized, if any, the status also provides the timestamp for the most recent synchronization and indicates whether synchronization is available and enabled. If "?at" is specified in the URL, the synchronization status for the specified ref is returned, rather than the complete repository status.
     *
     * The authenticated user must have <b>REPO_READ</b> permission for the repository, or it must be public if the request is anonymous. Additionally, after synchronization is enabled for a repository, meaning synchronization was available at that time, permission changes and other actions can cause it to become unavailable. Even when synchronization is enabled, if it is no longer available for the repository it will not be performed.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param at Retrieves the synchronization status for the specified ref within the repository, rather than for the entire repository
     * @returns RestRefSyncStatus Synchronization status for the specified repository, or specific ref within that repository.
     * @throws ApiError
     */
    public static getStatus(
        projectKey: string,
        repositorySlug: string,
        at?: string,
    ): CancelablePromise<RestRefSyncStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sync/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'at': at,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to view the repository, or the repository is not public if the request is anonymous.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Disable synchronization
     * Enables or disables synchronization for the specified repository. When synchronization is enabled, branches within the repository are immediately synchronized and the status is updated with the outcome. That initial synchronization is performed before the REST request returns, allowing it to return the updated status.
     *
     * The authenticated user must have <b>REPO_ADMIN</b> permission for the specified repository. Anonymous users cannot manage synchronization, even on public repositories. Additionally, synchronization must be available for the specified repository. Synchronization is only available if:
     *
     * - The repository is a fork, since its origin is used as upstream
     * - The owning user still has access to the fork's origin,  if the repository is a <i>personalfork</i>
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody
     * @returns RestRefSyncStatus The updated synchronization status for the repository, after enabling synchronization. 204 NO CONTENT is returned instead after disabling synchronization.
     * @throws ApiError
     */
    public static setEnabled(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestRefSyncStatus,
    ): CancelablePromise<RestRefSyncStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sync/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The JSON payload for the request did not define the "enabled" property.`,
                401: `The currently authenticated user has insufficient permissions to manage synchronization in the specified repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Manual synchronization
     * Allows developers to apply a manual operation to bring a ref back in sync with upstream when it becomes out of sync due to conflicting changes. The following actions are supported:
     *
     * - <tt>MERGE</tt>: Merges in commits from the upstream ref. After applying this action, the   synchronized ref will be <tt>AHEAD</tt> (as it still includes commits that do not exist   upstream.
     * - This action is only supported for <tt>DIVERGED</tt> refs
     * - If a "commitMessage" is provided in the context, it will be used on the merge commit.      Otherwise a default message is used.
     * - <tt>DISCARD</tt>: <i>Throws away</i> local changes in favour of those made upstream. This is a   <i>destructive</i> operation where commits in the local repository are lost.
     * - No context entries are supported for this action
     * - If the upstream ref has been deleted, the local ref is deleted as well
     * - Otherwise, the local ref is updated to reference the same commit as upstream, even if      the update is not fast-forward (similar to a forced push)
     *
     *
     * The authenticated user must have <b>REPO_WRITE</b> permission for the specified repository. Anonymous users cannot synchronize refs, even on public repositories. Additionally, synchronization must be <i>enabled</i> and <i>available</i> for the specified repository.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody
     * @returns RestRejectedRef The requested action was successfully performed, and has updated the ref's state, but the ref if is still not in sync with upstream. For example, after applying the <tt>MERGE</tt> action, the ref will still be <tt>AHEAD</tt> of upstream. If the action brings the ref in sync with upstream, 204 NO CONTENT is returned instead.
     * @throws ApiError
     */
    public static synchronize(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestRefSyncRequest,
    ): CancelablePromise<RestRejectedRef> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sync/latest/projects/{projectKey}/repos/{repositorySlug}/synchronize',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested synchronization action was not understood.`,
                401: `The currently authenticated user has insufficient permissions to update refs within the specified repository.`,
                404: `The specified repository does not exist.`,
                409: `Synchronization is not available or enabled for the specified repository, or the ref is already in sync with upstream.`,
                501: `The requested synchronization action was understood by the server, but the mechanism to apply it has not been implemented.`,
            },
        });
    }
    /**
     * Get recently accessed repositories
     * Retrieve a page of recently accessed repositories for the currently authenticated user.
     *
     * Repositories are ordered from most recently to least recently accessed. <p>Only authenticated users may call this resource.
     * @param permission (optional) If specified, it must be a valid repository permission level name and will limit the resulting repository list to ones that the requesting user has the specified permission level to. If not specified, the default <code>REPO_READ</code> permission level will be assumed.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of recently accessed repositories.
     * @throws ApiError
     */
    public static getRepositoriesRecentlyAccessed(
        permission: string = 'REPO_READ',
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
            url: '/api/latest/profile/recent/repos',
            query: {
                'permission': permission,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The permission level is unknown or not related to repository.`,
                401: `The request is unauthenticated.`,
            },
        });
    }
    /**
     * Stream archive of repository
     * Streams an archive of the repository's contents at the requested commit. If no `at=` commit is requested, an archive of the default branch is streamed.
     *
     * The <code>filename=</code> query parameter may be used to specify the exact filename to include in the "Content-Disposition" header. If an explicit filename is not provided, one will be automatically generated based on what is being archived. Its format depends on the at= value:
     *
     * - No <code>at=</code> commit:     &lt;slug&gt;-&lt;default-branch-name&gt;@&lt;commit&gt;.&lt;format&gt;;     e.g. example-master@43c2f8a0fe8.zip
     * - <code>at=</code>sha: &lt;slug&gt;-&lt;at&gt;.&lt;format&gt;; e.g.     example-09bcbb00100cfbb5310fb6834a1d5ce6cac253e9.tar.gz
     * - <code>at=</code>branchOrTag: &lt;slug&gt;-&lt;branchOrTag&gt;@&lt;commit&gt;.&lt;format&gt;;     e.g. example-feature@bbb225f16e1.tar
     *
     * - If the branch or tag is qualified (e.g. refs/heads/master, the short name         (master) will be included in the filename
     * - If the branch or tag's <i>short name</i> includes slashes (e.g. release/4.6),         they will be converted to hyphens in the filename (release-4.5)
     *
     *
     *
     *
     * Archives may be requested in the following formats by adding the <code>format=</code> query parameter:
     *
     * - zip: A zip file using standard compression (Default)
     * - tar: An uncompressed tarball
     * - tar.gz or tgz: A GZip-compressed tarball
     *
     *
     * The contents of the archive may be filtered by using the <code>path=</code> query parameter to specify paths to include. <code>path=</code> may be specified multiple times to include multiple paths.
     *
     * The <code>prefix=</code> query parameter may be used to define a directory (or multiple directories) where the archive's contents should be placed. If the prefix does not end with /, one will be added automatically. The prefix is <i>always</i> treated as a directory; it is not possible to use it to prepend characters to the entries in the archive.
     *
     * Archives of public repositories may be streamed by any authenticated or anonymous user. Streaming archives for non-public repositories requires an <i>authenticated user</i> with at least <b>REPO_READ</b> permission.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param path Paths to include in the streamed archive; may be repeated to include multiple paths
     * @param filename A filename to include the "Content-Disposition" header
     * @param at The commit to stream an archive of; if not supplied, an archive of the default branch is streamed
     * @param prefix A prefix to apply to all entries in the streamed archive; if the supplied prefix does not end with a trailing /, one will be added automatically
     * @param format The format to stream the archive in; must be one of: zip, tar, tar.gz or tgz
     * @returns any An archive or the requested commit, in zip, tar or gzipped-tar format.
     * @throws ApiError
     */
    public static getArchive(
        projectKey: string,
        repositorySlug: string,
        path?: string,
        filename?: string,
        at?: string,
        prefix?: string,
        format?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/archive',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'path': path,
                'filename': filename,
                'at': at,
                'prefix': prefix,
                'format': format,
            },
            errors: {
                400: `The requested format is not supported.`,
                401: `The currently authenticated user has insufficient permissions to view the repository.`,
                404: `The repository does not exist or does not contain the at commit.`,
            },
        });
    }
    /**
     * Delete an attachment
     * Delete an attachment.
     *
     * The user must be authenticated and have <strong>REPO_ADMIN</strong> permission for the specified repository.
     * @param projectKey The project key
     * @param attachmentId the attachment ID
     * @param repositorySlug The repository slug
     * @returns void
     * @throws ApiError
     */
    public static deleteAttachment(
        projectKey: string,
        attachmentId: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/attachments/{attachmentId}',
            path: {
                'projectKey': projectKey,
                'attachmentId': attachmentId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the attachment`,
                404: `The attachment does not exist`,
            },
        });
    }
    /**
     * Get an attachment
     * Retrieve the attachment.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository that is associated to the attachment.
     *
     * Range requests (see IETF RFC7233) are supported. However only a single range issupported. If multiple ranges are passed the ranges will be ignored and the entire content will be returned in the response.
     * @param projectKey The project key
     * @param attachmentId the attachment ID
     * @param repositorySlug The repository slug
     * @param userAgent
     * @param range
     * @returns any the attachment
     * @throws ApiError
     */
    public static getAttachment(
        projectKey: string,
        attachmentId: string,
        repositorySlug: string,
        userAgent?: string,
        range?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/attachments/{attachmentId}',
            path: {
                'projectKey': projectKey,
                'attachmentId': attachmentId,
                'repositorySlug': repositorySlug,
            },
            headers: {
                'User-Agent': userAgent,
                'Range': range,
            },
            errors: {
                401: `the user is currently not authenticated`,
                404: `The attachment does not exist`,
            },
        });
    }
    /**
     * Delete attachment metadata
     * Delete attachment metadata.
     *
     * The user must be authenticated and have <strong>REPO_ADMIN</strong> permission for the specified repository.
     * @param projectKey The project key
     * @param attachmentId the attachment ID
     * @param repositorySlug The repository slug
     * @returns void
     * @throws ApiError
     */
    public static deleteAttachmentMetadata(
        projectKey: string,
        attachmentId: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/attachments/{attachmentId}/metadata',
            path: {
                'projectKey': projectKey,
                'attachmentId': attachmentId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete theattachment metadata`,
                404: `The attachment or the attachment metadata does not exist`,
            },
        });
    }
    /**
     * Get attachment metadata
     * Retrieve the attachment metadata.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository that is associated to the attachment that has the attachment metadata.
     * @param projectKey The project key
     * @param attachmentId the attachment ID
     * @param repositorySlug The repository slug
     * @returns RestAttachmentMetadata The attachment metadata
     * @throws ApiError
     */
    public static getAttachmentMetadata(
        projectKey: string,
        attachmentId: string,
        repositorySlug: string,
    ): CancelablePromise<RestAttachmentMetadata> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/attachments/{attachmentId}/metadata',
            path: {
                'projectKey': projectKey,
                'attachmentId': attachmentId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the attachment metadata`,
                404: `The attachment or the attachment metadata does not exist`,
            },
        });
    }
    /**
     * Save attachment metadata
     * Save attachment metadata.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository that is associated to the attachment that has the attachment metadata.
     * @param projectKey The project key
     * @param attachmentId the attachment ID
     * @param repositorySlug The repository slug
     * @param requestBody The attachment metadata can be any valid JSON content
     * @returns any The attachment metadata
     * @throws ApiError
     */
    public static saveAttachmentMetadata(
        projectKey: string,
        attachmentId: string,
        repositorySlug: string,
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/attachments/{attachmentId}/metadata',
            path: {
                'projectKey': projectKey,
                'attachmentId': attachmentId,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The supplied content is not valid JSON`,
                401: `The currently authenticated user has insufficient permissions to save theattachment metadata`,
                404: `The repository or the attachment does not exist`,
            },
        });
    }
    /**
     * Find branches
     * Retrieve the branches matching the supplied <strong>filterText</strong> param.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param boostMatches Controls whether exact and prefix matches will be boosted to the top
     * @param context
     * @param orderBy Ordering of refs either ALPHABETICAL (by name) or MODIFICATION (last updated)
     * @param details Whether to retrieve plugin-provided metadata about each branch
     * @param filterText The text to match on
     * @param base Base branch or tag to compare each branch to (for the metadata providers that uses that information
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any The branches matching the supplied <strong>filterText</strong>.
     * @throws ApiError
     */
    public static getBranches(
        projectKey: string,
        repositorySlug: string,
        boostMatches?: boolean,
        context?: string,
        orderBy?: 'ALPHABETICAL' | 'MODIFICATION',
        details?: boolean,
        filterText?: string,
        base?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestBranch>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/branches',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'boostMatches': boostMatches,
                'context': context,
                'orderBy': orderBy,
                'details': details,
                'filterText': filterText,
                'base': base,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to read the repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Create branch
     * Creates a branch using the information provided in the RestCreateBranchRequest request
     *
     * The authenticated user must have <strong>REPO_WRITE</strong> permission for the context repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The request to create a branch containing a <strong>name</strong>, <strong>startPoint</strong>, and optionally a <strong>message</strong>
     * @returns RestBranch The created branch.
     * @throws ApiError
     */
    public static createBranchForRepository(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestCreateBranchRequest,
    ): CancelablePromise<RestBranch> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/branches',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The currently authenticated user has insufficient permissions to write to the repository.`,
                404: `The specified repository does not exist.`,
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
     * Get file content at revision
     * Retrieve a page of content for a file path at a specified revision.
     *
     * Responses from this endpoint vary widely depending on the query parameters. The example JSON is for a request that does not use size, type, blame or noContent.
     *
     * 1. size will return a response like {"size":10000}
     * 2. type will return a response like {"type":"FILE"}, where possible values are    "DIRECTORY", "FILE" and "SUBMODULE"
     * 3. blame <i>without</i> noContent will include blame for the lines of    content returned on the page
     * 4. blame <i>with</i> noContent will omit file contents and only return    blame for the requested lines
     * 5. noContent without blame is ignored and does nothing
     *
     *
     * The various parameters are "processed" in the above order. That means ?size=true&amp;type=truewill return a size response, not a type one; the type parameter will be ignored.
     *
     * The blame and noContent query parameters are handled differently from size and type. For blame and noContent, the <i>presence</i> of the parameter implies "true" if no value is specified; size and and type both require an explicit=true or they're treated as "false".
     *
     * - ?blame is the same as ?blame=true
     * - ?blame&amp;noContent is the same as ?blame=true&amp;noContent=true
     * - ?size is the same as ?size=false
     * - ?type is the same as ?type=false
     *
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param noContent If blame&amp;noContent only the blame is retrieved instead of the contents
     * @param at The commit ID or ref to retrieve the content for
     * @param size If true only the size will be returned for the file path instead of the contents
     * @param blame If present and not equal to 'false', the blame will be returned for the file as well
     * @param type If true only the type will be returned for the file path instead of the contents
     * @returns any A page of contents from a file.
     * @throws ApiError
     */
    public static getContent(
        projectKey: string,
        repositorySlug: string,
        noContent?: string,
        at?: string,
        size?: string,
        blame?: string,
        type?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/browse',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'noContent': noContent,
                'at': at,
                'size': size,
                'blame': blame,
                'type': type,
            },
            errors: {
                400: `The path parameter was not supplied.`,
                401: `The currently authenticated user has insufficient permissions to view the repository.`,
                404: `The repository does not exist.`,
            },
        });
    }
    /**
     * Get file content
     * Retrieve a page of content for a file path at a specified revision.
     *
     * Responses from this endpoint vary widely depending on the query parameters. The example JSON is for a request that does not use size, type, blame or noContent.
     *
     * 1. size will return a response like {"size":10000}
     * 2. type will return a response like {"type":"FILE"}, where possible values are    "DIRECTORY", "FILE" and "SUBMODULE"
     * 3. blame <i>without</i> noContent will include blame for the lines of    content returned on the page
     * 4. blame <i>with</i> noContent will omit file contents and only return    blame for the requested lines
     * 5. noContent without blame is ignored and does nothing
     *
     *
     * The various parameters are "processed" in the above order. That means ?size=true&amp;type=truewill return a size response, not a type one; the type parameter will be ignored.
     *
     * The blame and noContent query parameters are handled differently from size and type. For blame and noContent, the <i>presence</i> of the parameter implies "true" if no value is specified; size and and type both require an explicit=true or they're treated as "false".
     *
     * - ?blame is the same as ?blame=true
     * - ?blame&amp;noContent is the same as ?blame=true&amp;noContent=true
     * - ?size is the same as ?size=false
     * - ?type is the same as ?type=false
     *
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param path The file path to retrieve content from
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param noContent If blame&amp;noContent only the blame is retrieved instead of the contents
     * @param at The commit ID or ref to retrieve the content for
     * @param size If true only the size will be returned for the file path instead of the contents
     * @param blame If present and not equal to 'false', the blame will be returned for the file as well
     * @param type If true only the type will be returned for the file path instead of the contents
     * @returns any A page of contents from a file.
     * @throws ApiError
     */
    public static getContent1(
        path: string,
        projectKey: string,
        repositorySlug: string,
        noContent?: string,
        at?: string,
        size?: string,
        blame?: string,
        type?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/browse/{path}',
            path: {
                'path': path,
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'noContent': noContent,
                'at': at,
                'size': size,
                'blame': blame,
                'type': type,
            },
            errors: {
                400: `The path or until parameters were not supplied.`,
                401: `The currently authenticated user has insufficient permissions to view the repository.`,
                404: `The repository does not exist.`,
            },
        });
    }
    /**
     * Edit file
     * Update the content of path, on the given repository and branch.
     *
     * This resource accepts PUT multipart form data, containing the file in a form-field named content.
     *
     * An example <a href="http://curl.haxx.se/">curl</a> request to update 'README.md' would be:
     *
     * ```curl -X PUT -u username:password -F content=@README.md  -F 'message=Updated using file-edit REST API' -F branch=master -F  sourceCommitId=5636641a50b  http://example.com/rest/api/latest/projects/PROJECT_1/repos/repo_1/browse/README.md ```
     *
     * - branch:  the branch on which the path should be modified or created
     * - content: the full content of the file at path
     * - message: the message associated with this change, to be used as the commit message. Or null if the default message should be used.
     * - sourceCommitId: the commit ID of the file before it was edited, used to identify if content has changed. Or null if this is a new file
     *
     *
     * The file can be updated or created on a new branch. In this case, the sourceBranch parameter should be provided to identify the starting point for the new branch and the branch parameter identifies the branch to create the new commit on.
     * @param path The path of the file that is to be modified or created
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param formData The multipart form data containing the file
     * @returns RestCommit The newly created commit.
     * @throws ApiError
     */
    public static editFile(
        path: string,
        projectKey: string,
        repositorySlug: string,
        formData?: ExampleMultipartFormData,
    ): CancelablePromise<RestCommit> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/browse/{path}',
            path: {
                'path': path,
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `There are validation errors, e.g. The branch or content parameters were not supplied.`,
                401: `The currently authenticated user does not have write permission for the given repository.`,
                403: `The request was authenticated using a project or repository access token, which does not have a valid user associated with it`,
                404: `The repository does not exist.`,
                409: `The file already exists when trying to create a file, or the given content does not modify the file, or the file has changed since the given sourceCommitId, or the repository is archived.`,
            },
        });
    }
    /**
     * Get changes made in commit
     * Retrieve a page of changes made in a specified commit.
     *
     * <strong>Note:</strong> The implementation will apply a hard cap ({@code page.max.changes}) and it is not possible to request subsequent content when that cap is exceeded.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param until The commit to retrieve changes for
     * @param since The commit to which <code>until</code> should be compared to produce a page of changes. If not specified the commit's first parent is assumed (if one exists)
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of changes
     * @throws ApiError
     */
    public static getChanges1(
        projectKey: string,
        repositorySlug: string,
        until?: string,
        since?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestChange>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/changes',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'until': until,
                'since': since,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The until parameter was not supplied.`,
                401: `The currently authenticated user has insufficient permissions to view the repository.`,
                404: `The repository or the since or until parameters supplied does not exist.`,
            },
        });
    }
    /**
     * Get commits
     * Retrieve a page of commits from a given starting commit or "between" two commits. If no explicit commit is specified, the tip of the repository's default branch is assumed. commits may be identified by branch or tag name or by ID. A path may be supplied to restrict the returned commits to only those which affect that path.
     *
     * The authenticated user must have <b>REPO_READ</b> permission for the specified repository to call this resource.
     * @param projectKey The project key
     * @param repositorySlug The repository slug
     * @param avatarScheme The desired scheme for the avatar URL. If the parameter is not present URLs will use the same scheme as this request
     * @param path An optional path to filter commits by
     * @param withCounts Optionally include the total number of commits and total number of unique authors
     * @param followRenames If <code>true</code>, the commit history of the specified file will be followed past renames. Only valid for a path to a single file.
     * @param until The commit ID (SHA1) or ref (inclusively) to retrieve commits before
     * @param avatarSize If present the service adds avatar URLs for commit authors. Should be an integer specifying the desired size in pixels. If the parameter is not present, avatar URLs will not be set
     * @param since The commit ID or ref (exclusively) to retrieve commits after
     * @param merges If present, controls how merge commits should be filtered. Can be either <code>exclude</code>, to exclude merge commits, <code>include</code>, to include both merge commits and non-merge commits or <code>only</code>, to only return merge commits.
     * @param ignoreMissing <code>true</code> to ignore missing commits, <code>false</code> otherwise
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of commits
     * @throws ApiError
     */
    public static getCommits(
        projectKey: string,
        repositorySlug: string,
        avatarScheme?: string,
        path?: string,
        withCounts?: string,
        followRenames?: string,
        until?: string,
        avatarSize?: string,
        since?: string,
        merges?: string,
        ignoreMissing?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestCommit>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'avatarScheme': avatarScheme,
                'path': path,
                'withCounts': withCounts,
                'followRenames': followRenames,
                'until': until,
                'avatarSize': avatarSize,
                'since': since,
                'merges': merges,
                'ignoreMissing': ignoreMissing,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `One of the supplied commit IDs or refs was invalid.`,
                401: `The currently authenticated user has insufficient permissions to view the repository.`,
                404: `The repository does not exist.`,
            },
        });
    }
    /**
     * Get commit by ID
     * Retrieve a single commit <i>identified by its ID</i>. In general, that ID is a SHA1. <u>From 2.11, ref names like "refs/heads/master" are no longer accepted by this resource.</u>
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key
     * @param commitId The commit ID to retrieve
     * @param repositorySlug The repository slug
     * @param path An optional path to filter the commit by. If supplied the details returned <i>may not</i> be for the specified commit. Instead, starting from the specified commit, they will be the details for the first commit affecting the specified path.
     * @returns RestCommit A commit
     * @throws ApiError
     */
    public static getCommit(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        path?: string,
    ): CancelablePromise<RestCommit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
            },
            query: {
                'path': path,
            },
            errors: {
                400: `The supplied commit ID was invalid`,
                404: `The repository does not exist.`,
            },
        });
    }
    /**
     * Get changes in commit
     * Retrieve a page of changes made in a specified commit.
     *
     * <strong>Note:</strong> The implementation will apply a hard cap (<code>page.max.changes</code>) and it is not possible to request subsequent content when that cap is exceeded.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
     * @param projectKey The project key
     * @param commitId The commit to retrieve changes for
     * @param repositorySlug The repository slug
     * @param withComments <code>true</code> to apply comment counts in the changes (the default); otherwise, <code>false</code> to stream changes without comment counts
     * @param since The commit to which <code>until</code> should be compared to produce a page of changes. If not specified the commit's first parent is assumed (if one exists)
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of changes
     * @throws ApiError
     */
    public static getChanges(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        withComments?: string,
        since?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestChange>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/changes',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
            },
            query: {
                'withComments': withComments,
                'since': since,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The until parameter was not supplied`,
                401: `The currently authenticated user has insufficient permissions to view the repository.`,
                404: `The repository or the since or until parameters supplied does not exist.`,
            },
        });
    }
    /**
     * Search for commit comments
     * Retrieves the commit discussion comments that match the specified search criteria.
     *
     * It is possible to retrieve commit discussion comments that are anchored to a range of commits by providing the sinceId that the comments anchored from.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that the commit is in to call this resource.
     * @param projectKey The project key
     * @param commitId The <i>full ID</i> of the commit within the repository
     * @param repositorySlug The repository slug
     * @param path The path to the file on which comments were made
     * @param since For a merge commit, a parent can be provided to specify which diff the comments are on. For a commit range, a sinceId can be provided to specify where the comments are anchored from.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of comments that match the search criteria
     * @throws ApiError
     */
    public static getComments(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        path?: string,
        since?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestComment>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
            },
            query: {
                'path': path,
                'since': since,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The currently authenticated user has insufficient permissions to view the comment`,
                404: `Unable to find the supplied project, repository, or commit. The missing entity will be specified in the error details.`,
            },
        });
    }
    /**
     * Add a new commit comment
     * Add a new comment.
     *
     * Comments can be added in a few places by setting different attributes:
     *
     * General commit comment:
     *
     * ```{
         * "text": "An insightful general comment on a commit."
         * }
         *
         * </pre>
         * Reply to a comment:
         * <pre>{
             * "text": "A measured reply.",
             * "parent": {
                 * "id": 1
                 * }
                 * }
                 * </pre>
                 * General file comment:
                 * <pre>{
                     * "text": "An insightful general comment on a file.",
                     * "anchor": {
                         * "diffType": "COMMIT",
                         * "fromHash": "6df3858eeb9a53a911cd17e66a9174d44ffb02cd",
                         * "path": "path/to/file",
                         * "srcPath": "path/to/file",
                         * "toHash": "04c7c5c931b9418ca7b66f51fe934d0bd9b2ba4b"
                         * }
                         * }
                         * </pre>
                         * File line comment:
                         * <pre>{
                             * "text": "A pithy comment on a particular line within a file.",
                             * "anchor": {
                                 * "diffType": "COMMIT",
                                 * "line": 1,
                                 * "lineType": "CONTEXT",
                                 * "fileType": "FROM",
                                 * "fromHash": "6df3858eeb9a53a911cd17e66a9174d44ffb02cd",
                                 * "path": "path/to/file",
                                 * "srcPath": "path/to/file",
                                 * "toHash": "04c7c5c931b9418ca7b66f51fe934d0bd9b2ba4b"
                                 * }
                                 * }
                                 * ```
                                 *
                                 * Note: general file comments are an experimental feature and may change in the near future!
                                 *
                                 * For file and line comments, 'path' refers to the path of the file to which the comment should be applied and 'srcPath' refers to the path the that file used to have (only required for copies and moves). Also, fromHash and toHash refer to the sinceId / untilId (respectively) used to produce the diff on which the comment was added. fromHash will be resolved automatically as first parent if not specified. Note that this behaviour differs from `/pull-requests/comments`
                                 *
                                 * Finally diffType refers to the type of diff the comment was added on.
                                 *
                                 * For line comments, 'line' refers to the line in the diff that the comment should apply to. 'lineType' refers to the type of diff hunk, which can be:- 'ADDED' - for an added line;</li>- 'REMOVED' - for a removed line; or</li>- 'CONTEXT' - for a line that was unmodified but is in the vicinity of the diff.</li>'fileType' refers to the file of the diff to which the anchor should be attached - which is of relevance when displaying the diff in a side-by-side way. Currently the supported values are:- 'FROM' - the source file of the diff</li>- 'TO' - the destination file of the diff</li>If the current user is not a participant the user is added as one and updated to watch the commit.
                                 *
                                 * The authenticated user must have REPO_READ permission for the repository that the commit is in to call this resource.
                                 * @param projectKey The project key
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @param since For a merge commit, a parent can be provided to specify which diff the comments should be on. For a commit range, a sinceId can be provided to specify where the comments should be anchored from.
                                 * @param requestBody the comment
                                 * @returns RestComment The newly created comment.
                                 * @throws ApiError
                                 */
                                public static createComment(
                                    projectKey: string,
                                    commitId: string,
                                    repositorySlug: string,
                                    since?: string,
                                    requestBody?: RestComment,
                                ): CancelablePromise<RestComment> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments',
                                        path: {
                                            'projectKey': projectKey,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'since': since,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The comment was not created due to a validation error.`,
                                            401: `The currently authenticated user has insufficient permissions to view the commit, create a comment or watch the commit.`,
                                            404: `Unable to find the supplied project, repository, commit or parent comment. The missing entity will be specified in the error details.`,
                                            409: `Adding, deleting, or editing comments isn't supported on archived repositories.`,
                                        },
                                    });
                                }
                                /**
                                 * Delete a commit comment
                                 * Delete a commit comment. Anyone can delete their own comment. Only users with <strong>REPO_ADMIN</strong> and above may delete comments created by other users. Comments which have replies <i>may not be deleted</i>, regardless of the user's granted permissions.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that the commit is in to call this resource.
                                 * @param projectKey The project key
                                 * @param commentId the comment
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @param version The expected version of the comment. This must match the server's version of the comment or the delete will fail. To determine the current version of the comment, the comment should be fetched from the server prior to the delete. Look for the 'version' attribute in the returned JSON structure.
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static deleteComment(
                                    projectKey: string,
                                    commentId: string,
                                    commitId: string,
                                    repositorySlug: string,
                                    version?: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments/{commentId}',
                                        path: {
                                            'projectKey': projectKey,
                                            'commentId': commentId,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'version': version,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to delete the comment.`,
                                            404: `Unable to find the supplied project, repository or commit. The missing entity will be specified in the error details.`,
                                            409: `The comment has replies, the version supplied does not match the comment's current version or the repository is archived.`,
                                        },
                                    });
                                }
                                /**
                                 * Get a commit comment
                                 * Retrieves a commit discussion comment.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that the commit is in to call this resource.
                                 * @param projectKey The project key
                                 * @param commentId The ID of the comment to retrieve
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @returns RestComment The requested comment.
                                 * @throws ApiError
                                 */
                                public static getComment(
                                    projectKey: string,
                                    commentId: string,
                                    commitId: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestComment> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments/{commentId}',
                                        path: {
                                            'projectKey': projectKey,
                                            'commentId': commentId,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the comment`,
                                            404: `Unable to find the supplied project, repository, commit or comment. The missing entity will be specified in the error details.`,
                                        },
                                    });
                                }
                                /**
                                 * Update a commit comment
                                 * Update a comment, with the following restrictions:
                                 *
                                 * - only the author of the comment may update the <i>text</i> of the comment
                                 * - only the author of the comment or repository admins and above may update the other   fields of a comment
                                 *
                                 *
                                 * <strong>Note:</strong> the supplied supplied JSON object must contain a <code>version</code> that must match the server's version of the comment or the update will fail. To determine the current version of the comment, the comment should be fetched from the server prior to the update. Look for the 'version' attribute in the returned JSON structure.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that the commit is in to call this resource.
                                 * @param projectKey The project key
                                 * @param commentId The ID of the comment to retrieve
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @param requestBody The comment to update
                                 * @returns RestComment The newly updated comment.
                                 * @throws ApiError
                                 */
                                public static updateComment(
                                    projectKey: string,
                                    commentId: string,
                                    commitId: string,
                                    repositorySlug: string,
                                    requestBody?: RestComment,
                                ): CancelablePromise<RestComment> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/comments/{commentId}',
                                        path: {
                                            'projectKey': projectKey,
                                            'commentId': commentId,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The comment was not updated due to a validation error.`,
                                            401: `The currently authenticated user has insufficient permissions to view the commit, update the comment or watch the commit.`,
                                            404: `Unable to find the supplied project, repository, commit or comment. The missing entity will be specified in the error details.`,
                                            409: `The comment version supplied does not match the current version or the repository is archived.`,
                                        },
                                    });
                                }
                                /**
                                 * Get diff stats summary between revisions
                                 * Retrieve the diff stats summary for a commit.
                                 *
                                 * The stats summary include the total number of modified files, added lines, and deleted lines.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param path The path to the file which should be diffed (optional)
                                 * @param projectKey The project key
                                 * @param commitId The commit ID to diff to.
                                 * @param repositorySlug The repository slug
                                 * @param srcPath The source path for the file, if it was copied, moved or renamed
                                 * @param autoSrcPath <code>true</code> to automatically try to find the source path when it's not provided, <code>false</code> otherwise. Requires the path to be provided.
                                 * @param whitespace Optional whitespace flag which can be set to ignore-all
                                 * @param since The base revision to diff from. If omitted the parent revision of the commit ID is used
                                 * @returns RestDiffStatsSummary The diff stats summary for a commit.
                                 * @throws ApiError
                                 */
                                public static getDiffStatsSummary(
                                    path: string,
                                    projectKey: string,
                                    commitId: string,
                                    repositorySlug: string,
                                    srcPath?: string,
                                    autoSrcPath?: string,
                                    whitespace?: string,
                                    since?: string,
                                ): CancelablePromise<RestDiffStatsSummary> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/diff-stats-summary/{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'srcPath': srcPath,
                                            'autoSrcPath': autoSrcPath,
                                            'whitespace': whitespace,
                                            'since': since,
                                        },
                                        errors: {
                                            400: `The until parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get diff between revisions
                                 * Retrieve the diff between two provided revisions.
                                 *
                                 * To stream a raw text representation of the diff, this endpoint can be called with the request header 'Accept: text/plain'.
                                 *
                                 * Note:</strong> This resource is currently <i>not paged</i>. The server will internally apply a hard cap to the streamed lines, and it is not possible to request subsequent pages if that cap is exceeded. In the event that the cap is reached, the diff will be cut short and one or more {@code truncated} flags will be set to true on the "segments", "hunks" and "diffs" properties, as well as the top-level object, in the returned JSON response.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @param path The path to the file which should be diffed (optional)
                                 * @param projectKey The project key
                                 * @param srcPath The source path for the file, if it was copied, moved or renamed
                                 * @param avatarSize If present the service adds avatar URLs for comment authors where the provided value specifies the desired avatar size in pixels. Not applicable if streaming raw diff
                                 * @param filter Text used to filter files and lines (optional). Not applicable if streaming raw diff
                                 * @param avatarScheme The security scheme for avatar URLs. If the scheme is not present then it is inherited from the request. It can be set to "https" to force the use of secure URLs. Not applicable if streaming raw diff
                                 * @param contextLines The number of context lines to include around added/removed lines in the diff.Not applicable if streaming raw diff
                                 * @param autoSrcPath <code>true</code> to automatically try to find the source path when it's not provided, <code>false</code> otherwise. Requires the path to be provided.
                                 * @param whitespace Optional whitespace flag which can be set to ignore-all
                                 * @param withComments <code>true</code> to embed comments in the diff (the default); otherwise <code>false</code> to stream the diff without comments. Not applicable if streaming raw diff
                                 * @param since The base revision to diff from. If omitted the parent revision of the until revision is used
                                 * @returns RestDiff A diff between two revisions.
                                 * @throws ApiError
                                 */
                                public static streamDiff(
                                    commitId: string,
                                    repositorySlug: string,
                                    path: string,
                                    projectKey: string,
                                    srcPath?: string,
                                    avatarSize?: string,
                                    filter?: string,
                                    avatarScheme?: string,
                                    contextLines?: string,
                                    autoSrcPath?: string,
                                    whitespace?: string,
                                    withComments?: string,
                                    since?: string,
                                ): CancelablePromise<RestDiff> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/diff/{path}',
                                        path: {
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                            'path': path,
                                            'projectKey': projectKey,
                                        },
                                        query: {
                                            'srcPath': srcPath,
                                            'avatarSize': avatarSize,
                                            'filter': filter,
                                            'avatarScheme': avatarScheme,
                                            'contextLines': contextLines,
                                            'autoSrcPath': autoSrcPath,
                                            'whitespace': whitespace,
                                            'withComments': withComments,
                                            'since': since,
                                        },
                                        errors: {
                                            400: `The until parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get the common ancestor between two commits
                                 * Returns the best common ancestor between two commits.
                                 *
                                 * If more than one best common ancestor exists, only one will be returned. It is unspecified which will be returned.
                                 * @param projectKey The project key
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @param otherCommitId The other commit id to calculate the merge-base on
                                 * @returns RestCommit The common ancestor of the two given commits
                                 * @throws ApiError
                                 */
                                public static getMergeBase(
                                    projectKey: string,
                                    commitId: string,
                                    repositorySlug: string,
                                    otherCommitId?: string,
                                ): CancelablePromise<RestCommit> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/merge-base',
                                        path: {
                                            'projectKey': projectKey,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'otherCommitId': otherCommitId,
                                        },
                                        errors: {
                                            400: `The supplied commit ID(s) was/were invalid`,
                                            404: `The project, repository, or commit(s) does not exist`,
                                        },
                                    });
                                }
                                /**
                                 * Stop watching commit
                                 * Remove the authenticated user as a watcher for the specified commit.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository containing the commit to call this resource.
                                 * @param projectKey The project key
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static unwatch(
                                    projectKey: string,
                                    commitId: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/watch',
                                        path: {
                                            'projectKey': projectKey,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                                            404: `The specified project, repository or commit does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Watch commit
                                 * Add the authenticated user as a watcher for the specified commit.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository containing the commit to call this resource.
                                 * @param projectKey The project key
                                 * @param commitId The <i>full ID</i> of the commit within the repository
                                 * @param repositorySlug The repository slug
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static watch(
                                    projectKey: string,
                                    commitId: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/watch',
                                        path: {
                                            'projectKey': projectKey,
                                            'commitId': commitId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the pull request`,
                                            404: `The specified project, repository or commit does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Compare commits
                                 * Gets the file changes available in the <code> from</code> commit but not in the <code> to</code> commit.
                                 *
                                 *
                                 * If either the <code> from</code> or <code> to</code> commit are not specified, they will be replaced by the default branch of their containing repository.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param fromRepo an optional parameter specifying the source repository containing the source commit if that commit is not present in the current repository; the repository can be specified by either its ID <em>fromRepo=42</em> or by its project key plus its repo slug separated by a slash: <em>fromRepo=projectKey/repoSlug</em>
                                 * @param from the source commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param to the target commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of changes.
                                 * @throws ApiError
                                 */
                                public static streamChanges(
                                    projectKey: string,
                                    repositorySlug: string,
                                    fromRepo?: string,
                                    from?: string,
                                    to?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestChange>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/changes',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'fromRepo': fromRepo,
                                            'from': from,
                                            'to': to,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            404: `The source repository,target repository, or commit does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get accessible commits
                                 * Gets the commits accessible from the <code>from</code> commit but not in the <code>to</code> commit.
                                 *
                                 * If either the <code>from</code> or <code>to</code> commit are not specified, they will be replaced by the default branch of their containing repository.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param fromRepo an optional parameter specifying the source repository containing the source commit if that commit is not present in the current repository; the repository can be specified by either its ID <em>fromRepo=42</em> or by its project key plus its repo slug separated by a slash: <em>fromRepo=projectKey/repoSlug</em>
                                 * @param from the source commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param to the target commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of commits.
                                 * @throws ApiError
                                 */
                                public static streamCommits(
                                    projectKey: string,
                                    repositorySlug: string,
                                    fromRepo?: string,
                                    from?: string,
                                    to?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestCommit>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/commits',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'fromRepo': fromRepo,
                                            'from': from,
                                            'to': to,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            404: `The source repository,target repository, or commit does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Retrieve the diff stats summary between commits
                                 * Retrieve the diff stats summary of the changes available in the <code>from</code> commit but not in the <code> to</code> commit.
                                 *
                                 * If either the <code> from</code> or <code> to</code> commit are not specified, they will be replaced by the default branch of their containing repository.
                                 * @param path the path to the file to diff (optional)
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param fromRepo an optional parameter specifying the source repository containing the source commit if that commit is not present in the current repository; the repository can be specified by either its ID <em>fromRepo=42</em> or by its project key plus its repo slug separated by a slash: <em>fromRepo=projectKey/repoSlug</em>
                                 * @param srcPath source path
                                 * @param from the source commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param to the target commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param whitespace an optional whitespace flag which can be set to <code>ignore-all</code>
                                 * @returns RestDiff The diff stats summary for the changes.
                                 * @throws ApiError
                                 */
                                public static getDiffStatsSummary1(
                                    path: string,
                                    projectKey: string,
                                    repositorySlug: string,
                                    fromRepo?: string,
                                    srcPath?: string,
                                    from?: string,
                                    to?: string,
                                    whitespace?: string,
                                ): CancelablePromise<RestDiff> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/diff-stats-summary{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'fromRepo': fromRepo,
                                            'srcPath': srcPath,
                                            'from': from,
                                            'to': to,
                                            'whitespace': whitespace,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The source repository,target repository, or commit does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get diff between commits
                                 * Gets a diff of the changes available in the <code>from</code> commit but not in the <code> to</code> commit.
                                 *
                                 * If either the <code> from</code> or <code> to</code> commit are not specified, they will be replaced by the default branch of their containing repository.
                                 * @param path the path to the file to diff (optional)
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param contextLines an optional number of context lines to include around each added or removed lines in the diff
                                 * @param fromRepo an optional parameter specifying the source repository containing the source commit if that commit is not present in the current repository; the repository can be specified by either its ID <em>fromRepo=42</em> or by its project key plus its repo slug separated by a slash: <em>fromRepo=projectKey/repoSlug</em>
                                 * @param srcPath source path
                                 * @param from the source commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param to the target commit (can be a partial/full commit ID or qualified/unqualified ref name)
                                 * @param whitespace an optional whitespace flag which can be set to <code>ignore-all</code>
                                 * @returns RestDiff The diff of the changes.
                                 * @throws ApiError
                                 */
                                public static streamDiff1(
                                    path: string,
                                    projectKey: string,
                                    repositorySlug: string,
                                    contextLines?: string,
                                    fromRepo?: string,
                                    srcPath?: string,
                                    from?: string,
                                    to?: string,
                                    whitespace?: string,
                                ): CancelablePromise<RestDiff> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/compare/diff{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'contextLines': contextLines,
                                            'fromRepo': fromRepo,
                                            'srcPath': srcPath,
                                            'from': from,
                                            'to': to,
                                            'whitespace': whitespace,
                                        },
                                        errors: {
                                            404: `The source repository,target repository, or commit does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get raw diff for path
                                 * Stream the raw diff between two provided revisions.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param contextLines The number of context lines to include around added/removed lines in the diff
                                 * @param srcPath The source path for the file, if it was copied, moved or renamed
                                 * @param until The target revision to diff to (required)
                                 * @param whitespace Optional whitespace flag which can be set to <code>ignore-all</code>
                                 * @param since The base revision to diff from. If omitted the parent revision of the until revision is used
                                 * @returns any A raw diff between two revisions.
                                 * @throws ApiError
                                 */
                                public static streamRawDiff(
                                    projectKey: string,
                                    repositorySlug: string,
                                    contextLines?: string,
                                    srcPath?: string,
                                    until?: string,
                                    whitespace?: string,
                                    since?: string,
                                ): CancelablePromise<any> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/diff',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'contextLines': contextLines,
                                            'srcPath': srcPath,
                                            'until': until,
                                            'whitespace': whitespace,
                                            'since': since,
                                        },
                                        errors: {
                                            400: `The path parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get raw diff for path
                                 * Stream the raw diff between two provided revisions.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param path The path to the file which should be diffed (required)
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param contextLines The number of context lines to include around added/removed lines in the diff
                                 * @param srcPath The source path for the file, if it was copied, moved or renamed
                                 * @param until The target revision to diff to (required)
                                 * @param whitespace Optional whitespace flag which can be set to <code>ignore-all</code>
                                 * @param since The base revision to diff from. If omitted the parent revision of the until revision is used
                                 * @returns any A raw diff between two revisions.
                                 * @throws ApiError
                                 */
                                public static streamRawDiff1(
                                    path: string,
                                    projectKey: string,
                                    repositorySlug: string,
                                    contextLines?: string,
                                    srcPath?: string,
                                    until?: string,
                                    whitespace?: string,
                                    since?: string,
                                ): CancelablePromise<any> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/diff/{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'contextLines': contextLines,
                                            'srcPath': srcPath,
                                            'until': until,
                                            'whitespace': whitespace,
                                            'since': since,
                                        },
                                        errors: {
                                            400: `The until parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get files in directory
                                 * Retrieve a page of files from particular directory of a repository. The search is done recursively, so all files from any sub-directory of the specified directory will be returned.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param at The commit ID or ref (e.g. a branch or tag) to list the files at. If not specified the default branch will be used instead.
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of files.
                                 * @throws ApiError
                                 */
                                public static streamFiles(
                                    projectKey: string,
                                    repositorySlug: string,
                                    at?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<FileListResource>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/files',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'at': at,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            400: `The path parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The path requested does not exist at the supplied commit.`,
                                        },
                                    });
                                }
                                /**
                                 * Get files in directory
                                 * Retrieve a page of files from particular directory of a repository. The search is done recursively, so all files from any sub-directory of the specified directory will be returned.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param path The directory to list files for.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param at The commit ID or ref (e.g. a branch or tag) to list the files at. If not specified the default branch will be used instead.
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of files.
                                 * @throws ApiError
                                 */
                                public static streamFiles1(
                                    path: string,
                                    projectKey: string,
                                    repositorySlug: string,
                                    at?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<FileListResource>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/files/{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'at': at,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            400: `The path requested is not a directory at the supplied commit.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The path requested does not exist at the supplied commit.`,
                                        },
                                    });
                                }
                                /**
                                 * Get hook scripts
                                 * Return a page of hook scripts configured for the specified repository.
                                 *
                                 * This endpoint requires **REPO_ADMIN** permission.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of hook scripts.
                                 * @throws ApiError
                                 */
                                public static getConfigurations1(
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
                                    values?: Array<RestHookScriptConfig>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/hook-scripts',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the specified repository.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Remove a hook script
                                 * Removes the hook script from the set of hook scripts configured to run in the repository.
                                 *
                                 * This endpoint requires **REPO_ADMIN** permission.
                                 * @param projectKey The project key.
                                 * @param scriptId The ID of the hook script
                                 * @param repositorySlug The repository slug.
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static removeConfiguration1(
                                    projectKey: string,
                                    scriptId: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/hook-scripts/{scriptId}',
                                        path: {
                                            'projectKey': projectKey,
                                            'scriptId': scriptId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the specified repository.`,
                                            404: `The repository slug or hook script ID supplied does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Create/update a hook script
                                 * Creates/updates the hook script configuration for the provided hook script and repository.
                                 *
                                 * This endpoint requires **REPO_ADMIN** permission.
                                 * @param projectKey The project key.
                                 * @param scriptId The ID of the hook script
                                 * @param repositorySlug The repository slug.
                                 * @param requestBody The hook triggers for which the hook script should be run
                                 * @returns RestHookScriptConfig The updated hook script.
                                 * @throws ApiError
                                 */
                                public static setConfiguration1(
                                    projectKey: string,
                                    scriptId: string,
                                    repositorySlug: string,
                                    requestBody?: RestHookScriptTriggers,
                                ): CancelablePromise<RestHookScriptConfig> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/hook-scripts/{scriptId}',
                                        path: {
                                            'projectKey': projectKey,
                                            'scriptId': scriptId,
                                            'repositorySlug': repositorySlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The hook script was not created/updated due to a validation error.`,
                                            401: `The currently authenticated user has insufficient permissions to view the specified repository.`,
                                            404: `The repository slug supplied does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get repository labels
                                 * Get all labels applied to the given repository.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @returns RestLabel The applied label.
                                 * @throws ApiError
                                 */
                                public static getAllLabelsForRepository(
                                    projectKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestLabel> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/labels',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the labels.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Add repository label
                                 * Applies a label to the repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param requestBody The label to apply
                                 * @returns RestLabel The applied label.
                                 * @throws ApiError
                                 */
                                public static addLabel(
                                    projectKey: string,
                                    repositorySlug: string,
                                    requestBody?: RestLabel,
                                ): CancelablePromise<RestLabel> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/labels',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `A validation error prevented the label from being created or applied. Possible validation errors include: The name of the label contains uppercase characters, the name is smaller than 3 characters or longer than 50 characters, the label contains other characters than a-z 0-9 and - or the label is already applied to the given repository.`,
                                            401: `The currently authenticated user has insufficient permissions to apply a label.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Remove repository label
                                 * Remove label that is applied to the given repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository.
                                 * @param projectKey The project key.
                                 * @param labelName The label to remove
                                 * @param repositorySlug The repository slug.
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static removeLabel(
                                    projectKey: string,
                                    labelName: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/labels/{labelName}',
                                        path: {
                                            'projectKey': projectKey,
                                            'labelName': labelName,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to remove the label.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Stream files
                                 * Streams files from the repository's root with the last commit to modify each file. Commit modifications are traversed starting from the <code>at</code> commit or, if not specified, from the tip of the default branch.
                                 *
                                 * Unless the repository is public, the authenticated user must have <b>REPO_READ</b> access to call this resource.
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @param at The commit to use as the starting point when listing files and calculating modifications
                                 * @returns ExampleFiles A map of files to the last commit that modified them, and the latest commit to the repository (by nature, any commit to a repository modifies its root).
                                 * @throws ApiError
                                 */
                                public static stream(
                                    projectKey: string,
                                    repositorySlug: string,
                                    at?: string,
                                ): CancelablePromise<ExampleFiles> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/last-modified',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'at': at,
                                        },
                                        errors: {
                                            400: `No <code>at</code> commit was specified. When streaming modifications, an explicit starting commit must be supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist or does not contain the <code>at</code> commit.`,
                                        },
                                    });
                                }
                                /**
                                 * Stream files with last modified commit in path
                                 * Streams files in the requested <code>path</code> with the last commit to modify each file. Commit modifications are traversed starting from the <code>at</code> commit or, if not specified, from the tip of the default branch.
                                 *
                                 * Unless the repository is public, the authenticated user must have <b>REPO_READ</b> access to call this resource.
                                 * @param path The path within the repository whose files should be streamed
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @param at The commit to use as the starting point when listing files and calculating modifications
                                 * @returns ExampleFiles A map of files to the last commit that modified them, and the latest commit to update the requested path.
                                 * @throws ApiError
                                 */
                                public static stream1(
                                    path: string,
                                    projectKey: string,
                                    repositorySlug: string,
                                    at?: string,
                                ): CancelablePromise<ExampleFiles> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/last-modified/{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'at': at,
                                        },
                                        errors: {
                                            400: `No <code>at</code> commit was specified. When streaming modifications, an explicit starting commit must be supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist or does not contain the <code>at</code> commit, or the <code>at</code> commit does not contain the requested path.`,
                                        },
                                    });
                                }
                                /**
                                 * Get patch content at revision
                                 * Retrieve the patch content for a repository at a specified revision.
                                 *
                                 * Cache headers are added to the response (only if full commit hashes are used, not in the case of short hashes).
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param until The target revision from which to generate the patch (required)
                                 * @param allAncestors indicates whether or not to generate a patch which includes all the ancestors of the 'until' revision. If true, the value provided by 'since' is ignored.
                                 * @param since The base revision from which to generate the patch. This is only applicable when 'allAncestors' is false. If omitted the patch will represent one single commit, the 'until'.
                                 * @returns any The patch contents from a repository.
                                 * @throws ApiError
                                 */
                                public static streamPatch(
                                    projectKey: string,
                                    repositorySlug: string,
                                    until?: string,
                                    allAncestors?: string,
                                    since?: string,
                                ): CancelablePromise<any> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/patch',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'until': until,
                                            'allAncestors': allAncestors,
                                            'since': since,
                                        },
                                        errors: {
                                            400: `The until parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get raw content of a file at revision
                                 * Retrieve the raw content for a file path at a specified revision.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.
                                 * @param path The file path to retrieve content from
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param at A specific commit or ref to retrieve the raw content at, or the default branch if not specified
                                 * @param markup If present or "true", triggers the raw content to be markup-rendered and returned as HTML; otherwise, if not specified, or any value other than "true", the content is streamed without markup
                                 * @param htmlEscape (Optional) true if HTML should be escaped in the input markup, false otherwise. If not specified, the value of the markup.render.html.escape property, which is true by default, will be used
                                 * @param includeHeadingId (Optional) true if headings should contain an ID based on the heading content. If not specified, the value of the markup.render.headerids property, which is false by default, will be used
                                 * @param hardwrap (Optional) Whether the markup implementation should convert newlines to breaks. If not specified, the value of the markup.render.hardwrap property, which is true by default, will be used
                                 * @returns any The raw contents from a file.
                                 * @throws ApiError
                                 */
                                public static streamRaw(
                                    path: string,
                                    projectKey: string,
                                    repositorySlug: string,
                                    at?: string,
                                    markup?: string,
                                    htmlEscape?: string,
                                    includeHeadingId?: string,
                                    hardwrap?: string,
                                ): CancelablePromise<any> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/raw/{path}',
                                        path: {
                                            'path': path,
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'at': at,
                                            'markup': markup,
                                            'htmlEscape': htmlEscape,
                                            'includeHeadingId': includeHeadingId,
                                            'hardwrap': hardwrap,
                                        },
                                        errors: {
                                            400: `The path parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                            404: `The repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get ref change activity
                                 * Retrieve a page of repository ref change activity.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission to call this resource.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param ref (optional) exact match for a ref ID to filter ref change activity for
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of ref change activity.
                                 * @throws ApiError
                                 */
                                public static getRefChangeActivity(
                                    projectKey: string,
                                    repositorySlug: string,
                                    ref?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestRepositoryRefChangeActivity>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/ref-change-activities',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'ref': ref,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            401: `The user is currently not authenticated or the user does not have REPO_ADMIN permission.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get branches with ref change activities for repository
                                 * Retrieve a page of branches with ref change activities for a specific repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission to call this resource.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param filterText (optional) Partial match for a ref ID to filter minimal refs for
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of branches with ref change activities.
                                 * @throws ApiError
                                 */
                                public static findBranches(
                                    projectKey: string,
                                    repositorySlug: string,
                                    filterText?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestMinimalRef>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/ref-change-activities/branches',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'filterText': filterText,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            401: `The user is currently not authenticated or the user does not have REPO_ADMIN permission.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Delete auto decline settings
                                 * Delete auto decline settings for the supplied repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for this repository to call the resource.
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static deleteAutoDeclineSettings1(
                                    projectKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to delete the auto decline settings.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get auto decline settings
                                 * Retrieves the auto decline settings for the supplied repository. Project settings will be returned if no explicit settings have been set for the repository. In the case that there are no project settings, the default settings will be returned.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for this repository to call the resource.
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @returns RestAutoDeclineSettings The auto decline settings
                                 * @throws ApiError
                                 */
                                public static getAutoDeclineSettings1(
                                    projectKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestAutoDeclineSettings> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to retrieve the auto decline settings.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Create auto decline settings
                                 * Creates or updates the auto decline settings for the supplied repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for this repository to call the resource
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @param requestBody The settings to create or update
                                 * @returns RestAutoDeclineSettings The auto decline settings
                                 * @throws ApiError
                                 */
                                public static setAutoDeclineSettings1(
                                    projectKey: string,
                                    repositorySlug: string,
                                    requestBody?: RestAutoDeclineSettingsRequest,
                                ): CancelablePromise<RestAutoDeclineSettings> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-decline',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `inactivityWeeks was not one of 1, 2, 4, 8, or, 12, or the enabled parameter was not included in the request.`,
                                            401: `The currently authenticated user has insufficient permissions to create or update the auto decline settings.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Delete pull request auto-merge settings
                                 * Deletes pull request auto-merge settings for the supplied repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for this repository to call the resource.
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static delete5(
                                    projectKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to delete the pull request auto-merge settings.`,
                                            403: `The pull request auto-merge settings cannot be modified due to a restriction enforced by the supplied repository's project.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get pull request auto-merge settings
                                 * Retrieves the pull request auto-merge settings for the supplied repository. Project settings will be returned if no explicit settings have been set for the repository. In the case that there are no project settings, the default settings will be returned. If the repository's project has restricted its auto-merge settings, then the settings of the project will be returned.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for this repository to call the resource.
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @returns RestAutoMergeRestrictedSettings The pull request auto-merge settings
                                 * @throws ApiError
                                 */
                                public static get5(
                                    projectKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestAutoMergeRestrictedSettings> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to retrieve the pull request auto-merge settings.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Create or update the pull request auto-merge settings
                                 * Creates or updates the pull request auto-merge settings for the supplied repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for this repository to call the resource.
                                 * @param projectKey The project key
                                 * @param repositorySlug The repository slug
                                 * @param requestBody The settings to create or update
                                 * @returns RestAutoMergeRestrictedSettings The pull request auto-merge settings
                                 * @throws ApiError
                                 */
                                public static set1(
                                    projectKey: string,
                                    repositorySlug: string,
                                    requestBody?: RestAutoMergeSettingsRequest,
                                ): CancelablePromise<RestAutoMergeRestrictedSettings> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/auto-merge',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The 'enabled' field was not provided correctly.`,
                                            401: `The currently authenticated user has insufficient permissions to create or update the pull request auto-merge settings.`,
                                            403: `The pull request auto-merge settings cannot be modified due to a restriction enforced by the supplied repository's project.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get repository hooks
                                 * Retrieve a page of repository hooks for this repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @param type The optional type to filter by.
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of repository hooks with their associated enabled state.
                                 * @throws ApiError
                                 */
                                public static getRepositoryHooks1(
                                    projectKey: string,
                                    repositorySlug: string,
                                    type?: 'PRE_RECEIVE' | 'POST_RECEIVE',
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestRepositoryHook>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks',
                                        path: {
                                            'projectKey': projectKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        query: {
                                            'type': type,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to retrieve the hooks.`,
                                            404: `The specified repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Delete repository hook
                                 * Delete repository hook configuration for the supplied <strong>hookKey</strong> and <strong>repositorySlug</strong>
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param hookKey The hook key.
                                 * @param repositorySlug The repository slug.
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static deleteRepositoryHook(
                                    projectKey: string,
                                    hookKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}',
                                        path: {
                                            'projectKey': projectKey,
                                            'hookKey': hookKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            400: `The settings specified are invalid.`,
                                            401: `The currently authenticated user has insufficient permissions to delete the hook.`,
                                            404: `The specified repository or hook does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get repository hook
                                 * Retrieve a repository hook for this repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param hookKey The hook key.
                                 * @param repositorySlug The repository slug.
                                 * @returns RestRepositoryHook The repository hooks with their associated enabled state for the supplied hookKey.
                                 * @throws ApiError
                                 */
                                public static getRepositoryHook1(
                                    projectKey: string,
                                    hookKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestRepositoryHook> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}',
                                        path: {
                                            'projectKey': projectKey,
                                            'hookKey': hookKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to retrieve the hook.`,
                                            404: `The specified repository hook does not exist for the given repository, or the repository does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Disable repository hook
                                 * Disable a repository hook for this repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param hookKey The hook key.
                                 * @param repositorySlug The repository slug.
                                 * @returns RestRepositoryHook The repository hooks with their associated enabled state for the supplied hookKey.
                                 * @throws ApiError
                                 */
                                public static disableHook1(
                                    projectKey: string,
                                    hookKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestRepositoryHook> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled',
                                        path: {
                                            'projectKey': projectKey,
                                            'hookKey': hookKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to disable the hook.`,
                                            404: `The specified repository or hook does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Enable repository hook
                                 * Enable a repository hook for this repository and optionally apply new configuration.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 *
                                 * A JSON document may be provided to use as the settings for the hook. These structure and validity of the document is decided by the plugin providing the hook.
                                 * @param projectKey The project key.
                                 * @param hookKey The hook key.
                                 * @param repositorySlug The repository slug.
                                 * @param contentLength The content length.
                                 * @returns RestRepositoryHook The repository hooks with their associated enabled state for the supplied hookKey.
                                 * @throws ApiError
                                 */
                                public static enableHook1(
                                    projectKey: string,
                                    hookKey: string,
                                    repositorySlug: string,
                                    contentLength?: string,
                                ): CancelablePromise<RestRepositoryHook> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled',
                                        path: {
                                            'projectKey': projectKey,
                                            'hookKey': hookKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        headers: {
                                            'Content-Length': contentLength,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to enable the hook.`,
                                            404: `The specified repository or hook does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get repository hook settings
                                 * Retrieve the settings for a repository hook for this repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 * @param projectKey The project key.
                                 * @param hookKey The hook key.
                                 * @param repositorySlug The repository slug.
                                 * @returns ExampleSettings The settings for the hook.
                                 * @throws ApiError
                                 */
                                public static getSettings1(
                                    projectKey: string,
                                    hookKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<ExampleSettings> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings',
                                        path: {
                                            'projectKey': projectKey,
                                            'hookKey': hookKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to retrieve the hook settings.`,
                                            404: `The specified repository or hook does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Update repository hook settings
                                 * Modify the settings for a repository hook for this repository.
                                 *
                                 * The service will reject any settings which are too large, the current limit is 32KB once serialized.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                 *
                                 * A JSON document can be provided to use as the settings for the hook. These structure and validity of the document is decided by the plugin providing the hook.
                                 * @param projectKey The project key.
                                 * @param hookKey The hook key.
                                 * @param repositorySlug The repository slug.
                                 * @param requestBody The raw settings.
                                 * @returns ExampleSettings The settings for the hook.
                                 * @throws ApiError
                                 */
                                public static setSettings1(
                                    projectKey: string,
                                    hookKey: string,
                                    repositorySlug: string,
                                    requestBody?: ExampleSettings,
                                ): CancelablePromise<ExampleSettings> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/settings',
                                        path: {
                                            'projectKey': projectKey,
                                            'hookKey': hookKey,
                                            'repositorySlug': repositorySlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The settings specified are invalid.`,
                                            401: `The currently authenticated user has insufficient permissions to modify the hook settings.`,
                                            404: `The specified repository or hook does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get pull request settings
                                 * Retrieve the pull request settings for the context repository.
                                 *
                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the context repository to call this resource.
                                 *
                                 * This resource will call all RestFragments that are registered with the key <strong>bitbucket.repository.settings.pullRequests</strong>. If any fragment fails validations by returning a non-empty Map of errors, then no fragments will execute.
                                 *
                                 * The property keys for the settings that are bundled with the application are
                                 *
                                 * - mergeConfig - the merge strategy configuration for pull requests
                                 * - requiredApprovers - (Deprecated, please use com.atlassian.bitbucket.server.bundled-hooks.requiredApproversMergeHook instead) the number of approvals required on a pull request for it to be mergeable, or 0 if the merge check is disabled
                                 * - com.atlassian.bitbucket.server.bundled-hooks.requiredApproversMergeHook - the merge check configuration for required approvers
                                 * - requiredAllApprovers - whether or not all approvers must approve a pull request for it to be mergeable
                                 * - requiredAllTasksComplete - whether or not all tasks on a pull request need to be completed for it to be mergeable
                                 * - requiredSuccessfulBuilds - (Deprecated, please use com.atlassian.bitbucket.server.bitbucket-build.requiredBuildsMergeCheck instead) the number of successful builds on a pull request for it to be mergeable, or 0 if the merge check is disabled
                                 * - com.atlassian.bitbucket.server.bitbucket-build.requiredBuildsMergeCheck - the merge check configuration for required builds
                                 *
                                 *
                                 *
                                 * @param projectKey The project key.
                                 * @param repositorySlug The repository slug.
                                 * @returns RestRepositoryPullRequestSettings The repository pull request settings for the context repository.
                                 * @throws ApiError
                                 */
                                public static getPullRequestSettings1(
                                    projectKey: string,
                                    repositorySlug: string,
                                ): CancelablePromise<RestRepositoryPullRequestSettings> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests',
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
                                 * Update pull request settings
                                 * Update the pull request settings for the context repository.
                                 *
                                 * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the context repository to call this resource.
                                 *
                                 * This resource will call all RestFragments that are registered with the key <strong>bitbucket.repository.settings.pullRequests</strong>. If any fragment fails validations by returning a non-empty Map of errors, then no fragments will execute.
                                 *
                                 * Only the settings that should be updated need to be included in the request.
                                 *
                                 * The property keys for the settings that are bundled with the application are
                                 *
                                 * - mergeConfig - the merge strategy configuration for pull requests
                                 * - requiredApprovers - (Deprecated, please use com.atlassian.bitbucket.server.bundled-hooks.requiredApproversMergeHook instead) the number of approvals required on a pull request for it to be mergeable, or 0 to disable the merge check
                                 * - com.atlassian.bitbucket.server.bundled-hooks.requiredApproversMergeHook - a json map containing the keys 'enabled' (a boolean to enable or disable this merge check) and 'count' (an integer to set the number of required approvals)
                                 * - requiredAllApprovers - whether or not all approvers must approve a pull request for it to be mergeable
                                 * - requiredAllTasksComplete - whether or not all tasks on a pull request need to be completed for it to be mergeable
                                 * - requiredSuccessfulBuilds - (Deprecated, please use com.atlassian.bitbucket.server.bitbucket-build.requiredBuildsMergeCheck instead) the number of successful builds on a pull request for it to be mergeable, or 0 to disable the merge check
                                 * - com.atlassian.bitbucket.server.bitbucket-build.requiredBuildsMergeCheck - a json map containing the keys 'enabled' (a boolean to enable or disable this merge check) and 'count' (an integer to set the number of required builds)
                                 *
                                 *
                                 * <strong>Merge strategy configuration deletion:</strong>
                                 *
                                 * An explicitly set pull request merge strategy configuration can be deleted by POSTing a document with an empty "mergeConfig" attribute. i.e:
                                 *
                                 *
                                 * ```{
                                     * "mergeConfig": {
                                         * }
                                         * }
                                         * ```
                                         *
                                         * Upon completion of this request, the effective configuration will be:
                                         *
                                         * - The configuration set for this repository's SCM type as set at the project level, if present, otherwise
                                         * - the configuration set for this repository's SCM type as set at the instance level, if present, otherwise
                                         * - the default configuration for this repository's SCM type
                                         *
                                         *
                                         *
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param requestBody The updated settings.
                                         * @returns RestRepositoryPullRequestSettings The repository pull request settings for the context repository.
                                         * @throws ApiError
                                         */
                                        public static updatePullRequestSettings1(
                                            projectKey: string,
                                            repositorySlug: string,
                                            requestBody?: RestRepositoryPullRequestSettings,
                                        ): CancelablePromise<RestRepositoryPullRequestSettings> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    400: `The repository pull request settings were not updated due to a validation error.`,
                                                    401: `The currently authenticated user has insufficient permissions to see the specified repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Find tag
                                         * Retrieve the tags matching the supplied <strong>filterText</strong> param.
                                         *
                                         * The authenticated user must have <strong>REPO_READ</strong> permission for the context repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param orderBy Ordering of refs either ALPHABETICAL (by name) or MODIFICATION (last updated)
                                         * @param filterText The text to match on.
                                         * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                         * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                         * @returns any The tags matching the supplied <strong>filterText</strong>.
                                         * @throws ApiError
                                         */
                                        public static getTags(
                                            projectKey: string,
                                            repositorySlug: string,
                                            orderBy?: string,
                                            filterText?: string,
                                            start?: number,
                                            limit?: number,
                                        ): CancelablePromise<{
                                            isLastPage?: boolean;
                                            limit?: number;
                                            nextPageStart?: number;
                                            size?: number;
                                            start?: number;
                                            values?: Array<RestTag>;
                                        }> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/tags',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'orderBy': orderBy,
                                                    'filterText': filterText,
                                                    'start': start,
                                                    'limit': limit,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to read the repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Create tag
                                         * Creates a tag using the information provided in the RestCreateTagRequest request
                                         *
                                         * The authenticated user must have <strong>REPO_WRITE</strong> permission for the context repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param requestBody The request to create a tag containing a <strong>name</strong>, <strong>startPoint</strong>, and optionally a <strong>message</strong>
                                         * @returns RestTag The created tag.
                                         * @throws ApiError
                                         */
                                        public static createTagForRepository(
                                            projectKey: string,
                                            repositorySlug: string,
                                            requestBody?: RestCreateTagRequest,
                                        ): CancelablePromise<RestTag> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/tags',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to write to the repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Get tag
                                         * Retrieve a tag in the specified repository.
                                         *
                                         * The authenticated user must have <strong>REPO_READ</strong> permission for the context repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param name The name of the tag to be retrieved.
                                         * @param repositorySlug The repository slug.
                                         * @returns RestTag The tag which matches the supplied <strong>name</strong>.
                                         * @throws ApiError
                                         */
                                        public static getTag(
                                            projectKey: string,
                                            name: string,
                                            repositorySlug: string,
                                        ): CancelablePromise<RestTag> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/tags/{name}',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'name': name,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to read the repository.`,
                                                    404: `The specified tag does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Stop watching repository
                                         * Remove the authenticated user as a watcher for the specified repository.
                                         *
                                         * The authenticated user must have <strong>REPO_READ</strong> permission for the repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @returns void
                                         * @throws ApiError
                                         */
                                        public static unwatch2(
                                            projectKey: string,
                                            repositorySlug: string,
                                        ): CancelablePromise<void> {
                                            return __request(OpenAPI, {
                                                method: 'DELETE',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/watch',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Watch repository
                                         * Add the authenticated user as a watcher for the specified repository.
                                         *
                                         * The authenticated user must have <strong>REPO_READ</strong> permission for the repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param requestBody The repository to watch.
                                         * @returns void
                                         * @throws ApiError
                                         */
                                        public static watch2(
                                            projectKey: string,
                                            repositorySlug: string,
                                            requestBody?: RestRepository,
                                        ): CancelablePromise<void> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/watch',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to view the repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Find webhooks
                                         * Find webhooks in this repository.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param event List of <code>com.atlassian.webhooks.WebhookEvent</code> IDs to filter for
                                         * @param statistics <code>true</code> if statistics should be provided for all found webhooks
                                         * @returns any A page of webhooks.
                                         * @throws ApiError
                                         */
                                        public static findWebhooks1(
                                            projectKey: string,
                                            repositorySlug: string,
                                            event?: string,
                                            statistics?: boolean,
                                        ): CancelablePromise<any> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'event': event,
                                                    'statistics': statistics,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to find webhooks in the repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Create webhook
                                         * Create a webhook for the repository specified via the URL.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param requestBody The webhook to be created for this repository.
                                         * @returns RestWebhook A created webhook.
                                         * @throws ApiError
                                         */
                                        public static createWebhook1(
                                            projectKey: string,
                                            repositorySlug: string,
                                            requestBody?: RestWebhook,
                                        ): CancelablePromise<RestWebhook> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    400: `The webhook parameters were invalid or not supplied.`,
                                                    401: `The currently authenticated user has insufficient permissions to create webhooks in the repository.`,
                                                    404: `The repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Search webhooks
                                         * Search webhooks in this repository and parent project. This endpoint returns a superset of the results returned by the /webhooks endpoint because it allows filtering by project scope too, not just repository webhooks.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param scopeType Scopes to filter by. This parameter can be specified once e.g. "scopeType=repository", or twice e.g. "scopeType=repository&scopeType=project", to filter by more than one scope level.
                                         * @param event List of <code>com.atlassian.webhooks.WebhookEvent</code> ids to filter for
                                         * @param statistics <code>true</code> if statistics should be provided for all found webhooks
                                         * @returns any A page of webhooks.
                                         * @throws ApiError
                                         */
                                        public static searchWebhooks(
                                            projectKey: string,
                                            repositorySlug: string,
                                            scopeType?: string,
                                            event?: string,
                                            statistics?: boolean,
                                        ): CancelablePromise<any> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/search',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'scopeType': scopeType,
                                                    'event': event,
                                                    'statistics': statistics,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to find webhooks in the repository.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Test webhook
                                         * Test connectivity to a specific endpoint.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param repositorySlug The repository slug.
                                         * @param webhookId
                                         * @param sslVerificationRequired Whether SSL verification is required for the specified webhook URL. Default value is  <code>true</code>.
                                         * @param url The url in which to connect to
                                         * @param requestBody Basic authentication credentials, if required.
                                         * @returns RestWebhookRequestResponse A webhook.
                                         * @throws ApiError
                                         */
                                        public static testWebhook1(
                                            projectKey: string,
                                            repositorySlug: string,
                                            webhookId?: number,
                                            sslVerificationRequired?: string,
                                            url?: string,
                                            requestBody?: RestWebhookCredentials,
                                        ): CancelablePromise<RestWebhookRequestResponse> {
                                            return __request(OpenAPI, {
                                                method: 'POST',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/test',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'webhookId': webhookId,
                                                    'sslVerificationRequired': sslVerificationRequired,
                                                    'url': url,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to test a connection.`,
                                                    404: `The specified repository does not exist.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Delete webhook
                                         * Delete a webhook for the repository specified via the URL.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param webhookId The ID of the webhook to be deleted.
                                         * @param repositorySlug The repository slug.
                                         * @returns void
                                         * @throws ApiError
                                         */
                                        public static deleteWebhook1(
                                            projectKey: string,
                                            webhookId: string,
                                            repositorySlug: string,
                                        ): CancelablePromise<void> {
                                            return __request(OpenAPI, {
                                                method: 'DELETE',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId}',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'webhookId': webhookId,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to delete webhooks in the repository.`,
                                                    404: `The specified repository does not exist, or webhook does not exist in this repository.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Get webhook
                                         * Get a webhook by ID.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param webhookId ID of the webhook
                                         * @param repositorySlug The repository slug.
                                         * @param statistics <code>true</code> if statistics should be provided for the webhook
                                         * @returns RestWebhook A webhook.
                                         * @throws ApiError
                                         */
                                        public static getWebhook1(
                                            projectKey: string,
                                            webhookId: string,
                                            repositorySlug: string,
                                            statistics?: string,
                                        ): CancelablePromise<RestWebhook> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId}',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'webhookId': webhookId,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'statistics': statistics,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to get a webhook in the repository.`,
                                                    404: `The repository does not exist, or the webhook does not exist in the repository.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Update webhook
                                         * Update an existing webhook.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param webhookId Id of the existing webhook
                                         * @param repositorySlug The repository slug.
                                         * @param requestBody The representation of the updated values for the webhook
                                         * @returns RestWebhook A webhook.
                                         * @throws ApiError
                                         */
                                        public static updateWebhook1(
                                            projectKey: string,
                                            webhookId: string,
                                            repositorySlug: string,
                                            requestBody?: RestWebhook,
                                        ): CancelablePromise<RestWebhook> {
                                            return __request(OpenAPI, {
                                                method: 'PUT',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId}',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'webhookId': webhookId,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                body: requestBody,
                                                mediaType: 'application/json',
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to update a webhook in this repository.`,
                                                    404: `The repository does not exist, or the webhook does not exist in the repository.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Get last webhook invocation details
                                         * Get the latest invocations for a specific webhook.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param webhookId ID of the webhook
                                         * @param repositorySlug The repository slug.
                                         * @param event The string ID of a specific event to retrieve the last invocation for.
                                         * @param outcome The outcome to filter for. Can be SUCCESS, FAILURE, ERROR. None specified means that the all will be considered
                                         * @returns RestDetailedInvocation A webhook invocation dataset.
                                         * @throws ApiError
                                         */
                                        public static getLatestInvocation1(
                                            projectKey: string,
                                            webhookId: string,
                                            repositorySlug: string,
                                            event?: string,
                                            outcome?: string,
                                        ): CancelablePromise<RestDetailedInvocation> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId}/latest',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'webhookId': webhookId,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'event': event,
                                                    'outcome': outcome,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to get webhook invocations in the repository.`,
                                                    404: `The specified repository does not exist, or the webhook does not exist in the repository.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Get webhook statistics
                                         * Get the statistics for a specific webhook.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param webhookId ID of the webhook
                                         * @param repositorySlug The repository slug.
                                         * @param event The string ID of a specific event to retrieve the last invocation for. May be empty, in which case all events are considered
                                         * @returns RestInvocationHistory A webhook invocation dataset.
                                         * @throws ApiError
                                         */
                                        public static getStatistics1(
                                            projectKey: string,
                                            webhookId: string,
                                            repositorySlug: string,
                                            event?: string,
                                        ): CancelablePromise<RestInvocationHistory> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId}/statistics',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'webhookId': webhookId,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                query: {
                                                    'event': event,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to get webhook statistics in the repository.`,
                                                    404: `The specified repository does not exist, or the webhook does not exist in the repository.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Get webhook statistics summary
                                         * Get the statistics summary for a specific webhook.
                                         *
                                         * The authenticated user must have <strong>REPO_ADMIN</strong> permission for the specified repository to call this resource.
                                         * @param projectKey The project key.
                                         * @param webhookId ID of the webhook
                                         * @param repositorySlug The repository slug.
                                         * @returns RestInvocationHistory A webhook invocation dataset.
                                         * @throws ApiError
                                         */
                                        public static getStatisticsSummary1(
                                            projectKey: string,
                                            webhookId: string,
                                            repositorySlug: string,
                                        ): CancelablePromise<RestInvocationHistory> {
                                            return __request(OpenAPI, {
                                                method: 'GET',
                                                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/webhooks/{webhookId}/statistics/summary',
                                                path: {
                                                    'projectKey': projectKey,
                                                    'webhookId': webhookId,
                                                    'repositorySlug': repositorySlug,
                                                },
                                                errors: {
                                                    401: `The currently authenticated user has insufficient permissions to get webhook statistics summary in the repository.`,
                                                    404: `The repository does not exist, or the webhook does not exist in the repository.`,
                                                },
                                            });
                                        }
                                        /**
                                         * Search for repositories
                                         * Retrieve a page of repositories based on query parameters that control the search. See the documentation of the parameters for more details.
                                         *
                                         * This resource is anonymously accessible, if anonymous access is enabled.
                                         *
                                         * <b>Note on permissions.</b> In absence of the <code>permission</code> query parameter the implicit 'read' permission is assumed. Please note that this permission is lower than the <tt>REPO_READ</tt> permission rather than being equal to it. The implicit 'read' permission for a given repository is assigned to any user that has any of the higher permissions, such as <tt>REPO_READ</tt>, as well as to anonymous users if the repository is marked as public. The important implication of the above is that an anonymous request to this resource with a permission level <tt>REPO_READ</tt> is guaranteed to receive an empty list of repositories as a result. For anonymous requests it is therefore recommended to not specify the <tt>permission</tt> parameter at all.
                                         * @param archived (optional) if specified, this will limit the resulting repository list to ones whose are <tt>ACTIVE</tt>, <tt>ARCHIVED</tt> or <tt>ALL</tt> for both. The match performed is case-insensitive. This filter defaults to <tt>ACTIVE</tt> when not set. <em>Available since 8.0</em>
                                         * @param projectname (optional) if specified, this will limit the resulting repository list to ones whose project's name matches this parameter's value. The match performed is case-insensitive and any leading and/or trailing whitespace characters on the <code>projectname</code> parameter will be stripped.
                                         * @param projectkey (optional) if specified, this will limit the resulting repository list to ones whose project's key matches this parameter's value. The match performed is case-insensitive and any leading  and/or trailing whitespace characters on the <code>projectKey</code> parameter will be stripped. <em>Available since 8.0</em>
                                         * @param visibility (optional) if specified, this will limit the resulting repository list based on the repositories visibility. Valid values are <em>public</em> or <em>private</em>.
                                         * @param name (optional) if specified, this will limit the resulting repository list to ones whose name matches this parameter's value. The match performed is case-insensitive and any leading and/or trailing whitespace characters on the <code>name</code> parameter will be stripped.
                                         * @param permission (optional) if specified, it must be a valid repository permission level name and will limit the resulting repository list to ones that the requesting user has the specified permission level to. If not specified, the default implicit 'read' permission level will be assumed. The currently supported explicit permission values are <tt>REPO_READ</tt>, <tt>REPO_WRITE</tt> and <tt>REPO_ADMIN</tt>.
                                         * @param state (optional) if specified, it must be a valid repository state name and will limit the resulting repository list to ones that are in the specified state. The currently supported explicit state values are <tt>AVAILABLE</tt>, <tt>INITIALISING</tt> and <tt>INITIALISATION_FAILED</tt>. Filtering by <tt>OFFLINE</tt> repositories is not supported.<br><em>Available since 5.13</em>
                                         * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                         * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                         * @returns any A page of repositories.
                                         * @throws ApiError
                                         */
                                        public static getRepositories1(
                                            archived?: string,
                                            projectname?: string,
                                            projectkey?: string,
                                            visibility?: 'public' | 'private',
                                            name?: string,
                                            permission?: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN',
                                            state?: 'AVAILABLE' | 'INITIALISING' | 'INITIALISATION_FAILED',
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
                                                url: '/api/latest/repos',
                                                query: {
                                                    'archived': archived,
                                                    'projectname': projectname,
                                                    'projectkey': projectkey,
                                                    'visibility': visibility,
                                                    'name': name,
                                                    'permission': permission,
                                                    'state': state,
                                                    'start': start,
                                                    'limit': limit,
                                                },
                                                errors: {
                                                    400: `The <code>visibility</code> parameter contains an invalid value.`,
                                                },
                                            });
                                        }
                                    }

