/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestApplicationUser } from '../models/restApplicationUser.js';
import type { RestApplySuggestionRequest } from '../models/restApplySuggestionRequest.js';
import type { RestAutoMergeProcessingResult } from '../models/restAutoMergeProcessingResult.js';
import type { RestAutoMergeRequest } from '../models/restAutoMergeRequest.js';
import type { RestChange } from '../models/restChange.js';
import type { RestComment } from '../models/restComment.js';
import type { RestCommit } from '../models/restCommit.js';
import type { RestCommitMessageSuggestion } from '../models/restCommitMessageSuggestion.js';
import type { RestDefaultReviewersRequest } from '../models/restDefaultReviewersRequest.js';
import type { RestDiff } from '../models/restDiff.js';
import type { RestDiffStatsSummary } from '../models/restDiffStatsSummary.js';
import type { RestPullRequest } from '../models/restPullRequest.js';
import type { RestPullRequestActivity } from '../models/restPullRequestActivity.js';
import type { RestPullRequestAssignParticipantRoleRequest } from '../models/restPullRequestAssignParticipantRoleRequest.js';
import type { RestPullRequestAssignStatusRequest } from '../models/restPullRequestAssignStatusRequest.js';
import type { RestPullRequestCondition } from '../models/restPullRequestCondition.js';
import type { RestPullRequestDeclineRequest } from '../models/restPullRequestDeclineRequest.js';
import type { RestPullRequestDeleteRequest } from '../models/restPullRequestDeleteRequest.js';
import type { RestPullRequestFinishReviewRequest } from '../models/restPullRequestFinishReviewRequest.js';
import type { RestPullRequestMergeability } from '../models/restPullRequestMergeability.js';
import type { RestPullRequestMergeConfig } from '../models/restPullRequestMergeConfig.js';
import type { RestPullRequestMergeRequest } from '../models/restPullRequestMergeRequest.js';
import type { RestPullRequestParticipant } from '../models/restPullRequestParticipant.js';
import type { RestPullRequestRebaseability } from '../models/restPullRequestRebaseability.js';
import type { RestPullRequestRebaseRequest } from '../models/restPullRequestRebaseRequest.js';
import type { RestPullRequestRebaseResult } from '../models/restPullRequestRebaseResult.js';
import type { RestPullRequestReopenRequest } from '../models/restPullRequestReopenRequest.js';
import type { RestPullRequestSettings } from '../models/restPullRequestSettings.js';
import type { RestReviewerGroup } from '../models/restReviewerGroup.js';
import type { RestUserReaction } from '../models/restUserReaction.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class PullRequestsService {
    /**
     * Create default reviewer condition
     * Create a default reviewer pull request condition for the given repository.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The details needed to create a default reviewer pull request condition.
     * @returns RestPullRequestCondition The default reviewer pull request condition that was created.
     * @throws ApiError
     */
    public static createPullRequestCondition1(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestDefaultReviewersRequest,
    ): CancelablePromise<RestPullRequestCondition> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/condition',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
            },
        });
    }
    /**
     * Delete default reviewer condition
     * Delete the default reviewer pull request condition associated with the given ID.
     * @param projectKey The project key.
     * @param id
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deletePullRequestCondition1(
        projectKey: string,
        id: number,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                404: `An empty response indicating a pull request condition with the given ID could not be found.`,
            },
        });
    }
    /**
     * Update default reviewer condition
     * Update the default reviewer pull request condition for the given ID.
     * @param projectKey The project key.
     * @param id The ID of the pull request condition
     * @param repositorySlug The repository slug.
     * @param requestBody
     * @returns RestPullRequestCondition The updated default reviewer pull request condition.
     * @throws ApiError
     */
    public static updatePullRequestCondition1(
        projectKey: string,
        id: string,
        repositorySlug: string,
        requestBody?: {
            requiredApprovals?: number;
            reviewerGroups?: Array<RestReviewerGroup>;
            reviewers?: Array<RestApplicationUser>;
            sourceMatcher?: {
                displayId?: string;
                id?: string;
                type?: {
                    id?: 'ANY_REF' | 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
                    name?: string;
                };
            };
            targetMatcher?: {
                displayId?: string;
                id?: string;
                type?: {
                    id?: 'ANY_REF' | 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
                    name?: string;
                };
            };
        },
    ): CancelablePromise<RestPullRequestCondition> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
            },
        });
    }
    /**
     * Get default reviewer conditions
     * Return a page of default reviewer pull request conditions that have been configured for this repository.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @returns RestPullRequestCondition The default reviewer pull request conditions associated with the given repository.
     * @throws ApiError
     */
    public static getPullRequestConditions1(
        projectKey: string,
        repositorySlug: string,
    ): CancelablePromise<Array<RestPullRequestCondition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/conditions',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
        });
    }
    /**
     * Get required reviewers for PR creation
     * Return a set of users who are required reviewers for pull requests created from the given source repository and ref to the given target ref in this repository.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param targetRepoId The ID of the repository in which the target ref exists
     * @param sourceRepoId The ID of the repository in which the source ref exists
     * @param sourceRefId The ID of the source ref
     * @param targetRefId The ID of the target ref
     * @returns RestPullRequestCondition The default reviewer pull request conditions associated with the given repository.
     * @throws ApiError
     */
    public static getReviewers(
        projectKey: string,
        repositorySlug: string,
        targetRepoId?: string,
        sourceRepoId?: string,
        sourceRefId?: string,
        targetRefId?: string,
    ): CancelablePromise<Array<RestPullRequestCondition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/default-reviewers/latest/projects/{projectKey}/repos/{repositorySlug}/reviewers',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'targetRepoId': targetRepoId,
                'sourceRepoId': sourceRepoId,
                'sourceRefId': sourceRefId,
                'targetRefId': targetRefId,
            },
            errors: {
                400: `The request was malformed.`,
            },
        });
    }
        /**
         * Get pull requests for repository
         * Retrieve a page of pull requests to or from the specified repository.
         *
         * The authenticated user must have <strong>REPO_READ</strong> permission for the specified repository to call this resource.  Optionally clients can specify PR participant filters. Each filter has a mandatory username.N parameter, and the optional role.N and approved.N parameters.
         *
         * - username.N - the "root" of a single participant filter, where "N" is a natural number   starting from 1. This allows clients to specify multiple participant filters, by providing consecutive   filters as username.1, username.2 etc. Note that the filters numbering has to start   with 1 and be continuous for all filters to be processed. The total allowed number of participant   filters is 10 and all filters exceeding that limit will be dropped.
         * - role.N(optional) the role associated with username.N.   This must be one of AUTHOR, REVIEWER, or PARTICIPANT
         * - approved.N (optional) the approved status associated with username.N.   That is whether username.N has approved the PR. Either true, or false
         *
         * @param projectKey The project key.
         * @param repositorySlug The repository slug.
         * @param withAttributes (optional) defaults to true, whether to return additional pull request attributes
         * @param at (optional) a <i>fully-qualified</i> branch ID to find pull requests to or from, such as refs/heads/master
         * @param withProperties (optional) defaults to true, whether to return additional pull request properties
         * @param draft (optional) If specified, only pull requests matching the supplied draft status will be returned.
         * @param filterText (optional) If specified, only pull requests where the title or description contains the supplied string will be returned.
         * @param state (optional, defaults to <strong>OPEN</strong>). Supply <strong>ALL</strong> to return pull request in any state. If a state is supplied only pull requests in the specified state will be returned. Either <strong>OPEN</strong>, <strong>DECLINED</strong> or <strong>MERGED</strong>.
         * @param order (optional, defaults to <strong>NEWEST</strong>) the order to return pull requests in, either <strong>OLDEST</strong> (as in: "oldest first") or <strong>NEWEST</strong>.
         * @param direction (optional, defaults to <strong>INCOMING</strong>) the direction relative to the specified repository. Either <strong>INCOMING</strong> or <strong>OUTGOING</strong>.
         * @param start Start number for the page (inclusive). If not passed, first page is assumed.
         * @param limit Number of items to return. If not passed, a page size of 25 is used.
         * @returns any A page of pull requests that match the search criteria.
         * @throws ApiError
         */
        public static getPage(
            projectKey: string,
            repositorySlug: string,
            withAttributes?: string,
            at?: string,
            withProperties?: string,
            draft?: string,
            filterText?: string,
            state?: string,
            order?: string,
            direction?: string,
            start?: number,
            limit?: number,
        ): CancelablePromise<{
            isLastPage?: boolean;
            limit?: number;
            nextPageStart?: number;
            size?: number;
            start?: number;
            values?: Array<RestPullRequest>;
        }> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests',
                path: {
                    'projectKey': projectKey,
                    'repositorySlug': repositorySlug,
                },
                query: {
                    'withAttributes': withAttributes,
                    'at': at,
                    'withProperties': withProperties,
                    'draft': draft,
                    'filterText': filterText,
                    'state': state,
                    'order': order,
                    'direction': direction,
                    'start': start,
                    'limit': limit,
                },
                errors: {
                    400: `The request was malformed.`,
                    401: `The currently authenticated user has insufficient permissions to view the specified pull request.`,
                    404: `The specified repository or pull request does not exist.`,
                },
            });
        }
        /**
         * Create pull request
         * Create a new pull request from a source branch or tag to a target branch. The source and target may be in the same repository, or different ones. (Note that different repositories must belong to the same <code>Repository#getHierarchyId()</code> hierarchy.)
         *
         * The <code>fromRef</code> may be a branch or a tag. The <code>toRef</code> is required to be a branch. Tags are not allowed as targets because tags are intended to be immutable and should not be changed after they are created.
         *
         * The authenticated user must have <strong>REPO_READ</strong> permission for the <code>fromRef</code> and <code>toRef</code> repositories to call this resource.
         * @param projectKey The project key.
         * @param repositorySlug The repository slug.
         * @param requestBody The pull request data
         * @returns RestPullRequest The newly created pull request.
         * @throws ApiError
         */
        public static create(
            projectKey: string,
            repositorySlug: string,
            requestBody?: RestPullRequest,
        ): CancelablePromise<RestPullRequest> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests',
                path: {
                    'projectKey': projectKey,
                    'repositorySlug': repositorySlug,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `The pull request entity supplied in the request was malformed.`,
                    401: `The currently authenticated user has insufficient permissions to create a pull request between the two specified repositories.`,
                    404: `One of the specified repositories or branches does not exist.`,
                    409: `One of the following error cases occurred (check the error message for more details):
                    - There was a problem resolving one or more reviewers.
                    - The specified branches were the same.
                    - The <em>to</em> branch is already up-to-date with all the commits on the     <em>from</em> branch.
                    - A pull request between the two branches already exists.
                    - The <em>to</em> repository is archived.
                    `,
                },
            });
        }
        /**
         * Get pull request
         * Retrieve a pull request.
         *
         * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
         * @param projectKey The project key.
         * @param pullRequestId The ID of the pull request within the repository
         * @param repositorySlug The repository slug.
         * @returns RestPullRequest The specified pull request.
         * @throws ApiError
         */
        public static get3(
            projectKey: string,
            pullRequestId: string,
            repositorySlug: string,
        ): CancelablePromise<RestPullRequest> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}',
                path: {
                    'projectKey': projectKey,
                    'pullRequestId': pullRequestId,
                    'repositorySlug': repositorySlug,
                },
                errors: {
                    401: `The currently authenticated user has insufficient permissions to view the specified pull request.`,
                    404: `The specified repository or pull request does not exist.`,
                },
            });
        }
        /**
         * Update pull request metadata
         * Update the title, description, reviewers, destination branch or draft status of an existing pull request.
         *
         * **Note:** the <em>reviewers</em> list may be updated using this resource. However the <em>author</em> and <em>participants</em> list may not.
         *
         * The authenticated user must either:
         *
         * - be the author of the pull request and have the <strong>REPO_READ</strong> permission for the repository that this pull request targets; or
         * - have the <strong>REPO_WRITE</strong> permission for the repository that this pull request targets
         *
         *
         * to call this resource.
         * @param projectKey The project key.
         * @param pullRequestId The ID of the pull request within the repository
         * @param repositorySlug The repository slug.
         * @param requestBody The updated pull request
         * @returns RestPullRequest The updated pull request.
         * @throws ApiError
         */
        public static update(
            projectKey: string,
            pullRequestId: string,
            repositorySlug: string,
            requestBody?: RestPullRequest,
        ): CancelablePromise<RestPullRequest> {
            return __request(OpenAPI, {
                method: 'PUT',
                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}',
                path: {
                    'projectKey': projectKey,
                    'pullRequestId': pullRequestId,
                    'repositorySlug': repositorySlug,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `One of the following error cases occurred (check the error message for more details):
                    - The request tried to modify the <em>author</em> or <em>participants</em>.
                    - The pull request's version attribute was not specified.
                    - A reviewer's username was not specified.
                    - The toRef ID value was incorrectly left blank
                    `,
                    401: `The currently authenticated user has insufficient permissions to update the specified pull request.`,
                    404: `One of the specified repositories or branches does not exist.`,
                    409: `One of the following error cases occurred (check the error message for more details):
                    - The specified version is out of date.
                    - One of the reviewers could not be added to the pull request.
                    - If updating the destination branch:    - There is already an open pull request with an identical to branch
                    - The from and new to branch <i>are</i> the same
                    - The new destination branch up-to-date is up-to-date with all of                 changes from the from branch, resulting in a pull request with                 nothing to merge
                    - The <em>to</em> repository is archived.
                    `,
                },
            });
        }
        /**
         * Get pull request activity
         * Retrieve a page of activity associated with a pull request.
         *
         * Activity items include comments, approvals, rescopes (i.e. adding and removing of commits), merges and more.
         *
         * Different types of activity items may be introduced in newer versions of Stash or by user installed plugins, so clients should be flexible enough to handle unexpected entity shapes in the returned page.
         *
         * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
         * @param projectKey The project key.
         * @param pullRequestId The ID of the pull request within the repository
         * @param repositorySlug The repository slug.
         * @param fromType (required if <strong>fromId</strong> is present) the type of the activity item specified by <strong>fromId</strong> (either <strong>COMMENT</strong> or <strong>ACTIVITY</strong>)
         * @param fromId (optional) the ID of the activity item to use as the first item in the returned page
         * @param start Start number for the page (inclusive). If not passed, first page is assumed.
         * @param limit Number of items to return. If not passed, a page size of 25 is used.
         * @returns any A page of activity relating to the specified pull request.
         * @throws ApiError
         */
        public static getActivities(
            projectKey: string,
            pullRequestId: string,
            repositorySlug: string,
            fromType?: string,
            fromId?: string,
            start?: number,
            limit?: number,
        ): CancelablePromise<{
            isLastPage?: boolean;
            limit?: number;
            nextPageStart?: number;
            size?: number;
            start?: number;
            values?: Array<RestPullRequestActivity>;
        }> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/activities',
                path: {
                    'projectKey': projectKey,
                    'pullRequestId': pullRequestId,
                    'repositorySlug': repositorySlug,
                },
                query: {
                    'fromType': fromType,
                    'fromId': fromId,
                    'start': start,
                    'limit': limit,
                },
                errors: {
                    400: `The request was malformed.`,
                    401: `The currently authenticated user has insufficient permissions to view the specified pull request.`,
                    404: `The specified repository or pull request does not exist.`,
                },
            });
        }
                                                /**
                                                 * Gets pull request changes
                                                 * Gets changes for the specified PullRequest.
                                                 *
                                                 * If the changeScope query parameter is set to 'UNREVIEWED', the application will attempt to stream unreviewed changes based on the lastReviewedCommit of the current user, which are the changes between the lastReviewedCommit and the latest commit of the source branch. The current user is considered to <i>not</i> have any unreviewed changes for the pull request when the lastReviewedCommit is either null (everything is unreviewed, so all changes are streamed), equal to the latest commit of the source branch (everything is reviewed), or no longer on the source branch (the source branch has been rebased). In these cases, the application will fall back to streaming all changes (the default), which is the effective diff for the pull request. The type of changes streamed can be determined by the changeScope parameter included in the properties map of the response.
                                                 *
                                                 * Note: This resource is currently <i>not paged</i>. The server will return at most one page. The server will truncate the number of changes to either the request's page limit or an internal maximum, whichever is smaller. The start parameter of the page request is also ignored.
                                                 *
                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                 * @param projectKey The project key.
                                                 * @param pullRequestId The pull request ID.
                                                 * @param repositorySlug The repository slug.
                                                 * @param sinceId The since commit hash to stream changes for a RANGE arbitrary change scope
                                                 * @param changeScope UNREVIEWED to stream the unreviewed changes for the current user (if they exist); RANGE to stream changes between two arbitrary commits (requires 'sinceId' and 'untilId'); otherwise ALL to stream all changes (the default)
                                                 * @param untilId The until commit hash to stream changes for a RANGE arbitrary change scope
                                                 * @param withComments true to apply comment counts in the changes (the default); otherwise, false to stream changes without comment counts
                                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                                 * @returns RestChange A page of unreviewed Changes for the current user from the supplied pull request, including the unreviewedCommits in the properties map.
                                                 * @throws ApiError
                                                 */
                                                public static streamChanges1(
                                                    projectKey: string,
                                                    pullRequestId: string,
                                                    repositorySlug: string,
                                                    sinceId?: string,
                                                    changeScope?: string,
                                                    untilId?: string,
                                                    withComments?: string,
                                                    start?: number,
                                                    limit?: number,
                                                ): CancelablePromise<RestChange> {
                                                    return __request(OpenAPI, {
                                                        method: 'GET',
                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/changes',
                                                        path: {
                                                            'projectKey': projectKey,
                                                            'pullRequestId': pullRequestId,
                                                            'repositorySlug': repositorySlug,
                                                        },
                                                        query: {
                                                            'sinceId': sinceId,
                                                            'changeScope': changeScope,
                                                            'untilId': untilId,
                                                            'withComments': withComments,
                                                            'start': start,
                                                            'limit': limit,
                                                        },
                                                        errors: {
                                                            401: `The currently authenticated user has insufficient permissions to view the repository or pull request.`,
                                                            404: `The repository or pull request does not exist.`,
                                                        },
                                                    });
                                                }
                                                /**
                                                 * Add pull request comment
                                                 * Add a new comment.
                                                 *
                                                 * Comments can be added in a few places by setting different attributes: </p>General pull request comment:
                                                 * <pre> {
                                                     * "text": "An insightful general comment on a pull request."
                                                     * }
                                                     * </pre> Reply to a comment:  <pre> {
                                                         * "text": "A measured reply.",
                                                         * "parent": {
                                                             * "id": 1
                                                             * }
                                                             * }
                                                             * </pre> General file comment:  <pre> {
                                                                 * "text": "An insightful general comment on a file.",
                                                                 * "anchor": {
                                                                     * "diffType": "RANGE",
                                                                     * "fromHash": "6df3858eeb9a53a911cd17e66a9174d44ffb02cd",
                                                                     * "path": "path/to/file",
                                                                     * "srcPath": "path/to/file",
                                                                     * "toHash": "04c7c5c931b9418ca7b66f51fe934d0bd9b2ba4b"
                                                                     * }
                                                                     * }
                                                                     * </pre> File line comment:  <pre> {
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
                                                                             * </pre>
                                                                             *
                                                                             * Add a new task.
                                                                             *
                                                                             * Tasks are just comments with the attribute 'severity' set to 'BLOCKER':
                                                                             *
                                                                             * General pull request task:  <pre> {
                                                                                 * "text": "A task on a pull request.",
                                                                                 * "severity": "BLOCKER"
                                                                                 * }
                                                                                 * </pre>
                                                                                 *
                                                                                 * Add a pending comment.
                                                                                 *
                                                                                 * Pending comments are just comments with the attribute 'state' set to 'PENDING':
                                                                                 *
                                                                                 * Pending comment: <pre> {
                                                                                     * "text": "This is a pending comment",
                                                                                     * "state": "PENDING"
                                                                                     * }
                                                                                     * </pre>
                                                                                     *
                                                                                     * For file and line comments, 'path' refers to the path of the file to which the comment should be applied and 'srcPath' refers to the path the that file used to have (only required for copies and moves).
                                                                                     *
                                                                                     * fromHash and toHash refer to the sinceId / untilId (respectively) used to produce the diff on which the comment was added.
                                                                                     *
                                                                                     * For diffType 'COMMIT' or 'RANGE', you must specify both the fromHash and toHash. Note that this behaviour differs from `/commits/comments`
                                                                                     *
                                                                                     * Finally diffType refers to the type of diff the comment was added on. For backwards compatibility purposes if no diffType is provided and no fromHash/toHash pair is provided the diffType will be resolved to 'EFFECTIVE'. In any other cases the diffType is REQUIRED.
                                                                                     *
                                                                                     * For line comments, 'line' refers to the line in the diff that the comment should apply to. 'lineType' refers to the type of diff hunk, which can be:
                                                                                     *
                                                                                     * - 'ADDED' - for an added line;
                                                                                     * - 'REMOVED' - for a removed line; or
                                                                                     * - 'CONTEXT' - for a line that was unmodified but is in the vicinity of the diff.
                                                                                     * </ul>'fileType' refers to the file of the diff to which the anchor should be attached - which is of relevance when displaying the diff in a side-by-side way. Currently the supported values are:
                                                                                     *
                                                                                     * - 'FROM' - the source file of the diff
                                                                                     * - 'TO' - the destination file of the diff
                                                                                     * </ul>If the current user is not a participant the user is added as a watcher of the pull request.
                                                                                     *
                                                                                     * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                     * @param projectKey The project key.
                                                                                     * @param pullRequestId The pull request ID.
                                                                                     * @param repositorySlug The repository slug.
                                                                                     * @param requestBody The comment to add
                                                                                     * @returns RestComment The newly created comment.
                                                                                     * @throws ApiError
                                                                                     */
                                                                                    public static createComment2(
                                                                                        projectKey: string,
                                                                                        pullRequestId: string,
                                                                                        repositorySlug: string,
                                                                                        requestBody?: RestComment,
                                                                                    ): CancelablePromise<RestComment> {
                                                                                        return __request(OpenAPI, {
                                                                                            method: 'POST',
                                                                                            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments',
                                                                                            path: {
                                                                                                'projectKey': projectKey,
                                                                                                'pullRequestId': pullRequestId,
                                                                                                'repositorySlug': repositorySlug,
                                                                                            },
                                                                                            body: requestBody,
                                                                                            mediaType: 'application/json',
                                                                                            errors: {
                                                                                                400: `The comment was not created due to a validation error.`,
                                                                                                401: `The currently authenticated user has insufficient permissions to view the pull request, create a comment or watch the pull request.`,
                                                                                                404: `Unable to find the supplied project, repository, pull request or parent comment.`,
                                                                                                409: `Adding, deleting, or editing comments isn't supported on archived repositories.`,
                                                                                            },
                                                                                        });
                                                                                    }
                                                                                    /**
                                                                                     * Delete a pull request comment
                                                                                     * Delete a pull request comment. Anyone can delete their own comment. Only users with <strong>REPO_ADMIN</strong> and above may delete comments created by other users.
                                                                                     *
                                                                                     * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                     * @param projectKey The project key.
                                                                                     * @param commentId The ID of the comment to retrieve.
                                                                                     * @param pullRequestId The pull request ID.
                                                                                     * @param repositorySlug The repository slug.
                                                                                     * @param version The expected version of the comment. This must match the server's version of the comment or the delete will fail. To determine the current version of the comment, the comment should be fetched from the server prior to the delete. Look for the 'version' attribute in the returned JSON structure.
                                                                                     * @returns void
                                                                                     * @throws ApiError
                                                                                     */
                                                                                    public static deleteComment2(
                                                                                        projectKey: string,
                                                                                        commentId: string,
                                                                                        pullRequestId: string,
                                                                                        repositorySlug: string,
                                                                                        version?: string,
                                                                                    ): CancelablePromise<void> {
                                                                                        return __request(OpenAPI, {
                                                                                            method: 'DELETE',
                                                                                            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId}',
                                                                                            path: {
                                                                                                'projectKey': projectKey,
                                                                                                'commentId': commentId,
                                                                                                'pullRequestId': pullRequestId,
                                                                                                'repositorySlug': repositorySlug,
                                                                                            },
                                                                                            query: {
                                                                                                'version': version,
                                                                                            },
                                                                                            errors: {
                                                                                                401: `The currently authenticated user has insufficient permissions to delete the comment.`,
                                                                                                404: `Unable to find the supplied project, repository or pull request.`,
                                                                                                409: `The comment has replies, the version supplied does not match the current version or the repository is archived.`,
                                                                                            },
                                                                                        });
                                                                                    }
                                                                                    /**
                                                                                     * Update pull request comment
                                                                                     * Update a comment, with the following restrictions:
                                                                                     *
                                                                                     * - only the author of the comment may update the <i>text</i> of the comment
                                                                                     * - only the author of the comment, the author of the pull request or repository admins and above may update the other fields of a comment
                                                                                     * </ul>
                                                                                     *
                                                                                     * Convert a comment to a task or vice versa.
                                                                                     *
                                                                                     * Comments can be converted to tasks by setting the 'severity' attribute to 'BLOCKER':
                                                                                     * <pre> {
                                                                                         * "severity": "BLOCKER"
                                                                                         * }
                                                                                         * </pre>
                                                                                         *
                                                                                         * Tasks can be converted to comments by setting the 'severity' attribute to 'NORMAL':  <pre> {
                                                                                             * "severity": "NORMAL"
                                                                                             * }
                                                                                             * </pre>
                                                                                             *
                                                                                             * Resolve a task.
                                                                                             *
                                                                                             * Tasks can be resolved by setting the 'state' attribute to 'RESOLVED':  <pre> {
                                                                                                 * "state": "RESOLVED"
                                                                                                 * }
                                                                                                 * </pre>
                                                                                                 *
                                                                                                 * <strong>Note:</strong> the supplied JSON object must contain a <code>version</code> that must match the server's version of the comment or the update will fail. To determine the current version of the comment, the comment should be fetched from the server prior to the update. Look for the 'version' attribute in the returned JSON structure.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param commentId The ID of the comment to retrieve.
                                                                                                 * @param pullRequestId The pull request ID.
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param requestBody The updated comment
                                                                                                 * @returns RestComment The newly updated comment.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static updateComment2(
                                                                                                    projectKey: string,
                                                                                                    commentId: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    requestBody?: RestComment,
                                                                                                ): CancelablePromise<RestComment> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'PUT',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId}',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'commentId': commentId,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            400: `The comment was not updated due to a validation error.`,
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the pull request, update a comment or watch the pull request.`,
                                                                                                            404: `Unable to find the supplied project, repository, pull request or comment.`,
                                                                                                            409: `The comment version supplied does not match the current version or the repository is archived.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Apply pull request suggestion
                                                                                                 * Apply a suggestion contained within a comment.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param commentId The ID of the comment to retrieve.
                                                                                                 * @param pullRequestId The pull request ID.
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param requestBody A request containing other parameters required to apply a suggestion - The given versions/hashes must match the server's version/hashes or the suggestion application will fail (in order to avoid applying the suggestion to the wrong place
                                                                                                 * @returns void
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static applySuggestion(
                                                                                                    projectKey: string,
                                                                                                    commentId: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    requestBody?: RestApplySuggestionRequest,
                                                                                                ): CancelablePromise<void> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'POST',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/comments/{commentId}/apply-suggestion',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'commentId': commentId,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            400: `The suggestion was not applied due to a validation error.`,
                                                                                                            401: `The currently authenticated user has insufficient permissions to apply the suggestion.`,
                                                                                                            404: `Unable to find the supplied project, repository, pull request or parent comment.`,
                                                                                                            409: `There was an error applying the suggestion to the source branch. It must be applied manually.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Decline pull request
                                                                                                 * Decline a pull request.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The pullrequest ID provided by the path
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param version The current version of the pull request. If the server's version isn't the same as the specified version the operation will fail. To determine the current version of the pull request it should be fetched from the server prior to this operation. Look for the 'version' attribute in the returned JSON structure.
                                                                                                 * @param requestBody Optional body
                                                                                                 * @returns RestPullRequest The pull request was declined.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static decline(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    version?: string,
                                                                                                    requestBody?: RestPullRequestDeclineRequest,
                                                                                                ): CancelablePromise<RestPullRequest> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'POST',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/decline',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        query: {
                                                                                                            'version': version,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `The pull request is not OPEN or has been updated since the version specified by the request.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Test if pull request can be merged
                                                                                                 * Test whether a pull request can be merged.
                                                                                                 *
                                                                                                 * A pull request may not be merged if:
                                                                                                 *
                                                                                                 * - there are conflicts that need to be manually resolved before merging; and/or
                                                                                                 * - one or more merge checks have vetoed the merge.
                                                                                                 *
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @returns RestPullRequestMergeability The mergeability status of the pull request.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static canMerge(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                ): CancelablePromise<RestPullRequestMergeability> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'GET',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the specified pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `The specified pull request is not open.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Merge pull request
                                                                                                 * Merge the specified pull request immediately or set the pull request to auto-merge when all the merge checks pass by setting <strong>autoMerge</strong> field in the request body.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_WRITE</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param version The current version of the pull request. If the server's version isn't the same as the specified version the operation will fail. To determine the current version of the pull request it should be fetched from the server prior to this operation. Look for the 'version' attribute in the returned JSON structure.
                                                                                                 * @param requestBody The body holder
                                                                                                 * @returns RestPullRequest The merged pull request.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static merge(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    version?: string,
                                                                                                    requestBody?: RestPullRequestMergeRequest,
                                                                                                ): CancelablePromise<RestPullRequest> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'POST',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        query: {
                                                                                                            'version': version,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to merge the specified pull request`,
                                                                                                            403: `The auto-merge setting is not enabled for the repository that this pull request targets.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `One of the following error cases occurred (check the error message for more details):
                                                                                                            - The pull request has conflicts.
                                                                                                            - A merge check vetoed the merge.
                                                                                                            - The specified version is out of date.
                                                                                                            - The specified pull request is not open.
                                                                                                            - The <em>to</em> repository is archived.
                                                                                                            `,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Get pull request participants
                                                                                                 * Retrieves a page of the participants for a given pull request.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                                                                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                                                                                 * @returns any Details of the participants in this pull request.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static listParticipants(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    start?: number,
                                                                                                    limit?: number,
                                                                                                ): CancelablePromise<{
                                                                                                    isLastPage?: boolean;
                                                                                                    limit?: number;
                                                                                                    nextPageStart?: number;
                                                                                                    size?: number;
                                                                                                    start?: number;
                                                                                                    values?: Array<RestPullRequestParticipant>;
                                                                                                }> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'GET',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        query: {
                                                                                                            'start': start,
                                                                                                            'limit': limit,
                                                                                                        },
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Assign pull request participant role
                                                                                                 * Assigns a participant to an explicit role in pull request. Currently only the REVIEWER role may be assigned.
                                                                                                 *
                                                                                                 * If the user is not yet a participant in the pull request, they are made one and assigned the supplied role.
                                                                                                 *
                                                                                                 * If the user is already a participant in the pull request, their previous role is replaced with the supplied role unless they are already assigned the AUTHOR role which cannot be changed and will result in a Bad Request (400) response code.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_WRITE</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param requestBody The participant to be added to the pull request, includes the user and their role
                                                                                                 * @returns RestPullRequestParticipant Details of the participants in this pull request.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static assignParticipantRole(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    requestBody: RestPullRequestAssignParticipantRoleRequest,
                                                                                                ): CancelablePromise<RestPullRequestParticipant> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'POST',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            400: `The request does not have the username and role, or is attempting an invalid assignment.`,
                                                                                                            401: `The currently authenticated user has insufficient permissions to update the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `Adding reviewers isn't supported on archived repositories`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Unassign pull request participant
                                                                                                 * Unassigns a participant from the REVIEWER role they may have been given in a pull request.
                                                                                                 *
                                                                                                 * If the participant has no explicit role this method has no effect.
                                                                                                 *
                                                                                                 * Afterwards, the user will still remain a participant in the pull request but their role will be reduced to PARTICIPANT. This is because once made a participant of a pull request, a user will forever remain a participant. Only their role may be altered.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_WRITE</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param userSlug The slug for the user being unassigned
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @returns void
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static unassignParticipantRole(
                                                                                                    projectKey: string,
                                                                                                    userSlug: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                ): CancelablePromise<void> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'DELETE',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug}',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'userSlug': userSlug,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        errors: {
                                                                                                            400: `The request does not have the username.`,
                                                                                                            401: `The currently authenticated user has insufficient permissions to update the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `Removing reviewers isn't supported on archived repositories.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Change pull request status
                                                                                                 * Change the current user's status for a pull request. Implicitly adds the user as a participant if they are not already. If the current user is the author, this method will fail.
                                                                                                 *
                                                                                                 * The possible values for {@code status} are <strong>UNAPPROVED</strong>, <strong>NEEDS_WORK</strong> (which is referred to as "Requested changes" in the frontend from 8.10 onward), or <strong>APPROVED</strong>.
                                                                                                 *
                                                                                                 * If the new {@code status} is <strong>NEEDS_WORK</strong> or <strong>APPROVED</strong> then the {@code lastReviewedCommit} for the participant will be updated to the latest commit of the source branch of the pull request.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param userSlug The slug for the user changing their status
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param requestBody The participant representing the status to set, includes the status of the participant and last reviewed commit. If last reviewed commit is provided, it will be used to update the participant status. The operation will fail if the latest commit of the pull request does not match the provided last reviewed commit. If last reviewed commit is not provided, the latest commit of the pull request will be used for the update by default.
                                                                                                 * @param version The current version of the pull request. If the server's version isn't the same as the specified version the operation will fail. To determine the current version of the pull request it should be fetched from the server prior to this operation. Look for the 'version' attribute in the returned JSON structure. Note: This parameter is deprecated. Use last reviewed commit in request body instead
                                                                                                 * @returns RestPullRequestParticipant Details of the new participant.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static updateStatus(
                                                                                                    projectKey: string,
                                                                                                    userSlug: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    requestBody: RestPullRequestAssignStatusRequest,
                                                                                                    version?: string,
                                                                                                ): CancelablePromise<RestPullRequestParticipant> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'PUT',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/participants/{userSlug}',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'userSlug': userSlug,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        query: {
                                                                                                            'version': version,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            400: `The specified status was invalid or the currently authenticated user is the author of the PR and cannot have its status updated.`,
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `The pull request is not open, or has been updated since the last reviewed commit specified by the request.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Re-open pull request
                                                                                                 * Re-open a declined pull request.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The ID of the pull request within the repository
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @param version The current version of the pull request. If the server's version isn't the same as the specified version the operation will fail. To determine the current version of the pull request it should be fetched from the server prior to this operation. Look for the 'version' attribute in the returned JSON structure.
                                                                                                 * @param requestBody The body holder
                                                                                                 * @returns RestPullRequest The merged pull request.
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static reopen(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                    version?: string,
                                                                                                    requestBody?: RestPullRequestReopenRequest,
                                                                                                ): CancelablePromise<RestPullRequest> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'POST',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/reopen',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        query: {
                                                                                                            'version': version,
                                                                                                        },
                                                                                                        body: requestBody,
                                                                                                        mediaType: 'application/json',
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to reopen the specified pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                            409: `One of the following error cases occurred (check the error message for more details):
                                                                                                            - The pull request is not in a declined state.
                                                                                                            - The specified version is out of date.
                                                                                                            - The <em>to</em> repository is archived.
                                                                                                            `,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Stop watching pull request
                                                                                                 * Remove the authenticated user as a watcher for the specified pull request.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The pull request ID.
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @returns void
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static unwatch1(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                ): CancelablePromise<void> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'DELETE',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/watch',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                                /**
                                                                                                 * Watch pull request
                                                                                                 * Add the authenticated user as a watcher for the specified pull request.
                                                                                                 *
                                                                                                 * The authenticated user must have <strong>REPO_READ</strong> permission for the repository that this pull request targets to call this resource.
                                                                                                 * @param projectKey The project key.
                                                                                                 * @param pullRequestId The pull request ID.
                                                                                                 * @param repositorySlug The repository slug.
                                                                                                 * @returns void
                                                                                                 * @throws ApiError
                                                                                                 */
                                                                                                public static watch1(
                                                                                                    projectKey: string,
                                                                                                    pullRequestId: string,
                                                                                                    repositorySlug: string,
                                                                                                ): CancelablePromise<void> {
                                                                                                    return __request(OpenAPI, {
                                                                                                        method: 'POST',
                                                                                                        url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/watch',
                                                                                                        path: {
                                                                                                            'projectKey': projectKey,
                                                                                                            'pullRequestId': pullRequestId,
                                                                                                            'repositorySlug': repositorySlug,
                                                                                                        },
                                                                                                        errors: {
                                                                                                            401: `The currently authenticated user has insufficient permissions to view the pull request.`,
                                                                                                            404: `The specified repository or pull request does not exist.`,
                                                                                                        },
                                                                                                    });
                                                                                                }
                                                                                            }

