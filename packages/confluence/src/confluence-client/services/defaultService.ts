/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class DefaultService {
    /**
     * @deprecated
     * @returns any default response
     * @throws ApiError
     */
    public static getAuditRecords(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/audit',
        });
    }
}


