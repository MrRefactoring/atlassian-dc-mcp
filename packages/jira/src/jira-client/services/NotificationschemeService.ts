/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationSchemeBean } from '../models/NotificationSchemeBean.js';
import type { PageBean } from '../models/PageBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class NotificationschemeService {
    /**
     * Get paginated notification schemes
     * Returns a paginated list of notification schemes. In order to access notification scheme, the calling user is
     * required to have permissions to administer at least one project associated with the requested notification scheme. Each scheme contains
     * a list of events and recipient configured to receive notifications for these events. Consumer should allow events without recipients to appear in response.
     * The list is ordered by the scheme's name.
     * Follow the documentation of /notificationscheme/{id} resource for all details about returned value.
     *
     * @param expand
     * @param maxResults
     * @param startAt
     * @returns PageBean Paginated list of notification schemes to which the user has permissions.
     * @throws ApiError
     */
    public static getNotificationSchemes(
        expand?: string,
        maxResults?: number,
        startAt?: number,
    ): CancelablePromise<PageBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/notificationscheme',
            query: {
                'expand': expand,
                'maxResults': maxResults,
                'startAt': startAt,
            },
        });
    }
    /**
     * Get full notification scheme details
     * Returns a full representation of the notification scheme for the given id. This resource will return a
     * notification scheme containing a list of events and recipient configured to receive notifications for these events. Consumer
     * should allow events without recipients to appear in response. User accessing
     * the data is required to have permissions to administer at least one project associated with the requested notification scheme.
     * Notification recipients can be:
     * - current assignee - the value of the notificationType is CurrentAssignee
     * - issue reporter - the value of the notificationType is Reporter
     * - current user - the value of the notificationType is CurrentUser
     * - project lead - the value of the notificationType is ProjectLead
     * - component lead - the value of the notificationType is ComponentLead
     * - all watchers - the value of the notification type is AllWatchers
     * <li>configured user - the value of the notification type is User. Parameter will contain key of the user. Information about the user will be provided
     * if <b>user</b> expand parameter is used.
     * - configured group - the value of the notification type is Group. Parameter will contain name of the group. Information about the group will be provided
     * if <b>group</b> expand parameter is used.
     * - configured email address - the value of the notification type is EmailAddress, additionally information about the email will be provided.
     * - users or users in groups in the configured custom fields - the value of the notification type is UserCustomField or GroupCustomField. Parameter
     * will contain id of the custom field. Information about the field will be provided if <b>field</b> expand parameter is used.
     * - configured project role - the value of the notification type is ProjectRole. Parameter will contain project role id. Information about the project role
     * will be provided if <b>projectRole</b> expand parameter is used.
     * Please see the example for reference.
     * The events can be Jira system events or events configured by administrator. In case of the system events, data about theirs
     * ids, names and descriptions is provided. In case of custom events, the template event is included as well.
     * @param id
     * @param expand
     * @returns NotificationSchemeBean Returns a full representation of the notification scheme with given id
     * @throws ApiError
     */
    public static getNotificationScheme(
        id: number,
        expand?: string,
    ): CancelablePromise<NotificationSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/notificationscheme/{id}',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `The notification scheme does not exist, or is not visible to the calling user`,
            },
        });
    }
}
