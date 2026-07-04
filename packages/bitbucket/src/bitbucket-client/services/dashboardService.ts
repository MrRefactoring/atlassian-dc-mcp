/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestPullRequest } from '../models/restPullRequest.js';
import type { RestPullRequestSuggestion } from '../models/restPullRequestSuggestion.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class DashboardService {
    /**
     * Get pull request suggestions
     * Retrieves a page of suggestions for pull requests that the currently authenticated user may wish to raise. Such suggestions are based on ref changes occurring and so contain the ref change that prompted the suggestion plus the time the change event occurred. Changes will be returned in descending order based on the time the change that prompted the suggestion occurred.
     *
     * Note that although the response is a page object, the interface does not support paging, however a limit can be applied to the size of the returned page.
     * @param changesSince restrict pull request suggestions to be based on events that occurred since some timein the past. This is expressed in seconds since "now". So to return suggestionsbased only on activity within the past 48 hours, pass a value of 172800.
     * @param limit restricts the result set to return at most this many suggestions.
     * @returns any A page of pull requests that match the search criteria.
     * @throws ApiError
     */
    public static getPullRequestSuggestions(
        changesSince?: string,
        limit?: string,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestPullRequestSuggestion>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/dashboard/pull-request-suggestions',
            query: {
                'changesSince': changesSince,
                'limit': limit,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The current user is not authenticated`,
            },
        });
    }
    /**
     * Get pull requests for a user
     * Retrieve a page of pull requests where a user is involved as either a reviewer, author or a participant. The request may be filtered by pull request state, role or participant status.
     * @param closedSince (optional, defaults to returning pull requests regardless of closed since date). Permits returning only pull requests with a closed timestamp set more recently that (now - closedSince). Units are in seconds. So for example if closed since 86400 is set only pull requests closed in the previous 24 hours will be returned.
     * @param role (optional, defaults to returning pull requests for any role). If a role is supplied only pull requests where the authenticated user is a participant in the given role will be returned. Either <strong>REVIEWER</strong>, <strong>AUTHOR</strong> or <strong>PARTICIPANT</strong>.
     * @param participantStatus (optional, defaults to returning pull requests with any participant status). A comma separated list of participant status. That is, one or more of <strong>UNAPPROVED</strong>, <strong>NEEDS_WORK</strong>, or <strong>APPROVED</strong>.
     * @param state (optional, defaults to returning pull requests in any state). If a state is supplied only pull requests in the specified state will be returned. Either <strong>OPEN</strong>, <strong>DECLINED</strong> or <strong>MERGED</strong>. Omit this parameter to return pull request in any state.
     * @param user The name of the involved user, defaults to the current user.
     * @param order (optional, defaults to <strong>NEWEST</strong>) the order/(s) to return pull requests in; can choose from <strong>OLDEST</strong> (as in: "oldest first"), <strong>NEWEST</strong>, <strong>DRAFT_STATUS</strong>, <strong>PARTICIPANT_STATUS</strong>, and/or <strong>CLOSED_DATE</strong>. Where <strong>CLOSED_DATE</strong> is specified and the result set includes pull requests that are not in the closed state, these pull requests will appear first in the result set, followed by most recently closed pull requests.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of pull requests that match the search criteria.
     * @throws ApiError
     */
    public static getPullRequests1(
        closedSince?: string,
        role?: string,
        participantStatus?: string,
        state?: string,
        user?: string,
        order?: string,
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
            url: '/api/latest/dashboard/pull-requests',
            query: {
                'closedSince': closedSince,
                'role': role,
                'participantStatus': participantStatus,
                'state': state,
                'user': user,
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request was malformed.`,
                401: `The current user is not authenticated`,
            },
        });
    }
}

