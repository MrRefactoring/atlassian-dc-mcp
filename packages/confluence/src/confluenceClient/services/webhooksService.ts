/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DetailedInvocation } from '../models/detailedInvocation.js';
import type { RestInvocationHistory } from '../models/restInvocationHistory.js';
import type { RestWebhook } from '../models/restWebhook.js';
import type { Webhook } from '../models/webhook.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class WebhooksService {
    /**
     * Find webhooks
     * Find webhooks. The authenticated user must be an administrator to call this resource.
     * @param limit the limit of the number of items to return, this may be restricted by fixed system limits.
     * @param start the start point of the collection to return
     * @param event list of webhook event ids to filter for
     * @param statistics if statistics should be provided for all found webhooks.
     * @returns any returns a list of webhooks.
     * @throws ApiError
     */
    public static findWebhooks(
        limit?: string,
        start?: string,
        event?: string,
        statistics?: string,
    ): CancelablePromise<{
        results?: Array<RestWebhook>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/webhooks',
            query: {
                'limit': limit,
                'start': start,
                'event': event,
                'statistics': statistics,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to find webhooks.`,
            },
        });
    }
    /**
     * Create webhook
     * Create a webhook via the URL. The authenticated user must be an administrator to call this resource.
     * @param requestBody the webhook to be created.
     * @returns Webhook returns a created webhook.
     * @throws ApiError
     */
    public static createWebhook(
        requestBody: RestWebhook,
    ): CancelablePromise<Webhook> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/webhooks',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `returned if The webhook parameters were invalid or not supplied.`,
                401: `The currently authenticated user has insufficient permissions to create webhooks.`,
            },
        });
    }
    /**
     * Get webhook
     * Get a webhook by id. The authenticated user must be an administrator to call this resource.
     * @param webhookId id of the webhook
     * @param statistics
     * @returns RestWebhook returns a webhook.
     * @throws ApiError
     */
    public static getWebhook(
        webhookId: string,
        statistics: boolean = false,
    ): CancelablePromise<RestWebhook> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/webhooks/{webhookId}',
            path: {
                'webhookId': webhookId,
            },
            query: {
                'statistics': statistics,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to get webhook.`,
                404: `returned if the webhook does not exist.`,
            },
        });
    }
    /**
     *  Update webhook
     *  Update an existing webhook. The authenticated user must be an administrator to call this resource.
     * @param webhookId the existing webhook id
     * @param requestBody the representation of the updated values for the webhook
     * @returns RestWebhook returns a webhook.
     * @throws ApiError
     */
    public static updateWebhook(
        webhookId: string,
        requestBody: RestWebhook,
    ): CancelablePromise<RestWebhook> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/webhooks/{webhookId}',
            path: {
                'webhookId': webhookId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to update a webhook.`,
                404: `returned if the webhook does not exist.`,
            },
        });
    }
    /**
     * Delete webhook
     * Delete a webhook via the URL. The authenticated user must be an administrator to call this resource.
     * @param webhookId the id of the webhook to be deleted.
     * @returns void
     * @throws ApiError
     */
    public static deleteWebhook(
        webhookId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/webhooks/{webhookId}',
            path: {
                'webhookId': webhookId,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to delete webhooks.`,
                404: `returned if the webhook does not exist.`,
            },
        });
    }
    /**
     * Get latest invocations
     * Get the latest invocations for a specific webhook. The authenticated user must be an administrator to call this resource.
     * @param webhookId id of the webhook
     * @param outcomes the outcome to filter for. Can be SUCCESS, FAILURE, ERROR. None specified means that the all will be considered.
     * @param event the string id of a specific event to retrieve the last invocation for.
     * @param outcome
     * @returns DetailedInvocation returns a webhook invocation dataset.
     * @throws ApiError
     */
    public static getLatestInvocation(
        webhookId: string,
        outcomes?: string,
        event?: string,
        outcome?: Array<string>,
    ): CancelablePromise<DetailedInvocation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/webhooks/{webhookId}/latest',
            path: {
                'webhookId': webhookId,
            },
            query: {
                'outcomes': outcomes,
                'event': event,
                'outcome': outcome,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to get webhook.`,
                404: `returned if the webhook does not exist.`,
            },
        });
    }
    /**
     * Get statistic
     * Get the statistics for a specific webhook. The authenticated user must be an administrator to call this resource.
     * @param webhookId id of the webhook
     * @param event the string id of a specific event to retrieve the last invocation for.
     * @returns RestInvocationHistory returns a webhook invocation dataset.
     * @throws ApiError
     */
    public static getStatistics(
        webhookId: string,
        event?: string,
    ): CancelablePromise<RestInvocationHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/webhooks/{webhookId}/statistics',
            path: {
                'webhookId': webhookId,
            },
            query: {
                'event': event,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to get webhook.`,
                404: `returned if the webhook does not exist.`,
            },
        });
    }
    /**
     * Get statistics summary
     * Get the statistics summary for a specific webhook. The authenticated user must be an administrator to call this resource.
     * @param webhookId id of the webhook
     * @returns RestInvocationHistory returns a webhook invocation dataset.
     * @throws ApiError
     */
    public static getStatisticsSummary(
        webhookId: string,
    ): CancelablePromise<RestInvocationHistory> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/webhooks/{webhookId}/statistics/summary',
            path: {
                'webhookId': webhookId,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to get webhook.`,
                404: `returned if the webhook does not exist.`,
            },
        });
    }
    /**
     * Test webhook
     * Test connectivity to a specific endpoint. The authenticated user must be an administrator to call this resource.
     * @param url the url in which to connect to
     * @returns any returns a webhook.
     * @throws ApiError
     */
    public static testWebhook(
        url: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/webhooks/test',
            query: {
                'url': url,
            },
            errors: {
                401: `returned if the currently authenticated user has insufficient permissions to test a connection.`,
                404: `returned if repository does not exist.`,
            },
        });
    }
}


