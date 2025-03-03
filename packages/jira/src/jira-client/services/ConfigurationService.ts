/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigurationBean } from '../models/ConfigurationBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ConfigurationService {
    /**
     * Get Jira configuration details
     * Returns the information if the optional features in Jira are enabled or disabled. If the time tracking is enabled, it also returns the detailed information about time tracking configuration.
     * @returns ConfigurationBean Returned the configuration of optional features in Jira.
     * @throws ApiError
     */
    public static getConfiguration1(): CancelablePromise<ConfigurationBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/configuration',
            errors: {
                401: `Returned if the user is not logged in.`,
            },
        });
    }
}
