/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentJsonBean } from '../models/AttachmentJsonBean.js';
import type { CommentJsonBean } from '../models/CommentJsonBean.js';
import type { CommentsWithPaginationJsonBean } from '../models/CommentsWithPaginationJsonBean.js';
import type { CreateMetaIssueTypeBean } from '../models/CreateMetaIssueTypeBean.js';
import type { EditMetaBean } from '../models/EditMetaBean.js';
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EntityPropertyBean } from '../models/EntityPropertyBean.js';
import type { FieldEditBean } from '../models/FieldEditBean.js';
import type { FieldMetaBean } from '../models/FieldMetaBean.js';
import type { FieldValueBean } from '../models/FieldValueBean.js';
import type { IssueBean } from '../models/IssueBean.js';
import type { IssueCreateResponse } from '../models/IssueCreateResponse.js';
import type { IssuePickerResult } from '../models/IssuePickerResult.js';
import type { IssueRankRequestBean } from '../models/IssueRankRequestBean.js';
import type { IssueRefJsonBean } from '../models/IssueRefJsonBean.js';
import type { IssuesCreateResponse } from '../models/IssuesCreateResponse.js';
import type { IssueSubTaskMovePositionBean } from '../models/IssueSubTaskMovePositionBean.js';
import type { IssuesUpdateBean } from '../models/IssuesUpdateBean.js';
import type { IssueUpdateBean } from '../models/IssueUpdateBean.js';
import type { NotificationJsonBean } from '../models/NotificationJsonBean.js';
import type { PartialSuccessBean } from '../models/PartialSuccessBean.js';
import type { PinnedCommentJsonBean } from '../models/PinnedCommentJsonBean.js';
import type { RemoteIssueLinkBean } from '../models/RemoteIssueLinkBean.js';
import type { RemoteIssueLinkCreateOrUpdateRequest } from '../models/RemoteIssueLinkCreateOrUpdateRequest.js';
import type { StringList } from '../models/StringList.js';
import type { TransitionsMetaBean } from '../models/TransitionsMetaBean.js';
import type { UserBean } from '../models/UserBean.js';
import type { VoteBean } from '../models/VoteBean.js';
import type { WatchersBean } from '../models/WatchersBean.js';
import type { worklog } from '../models/worklog.js';
import type { WorklogWithPaginationBean } from '../models/WorklogWithPaginationBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IssueService {
    /**
     * Rank issues before or after a given issue
     * Moves (ranks) issues before or after a given issue. At most 50 issues may be ranked at once. This operation may fail for some issues, although this will be rare. In that case the 207 status code is returned for the whole response and detailed information regarding each issue is available in the response body. If rankCustomFieldId is not defined, the default rank field will be used.
     * @param requestBody Bean which contains list of issues to rank and information where it should be ranked.
     * @returns PartialSuccessBean Returns the list of issue with status of rank operation.
     * @throws ApiError
     */
    public static rankIssues(
        requestBody: IssueRankRequestBean,
    ): CancelablePromise<PartialSuccessBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/issue/rank',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if user does not a have valid license or does not have permission to rank.`,
            },
        });
    }
    /**
     * Get a single issue with Agile fields
     * Returns a single issue, for a given issue Id or issue key. Issues returned from this resource include Agile fields, like sprint, closedSprints, flagged, and epic.
     * @param issueIdOrKey
     * @param expand
     * @param fields
     * @param updateHistory
     * @returns IssueBean Returns the requested issue.
     * @throws ApiError
     */
    public static getIssue(
        issueIdOrKey: string,
        expand?: string,
        fields?: Array<StringList>,
        updateHistory?: boolean,
    ): CancelablePromise<IssueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/issue/{issueIdOrKey}',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'expand': expand,
                'fields': fields,
                'updateHistory': updateHistory,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not a have valid license.`,
                404: `Returned if the issue does not exist or the user does not have permission to view issue.`,
            },
        });
    }
    /**
     * Get the estimation of an issue for a board
     * Returns the estimation of the issue and a fieldId of the field that is used for it.
     * Original time internally stores and returns the estimation as a number of seconds.
     * The field used for estimation on the given board can be obtained from board configuration resource.
     * More information about the field are returned by edit meta resource or field resource.
     * @param issueIdOrKey
     * @param boardId
     * @returns FieldValueBean Returns the estimation of the issue and a fieldId of the field that is used for it.
     * @throws ApiError
     */
    public static getIssueEstimationForBoard(
        issueIdOrKey: string,
        boardId?: number,
    ): CancelablePromise<FieldValueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agile/1.0/issue/{issueIdOrKey}/estimation',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'boardId': boardId,
            },
            errors: {
                400: `Returned if the boardId was not provided, field does not exists or value was in wrong format.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if user does not a have valid license or does not have permission to edit issue.`,
                404: `Returned if the issue does not exist or the user does not have permission to view issue or the board does not exist or the user does not have permission to view board or the issue does not belong to the board.`,
            },
        });
    }
    /**
     * Update the estimation of an issue for a board
     * Updates the estimation of the issue. boardId param is required. This param determines which field will be updated on a issue.
     * Note that this resource changes the estimation field of the issue regardless of appearance the field on the screen.
     * Original time tracking estimation field accepts estimation in formats like "1w", "2d", "3h", "20m" or number which represent number of minutes.
     * However, internally the field stores and returns the estimation as a number of seconds.
     * The field used for estimation on the given board can be obtained from <a href="#agile/1.0/board-getConfiguration">board configuration resource</a>.
     * More information about the field are returned by edit meta resource or field resource.
     * @param issueIdOrKey
     * @param requestBody Bean that contains value of a new estimation.
     * @param boardId
     * @returns FieldValueBean Returns the estimation of the issue and a fieldId of the field that is used for it.
     * @throws ApiError
     */
    public static estimateIssueForBoard(
        issueIdOrKey: string,
        requestBody: FieldEditBean,
        boardId?: number,
    ): CancelablePromise<FieldValueBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agile/1.0/issue/{issueIdOrKey}/estimation',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'boardId': boardId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the boardId was not provided, field does not exists or value was in wrong format.`,
                401: `Returned if the user is not logged in.`,
                403: `Returned if user does not a have valid license or does not have permission to edit issue.`,
                404: `Returned if the issue does not exist or the user does not have permission to view issue or the board does not exist or the user does not have permission to view board or the issue does not belong to the board.`,
            },
        });
    }
    /**
     * Create an issue or sub-task from json
     * Creates an issue or a sub-task from a JSON representation.
     * The fields that can be set on create, in either the fields parameter or the update parameter can be determined using the /rest/api/2/issue/createmeta resource.
     * If a field is not configured to appear on the create screen, then it will not be in the createmeta, and a field
     * validation error will occur if it is submitted.
     * Creating a sub-task is similar to creating a regular issue, with two important differences:
     * - the issueType field must correspond to a sub-task issue type (you can use /issue/createmeta to discover sub-task issue types), and
     * - you must provide a parent field in the issue create request containing the id or key of the parent issue.
     * The updateHistory param adds the project that this issue is created in, to the current user's project history, if set to true (by default, the project history is not updated).
     * You can view the project history in the Jira application, via the Projects dropdown.
     * @param updateHistory
     * @param requestBody Issue update bean
     * @returns IssueCreateResponse Returns a link to the created issue.
     * @throws ApiError
     */
    public static createIssue(
        updateHistory: boolean = false,
        requestBody?: IssueUpdateBean,
    ): CancelablePromise<IssueCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue',
            query: {
                'updateHistory': updateHistory,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid field values, and so forth).`,
            },
        });
    }
    /**
     * Archive list of issues
     * Archives a list of issues.
     * @param notifyUsers Send the email with notification that the issue was updated to users that watch it. Admin or project admin permissions are required to disable the notification.
     * @param requestBody List of issue keys
     * @returns any Returns a stream of issues archiving results.
     * @throws ApiError
     */
    public static archiveIssues(
        notifyUsers?: string,
        requestBody?: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/archive',
            query: {
                'notifyUsers': notifyUsers,
            },
            body: requestBody,
            mediaType: 'text/plain',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the currently authenticated user does not have permission to archive the issue or doesn't have DC license or issue is already archived.`,
                404: `Returned if the issue does not exist.`,
            },
        });
    }
    /**
     * Create an issue or sub-task from json - bulk operation.
     * Creates issues or sub-tasks from a JSON representation. Creates many issues in one bulk operation.
     * Creating a sub-task is similar to creating a regular issue. More details can be found in createIssue section.
     * @param requestBody Issues update bean
     * @returns IssuesCreateResponse Returns a link to the created issues.
     * @throws ApiError
     */
    public static createIssues(
        requestBody?: IssuesUpdateBean,
    ): CancelablePromise<IssuesCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid field values, and so forth).`,
            },
        });
    }
    /**
     * Get metadata for project issue types
     * Returns the metadata for issue types used for creating issues. Data will not be returned if the user does not have permission to create issues in that project.
     * @param projectIdOrKey Project id or key
     * @param maxResults How many results on the page should be included
     * @param startAt The page offset
     * @returns CreateMetaIssueTypeBean Returns the metadata for issue types used for creating issues.
     * @throws ApiError
     */
    public static getCreateIssueMetaProjectIssueTypes(
        projectIdOrKey: string,
        maxResults?: string,
        startAt?: string,
    ): CancelablePromise<CreateMetaIssueTypeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/createmeta/{projectIdOrKey}/issuetypes',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            query: {
                'maxResults': maxResults,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the user does not have permission to view the requested project or project doesn't exist.`,
            },
        });
    }
    /**
     * Get metadata for issue types used for creating issues
     * Returns the metadata for issue types used for creating issues. Data will not be returned if the user does not have permission to create issues in that project.
     * @param issueTypeId Issue type id
     * @param projectIdOrKey Project id or key
     * @param maxResults How many results on the page should be included
     * @param startAt The page offset
     * @returns FieldMetaBean Returns the metadata for issue types used for creating issues.
     * @throws ApiError
     */
    public static getCreateIssueMetaFields(
        issueTypeId: string,
        projectIdOrKey: string,
        maxResults?: string,
        startAt?: string,
    ): CancelablePromise<FieldMetaBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/createmeta/{projectIdOrKey}/issuetypes/{issueTypeId}',
            path: {
                'issueTypeId': issueTypeId,
                'projectIdOrKey': projectIdOrKey,
            },
            query: {
                'maxResults': maxResults,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if the user does not have permission to view the requested project or project doesn't exist.`,
            },
        });
    }
    /**
     * Get suggested issues for auto-completion
     * Get issue picker resource
     * @param currentProjectId the id of the project in context of which the request is executed
     * @param query the query
     * @param currentIssueKey the key of the issue in context of which the request is executed
     * @param showSubTasks if set to false, subtasks will not be included in the list
     * @param currentJql the JQL in context of which the request is executed
     * @param showSubTaskParent if set to false and request is executed in context of a subtask, the parent issue will not be included in the auto-completion result, even if it matches the query
     * @returns IssuePickerResult Returns a response containing issue picker resource.
     * @throws ApiError
     */
    public static getIssuePickerResource(
        currentProjectId?: string,
        query?: string,
        currentIssueKey?: string,
        showSubTasks?: string,
        currentJql?: string,
        showSubTaskParent?: string,
    ): CancelablePromise<IssuePickerResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/picker',
            query: {
                'currentProjectId': currentProjectId,
                'query': query,
                'currentIssueKey': currentIssueKey,
                'showSubTasks': showSubTasks,
                'currentJQL': currentJql,
                'showSubTaskParent': showSubTaskParent,
            },
        });
    }
    /**
     * Get issue for key
     * Returns a full representation of the issue for the given issue key.
     * An issue JSON consists of the issue key, a collection of fields,
     * a link to the workflow transition sub-resource, and (optionally) the HTML rendered values of any fields that support it
     * (e.g. if wiki syntax is enabled for the description or comments).
     * The fields param (which can be specified multiple times) gives a comma-separated list of fields
     * to include in the response. This can be used to retrieve a subset of fields.
     * A particular field can be excluded by prefixing it with a minus.
     * By default, all (*all) fields are returned in this get-issue resource. Note: the default is different
     * when doing a jql search -- the default there is just navigable fields (*navigable).
     * - *all - include all fields
     * - *navigable - include just navigable fields
     * - summary,comment - include just the summary and comments
     * - -comment - include everything except comments (the default is *all for get-issue)
     * - *all,-comment - include everything except comments
     *
     * The {@code properties} param is similar to {@code fields} and specifies a comma-separated list of issue
     * properties to include. Unlike {@code fields}, properties are not included by default. To include them all
     * send {@code ?properties=*all}. You can also include only specified properties or exclude some properties
     * with a minus (-) sign.
     *
     * - {@code *all} - include all properties
     * - {@code *all, -prop1} - include all properties except {@code prop1}
     * - {@code prop1, prop1} - include {@code prop1} and {@code prop2} properties
     *
     * Jira will attempt to identify the issue by the issueIdOrKey path parameter. This can be an issue id,
     * or an issue key. If the issue cannot be found via an exact match, Jira will also look for the issue in a case-insensitive way,
     * by looking to see if the issue was moved. In either of these cases, the request will proceed as normal (a 302 or other redirect
     * will not be returned). The issue key contained in the response will indicate the current value of issue's key.
     *
     * The expand param is used to include, hidden by default, parts of response. This can be used to include:
     *
     * - renderedFields - field values in HTML format
     * - names - display name of each field
     * - schema - schema for each field which describes a type of the field
     * - transitions - all possible transitions for the given issue
     * - operations - all possibles operations which may be applied on issue
     * - editmeta - information about how each field may be edited. It contains field's schema as well.
     * - changelog - history of all changes of the given issue
     * - versionedRepresentations -
     * REST representations of all fields. Some field may contain more recent versions. RESET representations are numbered.
     * The greatest number always represents the most recent version. It is recommended that the most recent version is used.
     * version for these fields which provide a more recent REST representation.
     * After including versionedRepresentations "fields" field become hidden.
     * @param issueIdOrKey Issue id or key
     * @param expand The expand param is used to include, hidden by default, parts of response. This can be used to include: renderedFields, names, schema, transitions, operations, editmeta, changelog, versionedRepresentations.
     * @param fields The list of fields to return for the issue. By default, all fields are returned.
     * @param updateHistory The updateHistory param adds the issues retrieved by this method to the current user's issue history
     * @param properties The list of properties to return for the issue. By default no properties are returned.
     * @returns IssueBean Returns a full representation of a Jira issue in JSON format.
     * @throws ApiError
     */
    public static getIssue1(
        issueIdOrKey: string,
        expand?: string,
        fields?: string,
        updateHistory?: string,
        properties?: string,
    ): CancelablePromise<IssueBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'expand': expand,
                'fields': fields,
                'updateHistory': updateHistory,
                'properties': properties,
            },
            errors: {
                404: `Returned if the requested issue is not found, or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Edit an issue from a JSON representation
     * Edits an issue from a JSON representation. The issue can either be updated by setting explicit the field value(s) or by using an operation to change the field value.
     * @param issueIdOrKey Issue id or key
     * @param notifyUsers Send the email with notification that the issue was updated to users that watch it. Admin or project admin permissions are required to disable the notification.
     * @param requestBody Issue update bean
     * @returns void
     * @throws ApiError
     */
    public static editIssue(
        issueIdOrKey: string,
        notifyUsers?: string,
        requestBody?: IssueUpdateBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'notifyUsers': notifyUsers,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the requested issue update failed.`,
                403: `Returned if the user doesn't have permissions to disable users notification.`,
            },
        });
    }
    /**
     * Delete an issue
     * Deletes an issue. If the issue has subtasks you must set the parameter deleteSubtasks=true to delete the issue. You cannot delete an issue without its subtasks also being deleted.
     * @param issueIdOrKey Issue id or key
     * @param deleteSubtasks A String of true or false indicating that any subtasks should also be deleted. If the issue has no subtasks this parameter is ignored. If the issue has subtasks and this parameter is missing or false, then the issue will not be deleted and an error will be returned.
     * @returns void
     * @throws ApiError
     */
    public static deleteIssue(
        issueIdOrKey: string,
        deleteSubtasks?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'deleteSubtasks': deleteSubtasks,
            },
            errors: {
                400: `Returned if an error occurs.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to delete the issue.`,
                404: `Returned if the issue does not exist.`,
            },
        });
    }
    /**
     * Archive an issue
     * Archives an issue.
     * @param issueIdOrKey Issue id or key
     * @param notifyUsers Send the email with notification that the issue was updated to users that watch it. Admin or project admin permissions are required to disable the notification.
     * @returns void
     * @throws ApiError
     */
    public static archiveIssue(
        issueIdOrKey: string,
        notifyUsers?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/archive',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'notifyUsers': notifyUsers,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the currently authenticated user does not have permission to archive the issue or doesn't have DC license or issue is already archived.`,
                404: `Returned if the issue does not exist.`,
            },
        });
    }
    /**
     * Assign an issue to a user
     * Assign an issue to a user.
     * @param issueIdOrKey Issue id or key
     * @param requestBody UserBean containing the username
     * @returns void
     * @throws ApiError
     */
    public static assign(
        issueIdOrKey: string,
        requestBody?: UserBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/assignee',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there is a problem with the received user representation.`,
                401: `Returned if the calling user does not have permission to assign the issue.`,
                404: `Returned if either the issue or the user does not exist.`,
            },
        });
    }
    /**
     * Add one or more attachments to an issue
     * Add one or more attachments to an issue.
     * This resource expects a multipart post. The media-type multipart/form-data is defined in RFC 1867. Most client libraries have classes that make dealing with multipart posts simple. For instance, in Java the Apache HTTP Components library provides a MultiPartEntity that makes it simple to submit a multipart POST.
     * In order to protect against XSRF attacks, because this method accepts multipart/form-data, it has XSRF protection
     * on it. This means you must submit a header of X-Atlassian-Token: no-check with the request, otherwise it will be blocked.
     * The name of the multipart/form-data parameter that contains attachments must be file.
     * A simple example to upload a file called "myfile.txt" to issue TEST-123:
     * curl -D- -u admin:admin -X POST -H "X-Atlassian-Token: no-check" -F "file=@myfile.txt" http://myhost/rest/api/2/issue/TEST-123/attachments
     * @param issueIdOrKey Issue id or key
     * @param formData Attachments to be added
     * @returns AttachmentJsonBean Returns a JSON representation of the attachments added.
     * @throws ApiError
     */
    public static addAttachment(
        issueIdOrKey: string,
        formData?: Blob,
    ): CancelablePromise<AttachmentJsonBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/attachments',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Returned if attachments is disabled or if you don't have permission to add attachments to this issue.`,
                404: `Returned if the requested issue is not found, the user does not have permission to view it, or if the attachments exceeds the maximum configured attachment size.`,
            },
        });
    }
    /**
     * Get comments for an issue
     * Returns all comments for an issue. Results can be ordered by the 'created' field which means the date a comment was added.
     * @param issueIdOrKey Issue id or key
     * @param expand Optional flags: renderedBody (provides body rendered in HTML)
     * @param maxResults How many results on the page should be included. Defaults to 50.
     * @param orderBy Ordering of the results
     * @param startAt The page offset, if not specified then defaults to 0
     * @returns CommentsWithPaginationJsonBean Returns a collection of comments associated with the issue, with count and pagination information.
     * @throws ApiError
     */
    public static getComments(
        issueIdOrKey: string,
        expand?: string,
        maxResults?: string,
        orderBy?: string,
        startAt?: string,
    ): CancelablePromise<CommentsWithPaginationJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/comment',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'expand': expand,
                'maxResults': maxResults,
                'orderBy': orderBy,
                'startAt': startAt,
            },
            errors: {
                404: `Returned if the issue with the given id/key does not exist or if the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Add a comment
     * Adds a new comment to an issue.
     * @param issueIdOrKey Issue id or key
     * @param expand Optional flags: renderedBody (provides body rendered in HTML)
     * @param requestBody Comment create request
     * @returns CommentJsonBean Returned if add was successful.
     * @throws ApiError
     */
    public static addComment(
        issueIdOrKey: string,
        expand?: string,
        requestBody?: CommentJsonBean,
    ): CancelablePromise<CommentJsonBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/comment',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
            },
        });
    }
    /**
     * Get a comment by id
     * Returns a single comment.
     * @param issueIdOrKey Issue id or key
     * @param id Comment id
     * @param expand Optional flags: renderedBody (provides body rendered in HTML)
     * @returns CommentJsonBean Returns a full representation of a Jira comment in JSON format.
     * @throws ApiError
     */
    public static getComment(
        issueIdOrKey: string,
        id: string,
        expand?: string,
    ): CancelablePromise<CommentJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/comment/{id}',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if the requested comment is not found, or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Update a comment
     * Updates an existing comment using its JSON representation.
     * @param issueIdOrKey Issue id or key
     * @param id Comment id
     * @param expand Optional flags: renderedBody (provides body rendered in HTML)
     * @param requestBody Comment update request
     * @returns CommentJsonBean Returned if update was successful.
     * @throws ApiError
     */
    public static updateComment(
        issueIdOrKey: string,
        id: string,
        expand?: string,
        requestBody?: CommentJsonBean,
    ): CancelablePromise<CommentJsonBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/comment/{id}',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
            },
        });
    }
    /**
     * Delete a comment
     * Deletes an existing comment.
     * @param issueIdOrKey Issue id or key
     * @param id Comment id
     * @returns void
     * @throws ApiError
     */
    public static deleteComment(
        issueIdOrKey: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/comment/{id}',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
            },
        });
    }
    /**
     * Pin a comment
     * Pins a comment to the top of the comment list.
     * @param issueIdOrKey Issue id or key
     * @param id Comment id
     * @param requestBody 'true' must be included as raw data
     * @returns void
     * @throws ApiError
     */
    public static setPinComment(
        issueIdOrKey: string,
        id: string,
        requestBody: boolean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/comment/{id}/pin',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Returned if the comment with the given id does not exist or if the currently authenticated user does not have permission to pin it.`,
            },
        });
    }
    /**
     * Get metadata for issue types used for editing issues
     * Returns the meta data for editing an issue. The fields in the editmeta correspond to the fields in the edit screen for the issue. Fields not in the screen will not be in the editmeta.
     * @param issueIdOrKey Issue id or key
     * @returns EditMetaBean Returns a response containing a Map of FieldBeans for fields editable by the current user.
     * @throws ApiError
     */
    public static getEditIssueMeta(
        issueIdOrKey: string,
    ): CancelablePromise<EditMetaBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/editmeta',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the requested issue is not found or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Send notification to recipients
     * Sends a notification (email) to the list or recipients defined in the request.
     * @param issueIdOrKey Issue id or key
     * @param requestBody Notification request
     * @returns void
     * @throws ApiError
     */
    public static notify(
        issueIdOrKey: string,
        requestBody?: NotificationJsonBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/notify',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
                403: `Returned is outgoing emails are disabled OR no SMTP server is defined.`,
            },
        });
    }
    /**
     * Get pinned comments for an issue
     * Returns all pinned to the issue comments.
     * @param issueIdOrKey Issue id or key
     * @returns PinnedCommentJsonBean Returns a collection of pinned comments associated with the issue.
     * @throws ApiError
     */
    public static getPinnedComments(
        issueIdOrKey: string,
    ): CancelablePromise<PinnedCommentJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/pinned-comments',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the issue with the given id/key does not exist or if the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get keys of all properties for an issue
     * Returns the keys of all properties for the issue identified by the key or by the id.
     * @param issueIdOrKey Issue id or key
     * @returns EntityPropertiesKeysBean Returns a response containing EntityPropertiesKeysBean.
     * @throws ApiError
     */
    public static getPropertiesKeys2(
        issueIdOrKey: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/properties',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                400: `Returned if the issue key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to view the issue.`,
                404: `Returned if the issue with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Get the value of a specific property from an issue
     * Returns the value of the property with a given key from the issue identified by the key or by the id.
     * @param propertyKey The key of the property to return
     * @param issueIdOrKey Issue id or key
     * @returns EntityPropertyBean Returned if the issue property was found.
     * @throws ApiError
     */
    public static getProperty3(
        propertyKey: string,
        issueIdOrKey: string,
    ): CancelablePromise<EntityPropertyBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                400: `Returned if the issue key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to view the issue.`,
                404: `Returned if the issue with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Update the value of a specific issue's property
     * Sets the value of the specified issue's property.
     * @param propertyKey The key of the issue's property
     * @param issueIdOrKey Issue id or key
     * @param requestBody The value of the issue's property
     * @returns any Returned if the issue property is successfully updated.
     * @throws ApiError
     */
    public static setProperty2(
        propertyKey: string,
        issueIdOrKey: string,
        requestBody: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the issue key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the issue.`,
                404: `Returned if the issue with given key or id does not exist.`,
            },
        });
    }
    /**
     * Delete a property from an issue
     * Removes the property from the issue identified by the key or by the id.
     * @param propertyKey The key of the property to remove
     * @param issueIdOrKey Issue id or key
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty3(
        propertyKey: string,
        issueIdOrKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                400: `Returned if the issue key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the issue.`,
                404: `Returned if the issue with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Get remote issue links for an issue
     * Get remote issue links for an issue.
     * @param issueIdOrKey Issue id or key
     * @param globalId Global id of the remote issue link
     * @returns RemoteIssueLinkBean Returns a response containing remote issue links for the issue.
     * @throws ApiError
     */
    public static getRemoteIssueLinks(
        issueIdOrKey: string,
        globalId?: string,
    ): CancelablePromise<RemoteIssueLinkBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/remotelink',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'globalId': globalId,
            },
            errors: {
                400: `Returned if the linkId is not a valid number, or if the remote issue link with the given id does not belong to the given issue.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to view the remote issue link, or if issue linking is disabled.`,
                404: `Returned if the issue or remote issue link do not exist.`,
            },
        });
    }
    /**
     * Create or update remote issue link
     * Creates or updates a remote issue link from a JSON representation. If a globalId is provided and a remote issue link exists with that globalId, the remote issue link is updated. Otherwise, the remote issue link is created.
     * @param issueIdOrKey Issue id or key
     * @param requestBody Remote issue link create or update request
     * @returns RemoteIssueLinkBean Returns a link to the created/updated remote issue link.
     * @throws ApiError
     */
    public static createOrUpdateRemoteIssueLink(
        issueIdOrKey: string,
        requestBody?: RemoteIssueLinkCreateOrUpdateRequest,
    ): CancelablePromise<RemoteIssueLinkBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/remotelink',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to create/update the remote issue link, or if issue linking is disabled.`,
            },
        });
    }
    /**
     * Delete remote issue link
     * Delete the remote issue link with the given global id on the issue.
     * @param issueIdOrKey Issue id or key
     * @param globalId Global id of the remote issue link
     * @returns void
     * @throws ApiError
     */
    public static deleteRemoteIssueLinkByGlobalId(
        issueIdOrKey: string,
        globalId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/remotelink',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'globalId': globalId,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to delete the remote issue link, or if issue linking is disabled.`,
                404: `Returned if the issue or remote issue link do not exist.`,
            },
        });
    }
    /**
     * Get a remote issue link by its id
     * Get a remote issue link by its id.
     * @param linkId Id of the remote issue link
     * @param issueIdOrKey Issue id or key
     * @returns RemoteIssueLinkBean Returns a response containing a remote issue link.
     * @throws ApiError
     */
    public static getRemoteIssueLinkById(
        linkId: string,
        issueIdOrKey: string,
    ): CancelablePromise<RemoteIssueLinkBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/remotelink/{linkId}',
            path: {
                'linkId': linkId,
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                400: `Returned if the linkId is not a valid number, or if the remote issue link with the given id does not belong to the given issue.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to view the remote issue link, or if issue linking is disabled.`,
                404: `Returned if the issue or remote issue link do not exist.`,
            },
        });
    }
    /**
     * Update remote issue link
     * Updates a remote issue link from a JSON representation. Any fields not provided are set to null.
     * @param linkId Id of the remote issue link
     * @param issueIdOrKey Issue id or key
     * @param requestBody Remote issue link create or update request
     * @returns void
     * @throws ApiError
     */
    public static updateRemoteIssueLink(
        linkId: string,
        issueIdOrKey: string,
        requestBody?: RemoteIssueLinkCreateOrUpdateRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/remotelink/{linkId}',
            path: {
                'linkId': linkId,
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to update the remote issue link, or if issue linking is disabled.`,
            },
        });
    }
    /**
     * Delete remote issue link by id
     * Delete the remote issue link with the given id on the issue.
     * @param linkId Id of the remote issue link
     * @param issueIdOrKey Issue id or key
     * @returns void
     * @throws ApiError
     */
    public static deleteRemoteIssueLinkById(
        linkId: string,
        issueIdOrKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/remotelink/{linkId}',
            path: {
                'linkId': linkId,
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to delete the remote issue link, or if issue linking is disabled.`,
                404: `Returned if the issue or remote issue link do not exist.`,
            },
        });
    }
    /**
     * Restore an archived issue
     * Restores an archived issue.
     * @param issueIdOrKey Issue id or key
     * @param notifyUsers Send the email with notification that the issue was updated to users that watch it. Admin or project admin permissions are required to disable the notification.
     * @returns void
     * @throws ApiError
     */
    public static restoreIssue(
        issueIdOrKey: string,
        notifyUsers?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/restore',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'notifyUsers': notifyUsers,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the currently authenticated user does not have permission to restore the issue or doesn't have DC license or issue is not archived.`,
                404: `Returned if the issue does not exist.`,
            },
        });
    }
    /**
     * Get an issue's subtask list
     * Returns an issue's subtask list
     * @param issueIdOrKey The parent issue's key or id
     * @returns IssueRefJsonBean Returned if the request was successful.
     * @throws ApiError
     */
    public static getSubTasks(
        issueIdOrKey: string,
    ): CancelablePromise<IssueRefJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/subtask',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                403: `Returned if the user is not allowed to edit the issue`,
                404: `Returned if the issue doesn't exist`,
            },
        });
    }
    /**
     * Check if a subtask can be moved
     * Checks if a subtask can be moved
     * @param issueIdOrKey The parent issue's key or id
     * @returns boolean Returned if the request was successful.
     * @throws ApiError
     */
    public static canMoveSubTask(
        issueIdOrKey: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/subtask/move',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
        });
    }
    /**
     * Reorder an issue's subtasks
     * Reorders an issue's subtasks by moving the subtask at index 'from' to index 'to'.
     * @param issueIdOrKey The parent issue's key or id
     * @param requestBody The description of previous and current position of subtask in the sequence.
     * @returns void
     * @throws ApiError
     */
    public static moveSubTasks(
        issueIdOrKey: string,
        requestBody: IssueSubTaskMovePositionBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/subtask/move',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the from or to parameters are out of bounds`,
                403: `Returned if the user is not allowed to edit the issue`,
                404: `Returned if the parent issue doesn't exist`,
            },
        });
    }
    /**
     * Get list of transitions possible for an issue
     * Get a list of the transitions possible for this issue by the current user, along with fields that are required and their types.
     * Fields will only be returned if `expand=transitions.fields`.
     * The fields in the metadata correspond to the fields in the transition screen for that transition.
     * Fields not in the screen will not be in the metadata.
     * @param issueIdOrKey Issue id or key
     * @param transitionId Transition id
     * @returns TransitionsMetaBean Returns a response containing a Map of TransitionFieldBeans for each transition possible by the current user.
     * @throws ApiError
     */
    public static getTransitions(
        issueIdOrKey: string,
        transitionId?: string,
    ): CancelablePromise<TransitionsMetaBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/transitions',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'transitionId': transitionId,
            },
            errors: {
                404: `Returned if the issue does not exist or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Perform a transition on an issue
     * Perform a transition on an issue.
     * When performing the transition you can update or set other issue fields.
     * The fields that can be set on transition, in either the fields parameter or the update parameter can be determined using the /rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields resource.
     * If a field is not configured to appear on the transition screen, then it will not be in the transition metadata, and a field validation error will occur if it is submitted.
     * The updateHistory param adds the issues retrieved by this method to the current user's issue history, if set to true (by default, the issue history does not include issues retrieved via the REST API).
     * You can view the issue history in the Jira application, via the Issues dropdown or by using the lastViewed JQL field in an issue search.
     * @param issueIdOrKey Issue id or key
     * @param requestBody Issue update bean
     * @returns void
     * @throws ApiError
     */
    public static doTransition(
        issueIdOrKey: string,
        requestBody?: IssueUpdateBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/transitions',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the transition is not valid for the issue, or the user does not have permission to transition the issue.`,
                404: `Returned if the issue does not exist.`,
                500: `If transition ID is incorrect.`,
            },
        });
    }
    /**
     * Get votes for issue
     * A REST sub-resource representing the voters on the issue.
     * @param issueIdOrKey Issue id or key
     * @returns VoteBean Returns a response containing information about voting on the current issue
     * @throws ApiError
     */
    public static getVotes(
        issueIdOrKey: string,
    ): CancelablePromise<VoteBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/votes',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the user cannot view the issue in question or voting is disabled.`,
            },
        });
    }
    /**
     * Add vote to issue
     * Adds voter (currently logged user) to particular ticket. You need to be logged in to use this method.
     * @param issueIdOrKey Issue id.
     * @returns any Returns the vote count for particular ticket.
     * @throws ApiError
     */
    public static addVote(
        issueIdOrKey: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/votes',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the user cannot vote for any reason. (The user is the reporter, the user does not have permission to vote, voting is disabled in the instance, the issue does not exist, etc.)`,
            },
        });
    }
    /**
     * Remove vote from issue
     * Remove your vote from an issue.
     * @param issueIdOrKey Issue id or key
     * @returns void
     * @throws ApiError
     */
    public static removeVote(
        issueIdOrKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/votes',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the user cannot remove a vote for any reason. (The user did not vote on the issue, the user is the reporter, voting is disabled, the issue does not exist, etc.)`,
            },
        });
    }
    /**
     * Get list of watchers of issue
     * Returns the list of watchers for the issue with the given key.
     * @param issueIdOrKey Issue id or key
     * @returns WatchersBean Returns the list of watchers for an issue.
     * @throws ApiError
     */
    public static getIssueWatchers(
        issueIdOrKey: string,
    ): CancelablePromise<WatchersBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/watchers',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the requested issue is not found, or the user does not have permission to view it.`,
            },
        });
    }
    /**
     * Add a user as watcher
     * Adds a user to an issue's watcher list.
     * @param issueIdOrKey Issue id or key
     * @param userName The name of the user to add to the watcher list. If no name is specified, the current user is added.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static addWatcher1(
        issueIdOrKey: string,
        userName?: string,
        requestBody?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/watchers',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'userName': userName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if a user name query parameter is not supplied.`,
                401: `Returned if the calling user does not have permission to add the watcher to the issue's list of watchers.`,
                404: `Returned if either the issue does not exist.`,
            },
        });
    }
    /**
     * Delete watcher from issue
     * Removes a user from an issue's watcher list.
     * @param issueIdOrKey Issue id or key
     * @param userName The name of the user to remove from the watcher list.
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static removeWatcher1(
        issueIdOrKey: string,
        userName?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/watchers',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'userName': userName,
                'username': username,
            },
            errors: {
                400: `Returned if a user name query parameter is not supplied.`,
                401: `Returned if the calling user does not have permission to remove the watcher from the issue's list of watchers.`,
                404: `Returned if either the issue does not exist.`,
            },
        });
    }
    /**
     * Get worklogs for an issue
     * Returns all work logs for an issue. Work logs won't be returned if the Log work field is hidden for the project.
     * @param issueIdOrKey Issue id or key
     * @returns WorklogWithPaginationBean Returns a collection of worklogs associated with the issue, with count and pagination information.
     * @throws ApiError
     */
    public static getIssueWorklog(
        issueIdOrKey: string,
    ): CancelablePromise<WorklogWithPaginationBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/worklog',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            errors: {
                404: `Returned if the issue with the given id/key does not exist or if the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Add a worklog entry
     * Adds a new worklog entry to an issue.
     * @param issueIdOrKey a string containing the issue id or key the worklog will be added to
     * @param newEstimate Required when 'new' is selected for adjustEstimate. e.g. "2d"
     * @param adjustEstimate Allows you to provide specific instructions to update the remaining time estimate of the issue. Valid values are: new, leave, manual, auto
     * @param reduceBy Required when 'manual' is selected for adjustEstimate. e.g. "2d"
     * @param requestBody Worklog create request
     * @returns worklog Returned if add was successful.
     * @throws ApiError
     */
    public static addWorklog(
        issueIdOrKey: string,
        newEstimate?: string,
        adjustEstimate?: string,
        reduceBy?: string,
        requestBody?: worklog,
    ): CancelablePromise<worklog> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issue/{issueIdOrKey}/worklog',
            path: {
                'issueIdOrKey': issueIdOrKey,
            },
            query: {
                'newEstimate': newEstimate,
                'adjustEstimate': adjustEstimate,
                'reduceBy': reduceBy,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
                403: `Returned if the calling user does not have permission to add the worklog.`,
            },
        });
    }
    /**
     * Get a worklog by id
     * Returns a specific worklog. The work log won't be returned if the Log work field is hidden for the project.
     * @param issueIdOrKey Issue id or key
     * @param id Worklog id
     * @returns worklog Returns a response containing a worklog.
     * @throws ApiError
     */
    public static getWorklog(
        issueIdOrKey: string,
        id: string,
    ): CancelablePromise<worklog> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issue/{issueIdOrKey}/worklog/{id}',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            errors: {
                404: `Returned if the work log with the given id does not exist or if the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Update a worklog entry
     * Updates an existing worklog entry. Note that:
     * - Fields possible for editing are: comment, visibility, started, timeSpent and timeSpentSeconds.
     * - Either timeSpent or timeSpentSeconds can be set.
     * - Fields which are not set will not be updated.
     * - For a request to be valid, it has to have at least one field change.
     * @param issueIdOrKey a string containing the issue id or key the worklog belongs to
     * @param id id of the worklog to be updated
     * @param newEstimate required when 'new' is selected for adjustEstimate
     * @param adjustEstimate allows you to provide specific instructions to update the remaining time estimate of the issue. Valid values are: new, leave, auto
     * @param requestBody Worklog update request
     * @returns worklog Returned if update was successful.
     * @throws ApiError
     */
    public static updateWorklog(
        issueIdOrKey: string,
        id: string,
        newEstimate?: string,
        adjustEstimate?: string,
        requestBody?: worklog,
    ): CancelablePromise<worklog> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issue/{issueIdOrKey}/worklog/{id}',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            query: {
                'newEstimate': newEstimate,
                'adjustEstimate': adjustEstimate,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
                403: `Returned if the calling user does not have permission to update the worklog.`,
            },
        });
    }
    /**
     * Delete a worklog entry
     * Deletes an existing worklog entry.
     * @param issueIdOrKey a string containing the issue id or key the worklog belongs to
     * @param id Id of the worklog to be deleted
     * @param newEstimate Required when 'new' is selected for adjustEstimate. e.g. "2d"
     * @param adjustEstimate Allows you to provide specific instructions to update the remaining time estimate of the issue. Valid values are: new, leave, manual, auto
     * @param increaseBy Required when 'manual' is selected for adjustEstimate. e.g. "2d"
     * @returns void
     * @throws ApiError
     */
    public static deleteWorklog(
        issueIdOrKey: string,
        id: string,
        newEstimate?: string,
        adjustEstimate?: string,
        increaseBy?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issue/{issueIdOrKey}/worklog/{id}',
            path: {
                'issueIdOrKey': issueIdOrKey,
                'id': id,
            },
            query: {
                'newEstimate': newEstimate,
                'adjustEstimate': adjustEstimate,
                'increaseBy': increaseBy,
            },
            errors: {
                400: `Returned if the input is invalid (e.g. missing required fields, invalid values, and so forth).`,
                403: `Returned if the calling user does not have permission to delete the worklog.`,
            },
        });
    }
}
