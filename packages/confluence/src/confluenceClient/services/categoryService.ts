/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class CategoryService {
    /**
     * Add a category to a space
     * Adds a category the description of a given {@link Space} identified by spaceKey.
     *
     * Example request URI to add space category 'testCategory' to space with space key TEST:
     *
     * `https://example.com/confluence/rest/api/space/TEST/category/testCategory`
     * @param spaceKey a string containing the key of the space
     * @param labelName the name of the label to be added (do not include any prefix, team: prefix assumed)
     * @returns void
     * @throws ApiError
     */
    public static add(
        spaceKey: string,
        labelName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/space/{spaceKey}/category/{labelName}',
            path: {
                'spaceKey': spaceKey,
                'labelName': labelName,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `If the calling user does not have permission to add any label to the given space.`,
                404: `Returned if there is no space with the given spaceKey.`,
            },
        });
    }
    /**
     * Remove a category from a space
     * Removes a category from a space, identified by spaceKey.
     *
     * Example request URI:
     * `https://example.com/confluence/rest/api/space/TEST/category/example-category`
     * @param spaceKey The key of the space to remove the category from
     * @param categoryName The name of the category to remove
     * @returns void
     * @throws ApiError
     */
    public static removeCategory(
        spaceKey: string,
        categoryName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/space/{spaceKey}/category/{categoryName}',
            path: {
                'spaceKey': spaceKey,
                'categoryName': categoryName,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the Space.`,
                404: `Returned if there is no space with the given key`,
            },
        });
    }
}


