/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EpicBean } from '../models/EpicBean.js';
import type { EpicRankRequestBean } from '../models/EpicRankRequestBean.js';
import type { EpicUpdateBean } from '../models/EpicUpdateBean.js';
import type { IssueAssignRequestBean } from '../models/IssueAssignRequestBean.js';
import type { SearchResultsBean } from '../models/SearchResultsBean.js';
import type { StringList } from '../models/StringList.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class EpicService {
    /**
     * Get issues without an epic
     * Returns all issues that do not belong to any epic. This only includes issues that the user has permission to view. Issues returned from this resource include Agile fields, like sprint, closedSprints, flagged, and epic. By default, the returned issues are ordered by rank.
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns SearchResultsBean Returns the requested issues, at the specified page of the results.
     * @throws ApiError
     */
    public static getIssuesWithoutEpic1(
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<SearchResultsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/epic/none/issue',
            query: {
                'expand': expand,
                'jql': jql,
                'maxResults': maxResults,
                'validateQuery': validateQuery,
                'fields': fields,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
            },
        });
    }
    /**
     * Remove issues from any epic
     * Removes issues from epics. The user needs to have the edit issue permission for all issue they want to remove from epics. The maximum number of issues that can be moved in one operation is 50.
     * @param requestBody The issues to remove from epics.
     * @returns void
     * @throws ApiError
     */
    public static removeIssuesFromEpic(
        requestBody: IssueAssignRequestBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/epic/none/issue',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have permission to assign issues.`,
                404: `Returned if the epic does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get an epic by id or key
     * Returns the epic for a given epic Id. This epic will only be returned if the user has permission to view it.
     * @param epicIdOrKey
     * @returns EpicBean Returns the requested epic.
     * @throws ApiError
     */
    public static getEpic(
        epicIdOrKey: string,
    ): CancelablePromise<EpicBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/epic/{epicIdOrKey}',
            path: {
                'epicIdOrKey': epicIdOrKey,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the epic does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Update an epic's details
     * Performs a partial update of the epic. A partial update means that fields not present in the request JSON will not be updated. Valid values for color are color_1 to color_9.
     * @param epicIdOrKey
     * @param requestBody The epic properties to update.
     * @returns EpicBean Updated epic
     * @throws ApiError
     */
    public static partiallyUpdateEpic(
        epicIdOrKey: string,
        requestBody: EpicUpdateBean,
    ): CancelablePromise<EpicBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/epic/{epicIdOrKey}',
            path: {
                'epicIdOrKey': epicIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or edit issue permission.`,
                404: `Returned if the epic does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get issues for a specific epic
     * Returns all issues that belong to the epic, for the given epic Id. This only includes issues that the user has permission to view. Issues returned from this resource include Agile fields, like sprint, closedSprints, flagged, and epic. By default, the returned issues are ordered by rank.
     * @param epicIdOrKey
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns SearchResultsBean Returns the requested issues, at the specified page of the results.
     * @throws ApiError
     */
    public static getIssuesForEpic1(
        epicIdOrKey: string,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<SearchResultsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/epic/{epicIdOrKey}/issue',
            path: {
                'epicIdOrKey': epicIdOrKey,
            },
            query: {
                'expand': expand,
                'jql': jql,
                'maxResults': maxResults,
                'validateQuery': validateQuery,
                'fields': fields,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the epic does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Move issues to a specific epic
     * Moves issues to an epic, for a given epic id. Issues can be only in a single epic at the same time. That means that already assigned issues to an epic, will not be assigned to the previous epic anymore. The user needs to have the edit issue permission for all issue they want to move and to the epic. The maximum number of issues that can be moved in one operation is 50.
     * @param epicIdOrKey
     * @param requestBody The issues to move to the epic.
     * @returns void
     * @throws ApiError
     */
    public static moveIssuesToEpic(
        epicIdOrKey: string,
        requestBody: IssueAssignRequestBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/epic/{epicIdOrKey}/issue',
            path: {
                'epicIdOrKey': epicIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license or does not have edit issue permission for all issues to assign or for the epic.`,
                404: `Returned if the epic does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Rank an epic relative to another
     * Moves (ranks) an epic before or after a given epic. If rankCustomFieldId is not defined, the default rank field will be used.
     * @param epicIdOrKey
     * @param requestBody Bean which contains the information where the given epic should be ranked.
     * @returns void
     * @throws ApiError
     */
    public static rankEpics(
        epicIdOrKey: string,
        requestBody: EpicRankRequestBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/epic/{epicIdOrKey}/rank',
            path: {
                'epicIdOrKey': epicIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if user does not a have valid license or does not have permission to rank. To rank issues user have to have schedule issue permission for epics that they want to rank.`,
                404: `Returned when the given epics in the path parameter or the request body do not exist.`,
            },
        });
    }
}
