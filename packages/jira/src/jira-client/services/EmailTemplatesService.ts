/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class EmailTemplatesService {
    /**
     * Get email templates as zip file
     * Creates a zip file containing email templates at local home and returns the file.
     * @returns any Zipping was successful
     * @throws ApiError
     */
    public static downloadEmailTemplates(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/email-templates',
            errors: {
                403: `User is not a system admin`,
                500: `IOException happen or any unexpected exception was thrown`,
            },
        });
    }
    /**
     * Update email templates with zip file
     * Extracts given zip file to temporary templates folder. If the folder already exists it will replace it's content
     * @param requestBody
     * @returns any Templates has extracted
     * @throws ApiError
     */
    public static uploadEmailTemplates(
        requestBody?: Record<string, any>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/email-templates',
            body: requestBody,
            mediaType: 'application/zip',
            errors: {
                403: `User is not a system admin`,
                500: `IOException happen or any unexpected exception is thrown`,
            },
        });
    }
    /**
     * Update email templates with previously uploaded pack
     * Replaces the current email templates pack with previously uploaded one, if exists.
     * @returns any Templates were replaced
     * @throws ApiError
     */
    public static applyEmailTemplates(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/email-templates/apply',
            errors: {
                400: `There were no templates previously uploaded`,
                500: `Exception happened during applying process`,
            },
        });
    }
    /**
     * Update email templates to default
     * Replaces the current email templates pack with default templates, which are copied over from Jira binaries.
     * @returns any Templates were restored to default
     * @throws ApiError
     */
    public static revertEmailTemplatesToDefault(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/email-templates/revert',
            errors: {
                403: `User is not a system admin`,
                500: `Any unexpected exception is thrown`,
            },
        });
    }
    /**
     * Get email types for templates
     * Returns a list of root templates mapped with Event Types. The list can be used to decide which test emails to send.
     * @returns any Reading email types was successful
     * @throws ApiError
     */
    public static getEmailTypes(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/email-templates/types',
            errors: {
                403: `User is not a system admin`,
                500: `Any unexpected exception is thrown`,
            },
        });
    }
}
