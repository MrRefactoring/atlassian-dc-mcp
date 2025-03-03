/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppMonitoringRestEntity } from '../models/AppMonitoringRestEntity.js';
import type { IpdMonitoringRestEntity } from '../models/IpdMonitoringRestEntity.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class MonitoringService {
    /**
     * Get App Monitoring status
     * Checks if App Monitoring is enabled
     * @returns AppMonitoringRestEntity Returns the status of App Monitoring.
     * @throws ApiError
     */
    public static isAppMonitoringEnabled(): CancelablePromise<AppMonitoringRestEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/monitoring/app',
        });
    }
    /**
     * Update App Monitoring status
     * Enables or disables App Monitoring
     * @param requestBody The status to set for App Monitoring.
     * @returns void
     * @throws ApiError
     */
    public static setAppMonitoringEnabled(
        requestBody: AppMonitoringRestEntity,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/monitoring/app',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get if IPD Monitoring is enabled
     * Checks if IPD Monitoring is enabled
     * @returns IpdMonitoringRestEntity Returns the status of IPD Monitoring.
     * @throws ApiError
     */
    public static isIpdMonitoringEnabled(): CancelablePromise<IpdMonitoringRestEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/monitoring/ipd',
        });
    }
    /**
     * Update IPD Monitoring status
     * Enables or disables IPD Monitoring
     * @param requestBody The status to set for IPD Monitoring.
     * @returns void
     * @throws ApiError
     */
    public static setAppMonitoringEnabled1(
        requestBody: IpdMonitoringRestEntity,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/monitoring/ipd',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Check if JMX metrics are being exposed
     * Checks if JMX metrics are being exposed
     * @returns boolean Returns whether JMX metrics are being exposed.
     * @throws ApiError
     */
    public static areMetricsExposed(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/monitoring/jmx/areMetricsExposed',
        });
    }
    /**
     * Get the available JMX metrics
     * Gets the available JMX metrics
     * @returns string Returns the available JMX metrics.
     * @throws ApiError
     */
    public static getAvailableMetrics(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/monitoring/jmx/getAvailableMetrics',
        });
    }
    /**
     * Start exposing JMX metrics
     * Starts exposing JMX metrics
     * @returns any Confirmation that the JMX metrics are being exposed.
     * @throws ApiError
     */
    public static start(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/monitoring/jmx/startExposing',
        });
    }
    /**
     * Stop exposing JMX metrics
     * Stops exposing JMX metrics
     * @returns any Confirmation that the JMX metrics are no longer being exposed.
     * @throws ApiError
     */
    public static stop(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/monitoring/jmx/stopExposing',
        });
    }
}
