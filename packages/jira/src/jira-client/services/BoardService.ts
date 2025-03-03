/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardBean } from '../models/BoardBean.js';
import type { BoardConfigBean } from '../models/BoardConfigBean.js';
import type { BoardCreateBean } from '../models/BoardCreateBean.js';
import type { BooleanSettingBean } from '../models/BooleanSettingBean.js';
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EpicBean } from '../models/EpicBean.js';
import type { IssueBean } from '../models/IssueBean.js';
import type { ProjectJsonBean } from '../models/ProjectJsonBean.js';
import type { SprintBean } from '../models/SprintBean.js';
import type { StringList } from '../models/StringList.js';
import type { VersionBean } from '../models/VersionBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class BoardService {
    /**
     * Get all boards
     * Returns all boards. This only includes boards that the user has permission to view.
     * @param maxResults
     * @param name
     * @param projectKeyOrId
     * @param type
     * @param startAt
     * @returns BoardBean Returns the requested boards, at the specified page of the results.
     * @throws ApiError
     */
    public static getAllBoards(
        maxResults?: number,
        name?: string,
        projectKeyOrId?: string,
        type?: StringList,
        startAt?: number,
    ): CancelablePromise<BoardBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board',
            query: {
                'maxResults': maxResults,
                'name': name,
                'projectKeyOrId': projectKeyOrId,
                'type': type,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not have valid license.`,
            },
        });
    }
    /**
     * Create a new board
     * Creates a new board. Board name, type and filter Id is required.
     * - name - Must be less than 255 characters.
     * - type - Valid values: scrum, kanban
     * - filterId - Id of a filter that the user has permissions to view. Note, if the user does not have the 'Create shared objects' permission and tries to create a shared board, a private board will be created instead (remember that board sharing depends on the filter sharing).
     * Note:
     * - If you want to create a new project with an associated board, use the JIRA platform REST API. For more information, see the Create project method. The projectTypeKey for software boards must be 'software' and the projectTemplateKey must be either com.pyxis.greenhopper.jira:gh-kanban-template or com.pyxis.greenhopper.jira:gh-scrum-template.
     * - You can create a filter using the JIRA REST API. For more information, see the Create filter method.
     * - If you do not ORDER BY the Rank field for the filter of your board, you will not be able to reorder issues on the board.
     * @param requestBody Bean which contains board name, type and filter Id.
     * @returns BoardBean Returns the created board.
     * @throws ApiError
     */
    public static createBoard(
        requestBody: BoardCreateBean,
    ): CancelablePromise<BoardBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agile/1.0/board',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
            },
        });
    }
    /**
     * Get a single board
     * Returns a single board, for a given board Id.
     * @param boardId
     * @returns BoardBean Returns the requested board.
     * @throws ApiError
     */
    public static getBoard(
        boardId: number,
    ): CancelablePromise<BoardBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}',
            path: {
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete the board
     * Deletes the board.
     * @param boardId
     * @returns void
     * @throws ApiError
     */
    public static deleteBoard(
        boardId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/agile/1.0/board/{boardId}',
            path: {
                'boardId': boardId,
            },
            errors: {
                403: `Returned if the user does not a have valid license, or when the user does not have the permission to delete the board.`,
                404: `Returned if a board with the given id does not exist or the user does not have the permission to view the board.`,
            },
        });
    }
    /**
     * Get all issues from the board's backlog
     * Returns all issues from a board's backlog, for a given board Id.
     * @param boardId
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns IssueBean Returns the requested issues.
     * @throws ApiError
     */
    public static getIssuesForBacklog(
        boardId: number,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<IssueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/backlog',
            path: {
                'boardId': boardId,
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
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get the board configuration
     * Get the board configuration.
     * The response contains the following fields:
     * - id - Id of the board.
     * - name - Name of the board.
     * - filter - Reference to the filter used by the given board.
     * - subQuery (Kanban only) - JQL subquery used by the given board.
     * - columnConfig - The column configuration lists the columns for the board, in the order defined in the column configuration.
     * For each column, it shows the issue status mapping
     * as well as the constraint type (Valid values: none, issueCount, issueCountExclSubs) for the min/max number of issues.
     * Note, the last column with statuses mapped to it is treated as the "Done" column,
     * which means that issues in that column will be marked as already completed.
     * - estimation (Scrum only) - Contains information about type of estimation used for the board. Valid values: none, issueCount, field.
     * If the estimation type is "field", the Id and display name of the field used for estimation is also returned.
     * Note, estimates for an issue can be updated by a PUT /rest/api/2/issue/{issueIdOrKey} request, however the fields must be on the screen.
     * "timeoriginalestimate" field will never be on the screen, so in order to update it "originalEstimate" in "timetracking" field should be updated.
     * - ranking - Contains information about custom field used for ranking in the given board.
     * @param boardId
     * @returns BoardConfigBean Returns the configuration of the board for given boardId.
     * @throws ApiError
     */
    public static getConfiguration(
        boardId: number,
    ): CancelablePromise<BoardConfigBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/configuration',
            path: {
                'boardId': boardId,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all epics from the board
     * Returns all epics from the board, for the given board Id. This only includes epics that the user has permission to view. Note, if the user does not have permission to view the board, no epics will be returned at all.
     * @param boardId
     * @param maxResults
     * @param done
     * @param startAt
     * @returns EpicBean Returns the requested epics, at the specified page of the results.
     * @throws ApiError
     */
    public static getEpics(
        boardId: number,
        maxResults?: number,
        done?: string,
        startAt?: number,
    ): CancelablePromise<EpicBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/epic',
            path: {
                'boardId': boardId,
            },
            query: {
                'maxResults': maxResults,
                'done': done,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all issues without an epic
     * Returns all issues that do not belong to any epic on a board, for a given board Id.
     * @param boardId
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns IssueBean Returns the requested issues, at the specified page of the results.
     * @throws ApiError
     */
    public static getIssuesWithoutEpic(
        boardId: number,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<IssueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/epic/none/issue',
            path: {
                'boardId': boardId,
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
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all issues for a specific epic
     * Returns all issues that belong to an epic on the board, for the given epic Id and the board Id.
     * @param epicId
     * @param boardId
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns IssueBean Returns the requested issues, at the specified page of the results.
     * @throws ApiError
     */
    public static getIssuesForEpic(
        epicId: number,
        boardId: number,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<IssueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/epic/{epicId}/issue',
            path: {
                'epicId': epicId,
                'boardId': boardId,
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
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all issues from a board
     * Returns all issues from a board, for a given board Id. This only includes issues that the user has permission to view. Note, if the user does not have permission to view the board, no issues will be returned at all. Issues returned from this resource include Agile fields, like sprint, closedSprints, flagged, and epic. By default, the returned issues are ordered by rank.
     * @param boardId
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns IssueBean Returns the requested issues.
     * @throws ApiError
     */
    public static getIssuesForBoard(
        boardId: number,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<IssueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/issue',
            path: {
                'boardId': boardId,
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
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all projects associated with the board
     * Returns all projects that are associated with the board, for the given board Id. A project is associated with a board only if the board filter explicitly filters issues by the project and guaranties that all issues will come for one of those projects e.g. board's filter with "project in (PR-1, PR-1) OR reporter = admin" jql Projects are returned only if user can browse all projects that are associated with the board. Note, if the user does not have permission to view the board, no projects will be returned at all. Returned projects are ordered by the name.
     * @param boardId
     * @param maxResults
     * @param startAt
     * @returns ProjectJsonBean Returns the board's projects, at the specified page of the results.
     * @throws ApiError
     */
    public static getProjects(
        boardId: number,
        maxResults?: number,
        startAt?: number,
    ): CancelablePromise<ProjectJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/project',
            path: {
                'boardId': boardId,
            },
            query: {
                'maxResults': maxResults,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if board does not exist or the user does not have permission to access it.`,
            },
        });
    }
    /**
     * Get all properties keys for a board
     * Returns the keys of all properties for the board identified by the id. The user who retrieves the property keys is required to have permissions to view the board.
     * @param boardId
     * @returns EntityPropertiesKeysBean Returns the requested property keys.
     * @throws ApiError
     */
    public static getPropertiesKeys(
        boardId: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/properties',
            path: {
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get a property from a board
     * Returns the value of the property with a given key from the board identified by the provided id. The user who retrieves the property is required to have permissions to view the board.
     * @param propertyKey
     * @param boardId
     * @returns EntityPropertiesKeysBean Returns the requested property.
     * @throws ApiError
     */
    public static getProperty(
        propertyKey: string,
        boardId: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                404: `Returned if the board does not exist or the property with given key is not found or the user doesn't have permissions to see it.`,
            },
        });
    }
    /**
     * Update a board's property
     * Sets the value of the specified board's property. You can use this resource to store a custom data against the board identified by the id. The user who stores the data is required to have permissions to modify the board.
     * @param propertyKey
     * @param boardId
     * @returns EntityPropertiesKeysBean Returned if the board property is successfully updated.
     * @returns any Returned if the board property is successfully created.
     * @throws ApiError
     */
    public static setProperty(
        propertyKey: string,
        boardId: string,
    ): CancelablePromise<EntityPropertiesKeysBean | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/board/{boardId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                404: `Returned if the board does not exist or the user doesn't have permissions to see it.`,
            },
        });
    }
    /**
     * Delete a property from a board
     * Removes the property from the board identified by the id. Ths user removing the property is required to have permissions to modify the board.
     * @param propertyKey
     * @param boardId
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty(
        propertyKey: string,
        boardId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/agile/1.0/board/{boardId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                404: `Returned if the board does not exist or if the property with given key is not found or the user doesn't have permissions to see it.`,
            },
        });
    }
    /**
     * Get the value of the refined velocity setting
     * Returns the value of the setting for refined velocity chart
     * @param boardId
     * @returns BooleanSettingBean Returned if the board exists and the property was found.
     * @throws ApiError
     */
    public static getRefinedVelocity(
        boardId: number,
    ): CancelablePromise<BooleanSettingBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/settings/refined-velocity',
            path: {
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the boardId is invalid (negative or not a number).`,
                403: `Returned if the user does not have valid license.`,
                404: `Returned if the board with given id does not exist or if the property with given key is not found or the user doesn't have permissions to see it.`,
            },
        });
    }
    /**
     * Update the board's refined velocity setting
     * Sets the value of the specified board's refined velocity setting.
     * @param boardId
     * @param requestBody The request containing value of the board's property. The value has to a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns any Returned if the board property is successfully updated.
     * @throws ApiError
     */
    public static setRefinedVelocity(
        boardId: number,
        requestBody: BooleanSettingBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/board/{boardId}/settings/refined-velocity',
            path: {
                'boardId': boardId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the boardId is invalid (negative or not a number).`,
                403: `Returned if the user does not have valid license.`,
                404: `Returned if the board with given id does not exist or if the property with given key is not found or the user doesn't have permissions to see it.`,
            },
        });
    }
    /**
     * Get all sprints from a board
     * Returns all sprints from a board, for a given board Id. This only includes sprints that the user has permission to view.
     * @param boardId
     * @param maxResults
     * @param state
     * @param startAt
     * @returns SprintBean Returns the requested sprints, at the specified page of the results. Sprints will be ordered first by state (i.e. closed, active, future) then by their position in the backlog.
     * @throws ApiError
     */
    public static getAllSprints(
        boardId: number,
        maxResults?: number,
        state?: StringList,
        startAt?: number,
    ): CancelablePromise<SprintBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/sprint',
            path: {
                'boardId': boardId,
            },
            query: {
                'maxResults': maxResults,
                'state': state,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all issues for a sprint
     * Get all issues you have access to that belong to the sprint from the board. Issue returned from this resource contains additional fields like: sprint, closedSprints, flagged and epic. Issues are returned ordered by rank. JQL order has higher priority than default rank.
     * @param sprintId
     * @param boardId
     * @param expand
     * @param jql
     * @param maxResults
     * @param validateQuery
     * @param fields
     * @param startAt
     * @returns SprintBean Returns the requested issues, at the specified page of the results.
     * @throws ApiError
     */
    public static getIssuesForSprint(
        sprintId: number,
        boardId: number,
        expand?: string,
        jql?: string,
        maxResults?: number,
        validateQuery?: boolean,
        fields?: Array<StringList>,
        startAt?: number,
    ): CancelablePromise<SprintBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/sprint/{sprintId}/issue',
            path: {
                'sprintId': sprintId,
                'boardId': boardId,
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
                404: `Returned if the board does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get all versions from a board
     * Returns all versions from a board, for a given board Id. This only includes versions that the user has permission to view. Note, if the user does not have permission to view the board, no versions will be returned at all. Returned versions are ordered by the name of the project from which they belong and then by sequence defined by user.
     * @param boardId
     * @param maxResults
     * @param released
     * @param startAt
     * @returns VersionBean Returns the requested versions, at the specified page of the results.
     * @throws ApiError
     */
    public static getAllVersions(
        boardId: number,
        maxResults?: number,
        released?: string,
        startAt?: number,
    ): CancelablePromise<VersionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/board/{boardId}/version',
            path: {
                'boardId': boardId,
            },
            query: {
                'maxResults': maxResults,
                'released': released,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if board does not exist or the user does not have permission to view it.`,
            },
        });
    }
}
