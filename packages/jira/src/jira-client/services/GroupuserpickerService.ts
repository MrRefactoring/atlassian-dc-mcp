/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UsersAndGroupsBean } from '../models/UsersAndGroupsBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class GroupuserpickerService {
    /**
     * Get users and groups matching query with highlighting
     * Returns a list of users and groups matching query with highlighting
     * @param issueTypeId The list of issue type ids to further restrict the search
     * @param maxResults The maximum number of users to return
     * @param query A string used to search username, Name or e-mail address
     * @param showAvatar Show avatar
     * @param projectId The list of project ids to further restrict the search
     * @param fieldId The custom field id
     * @returns UsersAndGroupsBean Returns a list of users and groups matching query with highlighting
     * @throws ApiError
     */
    public static findUsersAndGroups(
        issueTypeId?: string,
        maxResults?: string,
        query?: string,
        showAvatar?: string,
        projectId?: string,
        fieldId?: string,
    ): CancelablePromise<UsersAndGroupsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/groupuserpicker',
            query: {
                'issueTypeId': issueTypeId,
                'maxResults': maxResults,
                'query': query,
                'showAvatar': showAvatar,
                'projectId': projectId,
                'fieldId': fieldId,
            },
            errors: {
                403: `Returned if the user does not have permission to view users and groups`,
            },
        });
    }
}
