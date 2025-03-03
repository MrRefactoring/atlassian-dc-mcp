/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ServerInfoBean } from '../models/ServerInfoBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ServerInfoService {
    /**
     * Get general information about the current Jira server
     * Returns general information about the current Jira server.
     * @returns ServerInfoBean Returns a full representation of the server info in JSON format.
     * @throws ApiError
     */
    public static getServerInfo(): CancelablePromise<ServerInfoBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/serverInfo',
        });
    }
}
