/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupPickerContext } from '../models/groupPickerContext.js';
import type { RestBranch } from '../models/restBranch.js';
import type { RestBuildStats } from '../models/restBuildStats.js';
import type { RestBuildStatus } from '../models/restBuildStatus.js';
import type { RestMultipleBuildStats } from '../models/restMultipleBuildStats.js';
import type { RestPullRequestParticipant } from '../models/restPullRequestParticipant.js';
import type { UserPickerContext } from '../models/userPickerContext.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class DeprecatedService {
    /**
     * @deprecated
     * Get build statuses for commit
     * Gets build statuses associated with a commit.
     *
     * <strong>Deprecated in 7.14, please use the repository based builds resource instead.</strong>
     * @param commitId Full SHA1 of the commit (ex: <code>e00cf62997a027bbf785614a93e2e55bb331d268</code>)
     * @param orderBy How the results should be ordered. Options are NEWEST, OLDEST, STATUS
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A Page of build statuses associated with the commit <br /> (limited to the most recent 100 build statuses associated with the commit)
     * @throws ApiError
     */
    public static getBuildStatus(
        commitId: string,
        orderBy?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestBuildStatus>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/build-status/latest/commits/{commitId}',
            path: {
                'commitId': commitId,
            },
            query: {
                'orderBy': orderBy,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The user is not authenticated or does not have the <b>LICENSED</b> permission.`,
            },
        });
    }
}

