/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServerInformation } from '../models/serverInformation.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ServerInformationService {
    /**
     * Get server information
     * Returns information about the current application build running on this instance.
     * @returns ServerInformation The server build information.
     * @throws ApiError
     */
    public static index2(): CancelablePromise<ServerInformation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/server-information',
            errors: {
                401: `Returned if the calling User is not authenticated.`,
            },
        });
    }
}


