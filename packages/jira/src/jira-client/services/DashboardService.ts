/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardBean } from '../models/DashboardBean.js';
import type { DashboardsBean } from '../models/DashboardsBean.js';
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EntityPropertyBean } from '../models/EntityPropertyBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class DashboardService {
    /**
     * Get all dashboards with optional filtering
     * Returns a list of all dashboards, optionally filtering them.
     * @param filter An optional filter that is applied to the list of dashboards.
     * @param maxResults A hint as to the maximum number of dashboards to return in each call.
     * @param startAt The index of the first dashboard to return (0-based).
     * @returns DashboardsBean Returns a list of dashboards.
     * @throws ApiError
     */
    public static list(
        filter?: string,
        maxResults?: string,
        startAt?: string,
    ): CancelablePromise<DashboardsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/dashboard',
            query: {
                'filter': filter,
                'maxResults': maxResults,
                'startAt': startAt,
            },
            errors: {
                400: `Returned if there is an invalid startAt parameter.`,
            },
        });
    }
    /**
     * Get all properties keys for a dashboard item
     * Returns the keys of all properties for the dashboard item identified by the id.
     * @param itemId The dashboard item from which keys will be returned.
     * @param dashboardId The dashboard id.
     * @returns EntityPropertiesKeysBean Returned if the dashboard item was found.
     * @throws ApiError
     */
    public static getPropertiesKeys(
        itemId: string,
        dashboardId: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/dashboard/{dashboardId}/items/{itemId}/properties',
            path: {
                'itemId': itemId,
                'dashboardId': dashboardId,
            },
            errors: {
                400: `Returned if the dashboard item id is invalid.`,
                404: `Returned if the dashboard item with given id does not exist or user does not have permissions to view it.`,
            },
        });
    }
    /**
     * Get a property from a dashboard item
     * Returns the value of the property with a given key from the dashboard item identified by the id.
     * @param propertyKey The key of the property to return.
     * @param itemId The dashboard item from which the property will be returned.
     * @param dashboardId The dashboard id.
     * @returns EntityPropertyBean Returned if the dashboard item property was found.
     * @throws ApiError
     */
    public static getProperty1(
        propertyKey: string,
        itemId: string,
        dashboardId: string,
    ): CancelablePromise<EntityPropertyBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/dashboard/{dashboardId}/items/{itemId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'itemId': itemId,
                'dashboardId': dashboardId,
            },
            errors: {
                400: `Returned if the dashboard item id is invalid.`,
                404: `Returned if the dashboard item with given id does not exist or user does not have permissions to view it.`,
            },
        });
    }
    /**
     * Set a property on a dashboard item
     * Sets the value of the property with a given key on the dashboard item identified by the id.
     * @param propertyKey The key of the dashboard item's property. The maximum length of the key is 255 bytes.
     * @param itemId The dashboard item on which the property will be set.
     * @param dashboardId The dashboard id.
     * @returns any Returned if the dashboard item property is successfully updated.
     * @throws ApiError
     */
    public static setProperty(
        propertyKey: string,
        itemId: string,
        dashboardId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/dashboard/{dashboardId}/items/{itemId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'itemId': itemId,
                'dashboardId': dashboardId,
            },
            errors: {
                400: `Returned if the dashboard item id is invalid.`,
                403: `Returned if the calling user does not have permission to administer the dashboard item.`,
                404: `Returned if the dashboard item with given id does not exist or user does not have permissions to view it.`,
            },
        });
    }
    /**
     * Delete a property from a dashboard item
     * Removes the property from the dashboard item identified by the key or by the id.
     * @param propertyKey The key of the property to remove.
     * @param itemId The dashboard item from which the property will be removed.
     * @param dashboardId The dashboard id.
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty1(
        propertyKey: string,
        itemId: string,
        dashboardId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/dashboard/{dashboardId}/items/{itemId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'itemId': itemId,
                'dashboardId': dashboardId,
            },
            errors: {
                400: `Returned if the dashboard item id is invalid.`,
                403: `Returned if the calling user does not have permission to edit the dashboard item.`,
                404: `Returned if the dashboard item with given id does not exist or user does not have permissions to view it.`,
            },
        });
    }
    /**
     * Get a single dashboard by ID
     * Returns a single dashboard.
     * @param id The dashboard id.
     * @returns DashboardBean Returns a single dashboard.
     * @throws ApiError
     */
    public static getDashboard(
        id: string,
    ): CancelablePromise<DashboardBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/dashboard/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if there is no dashboard with the specified id, or if the user does not have permission to see it.`,
            },
        });
    }
}
