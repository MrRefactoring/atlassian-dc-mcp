/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LicenseValidationResults } from '../models/LicenseValidationResults.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class LicenseValidatorService {
    /**
     * Validate a Jira license
     * Validates a Jira license
     * @param requestBody The license string to validate.
     * @returns LicenseValidationResults The validation results of the license.
     * @throws ApiError
     */
    public static validate(
        requestBody: string,
    ): CancelablePromise<LicenseValidationResults> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/licenseValidator',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
