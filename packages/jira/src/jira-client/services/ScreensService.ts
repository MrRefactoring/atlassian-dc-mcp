/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddFieldBean } from '../models/AddFieldBean.js';
import type { MoveFieldBean } from '../models/MoveFieldBean.js';
import type { ScreenableFieldBean } from '../models/ScreenableFieldBean.js';
import type { ScreenableTabBean } from '../models/ScreenableTabBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ScreensService {
    /**
     * Get available field screens
     * Adds field or custom field to the default tab.
     * @param search
     * @param expand
     * @param maxResults
     * @param startAt
     * @returns any Returns response indicating successful addition of field to default screen / default tab.
     * @throws ApiError
     */
    public static getAllScreens(
        search?: string,
        expand?: string,
        maxResults?: string,
        startAt?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/screens',
            query: {
                'search': search,
                'expand': expand,
                'maxResults': maxResults,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if screen, tab or field does not exist or field is already present on a selected tab.`,
                401: `Returned if the user does not have administrator permissions.`,
            },
        });
    }
    /**
     * Add field to default screen
     * Moves field on the given tab.
     * @param fieldId
     * @returns void
     * @throws ApiError
     */
    public static addFieldToDefaultScreen(
        fieldId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/screens/addToDefault/{fieldId}',
            path: {
                'fieldId': fieldId,
            },
            errors: {
                400: `Returned if the screen, tab or field does not exist.`,
                401: `Returned if the user is not authorized to move a field.`,
            },
        });
    }
    /**
     * Get available fields for screen
     * Gets available fields for screen. i.e ones that haven't already been added.
     * @param screenId
     * @returns ScreenableFieldBean Returns a list of available fields for the screen.
     * @throws ApiError
     */
    public static getFieldsToAdd(
        screenId: number,
    ): CancelablePromise<ScreenableFieldBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/screens/{screenId}/availableFields',
            path: {
                'screenId': screenId,
            },
            errors: {
                400: `Returned if the screen does not exist.`,
                401: `Returned if the user is not authorized to view the available fields.`,
            },
        });
    }
    /**
     * Get all tabs for a screen
     * Returns a list of all tabs for the given screen.
     * @param screenId
     * @param projectKey
     * @returns ScreenableTabBean Returns a list of Jira issue tabs.
     * @throws ApiError
     */
    public static getAllTabs(
        screenId: number,
        projectKey?: string,
    ): CancelablePromise<ScreenableTabBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/screens/{screenId}/tabs',
            path: {
                'screenId': screenId,
            },
            query: {
                'projectKey': projectKey,
            },
            errors: {
                400: `Returned if the screen does not exist.`,
                401: `Returned if the user is not authorized to view the tabs.`,
            },
        });
    }
    /**
     * Create tab for a screen
     * Creates tab for given screen.
     * @param screenId
     * @param requestBody
     * @returns ScreenableTabBean Returns newly created tab.
     * @throws ApiError
     */
    public static addTab(
        screenId: number,
        requestBody?: ScreenableTabBean,
    ): CancelablePromise<ScreenableTabBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/screens/{screenId}/tabs',
            path: {
                'screenId': screenId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the screen does not exist or the user is not authorized to create a tab.`,
                401: `Returned if the user is not authorized to create a tab.`,
            },
        });
    }
    /**
     * Rename a tab on a screen
     * Renames tab on given screen.
     * @param tabId
     * @param screenId
     * @param requestBody
     * @returns ScreenableTabBean Returns renamed tab.
     * @throws ApiError
     */
    public static renameTab(
        tabId: number,
        screenId: number,
        requestBody?: ScreenableTabBean,
    ): CancelablePromise<ScreenableTabBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/screens/{screenId}/tabs/{tabId}',
            path: {
                'tabId': tabId,
                'screenId': screenId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the screen does not exist or the user is not authorized to rename a tab.`,
                401: `Returned if the user is not authorized to rename a tab.`,
            },
        });
    }
    /**
     * Delete a tab from a screen
     * Deletes tab from given screen.
     * @param tabId
     * @param screenId
     * @returns void
     * @throws ApiError
     */
    public static deleteTab(
        tabId: number,
        screenId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/screens/{screenId}/tabs/{tabId}',
            path: {
                'tabId': tabId,
                'screenId': screenId,
            },
            errors: {
                400: `Returned if the screen does not exist or the user is not authorized to delete a tab.`,
                401: `Returned if the user is not authorized to delete a tab.`,
                412: `Returned if tab can not be deleted due to a pre-condition (there has to be at least one tab left).`,
            },
        });
    }
    /**
     * Get all fields for a tab
     * Gets all fields for a given tab.
     * @param tabId
     * @param screenId
     * @param projectKey
     * @returns ScreenableFieldBean Returns a list of all fields for the given tab.
     * @throws ApiError
     */
    public static getAllFields(
        tabId: number,
        screenId: number,
        projectKey?: string,
    ): CancelablePromise<ScreenableFieldBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/screens/{screenId}/tabs/{tabId}/fields',
            path: {
                'tabId': tabId,
                'screenId': screenId,
            },
            query: {
                'projectKey': projectKey,
            },
            errors: {
                400: `Returned if the screen or tab does not exist.`,
                401: `Returned if the user is not authorized to view the fields.`,
            },
        });
    }
    /**
     * Add field to a tab
     * Adds field to the given tab.
     * @param tabId
     * @param screenId
     * @param requestBody
     * @returns ScreenableFieldBean Returns newly added field.
     * @throws ApiError
     */
    public static addField(
        tabId: number,
        screenId: number,
        requestBody?: AddFieldBean,
    ): CancelablePromise<ScreenableFieldBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/screens/{screenId}/tabs/{tabId}/fields',
            path: {
                'tabId': tabId,
                'screenId': screenId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the screen, tab or field does not exist.`,
                401: `Returned if the user is not authorized to add a field.`,
            },
        });
    }
    /**
     * Remove field from tab
     * Removes field from given tab.
     * @param tabId
     * @param screenId
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static removeField(
        tabId: number,
        screenId: number,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/screens/{screenId}/tabs/{tabId}/fields/{id}',
            path: {
                'tabId': tabId,
                'screenId': screenId,
                'id': id,
            },
            errors: {
                400: `Returned if the screen or tab does not exist.`,
                401: `Returned if the user is not authorized to remove a field.`,
            },
        });
    }
    /**
     * Move field on a tab
     * Moves field on the given tab.
     * @param tabId
     * @param screenId
     * @param id
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static moveField(
        tabId: number,
        screenId: number,
        id: string,
        requestBody?: MoveFieldBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/screens/{screenId}/tabs/{tabId}/fields/{id}/move',
            path: {
                'tabId': tabId,
                'screenId': screenId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the screen, tab or field does not exist.`,
                401: `Returned if the user is not authorized to move a field.`,
            },
        });
    }
    /**
     * Update 'showWhenEmptyIndicator' for a field
     * Update 'showWhenEmptyIndicator' for given field on screen.
     * @param tabId
     * @param screenId
     * @param newValue
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static updateShowWhenEmptyIndicator(
        tabId: number,
        screenId: number,
        newValue: boolean,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/screens/{screenId}/tabs/{tabId}/fields/{id}/updateShowWhenEmptyIndicator/{newValue}',
            path: {
                'tabId': tabId,
                'screenId': screenId,
                'newValue': newValue,
                'id': id,
            },
            errors: {
                400: `Returned if the screen, tab or field does not exist.`,
                401: `Returned if the user is not authorized to update 'showWhenEmptyIndicator'.`,
            },
        });
    }
    /**
     * Move tab position
     * Moves tab position.
     * @param tabId
     * @param screenId
     * @param pos
     * @returns void
     * @throws ApiError
     */
    public static moveTab(
        tabId: number,
        screenId: number,
        pos: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/screens/{screenId}/tabs/{tabId}/move/{pos}',
            path: {
                'tabId': tabId,
                'screenId': screenId,
                'pos': pos,
            },
            errors: {
                400: `Returned if the screen does not exist or the user is not authorized to move a tab.`,
                401: `Returned if the user is not authorized to move a tab.`,
            },
        });
    }
}
