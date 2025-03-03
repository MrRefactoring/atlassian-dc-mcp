/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SecuritySchemeJsonBean } from '../models/SecuritySchemeJsonBean.js';
import type { SecuritySchemesJsonBean } from '../models/SecuritySchemesJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IssuesecurityschemesService {
    /**
     * Get all issue security schemes
     * Returns all issue security schemes that are defined.
     * @returns SecuritySchemesJsonBean Returns a list of all available issue security schemes.
     * @throws ApiError
     */
    public static getIssueSecuritySchemes(): CancelablePromise<SecuritySchemesJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuesecurityschemes',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not have the administrator permission.`,
            },
        });
    }
    /**
     * Get specific issue security scheme by id
     * Returns the issue security scheme along with that are defined.
     * @param id The issue security scheme id.
     * @returns SecuritySchemeJsonBean Returns the issue security scheme with the given id.
     * @throws ApiError
     */
    public static getIssueSecurityScheme(
        id: string,
    ): CancelablePromise<SecuritySchemeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuesecurityschemes/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not have the administrator permission and the scheme is not used in any project where the user has administrative permission.`,
            },
        });
    }
}
