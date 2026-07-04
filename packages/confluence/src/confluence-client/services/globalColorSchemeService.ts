/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorSchemeThemeBasedModel } from '../models/colorSchemeThemeBasedModel.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class GlobalColorSchemeService {
    /**
     * Get default global color scheme
     * Get default color scheme for the instance
     *
     *
     * @returns ColorSchemeThemeBasedModel Returns a full JSON representation of color scheme including light and dark theme
     * @throws ApiError
     */
    public static getDefaultColorScheme(): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/color-scheme/default',
        });
    }
    /**
     * Get global color scheme
     * Get information about the current color scheme for the instance
     *
     *
     * @returns ColorSchemeThemeBasedModel Returns a full JSON representation of color scheme including light and dark theme
     * @throws ApiError
     */
    public static getGlobalColorScheme(): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/color-scheme',
        });
    }
    /**
     * Set global color scheme
     * Update the current color scheme of the instance
     *
     *
     * @param requestBody New color scheme
     * @returns ColorSchemeThemeBasedModel Returns a full JSON representation of the updated color scheme
     * @throws ApiError
     */
    public static updateColorScheme(
        requestBody?: ColorSchemeThemeBasedModel,
    ): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/color-scheme',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there are invalid colors in the request`,
                403: `Returned if the user is not a site admin`,
            },
        });
    }
    /**
     * Reset global color scheme
     * Reset the global color scheme colors to default
     *
     *
     * @returns ColorSchemeThemeBasedModel Returns a full JSON representation of color scheme
     * @throws ApiError
     */
    public static resetGlobalColorScheme(): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/color-scheme/reset',
            errors: {
                403: `Returned if the user is not a site admin`,
            },
        });
    }
}


