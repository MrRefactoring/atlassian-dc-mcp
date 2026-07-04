/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestBuildCapabilities } from '../models/restBuildCapabilities.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class CapabilitiesService {
    /**
     * Get build capabilities
     * Returns the build capabilities of this instance
     * @returns RestBuildCapabilities capabilities
     * @throws ApiError
     */
    public static getCapabilities(): CancelablePromise<RestBuildCapabilities> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/build/capabilities',
        });
    }
    /**
     * Get deployment capabilities
     * Returns the Deployment capabilities of this instance
     * @returns any capabilities
     * @throws ApiError
     */
    public static getCapabilities1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/deployment/capabilities',
            errors: {
                404: `This instance of Bitbucket Data Center does not support deployments (for example, it has been disabled using the property 'plugin.deployment.capability.disabled').`,
            },
        });
    }
}

