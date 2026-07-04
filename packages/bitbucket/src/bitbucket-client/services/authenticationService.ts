/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthenticationEntity } from '../models/authenticationEntity.js';
import type { AuthenticationResponse } from '../models/authenticationResponse.js';
import type { BasicAuthConfigEntity } from '../models/basicAuthConfigEntity.js';
import type { CaptchaDataEntity } from '../models/captchaDataEntity.js';
import type { ConversationDTO } from '../models/conversationDTO.js';
import type { IdpConfigEntity } from '../models/idpConfigEntity.js';
import type { JitUserEntity } from '../models/jitUserEntity.js';
import type { LoginOptionEntity } from '../models/loginOptionEntity.js';
import type { RestAccessToken } from '../models/restAccessToken.js';
import type { RestAccessTokenRequest } from '../models/restAccessTokenRequest.js';
import type { RestProject } from '../models/restProject.js';
import type { RestRawAccessToken } from '../models/restRawAccessToken.js';
import type { RestRepository } from '../models/restRepository.js';
import type { RestSshAccessKey } from '../models/restSshAccessKey.js';
import type { RestSshKey } from '../models/restSshKey.js';
import type { RestSshSettings } from '../models/restSshSettings.js';
import type { SsoConfigEntity } from '../models/ssoConfigEntity.js';
import type { SsoManagementStatusDTO } from '../models/ssoManagementStatusDTO.js';
import type { StatusDTO } from '../models/statusDTO.js';
import type { TotpCodeVerificationDTO } from '../models/totpCodeVerificationDTO.js';
import type { TotpElevationRestDTO } from '../models/totpElevationRestDTO.js';
import type { TotpRecoveryCodeAuthenticationDTO } from '../models/totpRecoveryCodeAuthenticationDTO.js';
import type { TotpRecoveryCodeDTO } from '../models/totpRecoveryCodeDTO.js';
import type { TotpUserEnrollmentDTO } from '../models/totpUserEnrollmentDTO.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AuthenticationService {
    /**
     * Get project HTTP tokens
     * Get all access tokens associated with the given project.
     * @param projectKey The project key.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A response containing a page of access tokens and associated details.
     * @throws ApiError
     */
    public static getAllAccessTokens(
        projectKey: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestAccessToken>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access-tokens/latest/projects/{projectKey}',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not permitted to get access tokens for this project or authentication failed.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Create project HTTP token
     * Create an access token for the project according to the given request.
     * @param projectKey The project key.
     * @param requestBody The request containing the details of the access token to create.
     * @returns RestRawAccessToken A response containing the raw access token and associated details.
     * @throws ApiError
     */
    public static createAccessToken(
        projectKey: string,
        requestBody?: RestAccessTokenRequest,
    ): CancelablePromise<RestRawAccessToken> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/access-tokens/latest/projects/{projectKey}',
            path: {
                'projectKey': projectKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following error cases occurred (check the error message for more details).
                - The request does not contain a token name
                - The request does not contain a list of permissions, or the list of permissions is empty
                - One of the provided permission levels are unknown
                - The project already has the maximum number of tokens
                `,
                401: `The currently authenticated user is not permitted to create an access token for this project or authentication failed.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Get repository HTTP tokens
     * Get all access tokens associated with the given repository.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A response containing a page of access tokens and associated details.
     * @throws ApiError
     */
    public static getAllAccessTokens1(
        projectKey: string,
        repositorySlug: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestAccessToken>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access-tokens/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not permitted to get access tokens for this repository or authentication failed.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Create repository HTTP token
     * Create an access token for the repository according to the given request.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param requestBody The request containing the details of the access token to create.
     * @returns RestRawAccessToken A response containing the raw access token and associated details.
     * @throws ApiError
     */
    public static createAccessToken1(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestAccessTokenRequest,
    ): CancelablePromise<RestRawAccessToken> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/access-tokens/latest/projects/{projectKey}/repos/{repositorySlug}',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following error cases occurred (check the error message for more details).
                - The request does not contain a token name- The request does not contain a list of permissions, or the list of permissions is empty- One of the provided permission levels are unknown- The repository already has the maximum number of tokens`,
                401: `The currently authenticated user is not permitted to create an access token for this repository or authentication failed.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Delete a HTTP token
     * Delete the access token identified by the given ID.
     * @param projectKey The project key.
     * @param tokenId The token id.
     * @param repositorySlug The repository slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteById1(
        projectKey: string,
        tokenId: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/access-tokens/latest/projects/{projectKey}/repos/{repositorySlug}/{tokenId}',
            path: {
                'projectKey': projectKey,
                'tokenId': tokenId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user is not permitted to delete an access token on behalf of this user or authentication failed.`,
                404: `The specified user or token does not exist.`,
            },
        });
    }
    /**
     * Get HTTP token by ID
     * Get the access token identified by the given ID.
     * @param projectKey The project key.
     * @param tokenId The token id.
     * @param repositorySlug The repository slug.
     * @returns RestAccessToken A response containing the access token and associated details.
     * @throws ApiError
     */
    public static getById1(
        projectKey: string,
        tokenId: string,
        repositorySlug: string,
    ): CancelablePromise<RestAccessToken> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access-tokens/latest/projects/{projectKey}/repos/{repositorySlug}/{tokenId}',
            path: {
                'projectKey': projectKey,
                'tokenId': tokenId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user is not permitted to get access tokens on behalf of this user or authentication failed.`,
                404: `The specified user or token does not exist.`,
            },
        });
    }
    /**
     * Update HTTP token
     * Modify an access token according to the given request. Any fields not specified will not be altered.
     * @param projectKey The project key.
     * @param tokenId The token id.
     * @param repositorySlug The repository slug.
     * @param requestBody The request containing the details of the access token to modify
     * @returns RestAccessToken A response containing the updated access token and associated details.
     * @throws ApiError
     */
    public static updateAccessToken1(
        projectKey: string,
        tokenId: string,
        repositorySlug: string,
        requestBody?: RestAccessTokenRequest,
    ): CancelablePromise<RestAccessToken> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access-tokens/latest/projects/{projectKey}/repos/{repositorySlug}/{tokenId}',
            path: {
                'projectKey': projectKey,
                'tokenId': tokenId,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the provided permission levels are unknown.`,
                401: `The currently authenticated user is not permitted to update an access token on behalf of this user or authentication failed.`,
            },
        });
    }
    /**
     * Delete a HTTP token
     * Delete the access token identified by the given ID.
     * @param projectKey The project key.
     * @param tokenId The token id.
     * @returns void
     * @throws ApiError
     */
    public static deleteById(
        projectKey: string,
        tokenId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/access-tokens/latest/projects/{projectKey}/{tokenId}',
            path: {
                'projectKey': projectKey,
                'tokenId': tokenId,
            },
            errors: {
                401: `The currently authenticated user is not permitted to delete an access token on behalf of this user or authentication failed.`,
                404: `The specified user or token does not exist.`,
            },
        });
    }
    /**
     * Get HTTP token by ID
     * Get the access token identified by the given ID.
     * @param projectKey The project key.
     * @param tokenId The token id.
     * @returns RestAccessToken A response containing the access token and associated details.
     * @throws ApiError
     */
    public static getById(
        projectKey: string,
        tokenId: string,
    ): CancelablePromise<RestAccessToken> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access-tokens/latest/projects/{projectKey}/{tokenId}',
            path: {
                'projectKey': projectKey,
                'tokenId': tokenId,
            },
            errors: {
                401: `The currently authenticated user is not permitted to get access tokens on behalf of this user or authentication failed.`,
                404: `The specified user or token does not exist.`,
            },
        });
    }
    /**
     * Update HTTP token
     * Modify an access token according to the given request. Any fields not specified will not be altered.
     * @param projectKey The project key.
     * @param tokenId The token id.
     * @param requestBody The request containing the details of the access token to modify
     * @returns RestAccessToken A response containing the updated access token and associated details.
     * @throws ApiError
     */
    public static updateAccessToken(
        projectKey: string,
        tokenId: string,
        requestBody?: RestAccessTokenRequest,
    ): CancelablePromise<RestAccessToken> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access-tokens/latest/projects/{projectKey}/{tokenId}',
            path: {
                'projectKey': projectKey,
                'tokenId': tokenId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the provided permission levels are unknown.`,
                401: `The currently authenticated user is not permitted to update an access token on behalf of this user or authentication failed.`,
            },
        });
    }
    /**
     * Get personal HTTP tokens
     * Get all access tokens associated with the given user.
     * @param userSlug The user slug.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A response containing a page of access tokens and associated details.
     * @throws ApiError
     */
    public static getAllAccessTokens2(
        userSlug: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestAccessToken>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access-tokens/latest/users/{userSlug}',
            path: {
                'userSlug': userSlug,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user is not permitted to get access tokens on behalf of this user or authentication failed.`,
                404: `The specified user does not exist.`,
            },
        });
    }
    /**
     * Create personal HTTP token
     * Create an access token for the user according to the given request.
     * @param userSlug The user slug.
     * @param requestBody The request containing the details of the access token to create.
     * @returns RestRawAccessToken A response containing the raw access token and associated details.
     * @throws ApiError
     */
    public static createAccessToken2(
        userSlug: string,
        requestBody?: RestAccessTokenRequest,
    ): CancelablePromise<RestRawAccessToken> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/access-tokens/latest/users/{userSlug}',
            path: {
                'userSlug': userSlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following error cases occurred (check the error message for more details).
                - The request does not contain a token name
                - The request does not contain a list of permissions, or the list of permissions is empty
                - One of the provided permission levels are unknown
                - The user already has their maximum number of tokens
                `,
                401: `The currently authenticated user is not permitted to create an access token on behalf of this user or authentication failed`,
                404: `The specified user does not exist.`,
            },
        });
    }
    /**
     * Delete a HTTP token
     * Delete the access token identified by the given ID.
     * @param tokenId The token id.
     * @param userSlug The user slug.
     * @returns void
     * @throws ApiError
     */
    public static deleteById2(
        tokenId: string,
        userSlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/access-tokens/latest/users/{userSlug}/{tokenId}',
            path: {
                'tokenId': tokenId,
                'userSlug': userSlug,
            },
            errors: {
                401: `The currently authenticated user is not permitted to delete an access token on behalf of this user or authentication failed.`,
                404: `The specified user or token does not exist.`,
            },
        });
    }
    /**
     * Get HTTP token by ID
     * Get the access token identified by the given ID.
     * @param tokenId The token id.
     * @param userSlug The user slug.
     * @returns RestAccessToken A response containing the access token and associated details.
     * @throws ApiError
     */
    public static getById2(
        tokenId: string,
        userSlug: string,
    ): CancelablePromise<RestAccessToken> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access-tokens/latest/users/{userSlug}/{tokenId}',
            path: {
                'tokenId': tokenId,
                'userSlug': userSlug,
            },
            errors: {
                401: `The currently authenticated user is not permitted to get access tokens on behalf of this user or authentication failed.`,
                404: `The specified user or token does not exist.`,
            },
        });
    }
    /**
     * Update HTTP token
     * Modify an access token according to the given request. Any fields not specified will not be altered.
     * @param tokenId The token id.
     * @param userSlug The user slug.
     * @param requestBody The request containing the details of the access token to modify
     * @returns RestAccessToken A response containing the updated access token and associated details.
     * @throws ApiError
     */
    public static updateAccessToken2(
        tokenId: string,
        userSlug: string,
        requestBody?: RestAccessTokenRequest,
    ): CancelablePromise<RestAccessToken> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access-tokens/latest/users/{userSlug}/{tokenId}',
            path: {
                'tokenId': tokenId,
                'userSlug': userSlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the provided permission levels are unknown.`,
                401: `The currently authenticated user is not permitted to update an access token on behalf of this user or authentication failed.`,
            },
        });
    }
    /**
     * Get repository SSH keys
     * Retrieves the access keys for the repository identified in the URL.
     * @param projectKey The project key.
     * @param repositorySlug The repository slug.
     * @param filter If specified only SSH access keys with a label prefixed with the supplied string will be returned
     * @param effective Controls whether SSH access keys configured at the project level should be included in the results or not. When set to <code>true</code> all keys that have <em>access</em> to the repository (including project level keys) are included in the results. When set to <code>false</code>, only access keys configured for the specified <code>repository</code> are considered. Default is <code>false</code>.
     * @param minimumPermission If specified only SSH access keys with at least the supplied permission will be returned. Default is <code>Permission.REPO_READ</code>.
     * @param permission
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A single page of access keys for the repository.
     * @throws ApiError
     */
    public static getForRepository1(
        projectKey: string,
        repositorySlug: string,
        filter?: string,
        effective?: string,
        minimumPermission?: string,
        permission?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSshAccessKey>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/keys/latest/projects/{projectKey}/repos/{repositorySlug}/ssh',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'filter': filter,
                'effective': effective,
                'minimumPermission': minimumPermission,
                'permission': permission,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the access keys for this repository`,
                404: `The specified repository does not exist`,
            },
        });
    }
    /**
     * Add repository SSH key
     * Register a new SSH key and grants access to the repository identified in the URL.
     * @param projectKey The project key
     * @param repositorySlug The repository slug
     * @param requestBody
     * @returns RestSshAccessKey The newly created access key.
     * @throws ApiError
     */
    public static addForRepository(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestSshAccessKey,
    ): CancelablePromise<RestSshAccessKey> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/keys/latest/projects/{projectKey}/repos/{repositorySlug}/ssh',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The current request contains invalid or missing values.`,
                401: `The currently authenticated user has insufficient permissions to add an access key to the repository.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Revoke repository SSH key
     * Remove an existing access key for the repository identified in the URL. If the same SSH key is used as an access key for multiple projects or repositories, only the access to the repository identified in the URL will be revoked.
     * @param projectKey The project key
     * @param keyId The key id
     * @param repositorySlug The repository slug
     * @returns void
     * @throws ApiError
     */
    public static revokeForRepository(
        projectKey: string,
        keyId: string,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/keys/latest/projects/{projectKey}/repos/{repositorySlug}/ssh/{keyId}',
            path: {
                'projectKey': projectKey,
                'keyId': keyId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to remove access keys for this repository`,
            },
        });
    }
    /**
     * Get repository SSH key
     * Retrieves the access key for the SSH key with id <code>keyId</code> on the repository identified in the URL.
     * @param projectKey The project key
     * @param keyId The key id
     * @param repositorySlug The repository slug
     * @returns RestSshAccessKey The access key for the repository and SSH key with ID <code>keyId</code>.
     * @throws ApiError
     */
    public static getForRepository(
        projectKey: string,
        keyId: string,
        repositorySlug: string,
    ): CancelablePromise<RestSshAccessKey> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/keys/latest/projects/{projectKey}/repos/{repositorySlug}/ssh/{keyId}',
            path: {
                'projectKey': projectKey,
                'keyId': keyId,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the access keys for this repository.`,
                404: `The specified repository or key does not exist or the key does not have access on the repository.`,
            },
        });
    }
    /**
     * Update repository SSH key permission
     * Updates the permission granted to the specified SSH key to the repository identified in the URL.
     * @param projectKey The project key
     * @param keyId The newly created access key
     * @param permission The new permission to be granted to the SSH key
     * @param repositorySlug The repository slug
     * @returns RestSshAccessKey The newly created access key.
     * @throws ApiError
     */
    public static updatePermission1(
        projectKey: string,
        keyId: string,
        permission: string,
        repositorySlug: string,
    ): CancelablePromise<RestSshAccessKey> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/keys/latest/projects/{projectKey}/repos/{repositorySlug}/ssh/{keyId}/permission/{permission}',
            path: {
                'projectKey': projectKey,
                'keyId': keyId,
                'permission': permission,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions on the repository to edit its access keys.`,
                404: `The specified repository does not exist.`,
            },
        });
    }
    /**
     * Get SSH key
     * Retrieves the access keys for the project identified in the URL.
     * @param projectKey The project key
     * @param filter If specified only SSH access keys with a label prefixed with the supplied string will be returned.
     * @param permission If specified only SSH access keys with at least the supplied permission will be returned Default is PROJECT_READ.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A single page of access keys associated with the project.
     * @throws ApiError
     */
    public static getSshKeysForProject(
        projectKey: string,
        filter?: string,
        permission?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSshAccessKey>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/keys/latest/projects/{projectKey}/ssh',
            path: {
                'projectKey': projectKey,
            },
            query: {
                'filter': filter,
                'permission': permission,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the access keys for this project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Add project SSH key
     * Register a new SSH key and grants access to the project identified in the URL.
     * @param projectKey The project key
     * @param requestBody
     * @returns RestSshAccessKey The newly created access key.
     * @throws ApiError
     */
    public static addForProject(
        projectKey: string,
        requestBody?: RestSshAccessKey,
    ): CancelablePromise<RestSshAccessKey> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/keys/latest/projects/{projectKey}/ssh',
            path: {
                'projectKey': projectKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The current request contains invalid or missing values.`,
                401: `The currently authenticated user has insufficient permissions to add an access key to the project.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Revoke project SSH key
     * Remove an existing access key for the project identified in the URL. If the same SSH key is used as an access key for multiple projects or repositories, only the access to the project identified in the URL will be revoked.
     * @param projectKey The project key
     * @param keyId The key id
     * @returns void
     * @throws ApiError
     */
    public static revokeForProject(
        projectKey: string,
        keyId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/keys/latest/projects/{projectKey}/ssh/{keyId}',
            path: {
                'projectKey': projectKey,
                'keyId': keyId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to remove access keys for this project.`,
            },
        });
    }
    /**
     * Get project SSH key
     * Retrieves the access key for the SSH key with id <code>keyId</code> on the project identified in the URL.
     * @param projectKey The project key
     * @param keyId The key id
     * @returns RestSshAccessKey The access key for the repository and SSH key with ID <code>keyId</code>.
     * @throws ApiError
     */
    public static getForProject(
        projectKey: string,
        keyId: string,
    ): CancelablePromise<RestSshAccessKey> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/keys/latest/projects/{projectKey}/ssh/{keyId}',
            path: {
                'projectKey': projectKey,
                'keyId': keyId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the access keys for this repository.`,
                404: `The specified repository or key does not exist or the key does not have access on the repository.`,
            },
        });
    }
    /**
     * Update project SSH key permission
     * Updates the permission granted to the specified SSH key to the project identified in the URL.
     * @param projectKey The project key
     * @param keyId The newly created access key
     * @param permission The new permission to be granted to the SSH key
     * @returns RestSshAccessKey The newly created access key.
     * @throws ApiError
     */
    public static updatePermission(
        projectKey: string,
        keyId: string,
        permission: string,
    ): CancelablePromise<RestSshAccessKey> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/keys/latest/projects/{projectKey}/ssh/{keyId}/permission/{permission}',
            path: {
                'projectKey': projectKey,
                'keyId': keyId,
                'permission': permission,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions on the project to edit its access keys.`,
                404: `The specified project does not exist.`,
            },
        });
    }
    /**
     * Revoke project SSH key
     * Remove an existing access key for the projects and repositories in the submitted entity. If the same SSH key is used as an access key for multiple projects or repositories not supplied, only the access to the projects or repositories identified will be revoked.
     * @param keyId The identifier of the SSH key
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static revokeMany(
        keyId: string,
        requestBody?: {
            projects?: RestProject;
            repositories?: RestRepository;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/keys/latest/ssh/{keyId}',
            path: {
                'keyId': keyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The currently authenticated user has insufficient permissions to remove access keys for one or more of the specified projects or repositories.`,
                404: `On or more of the specified repositories or projects does not exist or the key itself does not exist.`,
            },
        });
    }
    /**
     * Get project SSH keys
     * Retrieves all project-related access keys for the SSH key with id <code>keyId</code>. If the current user is not an admin any of the projects the key provides access to, none are returned.
     * @param keyId
     * @returns any The SSH key with ID <code>keyId</code>.
     * @throws ApiError
     */
    public static getForProjects(
        keyId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/keys/latest/ssh/{keyId}/projects',
            path: {
                'keyId': keyId,
            },
            errors: {
                404: `The specified key does not exist`,
            },
        });
    }
    /**
     * Get repository SSH key
     * Retrieves all repository-related access keys for the SSH key with id <code>keyId</code>. If the current user is not an admin of any of the projects the key provides access to, none are returned.
     * @param keyId The key id
     * @param withRestrictions Include the readOnly field. The `readOnly` field is contextual for the user making the request. `readOnly` returns true if there is a restriction and the user does not have`PROJECT_ADMIN` access for the repository the key is associated with.
     * @returns any The SSH key with ID <code>keyId</code>.
     * @throws ApiError
     */
    public static getForRepositories(
        keyId: string,
        withRestrictions?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/keys/latest/ssh/{keyId}/repos',
            path: {
                'keyId': keyId,
            },
            query: {
                'withRestrictions': withRestrictions,
            },
            errors: {
                404: `The specified key does not exist.`,
            },
        });
    }
    /**
     * Delete all user SSH key
     * Delete all SSH keys for a supplied user.
     * @param userName the username of the user to delete the keys for. If no username is specified, the SSH keys will be deleted for the current authenticated user.
     * @param user
     * @returns void
     * @throws ApiError
     */
    public static deleteSshKeys(
        userName?: string,
        user?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ssh/latest/keys',
            query: {
                'userName': userName,
                'user': user,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the SSH keys. This is only possible when a <strong>user</strong> is explicitly supplied.`,
                404: `No user matches the supplied <strong>user</strong>`,
            },
        });
    }
    /**
     * Get SSH keys for user
     * Retrieve a page of SSH keys.
     * @param userName the username of the user to retrieve the keys for. If no username is specified, the SSH keys will be retrieved for the current authenticated user.
     * @param user
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A page of SSH keys.
     * @throws ApiError
     */
    public static getSshKeys(
        userName?: string,
        user?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestSshKey>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ssh/latest/keys',
            query: {
                'userName': userName,
                'user': user,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissionsto retrieve the SSH keys. This is only possible when a<strong>user</strong> is explicitly supplied.`,
                404: `No user matches the supplied <strong>user</strong>`,
            },
        });
    }
    /**
     * Add SSH key for user
     * Add a new SSH key to a supplied user.
     * @param user the username of the user to add the SSH key for. If no username is specified, the SSH key will be added for the current authenticated user.
     * @param requestBody
     * @returns RestSshKey The newly created SSH key.
     * @throws ApiError
     */
    public static addSshKey(
        user?: any,
        requestBody?: {
            algorithmType?: string;
            bitLength?: number;
            readonly createdDate?: string;
            expiryDays?: number;
            readonly fingerprint?: string;
            readonly id?: number;
            label?: string;
            readonly lastAuthenticated?: string;
            text?: string;
            /**
             * Contains a warning about the key, for example that it's deprecated
             */
            readonly warning?: string;
        },
    ): CancelablePromise<RestSshKey> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ssh/latest/keys',
            query: {
                'user': user,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The SSH key was not created because the key was not a valid RSA/DSA/ECDSA/Ed25519 key of a supported length.`,
                401: `Either there is no authenticated user or the currently authenticated user has insufficient permissions to add an SSH key. The latter is only possible when a <strong>user</strong> is explicitly supplied.`,
                404: `No user matches the supplied <strong>user</strong>`,
                409: `The SSH key already exists on the system.`,
            },
        });
    }
    /**
     * Remove SSH key
     * Delete an SSH key.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param keyId the id of the key to delete.
     * @returns void
     * @throws ApiError
     */
    public static deleteSshKey(
        keyId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ssh/latest/keys/{keyId}',
            path: {
                'keyId': keyId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the SSH key.`,
            },
        });
    }
    /**
     * Get SSH key for user by keyId
     * Retrieve an SSH key by keyId
     *
     * The authenticated user must have <strong>ADMIN</strong> permission or higher to call this resource.
     * @param keyId the ID of the key to retrieve.
     * @returns RestSshKey An SSH key.
     * @throws ApiError
     */
    public static getSshKey(
        keyId: string,
    ): CancelablePromise<RestSshKey> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ssh/latest/keys/{keyId}',
            path: {
                'keyId': keyId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissionsto retrieve the SSH key. This is only possible when a<strong>keyId</strong> is explicitly supplied.`,
                404: `No SSH key matches the supplied <strong>keyId</strong>`,
            },
        });
    }
    /**
     * Get SSH settings
     * Gets the SSH settings from the upstream.
     * @returns RestSshSettings The ssh settings from upstream
     * @throws ApiError
     */
    public static sshSettings(): CancelablePromise<RestSshSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ssh/latest/settings',
            errors: {
                401: `The request was not authenticated`,
            },
        });
    }
    /**
     * Get all configured IdPs
     * Returns a page of configured IdPs.
     *
     * This endpoint makes no guarantees to ordering besides the ordering being consistent.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 50 is used. A limit of -1 means that the request will fetch all results.
     * @returns any A page of configured IdPs.
     * @throws ApiError
     */
    public static getIdps(
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        results?: Array<IdpConfigEntity>;
        size?: number;
        start?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authconfig/latest/idps',
            query: {
                'start': start,
                'limit': limit,
            },
        });
    }
    /**
     * Create IdP configuration
     * Creates a new IdP configuration.
     * @param requestBody The configuration of the new IdP to add. The ID must be null.
     * @returns IdpConfigEntity The newly created IdP configuration.
     * @throws ApiError
     */
    public static addIdp(
        requestBody?: IdpConfigEntity,
    ): CancelablePromise<IdpConfigEntity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authconfig/latest/idps',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The provided IdP configuration was either incorrect or invalid.`,
            },
        });
    }
    /**
     * Delete IdP configuration
     * Removes the configuration for the IdP that matches the given ID.
     * @param id The ID of the IdP
     * @returns IdpConfigEntity The IdP configuration was successfully deleted.
     * @throws ApiError
     */
    public static removeIdp(
        id: string,
    ): CancelablePromise<IdpConfigEntity> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/authconfig/latest/idps/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get IdP configuration
     * Returns the configuration for the IdP that matches the given ID.
     * @param id The ID of the IdP
     * @returns IdpConfigEntity The configuration for the given IdP.
     * @throws ApiError
     */
    public static getIdp(
        id: string,
    ): CancelablePromise<IdpConfigEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authconfig/latest/idps/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update IdP configuration
     * Updates the configuration for the IdP that matches the given ID.
     *
     * Only the provided properties will be applied to the IdP configuration.
     * @param id The ID of the IdP
     * @param requestBody A request containing the IdP configuration to update. The ID must either be null or equal to the ID specified in the path.
     * @returns IdpConfigEntity The updated configuration for the given IdP.
     * @throws ApiError
     */
    public static updateIdp(
        id: string,
        requestBody?: IdpConfigEntity,
    ): CancelablePromise<IdpConfigEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/authconfig/latest/idps/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The provided IdP configuration was either incorrect or invalid.`,
            },
        });
    }
    /**
     * Get all JIT provisioned users
     * Returns a list of all the users created by JIT (Just-in-time) provisioning.
     *
     * Just-in-time user provisioning (JIT provisioning) allows users to be created and updated automatically when they log in through SAML SSO or OpenID Connect (OIDC) SSO.
     * @returns JitUserEntity A list of JIT users
     * @throws ApiError
     */
    public static getJitProvisionedUsers(): CancelablePromise<JitUserEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authconfig/latest/jit-users',
        });
    }
    /**
     * Get available login options
     * Returns a list of available login options, which contains details about the metadata required for the login page.
     *
     * Only enabled login options will be returned. Login options can either be the native login form or the configured IdPs.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 50 is used. A limit of -1 means that the request will fetch all results.
     * @returns any A list of login options
     * @throws ApiError
     */
    public static getLoginOptions(
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        results?: Array<LoginOptionEntity>;
        size?: number;
        start?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authconfig/latest/login-options',
            query: {
                'start': start,
                'limit': limit,
            },
        });
    }
    /**
     * Get SSO configuration
     * Returns the SSO configuration.
     * @returns SsoConfigEntity The SSO configuration
     * @throws ApiError
     */
    public static getConfig(): CancelablePromise<SsoConfigEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authconfig/latest/sso',
        });
    }
    /**
     * Update SSO configuration
     * Update the SSO configuration.
     * @param requestBody A request containing the SSO configuration to update.
     * @returns SsoConfigEntity The updated SSO Configuration
     * @throws ApiError
     */
    public static updateConfig(
        requestBody?: SsoConfigEntity,
    ): CancelablePromise<SsoConfigEntity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/authconfig/latest/sso',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The provided SSO configuration was invalid.`,
            },
        });
    }
    /**
     * Get basic auth configuration
     * Get the current configuration for blocking basic authentication requests.
     * @returns BasicAuthConfigEntity The blocking basic authentication configuration.
     * @throws ApiError
     */
    public static get(): CancelablePromise<BasicAuthConfigEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/basicauth/latest/config',
        });
    }
    /**
     * Update basic auth configuration
     * Store a new configuration for blocking basic authentication requests.
     * @param requestBody A request containing the new basic authentication configuration.
     * @returns void
     * @throws ApiError
     */
    public static put(
        requestBody?: BasicAuthConfigEntity,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/basicauth/latest/config',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Unable to update the basic authentication blocking configuration as another update is currently being performed.`,
            },
        });
    }
    /**
     * Authenticate with 2SV
     * Authenticates as the given user. This endpoint <strong>may</strong>:
     *
     * - Ask for two-step verification if the user has enrolled; or
     * - Enforce enrollment in two-step verification if two-step verification enforcement is configured for the instance and the user is not yet enrolled.
     * @param requestBody
     * @returns AuthenticationResponse The user has successfully authenticated.
     * @throws ApiError
     */
    public static authenticate(
        requestBody?: AuthenticationEntity,
    ): CancelablePromise<AuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/authenticate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The given user failed authentication.`,
                412: `The user must undergo additional verification or enroll in two-step verification in order to authenticate`,
            },
        });
    }
    /**
     * Get CAPTCHA challenge
     * Provides data for a CAPTCHA challenge.
     * @returns CaptchaDataEntity The CAPTCHA challenge
     * @throws ApiError
     */
    public static getCaptchaData(): CancelablePromise<CaptchaDataEntity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tsv/latest/authenticate/captcha',
        });
    }
    /**
     * Authenticate using recovery code
     * Authenticate as the given user using a recovery code.
     * @param requestBody A request containing a recovery code for the specified user.
     * @returns AuthenticationResponse The user was successfully logged in.
     * @throws ApiError
     */
    public static authenticateWithRecoveryCode(
        requestBody?: TotpRecoveryCodeAuthenticationDTO,
    ): CancelablePromise<AuthenticationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/authenticate/recovery-code',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested conversation cannot be found or is not valid in the requested context.`,
                401: `The recovery code provided was incorrect.`,
            },
        });
    }
    /**
     * Authenticate using TOTP code
     * Authenticate as the given user using a TOTP code.
     * @param requestBody A request containing a TOTP code for the given user.
     * @returns void
     * @throws ApiError
     */
    public static verifyCode(
        requestBody?: TotpCodeVerificationDTO,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/authenticate/totp-code',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested conversation cannot be found or is not valid in the requested context.`,
                401: `The TOTP code provided was incorrect.`,
            },
        });
    }
    /**
     * Get elevated session status
     * Checks the state of an elevated session for the currently authenticated user.
     * @param actionType The type of action being performed.
     * @returns void
     * @throws ApiError
     */
    public static getElevatedPermissionStatus(
        actionType?: 'unlock-user-2sv-settings',
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tsv/latest/elevate-permissions',
            query: {
                'actionType': actionType,
            },
            errors: {
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Create elevated session with password
     * Elevate permissions by providing the password for the currently authenticated user. This will create an elevated session.
     * @param actionType The type of action being performed.
     * @param requestBody A request containing the password for the currently authenticated user.
     * @returns void
     * @throws ApiError
     */
    public static elevatePermissionsWithPassword(
        actionType?: 'unlock-user-2sv-settings',
        requestBody?: TotpElevationRestDTO,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/elevate-permissions/password',
            query: {
                'actionType': actionType,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The user has entered an incorrect password or the requested action cannot be confirmed with a password.`,
                403: `The user cannot perform the requested action.`,
            },
        });
    }
    /**
     * Create elevated session with recovery code
     * Elevate permissions by providing a recovery code for the currently authenticated user. This will create an elevated session.
     * @param actionType The type of action being performed.
     * @param requestBody A request containing a recovery code for the currently authenticated user.
     * @returns TotpRecoveryCodeDTO Permissions were successfully elevated.
     * @throws ApiError
     */
    public static elevatePermissionsWithRecoveryCode(
        actionType?: 'unlock-user-2sv-settings',
        requestBody?: TotpRecoveryCodeDTO,
    ): CancelablePromise<TotpRecoveryCodeDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/elevate-permissions/recovery-code',
            query: {
                'actionType': actionType,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The recovery code provided was incorrect.`,
                403: `The user cannot perform the requested action.`,
            },
        });
    }
    /**
     * Create elevated session with TOTP
     * Elevate permissions by providing a TOTP code for the currently authenticated user. This will create an elevated session.
     * @param actionType The type of action being performed.
     * @param requestBody A request containing a TOTP code for the given user.
     * @returns void
     * @throws ApiError
     */
    public static elevatePermissionsWithTotp(
        actionType?: 'unlock-user-2sv-settings',
        requestBody?: TotpElevationRestDTO,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/elevate-permissions/totp',
            query: {
                'actionType': actionType,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following error cases occurred (check the error message for more details).
                - The user has entered an incorrect TOTP code
                - The requested action cannot be confirmed with a TOTP code
                - The user is not enrolled in two-step verification
                `,
                403: `The user cannot perform the requested action.`,
            },
        });
    }
    /**
     * Get SSO management status
     * Retrieves the status of the SSO management for the currently authenticated user.
     * @returns SsoManagementStatusDTO Successfully retrieved SSO management status
     * @throws ApiError
     */
    public static getSsoManagementStatus(): CancelablePromise<SsoManagementStatusDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tsv/latest/sso-management-status',
            errors: {
                401: `Failed to retrieve SSO management status due to unauthenticated user`,
            },
        });
    }
    /**
     * Get two-step verification status
     * Retrieves the status of two-step verification for the currently authenticated user.
     * @returns StatusDTO Successfully retrieved the two-step verification status.
     * @throws ApiError
     */
    public static getStatus(): CancelablePromise<StatusDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tsv/latest/status',
        });
    }
    /**
     * Complete enforced enrollment in 2SV
     * Complete enforced enrollment in two-step verification by verifying the provided TOTP code and creating a new session for the given user.
     * @param requestBody A request containing a TOTP code for the given user.
     * @returns TotpRecoveryCodeDTO Enrollment successfully completed.
     * @throws ApiError
     */
    public static completeEnforcedEnrollment(
        requestBody?: TotpCodeVerificationDTO,
    ): CancelablePromise<TotpRecoveryCodeDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/complete-enforced-enrollment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested enrollment conversation cannot be found or the user is already enrolled in two-step verification.`,
            },
        });
    }
    /**
     * Complete authentication app update for 2SV
     * Complete update of the authentication app used for two-step verification by verifying the provided TOTP code.
     * @param requestBody A request containing a TOTP code for the given user.
     * @returns TotpUserEnrollmentDTO Authentication app successfully updated.
     * @throws ApiError
     */
    public static completeAuthenticationChange(
        requestBody?: TotpCodeVerificationDTO,
    ): CancelablePromise<TotpUserEnrollmentDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/complete-enrollment-update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested authentication app conversation cannot be found or the user is not enrolled in two-step verification`,
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Complete voluntary enrollment in 2SV
     * Complete voluntary enrollment in two-step verification by verifying the provided TOTP code and creating a new session for the given user.
     * @param requestBody A request containing a TOTP code for the given user.
     * @returns TotpUserEnrollmentDTO Enrollment successfully completed.
     * @throws ApiError
     */
    public static completeVoluntaryEnrollment(
        requestBody?: TotpCodeVerificationDTO,
    ): CancelablePromise<TotpUserEnrollmentDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/complete-voluntary-enrollment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested enrollment conversation cannot be found or the user is already enrolled in two-step verification.`,
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Rotate recovery code
     * Rotates the recovery code for the currently authentication user.
     * @returns TotpRecoveryCodeDTO The recovery code has been successfully rotated.
     * @throws ApiError
     */
    public static rotateRecoverCode(): CancelablePromise<TotpRecoveryCodeDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/recovery-code/rotate',
            errors: {
                400: `The request has failed due to the user not being enrolled in two-step verification.`,
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Start enforced enrollment in 2SV
     * Start or resume enforced enrollment in two-step verification by returning the conversation details.
     *
     * There are two ways to enroll in two-step verification: voluntary and enforced. Enrollment is a two-step process. First, the user starts the enrollment process via <code>/start-voluntary-enrollment</code> or <code>/start-enforced-enrollment</code>. Second and final step is to complete the enrollment via <code>/complete-voluntary-enrollment</code> or <code>/complete-enforced-enrollment</code>. In the case of enforced enrollment, the conversation is started at the time of login via <code>/authenticate</code>.
     * @param requestBody
     * @returns TotpUserEnrollmentDTO A conversation has successfully started.
     * @throws ApiError
     */
    public static startEnforcedEnrollment(
        requestBody?: ConversationDTO,
    ): CancelablePromise<TotpUserEnrollmentDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/start-enforced-enrollment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The requested enrollment conversation cannot be found or is not valid in the requested context.`,
            },
        });
    }
    /**
     * Start authentication app update for 2SV
     * Start the process of changing the authentication app used for two-step verification by creating a conversation.
     * @returns TotpUserEnrollmentDTO A conversation has successfully started.
     * @throws ApiError
     */
    public static startEnrollmentUpdate(): CancelablePromise<TotpUserEnrollmentDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/start-enrollment-update',
            errors: {
                400: `The user is not enrolled in two-step verification using TOTP.`,
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Start voluntary enrollment in 2SV
     * Start voluntary enrollment in two-step verification by creating a conversation.
     *
     * There are two ways to enroll in two-step verification: voluntary and enforced. Enrollment is a two-step process. First, the user starts the enrollment process via <code>/start-voluntary-enrollment</code> or <code>/start-enforced-enrollment</code>. Second and final step is to complete the enrollment via <code>/complete-voluntary-enrollment</code> or <code>/complete-enforced-enrollment</code>. In the case of enforced enrollment, the conversation is started at the time of login via <code>/authenticate</code>.
     * @returns TotpUserEnrollmentDTO A conversation has successfully started.
     * @throws ApiError
     */
    public static startVoluntaryEnrollment(): CancelablePromise<TotpUserEnrollmentDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tsv/latest/totp/start-voluntary-enrollment',
            errors: {
                400: `The user is already enrolled in two-step verification using TOTP.`,
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Uneroll current user from two-step verification
     * Unenroll the currently authenticated user from two-step verification.
     * @returns void
     * @throws ApiError
     */
    public static unenroll(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tsv/latest/totp/unenroll',
            errors: {
                400: `No enrollment found for the currently authenticated user.`,
                401: `The currently authenticated user requires an elevated session to perform this request.`,
            },
        });
    }
    /**
     * Unenroll specific user from two-step verification
     * Unenroll a user from two-step verification specified by the given username.
     * @param userName username
     * @param requestBody A request containing a TOTP code for the given user.
     * @returns void
     * @throws ApiError
     */
    public static unenrollUser(
        userName: string,
        requestBody?: TotpElevationRestDTO,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tsv/latest/totp/unenroll/user/{userName}',
            path: {
                'userName': userName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No enrollment found for the specified user.`,
                401: `The user has entered an invalid TOTP code.`,
                403: `The user cannot unenroll themselves.`,
                404: `No user matches the supplied <strong>username</strong>.`,
            },
        });
    }
}

