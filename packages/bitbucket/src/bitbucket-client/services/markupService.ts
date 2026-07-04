/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestMarkup } from '../models/restMarkup.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class MarkupService {
    /**
     * Preview markdown render
     * Preview generated HTML for the given markdown content.
     *
     * Only authenticated users may call this resource.
     * @param htmlEscape (Optional) true if HTML should be escaped in the input markup, false otherwise.
     * @param urlMode (Optional) The mode to use when building URLs. One of: ABSOLUTE, RELATIVE or, CONFIGURED. By default this is RELATIVE.
     * @param includeHeadingId (Optional) true if headers should contain an ID based on the heading content.
     * @param hardwrap (Optional) Whether the markup implementation should convert newlines to breaks. By default this is false which reflects the standard markdown specification.
     * @param requestBody
     * @returns RestMarkup The rendered markdown.
     * @throws ApiError
     */
    public static preview(
        htmlEscape?: string,
        urlMode?: string,
        includeHeadingId?: string,
        hardwrap?: string,
        requestBody?: string,
    ): CancelablePromise<RestMarkup> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/markup/preview',
            query: {
                'htmlEscape': htmlEscape,
                'urlMode': urlMode,
                'includeHeadingId': includeHeadingId,
                'hardwrap': hardwrap,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The markdown was invalid.`,
                401: `The currently authenticated user has insufficient permissions preview rendered markdown.`,
            },
        });
    }
}

