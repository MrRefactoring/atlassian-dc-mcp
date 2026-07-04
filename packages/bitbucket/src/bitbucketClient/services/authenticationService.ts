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
}

