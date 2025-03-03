/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TerminologyRequestBean } from '../models/TerminologyRequestBean.js';
import type { TerminologyResponseBean } from '../models/TerminologyResponseBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class TerminologyService {
    /**
     * Get all defined names for 'epic' and 'sprint'
     * Returns a list of all defined names for the default words 'epic' and 'sprint'
     * @returns TerminologyResponseBean Returns a list of all defined names for the default words 'epic' and 'sprint'
     * @throws ApiError
     */
    public static getAllTerminologyEntries(): CancelablePromise<TerminologyResponseBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/terminology/entries',
        });
    }
    /**
     * Update epic/sprint names from original to new
     * Change epic/sprint names from {originalName} to {newName}. The {newName} will be displayed in Jira instead of {originalName}
     * {"originalName"} must be equal to "epic" or "sprint".
     * There can be only one entry per unique {"originalName"}.
     * {"newName"} can only consist of alphanumeric characters and spaces e.g. {"newName": "iteration number 2"}.
     * {"newName"} must be between 1 to 100 characters.
     * It can't use the already defined {"newName"} values or restricted JQL words.
     * To reset {"newName"} to the default value, enter the {"originalName"} value as the value for {"newName"}. For example, if you want to return to {"originalName": "sprint"}, enter {"newName": "sprint"}.
     * @param requestBody Collection of TerminologyRequestBean
     * @returns void
     * @throws ApiError
     */
    public static setTerminologyEntries(
        requestBody: TerminologyRequestBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/terminology/entries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the provided data isn't valid.`,
                403: `Returned if the user doesn't have admin permissions.`,
                404: `Returned if the feature is turned off via a feature flag.`,
            },
        });
    }
    /**
     * Get epic or sprint name by original name
     * Returns epic or sprint name as specified in the {originalName} path param
     * @param originalName
     * @returns TerminologyResponseBean Returns epic or sprint name.
     * @throws ApiError
     */
    public static getTerminologyEntry(
        originalName: string,
    ): CancelablePromise<TerminologyResponseBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/terminology/entries/{originalName}',
            path: {
                'originalName': originalName,
            },
            errors: {
                404: `Returned if there is no epic or sprint name defined in the {originalName}.`,
            },
        });
    }
}
