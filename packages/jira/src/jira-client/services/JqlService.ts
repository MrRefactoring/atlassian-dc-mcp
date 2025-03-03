/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutoCompleteResponseBean } from '../models/AutoCompleteResponseBean.js';
import type { AutoCompleteResultWrapper } from '../models/AutoCompleteResultWrapper.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class JqlService {
    /**
     * Get auto complete data for JQL searches
     * Returns the auto complete data required for JQL searches
     * @returns AutoCompleteResponseBean The auto complete data required for JQL searches.
     * @throws ApiError
     */
    public static getAutoComplete(): CancelablePromise<AutoCompleteResponseBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/jql/autocompletedata',
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                500: `Returned if an error occurs while generating the response.`,
            },
        });
    }
    /**
     * Get auto complete suggestions for JQL search
     * Returns auto complete suggestions for JQL search
     * @param predicateValue
     * @param predicateName
     * @param fieldName
     * @param fieldValue
     * @returns AutoCompleteResultWrapper The autocompletion suggestions for JQL search.
     * @throws ApiError
     */
    public static getFieldAutoCompleteForQueryString(
        predicateValue?: string,
        predicateName?: string,
        fieldName?: string,
        fieldValue?: string,
    ): CancelablePromise<AutoCompleteResultWrapper> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/jql/autocompletedata/suggestions',
            query: {
                'predicateValue': predicateValue,
                'predicateName': predicateName,
                'fieldName': fieldName,
                'fieldValue': fieldValue,
            },
        });
    }
}
