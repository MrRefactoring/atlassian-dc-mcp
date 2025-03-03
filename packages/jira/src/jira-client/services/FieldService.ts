/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomFieldDefinitionJsonBean } from '../models/CustomFieldDefinitionJsonBean.js';
import type { FieldBean } from '../models/FieldBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class FieldService {
    /**
     * Get all fields, both System and Custom
     * Returns a list of all fields, both System and Custom
     * @returns FieldBean Returns a list of all fields
     * @throws ApiError
     */
    public static getFields(): CancelablePromise<FieldBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/field',
            errors: {
                401: `Returned if user is not logged-in and don't have access to any project`,
            },
        });
    }
    /**
     * Create a custom field using a definition
     * Creates a custom field using a definition
     * @param requestBody
     * @returns FieldBean Custom field was created
     * @throws ApiError
     */
    public static createCustomField(
        requestBody?: CustomFieldDefinitionJsonBean,
    ): CancelablePromise<FieldBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/field',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the input is invalid`,
                500: `Returned if exception occured during custom field creation`,
            },
        });
    }
}
