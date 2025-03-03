/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComponentBean } from '../models/ComponentBean.js';
import type { ComponentIssueCountsBean } from '../models/ComponentIssueCountsBean.js';
import type { PageBean } from '../models/PageBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ComponentService {
    /**
     * Create component
     * Create a component via POST.
     * @param requestBody the request containing value of the component's property. The value has to be a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns ComponentBean Returned if the component is created successfully.
     * @throws ApiError
     */
    public static createComponent(
        requestBody?: ComponentBean,
    ): CancelablePromise<ComponentBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/component',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the caller is not logged in and does not have permission to create components in the project.`,
                403: `Returned if the caller is authenticated and does not have permission to create components in the project.`,
                404: `Returned if the project does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get paginated components
     * Returns paginated list of filtered active components
     * @param maxResults the maximum number of components to return
     * @param query the string that components names will be matched with
     * @param projectIds the set of project ids to filter components
     * @param startAt the index of the first components to return
     * @returns PageBean Returns paginated list of components
     * @throws ApiError
     */
    public static getPaginatedComponents(
        maxResults: string = '100',
        query?: string,
        projectIds?: string,
        startAt: string = '0',
    ): CancelablePromise<PageBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/component/page',
            query: {
                'maxResults': maxResults,
                'query': query,
                'projectIds': projectIds,
                'startAt': startAt,
            },
        });
    }
    /**
     * Get project component
     * Returns a project component.
     * @param id a String containing the component key
     * @returns ComponentBean Returns a full JSON representation of a project component.
     * @throws ApiError
     */
    public static getComponent(
        id: string,
    ): CancelablePromise<ComponentBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/component/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if there is no component with the given key, or if the calling user does not have permission to view the component.`,
            },
        });
    }
    /**
     * Update a component
     * Modify a component via PUT. Any fields present in the PUT will override existing values. As a convenience, if a field is not present, it is silently ignored.
     * @param id The component to delete.
     * @param requestBody the request containing value of the component's property. The value has to be a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns ComponentBean Returned if the component is successfully updated.
     * @throws ApiError
     */
    public static updateComponent(
        id: string,
        requestBody?: ComponentBean,
    ): CancelablePromise<ComponentBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/component/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Returned if the currently authenticated user does not have permission to edit the component.`,
                404: `Returned if the component does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete a project component
     * Delete a project component.
     * @param id The component to delete.
     * @param moveIssuesTo The new component applied to issues whose 'id' component will be deleted. If this value is null, then the 'id' component is simply removed from the related isues.
     * @returns any Returned if the component is successfully deleted.
     * @throws ApiError
     */
    public static delete(
        id: string,
        moveIssuesTo?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/component/{id}',
            path: {
                'id': id,
            },
            query: {
                'moveIssuesTo': moveIssuesTo,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to delete the component.`,
                404: `Returned if the component does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get component related issues
     * Returns counts of issues related to this component.
     * @param id a String containing the component id
     * @returns ComponentIssueCountsBean Returns counts of issues related to this component.
     * @throws ApiError
     */
    public static getComponentRelatedIssues(
        id: string,
    ): CancelablePromise<ComponentIssueCountsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/component/{id}/relatedIssueCounts',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the component does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
}
