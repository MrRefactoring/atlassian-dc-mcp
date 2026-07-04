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
                                    }

