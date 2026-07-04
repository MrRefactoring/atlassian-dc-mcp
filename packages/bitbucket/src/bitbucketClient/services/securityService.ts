/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExampleCertificateMultipartFormData } from '../models/exampleCertificateMultipartFormData.js';
import type { RestGpgKey } from '../models/restGpgKey.js';
import type { RestRepository } from '../models/restRepository.js';
import type { RestRepositorySelector } from '../models/restRepositorySelector.js';
import type { RestSecretScanningAllowlistRule } from '../models/restSecretScanningAllowlistRule.js';
import type { RestSecretScanningAllowlistRuleSetRequest } from '../models/restSecretScanningAllowlistRuleSetRequest.js';
import type { RestSecretScanningRule } from '../models/restSecretScanningRule.js';
import type { RestSecretScanningRuleSetRequest } from '../models/restSecretScanningRuleSetRequest.js';
import type { RestSystemSigningConfiguration } from '../models/restSystemSigningConfiguration.js';
import type { RestX509Certificate } from '../models/restX509Certificate.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SecurityService {
    /**
     * Get all GPG keys
     * Find all the keys for the currently authenticated user. Optionally, users with ADMIN and higher permissions may choose to specify the <code>user</code> parameter to retrieve GPG keys for another user.
     *
     * Only authenticated users may call this endpoint.
     * @param user The name of the user to get keys for (optional; requires ADMIN permission or higher).
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Returns a paged response of of keys for the user.
     * @throws ApiError
     */
    public static getKeysForUser(
        user?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestGpgKey>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/gpg/latest/keys',
            query: {
                'user': user,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to perform this operation.`,
            },
        });
    }
    /**
     * Create a GPG key
     * Add a GPG key to the authenticated user's account. Optionally, users with ADMIN and higher permissions may choose to specify the <code>user</code> parameter to add a GPG key for another user.
     *
     * Only authenticated users may call this endpoint.
     * @param user The name of the user to add a key for (optional; requires ADMIN permission or higher).
     * @param requestBody The request body.
     * @returns RestGpgKey Response contains the GPG key that was just created.
     * @throws ApiError
     */
    public static addKey(
        user?: string,
        requestBody?: RestGpgKey,
    ): CancelablePromise<RestGpgKey> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/gpg/latest/keys',
            query: {
                'user': user,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request has failed validation.`,
                401: `The currently authenticated user has insufficient permissions to perform this operation.`,
            },
        });
    }
    /**
     * Delete a GPG key
     * Delete the GPG key with the specified ID or Key Fingerprint.
     * @param fingerprintOrId The GPG fingerprint or ID.
     * @returns void
     * @throws ApiError
     */
    public static deleteKey(
        fingerprintOrId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gpg/latest/keys/{fingerprintOrId}',
            path: {
                'fingerprintOrId': fingerprintOrId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to perform this operation.`,
            },
        });
    }
}

