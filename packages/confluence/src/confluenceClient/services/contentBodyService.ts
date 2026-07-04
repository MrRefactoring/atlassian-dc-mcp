/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentBody } from '../models/contentBody.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentBodyService {
    /**
     * Convert body representation
     * Converts between content body representations. Not all representations can be converted to/from other formats. Supported conversions:
     *
     * - `storage -> view,export_view,styled_view,editor`
     * - `editor -> storage`
     * - `view -> None`
     * - `export_view -> None`
     * - `styled_view -> None`
     *
     * Example request URI(s):
     *
     * - `http://example.com/confluence/rest/api/contentbody/convert/view`
     * @param to the representation to convert to.
     * @param expand A comma separated list of properties to expand on the content. Default value: <code>body.storage,history,space,version,ancestors</code>
     * @param requestBody the body to convert from
     * @returns ContentBody returns the converted body
     * @throws ApiError
     */
    public static convert(
        to: string,
        expand?: string,
        requestBody?: ContentBody,
    ): CancelablePromise<ContentBody> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/contentbody/convert/{to}',
            path: {
                'to': to,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}


