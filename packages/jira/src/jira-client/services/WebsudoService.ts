/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class WebsudoService {
    /**
     * Invalidate the current WebSudo session
     * This method invalidates the any current WebSudo session.
     * @param requestBody No request body is needed
     * @returns void
     * @throws ApiError
     */
    public static release(
        requestBody?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/1/websudo',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
