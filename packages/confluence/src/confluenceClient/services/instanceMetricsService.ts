/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InstanceMetrics } from '../models/instanceMetrics.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class InstanceMetricsService {
    /**
     * Get instance metrics
     * Returns simple metrics about this instance.
     * @returns InstanceMetrics The instance metrics.
     * @throws ApiError
     */
    public static index1(): CancelablePromise<InstanceMetrics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/instance-metrics',
            errors: {
                401: `Returned if the calling User is not authenticated.`,
                403: `Returned if the calling User does not have necessary permission.`,
            },
        });
    }
}


