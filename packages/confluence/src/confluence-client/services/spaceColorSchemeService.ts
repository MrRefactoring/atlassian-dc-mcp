/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorSchemeThemeBasedModel } from '../models/colorSchemeThemeBasedModel.js';
import type { SpaceColorSchemeTypeModel } from '../models/spaceColorSchemeTypeModel.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SpaceColorSchemeService {
    /**
     * Get Space color scheme type
     * Get the current color scheme type used for a space, it can be global or custom
     *
     *
     * @param spaceKey Space key of the space to request color scheme type for.
     * @returns SpaceColorSchemeTypeModel Returns a color scheme type
     * @throws ApiError
     */
    public static getColorSchemeType(
        spaceKey: string,
    ): CancelablePromise<SpaceColorSchemeTypeModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/color-scheme/type',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                403: `Returned if a space with the user for given space key is not space admin.`,
                404: `Returned if a space with the given space key does not exist.`,
            },
        });
    }
    /**
     * Update Space color scheme type
     * Update the color scheme type used for a space, currently it can be global or custom
     *
     *
     * @param spaceKey space key of the space to update color scheme type for.
     * @param requestBody New color scheme type
     * @returns SpaceColorSchemeTypeModel Returns the updated color scheme type
     * @throws ApiError
     */
    public static updateColorSchemeType(
        spaceKey: string,
        requestBody?: SpaceColorSchemeTypeModel,
    ): CancelablePromise<SpaceColorSchemeTypeModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/color-scheme/type',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if space type is invalid in the request`,
                403: `Returned if a space with the user is not space admin for the given space.`,
                404: `Returned if a space with the given space key does not exist.`,
            },
        });
    }
    /**
     * Get Space color scheme
     * Get information about the current color scheme for a space
     *
     *
     * @param spaceKey space key of the space to request color scheme for.
     * @returns ColorSchemeThemeBasedModel Returns a full JSON representation of color scheme
     * @throws ApiError
     */
    public static getSpaceColorScheme(
        spaceKey: string,
    ): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/space/{spaceKey}/color-scheme',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                403: `Returned if a space with the user is not space admin for the given space.`,
                404: `Returned if a space with the given space key does not exist.`,
            },
        });
    }
    /**
     * Update Space color scheme
     * Update the color scheme for a space
     *
     *
     * @param spaceKey space key of the space to set color scheme for.
     * @param requestBody New color scheme
     * @returns ColorSchemeThemeBasedModel Returns a full JSON representation of color scheme
     * @throws ApiError
     */
    public static updateSpaceColorScheme(
        spaceKey: string,
        requestBody?: ColorSchemeThemeBasedModel,
    ): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/color-scheme',
            path: {
                'spaceKey': spaceKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if there are invalid colors in the request`,
                403: `Returned if a space with the user is not space admin for the given space.`,
                404: `Returned if a space with the given space key does not exist.`,
            },
        });
    }
    /**
     * Reset Space color scheme
     * Reset the space color scheme to use global color scheme
     *
     *
     * @param spaceKey Space key of the space to reset color scheme for.
     * @returns ColorSchemeThemeBasedModel Returns a JSON representation of color scheme
     * @throws ApiError
     */
    public static resetSpaceColorScheme(
        spaceKey: string,
    ): CancelablePromise<ColorSchemeThemeBasedModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/space/{spaceKey}/color-scheme/reset',
            path: {
                'spaceKey': spaceKey,
            },
            errors: {
                403: `Returned if a space with the user is not space admin for the given space.`,
                404: `Returned if a space with the given space key does not exist.`,
            },
        });
    }
}


