/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AccessModeService {
    /**
     * Get access mode status
     * Returns the access mode status for Confluence.
     * @returns any Returns the access mode status for Confluence. Example: READ_WRITE
     * @throws ApiError
     */
    public static getAccessModeStatus(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/accessmode',
        });
    }
}


