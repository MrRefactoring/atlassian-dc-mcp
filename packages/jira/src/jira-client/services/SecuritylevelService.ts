/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SecurityLevelJsonBean } from '../models/SecurityLevelJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class SecuritylevelService {
    /**
     * Get a security level by ID
     * Returns a full representation of the security level that has the given id.
     * @param id
     * @returns SecurityLevelJsonBean Returned if the issue type exists and is visible by the calling user.
     * @throws ApiError
     */
    public static getIssuesecuritylevel(
        id: string,
    ): CancelablePromise<SecurityLevelJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/securitylevel/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the issue type does not exist, or is not visible to the calling user.`,
            },
        });
    }
}
