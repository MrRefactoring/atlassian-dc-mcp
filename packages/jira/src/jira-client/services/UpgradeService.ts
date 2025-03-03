/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpgradeResultBean } from '../models/UpgradeResultBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class UpgradeService {
    /**
     * Get result of the last upgrade task
     * Returns the result of the last upgrade task.
     * @returns UpgradeResultBean Returns the result of the last upgrade.
     * @throws ApiError
     */
    public static getUpgradeResult(): CancelablePromise<UpgradeResultBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/upgrade',
            errors: {
                303: `Returned if the upgrade task is still running.`,
                404: `Returned if no prior upgrade task exists.`,
            },
        });
    }
    /**
     * Run pending upgrade tasks
     * Runs any pending delayed upgrade tasks. Need Admin permissions to do this.
     * @returns any OK response if successful, array of error messages if schedule fails.
     * @throws ApiError
     */
    public static runUpgradesNow(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/upgrade',
            errors: {
                403: `Returned if the user does not have admin permissions.`,
                409: `Returned if ZDU cluster upgrade in progress.`,
            },
        });
    }
}
