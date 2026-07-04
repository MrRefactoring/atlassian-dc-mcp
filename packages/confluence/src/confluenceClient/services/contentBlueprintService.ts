/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Content } from '../models/content.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class ContentBlueprintService {
    /**
     * Publish shared draft
     * Publishes a shared draft of a Content created from a ContentBlueprint.
     * @param draftId the id of the draft
     * @param expand A comma separated list of properties to expand on the content. Default value: <code>body.storage,history,space,version,ancestors</code>
     * @param status only support 'draft' status for now.
     * @param requestBody he content to be created, where the status of the included content is "current",
     * and the content has an ID (which will be the draft ID)
     * @returns Content returns a JSON representation of the content
     * @throws ApiError
     */
    public static publishSharedDraft(
        draftId: string,
        expand?: string,
        status?: string,
        requestBody?: Content,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/content/blueprint/instance/{draftId}',
            path: {
                'draftId': draftId,
            },
            query: {
                'expand': expand,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Publish legacy draft
     * Publishes a legacy draft of a Content created from a ContentBlueprint.
     * @param draftId the id of the draft
     * @param expand A comma separated list of properties to expand on the content. Default value: <code>body.storage,history,space,version,ancestors</code>
     * @param status only support 'draft' status for now.
     * @param requestBody The content to be created, where the status of the included content is "current",
     * and the content has an ID (which will be the draft ID)
     * @returns Content returns a JSON representation of the content
     * @throws ApiError
     */
    public static publishLegacyDraft(
        draftId: string,
        expand?: string,
        status?: string,
        requestBody?: Content,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content/blueprint/instance/{draftId}',
            path: {
                'draftId': draftId,
            },
            query: {
                'expand': expand,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}


