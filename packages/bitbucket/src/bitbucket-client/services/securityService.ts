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
     * Retrieve inactive AES key(s)
     * Retrieves a list of inactive AES encryption key(s). An AES key becomes inactive after it has been rotated.
     * @returns any Returned if the keys were retrieved successfully
     * @throws ApiError
     */
    public static getInactiveKeys(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/secrets/1.0/keys/inactive',
            errors: {
                401: `Returned if user is not authorized`,
                500: `Returned if an error occurs when retrieving the keys`,
            },
        });
    }
    /**
     * Delete inactive AES key(s)
     * Delete the inactive AES encryption key(s). Post rotation, inactive AES key(s) can be cleaned up.
     * @returns any Returned if the keys were deleted successfully
     * @throws ApiError
     */
    public static deleteInactiveKeys(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/secrets/1.0/keys/inactive',
            errors: {
                401: `Returned if user is not authorized`,
                500: `Returned if an error occurs when deleting the keys`,
            },
        });
    }
    /**
     * Rotate the current AES key
     * Rotate the current AES encryption key. Existing secrets will be re-encrypted with the new key.
     * @returns any Returned if the key was rotated successfully
     * @throws ApiError
     */
    public static rotateKey(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/secrets/1.0/keys/rotate',
            errors: {
                401: `Returned if user is not authorized`,
                406: `Returned if the rotation cannot occur`,
                500: `Returned if an error occurs when rotating the key`,
                501: `Returned if the rotation is not supported on the instance`,
            },
        });
    }
    /**
     * Delete all GPG keys for user
     * Delete all GPG keys for a supplied user.
     * @param user The username of the user to delete the keys for. If no username is specified, the GPG keys will be deleted for the currently authenticated user.
     * @returns void
     * @throws ApiError
     */
    public static deleteForUser(
        user?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/gpg/latest/keys',
            query: {
                'user': user,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the GPG keys. This is only possible when a <strong>user</strong> is explicitly supplied.`,
                404: `No user matches the supplied <strong>user</strong>.`,
            },
        });
    }
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
    /**
     * Find repository secret scanning allowlist rules
     * Find repository secret scanning allowlist rules by filtering.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter Filter names by the provided text
     * @param order Order by
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of allowlist rules
     * @throws ApiError
     */
    public static search2(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSecretScanningAllowlistRule>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/allowlist',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request was not a correctly formed allowlist rule. See returned error for more details`,
                401: `The authenticated user is not permitted to view repository rules`,
            },
        });
    }
    /**
     * Create repository secret scanning allowlist rule
     * Create a new repository secret scanning allowlist rule. Repository allowlist rules are used when scanning the given repository.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody Allowlist rule to create, either the line regular expression or the path regular expression must be present
     * @returns RestSecretScanningAllowlistRule The created rule
     * @throws ApiError
     */
    public static createAllowlistRule1(
        projectKey: string,
        repositorySlug: string,
        requestBody: RestSecretScanningAllowlistRuleSetRequest,
    ): CancelablePromise<RestSecretScanningAllowlistRule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/allowlist',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed allowlist rule. See returned error for more details`,
                401: `The authenticated user is not permitted to create repository rules`,
            },
        });
    }
    /**
     * Delete a repository secret scanning allowlist rule
     * Delete a repository secret scanning allowlist rule with the provided ID.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param id The allowlist rule id.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteAllowlistRule1(
        projectKey: string,
        id: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/allowlist/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The authenticated user is not permitted to delete repository allowlist rules`,
            },
        });
    }
    /**
     * Get a repository secret scanning allowlist rule
     * Get a repository secret scanning allowlist rule by ID.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param id The allowlist rule id.
     * @param repositorySlug The repository slug.
     * @returns RestSecretScanningAllowlistRule The requested allowlist rule
     * @throws ApiError
     */
    public static getAllowlistRule1(
        projectKey: string,
        id: string,
        repositorySlug: string,
    ): CancelablePromise<RestSecretScanningAllowlistRule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/allowlist/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The authenticated user is not permitted to view repository allowlist rules`,
                404: `The requested allowlist rule was not found`,
            },
        });
    }
    /**
     * Edit an existing repository secret scanning allowlist rule
     * Edit a repository secret scanning allowlist rule.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param id The allowlist rule id.
     * @param repositorySlug The repository slug.
     * @param requestBody
     * @returns RestSecretScanningAllowlistRule The updated allowlist rule
     * @throws ApiError
     */
    public static editAllowlistRule1(
        projectKey: string,
        id: string,
        repositorySlug: string,
        requestBody: RestSecretScanningAllowlistRuleSetRequest,
    ): CancelablePromise<RestSecretScanningAllowlistRule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/allowlist/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed allowlist rule. See returned error for more details`,
                401: `The authenticated user is not permitted to edit repository allowlist rules`,
            },
        });
    }
    /**
     * Delete an exempt repository
     * Remove a repository from being exempt from secret scanning
     * @returns void
     * @throws ApiError
     */
    public static deleteExemptRepo(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/exempt',
            errors: {
                401: `The authenticated user is not permitted to delete an exempt repository`,
            },
        });
    }
    /**
     * Get whether a repository is exempt
     * Check whether a repository is exempt from secret scanning
     * @returns any True if the repository is exempt from secret scanning, false otherwise
     * @throws ApiError
     */
    public static isRepoExempt(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/exempt',
            errors: {
                401: `The authenticated user is not permitted to check whether a repository is exempt from secret scanning`,
            },
        });
    }
    /**
     * @deprecated
     * Exempt a repo from secret scanning
     * Exempt a repository from being scanned for secrets
     *
     * <strong>Deprecated since 8.6</strong>. Exemptions are now managed by scope.
     * Use POST /rest/api/1.0/secret-scanning/exempt for global scope
     * Use POST /rest/api/1.0/projects/{projectKey}/secret-scanning/exempt for the project scope
     * @returns void
     * @throws ApiError
     */
    public static addExemptRepo(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/exempt',
            errors: {
                401: `The authenticated user is not permitted to exempt a repository from secret scanning`,
                409: `At least one of specified repositories have already been previously made exempt.`,
            },
        });
    }
    /**
     * Find repository secret scanning rules
     * Find repository secret scanning rules by filtering.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter Filter names by the provided text
     * @param order Order by
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of rules
     * @throws ApiError
     */
    public static search3(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSecretScanningRule>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/rules',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request was not correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to view repository rules`,
            },
        });
    }
    /**
     * Create repository secret scanning rule
     * Create a new repository secret scanning rule. Repository rules are used when scanning the given repository.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody Rule to create, either the line regular expression or the path regular expression must be present
     * @returns RestSecretScanningRule The created rule
     * @throws ApiError
     */
    public static createRule1(
        projectKey: string,
        repositorySlug: string,
        requestBody: RestSecretScanningRuleSetRequest,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/rules',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to create repository rules`,
            },
        });
    }
    /**
     * Delete a repository secret scanning rule
     * Delete a repository secret scanning rule with the provided ID.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param id The rule id.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteRule1(
        projectKey: string,
        id: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/rules/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The authenticated user is not permitted to delete repository rules`,
            },
        });
    }
    /**
     * Get a repository secret scanning rule
     * Get a repository secret scanning rule by ID.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param id The rule id.
     * @param repositorySlug The repository slug.
     * @returns RestSecretScanningRule The requested rule
     * @throws ApiError
     */
    public static getRule1(
        projectKey: string,
        id: string,
        repositorySlug: string,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/rules/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The authenticated user is not permitted to view repository rules`,
                404: `The requested rule was not found`,
            },
        });
    }
    /**
     * Edit an existing repository secret scanning rule
     * Edit a repository secret scanning rule.
     *
     * Repository **Admin** is required
     * @param projectKey The project key.
     * @param id The rule id.
     * @param repositorySlug The repository slug.
     * @param requestBody
     * @returns RestSecretScanningRule The updated rule
     * @throws ApiError
     */
    public static editRule1(
        projectKey: string,
        id: string,
        repositorySlug: string,
        requestBody: RestSecretScanningRuleSetRequest,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/secret-scanning/rules/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to edit repository rules`,
            },
        });
    }
    /**
     * Find project secret scanning allowlist rules
     * Find project secret scanning allowlist rules by filtering.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param filter Filter names by the provided text
     * @param order Order by
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of allowlist rules
     * @throws ApiError
     */
    public static searchAllowlistRule(
        projectKey: string,
        filter?: string,
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSecretScanningAllowlistRule>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/secret-scanning/allowlist',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'filter': filter,
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request was not correctly formed allowlist rule. See returned error for more details`,
                401: `The authenticated user is not permitted to view project allowlist rules`,
            },
        });
    }
    /**
     * Create project secret scanning allowlist rule
     * Create a new project level secret scanning allowlist rule. Project allowlist rules are used when scanning all non exempt repositories in the provided project.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param requestBody Allowlist rule to create, either the line regular expression or the path regular expression must be present
     * @returns RestSecretScanningAllowlistRule The created allowlist rule
     * @throws ApiError
     */
    public static createAllowlistRule(
        projectKey: string,
        requestBody: RestSecretScanningAllowlistRuleSetRequest,
    ): CancelablePromise<RestSecretScanningAllowlistRule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/secret-scanning/allowlist',
            path: {
                'projectKey': projectKey,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed allowlist rule. See returned error for more details`,
                401: `The authenticated user is not permitted to create project allowlist rules.`,
            },
        });
    }
    /**
     * Delete a project secret scanning allowlist rule
     * Delete a project secret scanning allowlist rule with the provided ID.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param id The allowlist rule id.
     * @returns void
     * @throws ApiError
     */
    public static deleteAllowlistRule(
        projectKey: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/secret-scanning/allowlist/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to delete project rules`,
            },
        });
    }
    /**
     * Get a project secret scanning allowlist rule
     * Get a project secret scanning allowlist rule by ID.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param id The allowlist rule id.
     * @returns RestSecretScanningAllowlistRule The requested allowlist rule
     * @throws ApiError
     */
    public static getAllowlistRule(
        projectKey: string,
        id: string,
    ): CancelablePromise<RestSecretScanningAllowlistRule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/secret-scanning/allowlist/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to view project allowlist rules`,
                404: `The requested allowlist rules was not found`,
            },
        });
    }
    /**
     * Edit an existing project secret scanning allowlist rule
     * Edit a project secret scanning allowlist rule.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param id The allowlist rule id.
     * @param requestBody
     * @returns RestSecretScanningAllowlistRule The updated allowlist rule
     * @throws ApiError
     */
    public static editAllowlistRule(
        projectKey: string,
        id: string,
        requestBody: RestSecretScanningAllowlistRuleSetRequest,
    ): CancelablePromise<RestSecretScanningAllowlistRule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/secret-scanning/allowlist/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed allowlist rule. See returned error for more details`,
                401: `The authenticated user is not permitted to modify project allowlist rules`,
            },
        });
    }
    /**
     * Find repos exempt from secret scanning for a project
     * Find repositories exempt from secret scanning in a project
     * @param order Order by project name followed by repository name either ascending or descending, defaults to ascending.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of repositories
     * @throws ApiError
     */
    public static findExemptReposByProject(
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestRepository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/secret-scanning/exempt',
            query: {
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The authenticated user is not permitted to search exempt repositories for this project`,
            },
        });
    }
    /**
     * Bulk exempt repos from secret scanning
     * Bulk exempt a  list of repositories from being scanned for secrets. User must be have **PROJECT ADMIN** permissions.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static bulkAddExemptRepositories1(
        requestBody?: Array<RestRepositorySelector>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/secret-scanning/exempt',
            body: requestBody,
            mediaType: '*/*',
            errors: {
                401: `The authenticated user is not permitted to exempt a repository from secret scanning. No repositories were made exempt.`,
            },
        });
    }
    /**
     * Find project secret scanning rules
     * Find project secret scanning rules by filtering.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param filter Filter names by the provided text
     * @param order Order by
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of rules
     * @throws ApiError
     */
    public static search1(
        projectKey: string,
        filter?: string,
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSecretScanningRule>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/secret-scanning/rules',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'filter': filter,
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request was not correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to view project rules`,
            },
        });
    }
    /**
     * Create project secret scanning rule
     * Create a new project level secret scanning rule. Project rules are used when scanning all non exempt repositories in the provided project.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param requestBody Rule to create, either the line regular expression or the path regular expression must be present
     * @returns RestSecretScanningRule The created rule
     * @throws ApiError
     */
    public static createRule(
        projectKey: string,
        requestBody: RestSecretScanningRuleSetRequest,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/secret-scanning/rules',
            path: {
                'projectKey': projectKey,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to create project rules.`,
            },
        });
    }
    /**
     * Delete a project secret scanning rule
     * Delete a project secret scanning rule with the provided ID.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param id The rule id.
     * @returns void
     * @throws ApiError
     */
    public static deleteRule(
        projectKey: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/projects/{projectKey}/secret-scanning/rules/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to delete project rules`,
            },
        });
    }
    /**
     * Get a project secret scanning rule
     * Get a project secret scanning rule by ID.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param id The rule id.
     * @returns RestSecretScanningRule The requested rule
     * @throws ApiError
     */
    public static getRule(
        projectKey: string,
        id: string,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/secret-scanning/rules/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to view project rules`,
                404: `The requested rules was not found`,
            },
        });
    }
    /**
     * Edit an existing project secret scanning rule
     * Edit a project secret scanning rule.
     *
     * Project **Admin** is required
     * @param projectKey The project key.
     * @param id The rule id.
     * @param requestBody
     * @returns RestSecretScanningRule The updated rule
     * @throws ApiError
     */
    public static editRule(
        projectKey: string,
        id: string,
        requestBody: RestSecretScanningRuleSetRequest,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/projects/{projectKey}/secret-scanning/rules/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to modify project rules`,
            },
        });
    }
    /**
     * Find all repos exempt from secret scan
     * Find all repositories exempt from secret scanning
     * @param order Order by project name followed by repository name either ascending or descending, defaults to ascending.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of repositories
     * @throws ApiError
     */
    public static findExemptReposByScope(
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestRepository>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/secret-scanning/exempt',
            query: {
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The authenticated user is not permitted to search exempt repositories globally`,
            },
        });
    }
    /**
     * Bulk exempt repos from secret scanning
     * Bulk exempt a  list of repositories from being scanned for secrets. User must be have global **ADMIN** permissions.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static bulkAddExemptRepositories(
        requestBody?: Array<RestRepositorySelector>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/secret-scanning/exempt',
            body: requestBody,
            mediaType: '*/*',
            errors: {
                401: `The authenticated user is not permitted to exempt a repository from secret scanning. No repositories were made exempt.`,
                409: `At least one of specified repositories have already been previously made exempt.`,
            },
        });
    }
    /**
     * Find global secret scanning rules
     * Find global secret scanning rules by filtering.
     * @param filter Filter by rule name
     * @param order Order by
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of rules
     * @throws ApiError
     */
    public static search4(
        filter?: string,
        order?: 'NAME_ASC' | 'NAME_DESC',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSecretScanningRule>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/secret-scanning/rules',
            query: {
                'filter': filter,
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The request did not contain a correctly formed search request, see returned error for more details.`,
                401: `The authenticated user is not permitted to search global rules`,
            },
        });
    }
    /**
     * Create global secret scanning rule
     * Create a new global secret scanning rule. Global rules are used when scanning all non exempt repositories.
     * @param requestBody Rule to create, either the line regular expression or the path regular expression must be present
     * @returns RestSecretScanningRule The created rule
     * @throws ApiError
     */
    public static createRule2(
        requestBody: RestSecretScanningRuleSetRequest,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/secret-scanning/rules',
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to create global rules`,
            },
        });
    }
    /**
     * Delete a global secret scanning rule
     * Delete a global secret scanning rule with the provided ID
     * @param id The rule id.
     * @returns void
     * @throws ApiError
     */
    public static deleteRule2(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/secret-scanning/rules/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to delete global rules`,
            },
        });
    }
    /**
     * Get a global secret scanning rule
     * Get a global secret scanning rule by ID.
     * @param id The rule id.
     * @returns RestSecretScanningRule The requested rule
     * @throws ApiError
     */
    public static getRule2(
        id: string,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/secret-scanning/rules/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to get global rules`,
                404: `The requested rule was not found`,
            },
        });
    }
    /**
     * Edit a global secret scanning rule.
     * Edit an existing global secret scanning rule
     * @param id The rule id.
     * @param requestBody
     * @returns RestSecretScanningRule The updated rule
     * @throws ApiError
     */
    public static editRule2(
        id: string,
        requestBody: RestSecretScanningRuleSetRequest,
    ): CancelablePromise<RestSecretScanningRule> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/secret-scanning/rules/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request did not contain a correctly formed rule. See returned error for more details`,
                401: `The authenticated user is not permitted to update global rules`,
            },
        });
    }
    /**
     * Get all X.509 certificates
     * Get all X.509 certificates that have been added to the system.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @returns RestX509Certificate A page of X.509 certificates
     * @throws ApiError
     */
    public static getAllCertificates(): CancelablePromise<RestX509Certificate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/signing/x509-certificates',
            errors: {
                401: `The authenticated user is not permitted to get X.509 certificates`,
            },
        });
    }
    /**
     * Create an X.509 certificate
     * Create an X.509 certificate. This will add the given X.509 certificate to the system. Existing entries will not be overridden if an X.509 certificate already exists. Once added, an X.509 certificate cannot be updated.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param formData The multipart form data containing the certificate in a form-field named 'certificate'
     * @returns RestX509Certificate The newly created X.509 certificate
     * @throws ApiError
     */
    public static createCertificate(
        formData: ExampleCertificateMultipartFormData,
    ): CancelablePromise<RestX509Certificate> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/signing/x509-certificates',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `The request did not contain a valid X.509 certificate request. See returned error for more details`,
                401: `The authenticated user is not permitted to create X.509 certificates`,
            },
        });
    }
    /**
     * Update X.509 CRL entries
     * Update the certificate revocation list (CRL) entries for an issuer X.509 certificate in the system, identified by <code>id</code>. This will add any new revoked X.509 certificates that were issued by the given issuer X.509 certificate.
     *
     * This endpoint will schedule a request to asynchronously perform the task. Please allow time for the task to complete as it will vary depending on how many CRLs there are to retrieve and process.
     *
     * Note: CRL updates are scheduled to run every 24 hours. You may wish to trigger a refresh manually using this endpoint, otherwise, entries will be updated daily.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param id The ID of the issuer certificate.
     * @returns any Successfully started processing CRLs.
     * @throws ApiError
     */
    public static updateCertificateRevocationListEntries(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/signing/x509-certificates/crl/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to update X.509 CRL entries`,
                404: `There is no X.509 certificate with the given ID`,
            },
        });
    }
    /**
     * Delete an X.509 certificate
     * Delete an X.509 certificate specified by the given ID.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param id The ID of the X.509 certificate.
     * @returns void
     * @throws ApiError
     */
    public static deleteCertificate(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/signing/x509-certificates/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The authenticated user is not permitted to delete X.509 certificates`,
                404: `There is no X.509 certificate with the given ID`,
            },
        });
    }
    /**
     * Get system signing configuration
     * Gets the configuration details for system signing Git objects.
     * @returns RestSystemSigningConfiguration The configuration details for system signing Git objects
     * @throws ApiError
     */
    public static getSystemSigningConfiguration(): CancelablePromise<RestSystemSigningConfiguration> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/system-signing/configuration',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the configuration details for system signing Git objects.`,
            },
        });
    }
    /**
     * Update system signing configuration
     * Updates the configuration for system signing Git objects.
     * @param requestBody
     * @returns RestSystemSigningConfiguration The updated configuration details for system signing Git objects
     * @throws ApiError
     */
    public static updateSystemSigningConfiguration(
        requestBody?: {
            enabled?: boolean;
        },
    ): CancelablePromise<RestSystemSigningConfiguration> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/system-signing/configuration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The configuration details could not be updated because the provided request was invalid`,
                401: `The currently authenticated user has insufficient permissions to retrieve the configuration details for system signing Git objects.`,
            },
        });
    }
}

