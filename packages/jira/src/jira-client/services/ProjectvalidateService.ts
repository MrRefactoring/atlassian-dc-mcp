/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ErrorCollection } from '../models/ErrorCollection.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ProjectvalidateService {
    /**
     * Get project key validation
     * Validates a project key.
     * @param key
     * @returns ErrorCollection Returns an ErrorCollection containing any validation errors for the project key. If the project key is valid, the ErrorCollection will be empty.
     * @throws ApiError
     */
    public static getProject1(
        key?: string,
    ): CancelablePromise<ErrorCollection> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/projectvalidate/key',
            query: {
                'key': key,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
            },
        });
    }
}
