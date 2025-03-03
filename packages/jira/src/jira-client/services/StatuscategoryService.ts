/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusCategoryJsonBean } from '../models/StatusCategoryJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class StatuscategoryService {
    /**
     * Get all status categories
     * Returns a list of all status categories
     * @param request a Request
     * @param uriInfo a UriInfo
     * @returns StatusCategoryJsonBean Returns a list of all Jira issue status categories in JSON format, that are visible to the user.
     * @throws ApiError
     */
    public static getStatusCategories(
        request?: string,
        uriInfo?: string,
    ): CancelablePromise<StatusCategoryJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/statuscategory',
            query: {
                'request': request,
                'uriInfo': uriInfo,
            },
            errors: {
                404: `Returned if no status categories are found, or the user does not have permission to view them.`,
            },
        });
    }
    /**
     * Get status category by ID or key
     * Returns a full representation of the StatusCategory having the given id or key
     * @param idOrKey
     * @returns StatusCategoryJsonBean Returns a full representation of a Jira issue status category in JSON format.
     * @throws ApiError
     */
    public static getStatusCategory(
        idOrKey: string,
    ): CancelablePromise<StatusCategoryJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/statuscategory/{idOrKey}',
            path: {
                'idOrKey': idOrKey,
            },
            errors: {
                404: `Returned if the requested issue status category is not found, or the user does not have permission to view it.`,
            },
        });
    }
}
