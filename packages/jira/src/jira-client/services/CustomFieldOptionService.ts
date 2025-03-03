/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomFieldOptionBean } from '../models/CustomFieldOptionBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class CustomFieldOptionService {
    /**
     * Get custom field option by ID
     * Returns a full representation of the Custom Field Option that has the given id.
     * @param id a String containing an Custom Field Option id.
     * @returns CustomFieldOptionBean Returned if the Custom Field Option exists and is visible by the calling user.
     * @throws ApiError
     */
    public static getCustomFieldOption(
        id: string,
    ): CancelablePromise<CustomFieldOptionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/customFieldOption/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the Custom Field Option does not exist, or is not visible to the calling user.`,
            },
        });
    }
}
