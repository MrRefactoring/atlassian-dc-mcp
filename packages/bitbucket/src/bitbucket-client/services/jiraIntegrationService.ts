/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestChangeset } from '../models/restChangeset.js';
import type { RestCommentJiraIssue } from '../models/restCommentJiraIssue.js';
import type { RestEnhancedEntityLink } from '../models/restEnhancedEntityLink.js';
import type { RestJiraIssue } from '../models/restJiraIssue.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class JiraIntegrationService {
    /**
     * Create Jira Issue
     * Create a Jira issue and associate it with a comment on a pull request.
     *
     * This resource can only be used with comments on a pull request. Attempting to call this resource with a different type of comment (for example, a comment on a commit) will result in an error.
     *
     * The authenticated user must have <strong>REPO_READ</strong> permission for the repository containing the comment to call this resource.
     *
     * The JSON structure for the create issue format is specified by Jira's REST v2 API.
     * @param commentId the comment to associate the created Jira issue to
     * @param applicationId id of the Jira server
     * @param requestBody A String representation of the JSON format Jira create issue request see: <a href="https://docs.atlassian.com/jira/REST/server/#api/2/issue-createIssue">Jira REST API</a>
     * @returns RestCommentJiraIssue The created Jira issue key and the associated comment ID
     * @throws ApiError
     */
    public static createIssue(
        commentId: string,
        applicationId?: string,
        requestBody?: string,
    ): CancelablePromise<RestCommentJiraIssue> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jira/latest/comments/{commentId}/issues',
            path: {
                'commentId': commentId,
            },
            query: {
                'applicationId': applicationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The specified application link ID does not match any linked Jira instance.`,
                401: `Authentication with the Jira instance is required.`,
            },
        });
    }
    /**
     * Get changesets for issue key
     * Retrieve a page of changesets associated with the given issue key.
     * @param issueKey The issue key to search by
     * @param maxChanges The maximum number of changes to retrieve for each changeset
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of detailed changesets
     * @throws ApiError
     */
    public static getCommitsByIssueKey(
        issueKey: string,
        maxChanges?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestChangeset>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jira/latest/issues/{issueKey}/commits',
            path: {
                'issueKey': issueKey,
            },
            query: {
                'maxChanges': maxChanges,
                'start': start,
                'limit': limit,
            },
        });
    }
    /**
     * Get entity link
     * Retrieves the enchanced primary entitylink
     *
     * The authenticated user must have <strong>PROJECT_READ</strong> permission for the project having the primary enhanced entitylink.
     *
     *
     * @param projectKey The project key
     * @returns RestEnhancedEntityLink The primary enhanced entitylink.
     * @throws ApiError
     */
    public static getEnhancedEntityLinkForProject(
        projectKey: string,
    ): CancelablePromise<RestEnhancedEntityLink> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jira/latest/projects/{projectKey}/primary-enhanced-entitylink',
            path: {
                'projectKey': projectKey,
            },
        });
    }
    /**
     * Get issues for a pull request
     * Retrieves Jira issue keys that are associated with the commits in the specified pull request. The number of commits checked for issues is limited to a default of 100.
     * @param projectKey The project key
     * @param pullRequestId The pull request id
     * @param repositorySlug The repository slug
     * @returns RestJiraIssue A list of Jira issues keys for the pull request
     * @throws ApiError
     */
    public static getIssueKeysForPullRequest(
        projectKey: string,
        pullRequestId: string,
        repositorySlug: string,
    ): CancelablePromise<Array<RestJiraIssue>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jira/latest/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/issues',
            path: {
                'projectKey': projectKey,
                'pullRequestId': pullRequestId,
                'repositorySlug': repositorySlug,
            },
        });
    }
}

