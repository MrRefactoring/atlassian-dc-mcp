/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExampleAvatarMultipartFormData } from '../models/exampleAvatarMultipartFormData.js';
import type { ExamplePostMultipartFormData } from '../models/examplePostMultipartFormData.js';
import type { ExamplePreviewMigration } from '../models/examplePreviewMigration.js';
import type { ExamplePutMultipartFormData } from '../models/examplePutMultipartFormData.js';
import type { ExampleSettingsMap } from '../models/exampleSettingsMap.js';
import type { RestAggregateRejectCounter } from '../models/restAggregateRejectCounter.js';
import type { RestAnnouncementBanner } from '../models/restAnnouncementBanner.js';
import type { RestApplicationProperties } from '../models/restApplicationProperties.js';
import type { RestApplicationUser } from '../models/restApplicationUser.js';
import type { RestBitbucketLicense } from '../models/restBitbucketLicense.js';
import type { RestBulkUserRateLimitSettingsUpdateRequest } from '../models/restBulkUserRateLimitSettingsUpdateRequest.js';
import type { RestClusterInformation } from '../models/restClusterInformation.js';
import type { RestExportRequest } from '../models/restExportRequest.js';
import type { RestHookScript } from '../models/restHookScript.js';
import type { RestImportRequest } from '../models/restImportRequest.js';
import type { RestJob } from '../models/restJob.js';
import type { RestJobMessage } from '../models/restJobMessage.js';
import type { RestLabel } from '../models/restLabel.js';
import type { RestLabelable } from '../models/restLabelable.js';
import type { RestLoggingSettings } from '../models/restLoggingSettings.js';
import type { RestLogLevel } from '../models/restLogLevel.js';
import type { RestMailConfiguration } from '../models/restMailConfiguration.js';
import type { RestMeshConnectivityReport } from '../models/restMeshConnectivityReport.js';
import type { RestMeshMigrationRequest } from '../models/restMeshMigrationRequest.js';
import type { RestMeshMigrationSummary } from '../models/restMeshMigrationSummary.js';
import type { RestMeshNode } from '../models/restMeshNode.js';
import type { RestMigrationRepository } from '../models/restMigrationRepository.js';
import type { RestNamedLink } from '../models/restNamedLink.js';
import type { RestRateLimitSettings } from '../models/restRateLimitSettings.js';
import type { RestRepositoryPolicy } from '../models/restRepositoryPolicy.js';
import type { RestScopesExample } from '../models/restScopesExample.js';
import type { RestSshKeySettings } from '../models/restSshKeySettings.js';
import type { RestUserRateLimitSettings } from '../models/restUserRateLimitSettings.js';
import type { RestUserRateLimitSettingsUpdateRequest } from '../models/restUserRateLimitSettingsUpdateRequest.js';
import type { UserPasswordUpdate } from '../models/userPasswordUpdate.js';
import type { UserUpdateWithCredentials } from '../models/userUpdateWithCredentials.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class SystemMaintenanceService {
    /**
     * Dismiss retention config notification
     * Dismisses the retention config review notification displayed by the audit plugin for the user that's currently logged in.
     * @returns any A blank response
     * @throws ApiError
     */
    public static dismissRetentionConfigReviewNotification(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/audit/latest/notification-settings/retention-config-review',
            errors: {
                401: `The currently authenticated user has insufficient permissions to dismiss the notification.`,
            },
        });
    }
    /**
     * Get repository archive policy
     * Retrieves the repository archive policy for the instance.
     *
     * The user must be authenticated to access this resource.
     * @returns RestRepositoryPolicy A response containing the repository archive policy for the instance
     * @throws ApiError
     */
    public static getRepositoryArchivePolicy(): CancelablePromise<RestRepositoryPolicy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/policies/latest/admin/repos/archive',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the repository archive policy`,
            },
        });
    }
    /**
     * Update repository archive policy
     * Sets the repository archive policy for the instance.
     *
     * The authenticated user must have <b>SYS_ADMIN</b> permission.
     * @param requestBody The request containing the details of the policy.
     * @returns RestRepositoryPolicy A response containing the repository archive policy for the instance
     * @throws ApiError
     */
    public static setRepositoryArchivePolicy(
        requestBody?: RestRepositoryPolicy,
    ): CancelablePromise<RestRepositoryPolicy> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/policies/latest/admin/repos/archive',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The permission was invalid or does not exist`,
                401: `The currently authenticated user has insufficient permissions to set the repository archive policy`,
            },
        });
    }
    /**
     * Get repository delete policy
     * Retrieves the repository delete policy for the instance.
     *
     * The user must be authenticated to access this resource.
     * @returns RestRepositoryPolicy A response containing the repository delete policy for the instance
     * @throws ApiError
     */
    public static getRepositoryDeletePolicy(): CancelablePromise<RestRepositoryPolicy> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/policies/latest/admin/repos/delete',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the repository delete policy`,
            },
        });
    }
    /**
     * Update the repository delete policy
     * Sets the repository delete policy for the instance.
     *
     * The authenticated user must have <b>SYS_ADMIN</b> permission.
     * @param requestBody The request containing the details of the policy.
     * @returns RestRepositoryPolicy A response containing the repository delete policy for the instance
     * @throws ApiError
     */
    public static setRepositoryDeletePolicy(
        requestBody?: RestRepositoryPolicy,
    ): CancelablePromise<RestRepositoryPolicy> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/policies/latest/admin/repos/delete',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The permission was invalid or does not exist`,
                401: `The currently authenticated user has insufficient permissions to set the repository delete policy`,
            },
        });
    }
    /**
     * Get global SSH key settings
     * Gets the global settings that enforce the maximum expiry of SSH keys and restrictions on SSH key types.
     * @returns RestSshKeySettings The global ssh key settings configuration.
     * @throws ApiError
     */
    public static getGlobalSettings(): CancelablePromise<RestSshKeySettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the ssh keys global settings configuration.`,
            },
        });
    }
    /**
     * Update global SSH key settings
     * Updates the global settings that enforces the maximum expiry of SSH keys and restrictions on SSH key types.
     * @param requestBody A request containing expiry length to be set for SSH keys and a list of SSH key type restrictions.
     * @returns void
     * @throws ApiError
     */
    public static updateGlobalSettings(
        requestBody?: RestSshKeySettings,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was invalid, which may be due to:
                - attempted to set expiry to less than 1 day
                - attempted to set expiry using partial days
                - attempted to set a restriction on a key type which was invalid
                The exact reason for the error will be provided in the error message.`,
                401: `The currently authenticated user has insufficient permissions to update these settings.`,
            },
        });
    }
    /**
     * Get supported SSH key algorithms and lengths
     * Retrieves a list of all supported SSH key algorithms and lengths.
     * @returns any A list of supported SSH key algorithms and lengths.
     * @throws ApiError
     */
    public static getSupportedKeyTypes(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/supported-key-types',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve this list.`,
            },
        });
    }
    /**
     * Delete announcement banner
     * Deletes a banner, if one is present in the database.
     * @returns void
     * @throws ApiError
     */
    public static deleteBanner(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/banner',
            errors: {
                401: `The user does not have permission to access the banner service through this endpoint`,
            },
        });
    }
    /**
     * Get announcement banner
     * Gets the announcement banner, if one exists and is available to the user
     * @returns RestAnnouncementBanner The requested banner
     * @throws ApiError
     */
    public static getBanner(): CancelablePromise<RestAnnouncementBanner> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/banner',
            errors: {
                401: `The user does not have permission to access the banner service through this endpoint`,
            },
        });
    }
    /**
     * Update/Set announcement banner
     * Sets the announcement banner with the provided JSON.
     * Only users authenticated as Admins may call this resource
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static setBanner(
        requestBody?: {
            audience: 'AUTHENTICATED' | 'ALL';
            enabled?: boolean;
            message?: string;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/banner',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `There was malformed or incorrect data in the provided JSON`,
                401: `The user does not have permission to access the banner service through this endpoint`,
            },
        });
    }
    /**
     * Get cluster node information
     * Gets information about the nodes that currently make up the stash cluster.
     *
     * The authenticated user must have the <strong>SYS_ADMIN</strong> permission to call this resource.
     * @returns RestClusterInformation A response containing information about the cluster
     * @throws ApiError
     */
    public static getInformation(): CancelablePromise<RestClusterInformation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/cluster',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the cluster information.`,
            },
        });
    }
    /**
     * Clear default branch
     * Clears the global default branch, which is used when creating new repositories if an explicit default branch is not specified, if one has been configured.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @returns void
     * @throws ApiError
     */
    public static clearDefaultBranch(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/default-branch',
            errors: {
                401: `The current user does not have sufficient permissions to clear the global default branch.`,
            },
        });
    }
    /**
     * Get the default branch
     * Retrieves the configured global default branch, which is used when creating new repositories if an explicit default branch is not specified.
     *
     * The user must be authenticated to call this resource.
     * @returns any The configured global default branch.
     * @throws ApiError
     */
    public static getDefaultBranch(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/default-branch',
            errors: {
                404: `No global default branch has been configured.`,
            },
        });
    }
    /**
     * Update/Set default branch
     * Configures the global default branch, which is used when creating new repositories if an explicit default branch is not specified.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static setDefaultBranch(
        requestBody?: {
            id?: string;
        },
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/default-branch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The current user does not have sufficient permissions to configure the global default branch.`,
            },
        });
    }
    /**
     * Get the control plane PEM
     * Obtain the control plane PEM.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @returns any The control plane PEM.
     * @throws ApiError
     */
    public static getControlPlanePublicKey(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/git/mesh/config/control-plane.pem',
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Generate Mesh connectivity report
     * Generates a connectivity report between the Bitbucket node(s) and the Mesh node(s).
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @returns RestMeshConnectivityReport The connectivity report between the Bitbucket node(s) and Mesh node(s).
     * @throws ApiError
     */
    public static connectivity(): CancelablePromise<RestMeshConnectivityReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/git/mesh/diagnostics/connectivity',
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Get all registered Mesh nodes
     * Get all the registered Mesh nodes.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @returns RestMeshNode The list of registered Mesh nodes.
     * @throws ApiError
     */
    public static getAllRegisteredMeshNodes(): CancelablePromise<RestMeshNode> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/git/mesh/nodes',
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Register new Mesh node
     * Register a new Mesh node.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @param requestBody The request specifying the new Mesh node.
     * @returns RestMeshNode The newly registered Mesh node.
     * @throws ApiError
     */
    public static registerNewMeshNode(
        requestBody?: RestMeshNode,
    ): CancelablePromise<RestMeshNode> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/git/mesh/nodes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Delete Mesh node
     * Delete a Mesh node
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @param id
     * @param force
     * @returns any default response
     * @throws ApiError
     */
    public static delete2(
        id: number,
        force: boolean = false,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/git/mesh/nodes/{id}',
            path: {
                'id': id,
            },
            query: {
                'force': force,
            },
        });
    }
    /**
     * Get Mesh node
     * Get the registered Mesh node that matches the supplied ID.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @param id The ID of the Mesh node.
     * @returns RestMeshNode The Mesh node that matches the ID.
     * @throws ApiError
     */
    public static getRegisteredMeshNodeById(
        id: string,
    ): CancelablePromise<RestMeshNode> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/git/mesh/nodes/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
                404: `The Mesh node does not exist.`,
            },
        });
    }
    /**
     * Update Mesh node
     * Update a Mesh node.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @param id The ID of the Mesh node to update.
     * @param requestBody The request specifying the updated Mesh node.
     * @returns RestMeshNode The updated Mesh node.
     * @throws ApiError
     */
    public static updateMeshNode(
        id: string,
        requestBody?: RestMeshNode,
    ): CancelablePromise<RestMeshNode> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/git/mesh/nodes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The request was malformed.`,
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Get support zips for all Mesh nodes
     * Get the support zips for all the Mesh nodes.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @returns any The support zips for all the Mesh nodes.
     * @throws ApiError
     */
    public static getSupportZips(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/git/mesh/support-zips',
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
            },
        });
    }
    /**
     * Get support zip for node
     * Get the support zip for the Mesh node that matches the specified ID.
     *
     * The authenticated user must have **SYS_ADMIN** permission.
     * @param id The ID of the Mesh node.
     * @returns any The support zip for the Mesh node that matches the ID.
     * @throws ApiError
     */
    public static getSupportZip(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/git/mesh/support-zips/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to call this resource.`,
                404: `The Mesh node does not exist.`,
            },
        });
    }
    /**
     * Get license details
     * Retrieves details about the current license, as well as the current status of the system with regards to the installed license. The status includes the current number of users applied toward the license limit, as well as any status messages about the license (warnings about expiry or user counts exceeding license limits).
     *
     * The authenticated user must have <b>ADMIN</b> permission. Unauthenticated users, and non-administrators, are not permitted to access license details.
     * @returns RestBitbucketLicense The currently-installed license.
     * @throws ApiError
     */
    public static get2(): CancelablePromise<RestBitbucketLicense> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/license',
            errors: {
                401: `The currently authenticated user has insufficient permissions to view the license, or the request is anonymous.`,
                404: `No license has been installed.`,
            },
        });
    }
    /**
     * Update license
     * Decodes the provided encoded license and sets it as the active license. If no license was provided, a 400 is returned. If the license cannot be decoded, or cannot be applied, a 409 is returned. Some possible reasons a license may not be applied include:
     *
     * - It is for a different product
     * - It is already expired
     *
     *
     * Otherwise, if the license is updated successfully, details for the new license are returned with a 200 response.
     *
     * <b>Warning</b>: It is possible to downgrade the license during update, applying a license with a lower number of permitted users. If the number of currently-licensed users exceeds the limits of the new license, pushing will be disabled until the licensed user count is brought into compliance with the new license.
     *
     * The authenticated user must have <b>SYS_ADMIN</b> permission. <b>ADMIN</b> users may <i>view</i> the current license details, but they may not <i>update</i> the license.
     * @param requestBody a JSON payload containing the encoded license to apply
     * @returns RestBitbucketLicense The newly-installed license.
     * @throws ApiError
     */
    public static updateLicense(
        requestBody?: RestBitbucketLicense,
    ): CancelablePromise<RestBitbucketLicense> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/license',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No encoded license was provided in the JSON body for the POST.`,
                401: `The currently authenticated user has insufficient permissions to update the license.`,
                409: `The encoded license could not be decoded, or it is not valid for use on this server. Some possible reasons a license may not be applied include: it may be for a different product, it may have already expired, or this Bitbucket version doesn't support Server licenses.`,
            },
        });
    }
    /**
     * Delete mail configuration
     * Deletes the current mail configuration.
     *
     * The authenticated user must have the <strong>SYS_ADMIN</strong> permission to call this resource.
     * @returns void
     * @throws ApiError
     */
    public static deleteMailConfig(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/mail-server',
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete the mail server configuration.`,
            },
        });
    }
    /**
     * Get mail configuration
     * Retrieves the current mail configuration.
     *
     * The authenticated user must have the <strong>SYS_ADMIN</strong> permission to call this resource.
     * @returns RestMailConfiguration The mail configuration
     * @throws ApiError
     */
    public static getMailConfig(): CancelablePromise<RestMailConfiguration> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/mail-server',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the mail configuration.`,
                404: `The mail server hasn't been configured`,
            },
        });
    }
    /**
     * Update mail configuration
     * Updates the mail configuration.
     *
     * The authenticated user must have the <strong>SYS_ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns RestMailConfiguration The updated mail configuration.
     * @throws ApiError
     */
    public static setMailConfig(
        requestBody?: {
            hostname?: string;
            password?: string;
            port?: number;
            protocol?: 'SMTP' | 'SMTPS';
            requireStartTls?: boolean;
            senderAddress?: string;
            useStartTls?: boolean;
            username?: string;
        },
    ): CancelablePromise<RestMailConfiguration> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/mail-server',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The mail configuration was not updated due to a validation error.`,
                401: `The currently authenticated user has insufficient permissions to update themail configuration.`,
            },
        });
    }
    /**
     * Update mail configuration
     * Clears the server email address.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @returns void
     * @throws ApiError
     */
    public static clearSenderAddress(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/mail-server/sender-address',
            errors: {
                401: `The currently authenticated user has insufficient permissions toclear the server email address.`,
            },
        });
    }
    /**
     * Get server mail address
     * Retrieves the server email address
     * @returns any The server email address
     * @throws ApiError
     */
    public static getSenderAddress(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/mail-server/sender-address',
            errors: {
                401: `he currently authenticated user has insufficient permissions to retrieve the server email address.`,
            },
        });
    }
    /**
     * Update server mail address
     * Updates the server email address
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns any The from address used in notification emails
     * @throws ApiError
     */
    public static setSenderAddress(
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/mail-server/sender-address',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The server email address was not updated due to a validation error.`,
                401: `The currently authenticated user has insufficient permissions to update the server email address.`,
            },
        });
    }
    /**
     * Get rate limit history
     * Retrieves the recent rate limit history for the instance.
     *
     * The authenticated user must have the <strong>ADMIN</strong> permission to call this resource.
     * @param order An optional sort category to arrange the results in descending order
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A response containing a page of aggregated counters for users who have been recently rate limited.
     * @throws ApiError
     */
    public static getHistory(
        order?: 'NEWEST' | 'FREQUENCY',
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestAggregateRejectCounter>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/rate-limit/history',
            query: {
                'order': order,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The sort query parameter is invalid.`,
                401: `The currently authenticated user has insufficient permissions to retrieve rate limit history.`,
            },
        });
    }
    /**
     * Get rate limit settings
     * Retrieves the rate limit settings for the instance.
     *
     * The user must be authenticated to call this resource.
     * @returns RestRateLimitSettings A response containing the rate limit plugin settings for the instance.
     * @throws ApiError
     */
    public static getSettings3(): CancelablePromise<RestRateLimitSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/rate-limit/settings',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve rate limit settings.`,
            },
        });
    }
    /**
     * Set rate limit
     * Sets the rate limit settings for the instance.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody Sets the rate limit settings for the instance.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @returns RestRateLimitSettings A response containing the updated rate limit plugin settings for the instance.
     * @throws ApiError
     */
    public static setSettings3(
        requestBody?: RestRateLimitSettings,
    ): CancelablePromise<RestRateLimitSettings> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/rate-limit/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following error cases occurred (check the error message for more details):
                - The request is empty
                - The enabled field of the request is not a boolean
                - The defaultSettings field of the request does not contain both capacity and fillRate
                - The capacity and fillRate are not positive integers
                `,
                401: `The currently authenticated user has insufficient permissions to set rate limit settings.`,
            },
        });
    }
    /**
     * Get rate limit settings for user
     * Retrieves the user-specific rate limit settings for the given user.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @param filter Optional filter
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any A response containing all the user-specific rate limit settings filtered by the optional filter.
     * @throws ApiError
     */
    public static getAllRateLimitSettings(
        filter?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestUserRateLimitSettings>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/rate-limit/settings/users',
            query: {
                'filter': filter,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve rate limit settings.`,
            },
        });
    }
    /**
     * Set rate limit settings for users
     * Sets the given rate limit settings for the given users.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns RestUserRateLimitSettings A response containing the updated user settings.
     * @throws ApiError
     */
    public static set2(
        requestBody?: RestBulkUserRateLimitSettingsUpdateRequest,
    ): CancelablePromise<RestUserRateLimitSettings> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/admin/rate-limit/settings/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following valid state error cases occurred (check the error message for more details):
                - The request is empty
                - No users are provided in the request
                - One or more of the users are invalid
                - Whitelisted is false or not provided, and no settings are provided either
                - Whitelisted is false or not provided, settings are provided,   but do not contain both capacity and fillRate
                - Whitelisted is false or not provided, settings are provided,   but capacity and fillRate are not positive integers
                - Whitelisted is true, and settings are provided (only one must be provided)
                `,
                401: `The currently authenticated user has insufficient permissions to set user settings.`,
            },
        });
    }
    /**
     * Delete user specific rate limit settings
     * Deletes the user-specific rate limit settings for the given user.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @param userSlug The user slug.
     * @returns void
     * @throws ApiError
     */
    public static delete8(
        userSlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/admin/rate-limit/settings/users/{userSlug}',
            path: {
                'userSlug': userSlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve rate limit settings.`,
                404: `The specified user does not exist, or has no settings.`,
            },
        });
    }
    /**
     * Get user specific rate limit settings
     * Retrieves the user-specific rate limit settings for the given user.
     *
     * To call this resource, the user must be authenticated and either have <strong>ADMIN</strong> permission or be the same user as the one whose settings are requested. A user with <strong>ADMIN</strong> permission cannot get the settings of a user with <strong>SYS_ADMIN</strong> permission.
     * @param userSlug The user slug.
     * @returns RestUserRateLimitSettings A response containing the user-specific rate limit settings for the given user.
     * @throws ApiError
     */
    public static get6(
        userSlug: string,
    ): CancelablePromise<RestUserRateLimitSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/admin/rate-limit/settings/users/{userSlug}',
            path: {
                'userSlug': userSlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve rate limit settings.`,
                404: `The specified user does not exist, or has no settings.`,
            },
        });
    }
    /**
     * Set rate limit settings for user
     * Sets the given rate limit settings for the given user.
     *
     * The authenticated user must have <strong>ADMIN</strong> permission to call this resource.
     * @param userSlug The user slug.
     * @param requestBody
     * @returns RestUserRateLimitSettings A response containing the updated user settings
     * @throws ApiError
     */
    public static set3(
        userSlug: string,
        requestBody?: RestUserRateLimitSettingsUpdateRequest,
    ): CancelablePromise<RestUserRateLimitSettings> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/admin/rate-limit/settings/users/{userSlug}',
            path: {
                'userSlug': userSlug,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following valid state error cases occurred (check the error message for more details):
                - The request is empty
                - Whitelisted is false or not provided, and no settings are provided either
                - Whitelisted is false or not provided, settings are provided,   but do not contain both capacity and fillRate
                - Whitelisted is false or not provided, settings are provided,   but capacity and fillRate are not positive integers
                - Whitelisted is true, and settings are provided (only one must be provided)
                `,
                401: `The currently authenticated user has insufficient permissions to set user settings.`,
            },
        });
    }
    /**
     * Get application properties
     * Retrieve version information and other application properties.
     *
     * No authentication is required to call this resource.
     * @returns RestApplicationProperties The application properties
     * @throws ApiError
     */
    public static getApplicationProperties(): CancelablePromise<RestApplicationProperties> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/application-properties',
        });
    }
    /**
     * Create a new hook script
     * Create a new hook script.
     *
     * This endpoint requires **SYS_ADMIN** permission.
     * @param formData The multipart form data containing the hook script
     * @returns RestHookScript The newly created hook script.
     * @throws ApiError
     */
    public static createHookScript(
        formData?: ExamplePostMultipartFormData,
    ): CancelablePromise<RestHookScript> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/hook-scripts',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `The hook script was not created due to a validation error.`,
                401: `The currently authenticated user has insufficient permissions.`,
            },
        });
    }
    /**
     * Delete a hook script.
     * Deletes a registered hook script.
     *
     * This endpoint requires **SYS_ADMIN** permission.
     * @param scriptId The ID of the hook script to delete
     * @returns void
     * @throws ApiError
     */
    public static deleteHookScript(
        scriptId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/latest/hook-scripts/{scriptId}',
            path: {
                'scriptId': scriptId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions.`,
                404: `Unable to find the supplied hook script ID.`,
            },
        });
    }
    /**
     * Get a hook script
     * Retrieves a hook script by ID.
     * @param scriptId The ID of the hook script to retrieve
     * @returns RestHookScript The hook script.
     * @throws ApiError
     */
    public static getHookScript(
        scriptId: string,
    ): CancelablePromise<RestHookScript> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/hook-scripts/{scriptId}',
            path: {
                'scriptId': scriptId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions.`,
                404: `The hook script ID supplied does not exist.`,
            },
        });
    }
    /**
     * Update a hook script
     * Updates a hook script.
     *
     * This endpoint requires **SYS_ADMIN** permission.
     * @param scriptId The ID of the hook script
     * @param requestBody The multipart form data containing the hook script
     * @returns RestHookScript The updated hook script.
     * @throws ApiError
     */
    public static updateHookScript(
        scriptId: string,
        requestBody?: ExamplePutMultipartFormData,
    ): CancelablePromise<RestHookScript> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/hook-scripts/{scriptId}',
            path: {
                'scriptId': scriptId,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                401: `The currently authenticated user has insufficient permissions.`,
                404: `The hook script ID supplied does not exist.`,
                409: `A hook script with the same name already exists.`,
                422: `One or more fields to update must be specified: content, description and/or name.`,
            },
        });
    }
    /**
     * Get hook script content
     * Retrieves the hook script content.
     *
     * This endpoint requires **SYS_ADMIN** permission.
     * @param scriptId The ID of the hook script
     * @returns any The hook script content.
     * @throws ApiError
     */
    public static read(
        scriptId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/hook-scripts/{scriptId}/content',
            path: {
                'scriptId': scriptId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions.`,
                404: `The hook script ID supplied does not exist.`,
            },
        });
    }
    /**
     * Get all labels
     * Returns a paged response of all the labels in the system.
     *
     * The user needs to be authenticated to use this resource.
     * @param prefix (optional) prefix to filter the labels on.
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any Page of returned labels.
     * @throws ApiError
     */
    public static getLabels(
        prefix?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestLabel>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/labels',
            query: {
                'prefix': prefix,
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The user is currently not authenticated.`,
            },
        });
    }
    /**
     * Get label
     * Returns a label.
     *
     * The user needs to be authenticated to use this resource.
     * @param labelName the label name
     * @returns RestLabel The label.
     * @throws ApiError
     */
    public static getLabel(
        labelName: string,
    ): CancelablePromise<RestLabel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/labels/{labelName}',
            path: {
                'labelName': labelName,
            },
            errors: {
                401: `The user is currently not authenticated.`,
                404: `The specified label does not exist.`,
            },
        });
    }
    /**
     * Get labelables for label
     * Returns a page of labelables for a given label.
     *
     * Only labelables that the authenticated user has view access to will be returned.
     * @param labelName The page of labelables.
     * @param type  the type of labelables to be returned. Supported values: REPOSITORY
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any The page of labelables.
     * @throws ApiError
     */
    public static getLabelables(
        labelName: string,
        type?: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestLabelable>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/labels/{labelName}/labeled',
            path: {
                'labelName': labelName,
            },
            query: {
                'type': type,
                'start': start,
                'limit': limit,
            },
            errors: {
                400: `The type of labelable is incorrect, correct values are REPOSITORY.`,
                401: `The currently authenticated user has insufficient permissions to retrieve the labelables`,
                404: `The specified label does not exist.`,
            },
        });
    }
    /**
     * Get current log level
     * Retrieve the current log level for a given logger.
     *
     * The authenticated user must have <strong>SYS_ADMIN</strong> permission or higher to call this resource.
     * @param loggerName The name of the logger.
     * @returns RestLogLevel The log level of the logger.
     * @throws ApiError
     */
    public static getLevel(
        loggerName: string,
    ): CancelablePromise<RestLogLevel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/logs/logger/{loggerName}',
            path: {
                'loggerName': loggerName,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the log level.`,
            },
        });
    }
    /**
     * Set log level
     * Set the current log level for a given logger.
     *
     * The authenticated user must have <strong>SYS_ADMIN</strong> permission or higher to call this resource.
     * @param levelName The level to set the logger to. Either TRACE, DEBUG, INFO, WARN or ERROR
     * @param loggerName The name of the logger.
     * @returns void
     * @throws ApiError
     */
    public static setLevel(
        levelName: string,
        loggerName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/logs/logger/{loggerName}/{levelName}',
            path: {
                'levelName': levelName,
                'loggerName': loggerName,
            },
            errors: {
                400: `The log level was invalid.`,
                401: `The currently authenticated user has insufficient permissions to set the log level.`,
            },
        });
    }
    /**
     * Get root log level
     * Retrieve the current log level for the root logger.
     *
     * The authenticated user must have <strong>SYS_ADMIN</strong> permission or higher to call this resource.
     * @returns RestLogLevel The log level of the logger.
     * @throws ApiError
     */
    public static getRootLevel(): CancelablePromise<RestLogLevel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/logs/rootLogger',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve the log level.`,
            },
        });
    }
    /**
     * Set root log level
     * Set the current log level for the root logger.
     *
     * The authenticated user must have <strong>SYS_ADMIN</strong> permission or higher to call this resource.
     * @param levelName the level to set the logger to. Either TRACE, DEBUG, INFO, WARN or ERROR
     * @returns void
     * @throws ApiError
     */
    public static setRootLevel(
        levelName: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/logs/rootLogger/{levelName}',
            path: {
                'levelName': levelName,
            },
            errors: {
                400: `The log level was invalid.`,
                401: `The currently authenticated user has insufficient permissions to set the log level.`,
            },
        });
    }
    /**
     * Get debug logging and profiling
     * Returns whether debug logging and profiling are enabled.
     *
     * The authenticated user must have <strong>SYS_ADMIN</strong> permission to call this resource.
     * @returns RestLoggingSettings Whether debug logging and profiling are enabled.
     * @throws ApiError
     */
    public static getSettings2(): CancelablePromise<RestLoggingSettings> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/logs/settings',
            errors: {
                401: `The currently authenticated user has insufficient permissions to retrieve these settings.`,
            },
        });
    }
    /**
     * Set debug logging and profiling
     * Set whether debug logging and profiling should be enabled. This setting persists on restarts.
     *
     * The authenticated user must have <strong>SYS_ADMIN</strong> permission to call this resource.
     * @param requestBody
     * @returns RestLoggingSettings Debug logging and profiling were successfully updated.
     * @throws ApiError
     */
    public static setSettings2(
        requestBody?: {
            debugLoggingEnabled: boolean;
            profilingEnabled: boolean;
        },
    ): CancelablePromise<RestLoggingSettings> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/latest/logs/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `The settings were not correctly specified.`,
                401: `The currently authenticated user has insufficient permissions to update these settings.`,
            },
        });
    }
    /**
     * Start export job
     * Starts a background job that exports the selected repositories.
     *
     * Only 2 concurrent exports are supported _per cluster node_. If a request ends up on a node that is already running that many export jobs, the request will be rejected and an error returned.
     *
     * The response includes a description of the job that has been started, and its ID can be used to query these details again, including the current progress, warnings and errors that occurred while processing the job, and to interrupt and cancel the execution of this job.
     *
     * The request to start an export is similar to the one for previewing an export. Additionally, it accepts an optional parameter, `exportLocation`, which can be used to specify a _relative_ path within `data/migration/export` in the shared home directory. No locations outside of that directory will be accepted for exports.
     *
     * There are essentially three ways to select repositories for export. Regardless of which you use, a few general rules apply:
     *
     * - You can supply a list of selectors. The selection will be additive.
     * - Repositories that are selected more than once due to overlapping selectors will be de-duplicated and effectively exported only once.
     * - For every selected repository, its full fork hierarchy will be considered selected, even if parts of that hierarchy would otherwise not be matched by the provided selectors. For example, when you explicitly select a single repository only, but that repository is a fork, then its origin will be exported (and eventually imported), too.
     *
     * Now, a single repository can be selected like this:
     *
     * ```
     *
     *
     *
     * {
         * "projectKey": "PRJ",
         * "slug": "my-repo"
         * }
         *
         * ```
         *
         * Second, all repositories in a specific project can be selected like this:
         *
         * ```
         *
         *
         *
         * {
             * "projectKey": "PRJ",
             * "slug": *"
             * }
             *
             * ```
             *
             * And third, all projects and repositories in the system would be selected like this:
             *
             * ```
             *
             *
             *
             * {
                 * "projectKey": "*",
                 * "slug": *"
                 * }
                 *
                 * ```
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param requestBody The request
                 * @returns RestJob Details about the export job.
                 * @throws ApiError
                 */
                public static startExport(
                    requestBody?: RestExportRequest,
                ): CancelablePromise<RestJob> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/latest/migration/exports',
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `The request was malformed.`,
                            401: `The currently authenticated user has insufficient permissions to start anexport`,
                            503: `The export could not be started because the limit of concurrent migration jobs has been reached.`,
                        },
                    });
                }
                /**
                 * Preview export
                 * Enumerates the projects and repositories that would be exported for a given export request.
                 *
                 * All affected repositories will be enumerated explicitly, and while projects are listed as individual items in responses from this endpoint, their presence does not imply that all their repositories are included.
                 *
                 * While this endpoint can be used to verify that all selectors in the request apply as intended, it should be noted that a subsequent, actual export might contain a different set of repositories, as they might have been added or deleted in the meantime.
                 *
                 * Note that the overall response from this endpoint can become very large when a lot of repositories end up in the selection. This is why the server is streaming the response while it is being generated (as opposed to creating it in memory and then sending it all at once) and it can be consumed in a streaming way, too.
                 *
                 * Also, due to the potential size of the response, projects and repositories are listed with fewer details than in other REST responses.
                 *
                 * For a more detailed description of selectors, see the endpoint documentation for starting an export.
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param requestBody the export request
                 * @returns RestScopesExample The effectively selected projects and repositories.
                 * @throws ApiError
                 */
                public static previewExport(
                    requestBody?: RestExportRequest,
                ): CancelablePromise<RestScopesExample> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/latest/migration/exports/preview',
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `The request was malformed.`,
                            401: `The currently authenticated user has insufficient permissions to generate a preview.`,
                        },
                    });
                }
                /**
                 * Get export job details
                 * Gets the details, including the current status and progress, of the export job identified by the given ID.
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param jobId the ID of the job
                 * @returns RestJob The job, including status and progress information.
                 * @throws ApiError
                 */
                public static getExportJob(
                    jobId: string,
                ): CancelablePromise<RestJob> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/latest/migration/exports/{jobId}',
                        path: {
                            'jobId': jobId,
                        },
                        errors: {
                            401: `The currently authenticated user has insufficient permissions to retrieve information about this job.`,
                            404: `The specified job does not exist.`,
                        },
                    });
                }
                /**
                 * Cancel export job
                 * Requests the cancellation of an export job.
                 *
                 * The request to cancel a job will be processed successfully if the job is actually still running. If it has already finished (successfully or with errors) or if it has already been canceled before, then an error will be returned.
                 *
                 * There might be a small delay between accepting the request and actually cancelling the job. In most cases, the delay will be close to instantaneously. In the unlikely case of communication issues across a cluster, it can however take a few seconds to cancel a job.
                 *
                 * A client should always actively query the job status to confirm that a job has been successfully canceled.
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param jobId the ID of the job to cancel
                 * @returns void
                 * @throws ApiError
                 */
                public static cancelExportJob(
                    jobId: string,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/latest/migration/exports/{jobId}/cancel',
                        path: {
                            'jobId': jobId,
                        },
                        errors: {
                            401: `The currently authenticated user has insufficient permissions to cancel this job.`,
                            404: `The specified job does not exist.`,
                            409: `The job was in a state that does not allow cancellation, e.g. it has already finished.`,
                        },
                    });
                }
                /**
                 * Get job messages
                 * Gets the messages generated by the job.
                 *
                 * Without any filter, all messages will be returned, but the response can optionally be filtered for the following severities. The severity parameter can be repeated to include multiple severities in one response.
                 *
                 * - INFO
                 * - WARN
                 * - ERROR
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param jobId The ID of the job
                 * @param severity The severity to include in the results
                 * @param subject The subject
                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                 * @returns any The messages generated by this job.
                 * @throws ApiError
                 */
                public static getExportJobMessages(
                    jobId: string,
                    severity?: string,
                    subject?: string,
                    start?: number,
                    limit?: number,
                ): CancelablePromise<{
                    isLastPage?: boolean;
                    limit?: number;
                    nextPageStart?: number;
                    size?: number;
                    start?: number;
                    values?: Array<RestJobMessage>;
                }> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/latest/migration/exports/{jobId}/messages',
                        path: {
                            'jobId': jobId,
                        },
                        query: {
                            'severity': severity,
                            'subject': subject,
                            'start': start,
                            'limit': limit,
                        },
                        errors: {
                            401: `The currently authenticated user has insufficient permissions to retrieve information about this job.`,
                            404: `The specified job does not exist.`,
                        },
                    });
                }
                /**
                 * Start import job
                 * Starts a background job that imports the specified archive.
                 *
                 * Only 1 import at a time is supported _per cluster_. If another request is made while an import is already running, the request will be rejected and an error returned.
                 *
                 * The path in the request must point to a valid archive file. The file must be located within the `data/migration/import` directory in the shared home directory.
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param requestBody The request
                 * @returns RestJob Details about the export job.
                 * @throws ApiError
                 */
                public static startImport(
                    requestBody?: RestImportRequest,
                ): CancelablePromise<RestJob> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/latest/migration/imports',
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            400: `The request was malformed.`,
                            401: `The currently authenticated user has insufficient permissions to start an import.`,
                            503: `The import could not be started because the limit of concurrent migration jobs has been reached.`,
                        },
                    });
                }
                /**
                 * Get import job status
                 * Gets the details, including the current status and progress, of the import job identified by the given ID.
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param jobId The ID of the job
                 * @returns RestJob The job, including status and progress information.
                 * @throws ApiError
                 */
                public static getImportJob(
                    jobId: string,
                ): CancelablePromise<RestJob> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/latest/migration/imports/{jobId}',
                        path: {
                            'jobId': jobId,
                        },
                        errors: {
                            401: `The currently authenticated user has insufficient permissions to retrieve information about this job.`,
                            404: `The specified job does not exist.`,
                        },
                    });
                }
                /**
                 * Cancel import job
                 * Requests the cancellation of an import job.
                 *
                 * The request to cancel a job will be processed successfully if the job is actually still running. If it has already finished (successfully or with errors) or if it has already been canceled before, then an error will be returned.
                 *
                 * Note that import jobs are not canceled as instantaneously as export jobs. Rather, once the request has been accepted, there are a number of checkpoints at which the job will actually apply it and stop. This is to keep the system in a reasonably consistent state:
                 *
                 * - After the current fork hierarchy has been imported and verified.
                 * - Before the next repository is imported.
                 * - Before the next pull request is imported.
                 *
                 * A client should always actively query the job status to confirm that a job has been successfully canceled.
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param jobId the ID of the job to cancel
                 * @returns void
                 * @throws ApiError
                 */
                public static cancelImportJob(
                    jobId: string,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/api/latest/migration/imports/{jobId}/cancel',
                        path: {
                            'jobId': jobId,
                        },
                        errors: {
                            401: `The currently authenticated user has insufficient permissions to cancel this job.`,
                            404: `The specified job does not exist.`,
                            409: `The job was in a state that does not allow cancellation, e.g. it has already finished.`,
                        },
                    });
                }
                /**
                 * Get import job messages
                 * Gets the messages generated by the job.
                 *
                 * Without any filter, all messages will be returned, but the response can optionally be filtered for the following severities. The severity parameter can be repeated to include multiple severities in one response.
                 *
                 * - INFO
                 * - WARN
                 * - ERROR
                 *
                 * The authenticated user must have **ADMIN** permission or higher to call this resource.
                 * @param jobId The ID of the job
                 * @param severity The severity to include in the results
                 * @param subject The subject
                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                 * @returns any The messages generated by this job.
                 * @throws ApiError
                 */
                public static getImportJobMessages(
                    jobId: string,
                    severity?: string,
                    subject?: string,
                    start?: number,
                    limit?: number,
                ): CancelablePromise<{
                    isLastPage?: boolean;
                    limit?: number;
                    nextPageStart?: number;
                    size?: number;
                    start?: number;
                    values?: Array<RestJobMessage>;
                }> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/latest/migration/imports/{jobId}/messages',
                        path: {
                            'jobId': jobId,
                        },
                        query: {
                            'severity': severity,
                            'subject': subject,
                            'start': start,
                            'limit': limit,
                        },
                        errors: {
                            401: `The currently authenticated user has insufficient permissions to retrieve information about this job.`,
                            404: `The specified job does not exist.`,
                        },
                    });
                }
                /**
                 * Start Mesh migration job
                 * Starts a background job that migrates selected projects/repositories to Mesh.
                 *
                 * Only 1 job is supported _per cluster_.
                 *
                 * The response includes a description of the job that has been started, and its ID can be used to query these details again, including the current progress, and to interrupt and cancel the execution of this job.
                 *
                 * The request to start a migration is similar to the one for previewing a migration.
                 *
                 * There are essentially three ways to select repositories for migration. Regardless of which you use, a few general rules apply:
                 *
                 * - You can supply a list of repository IDs and project IDs. The selection will be additive. All repositories     in the system are migrated if both lists are empty.     - Repositories that are selected more than once due to overlapping IDs will be de-duplicated and     effectively migrated only once.     - For every selected repository, its full fork hierarchy will be considered selected, even if parts of that     hierarchy would otherwise not be matched by the provided IDs. For example, when you explicitly     select a single repository only, but that repository is a fork, then its origin will be migrated too.
                 *
                 * Now, a single repository can be selected like this:
                 *
                 * ```
                 *
                 * {
                     * "repositoryIds": [1]
                     * }
                     * ```
                     *
                     * Multiple repositories can be selected like this:
                     *
                     *
                     *
                     * ```
                     *
                     * {
                         * "repositoryIds": [1, 2]
                         * }
                         * ```
                         *
                         * Second, all repositories in a specific project can be selected like this:
                         *
                         *
                         *
                         * ```
                         *
                         * {
                             * "projectIds": [1]
                             * }
                             * ```
                             *
                             * And third, all projects and repositories in the system would be selected like this:
                             *
                             *
                             *
                             * ```
                             *
                             * {
                                 * "projectIds": [],
                                 * "repositoryIds": []
                                 * }
                                 * ```
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param requestBody
                                 * @returns RestJob The started job
                                 * @throws ApiError
                                 */
                                public static startMeshMigration(
                                    requestBody?: {
                                        all?: boolean;
                                        maxBytesPerSecond?: {
                                            asLong?: number;
                                            present?: boolean;
                                        };
                                        projectIds?: Array<number>;
                                        repositoryIds?: Array<number>;
                                    },
                                ): CancelablePromise<RestJob> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/migration/mesh',
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The migration request failed one/more validation checks.`,
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            503: `A migration job is already in progress`,
                                        },
                                    });
                                }
                                /**
                                 * Preview Mesh migration
                                 * Enumerates the projects and repositories that would be migrated for a given request.
                                 *
                                 * All affected repositories will be enumerated explicitly, and while projects are listed as individual items in responses from this endpoint, their presence does not imply that all their repositories are included.
                                 *
                                 * While this endpoint can be used to verify that all selectors in the request apply as intended, it should be noted that a subsequent, actual export might contain a different set of repositories, as they might have been added or deleted in the meantime.
                                 *
                                 * Note that the overall response from this endpoint can become very large when a lot of repositories end up in the selection. This is why the server is streaming the response while it is being generated (as opposed to creating it in memory and then sending it all at once) and it can be consumed in a streaming way, too.
                                 *
                                 * Also, due to the potential size of the response, projects and repositories are listed with fewer details than in other REST responses.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param requestBody The export request
                                 * @returns ExamplePreviewMigration Enumeration of projects and repositories that would be migrated for a given request.
                                 * @throws ApiError
                                 */
                                public static previewMeshMigration(
                                    requestBody?: RestMeshMigrationRequest,
                                ): CancelablePromise<ExamplePreviewMigration> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/migration/mesh/preview',
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The request was invalid or missing.`,
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                        },
                                    });
                                }
                                /**
                                 * Find repositories by Mesh migration state
                                 * Searches for repositories in the system matching the specified criteria and enriches their MeshMigrationQueueState migration state if a migration is currently in progress.
                                 *
                                 * The currently active migration can optionally be specified by passing a migrationId, if known. If this isn't passed, an attempt is made to locate the active migration and its ID is used.
                                 *
                                 * If a migration is currently active, only repositories that are a part of the migration are filtered and returned. Otherwise, all repositories in the systems are filtered and returned.
                                 *
                                 * Filtering by state is ignored when no migration is currently in progress. In such a case, results are not enriched with their MeshMigrationQueueState migration state.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param migrationId (optional) The currently active migration job. If not passed, this is looked up internally.
                                 * @param projectKey (optional) The project key. Can be specified more than once to filter by more than one project.
                                 * @param name (optional) The repository name
                                 * @param state (optional) If a migration is active, the MeshMigrationQueueState state to filter results by. Can be specified more than once to filter by more than one state.
                                 * @param remote (optional) Whether the repository has been fully migrated to Mesh. If not present, all repositories are considered regardless of where they're located.
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any A page of repositories matching the specified criteria.
                                 * @throws ApiError
                                 */
                                public static searchMeshMigrationRepos(
                                    migrationId?: string,
                                    projectKey?: string,
                                    name?: string,
                                    state?: string,
                                    remote?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestMigrationRepository>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/migration/mesh/repos',
                                        query: {
                                            'migrationId': migrationId,
                                            'projectKey': projectKey,
                                            'name': name,
                                            'state': state,
                                            'remote': remote,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            400: `The request was malformed.`,
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            404: `No migration job with the given ID exists.`,
                                        },
                                    });
                                }
                                /**
                                 * Get all Mesh migration job summaries
                                 * Retrieve a page of Mesh migration job summaries. Jobs are ordered by when they were started, newest first.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any The summary of the migration job.
                                 * @throws ApiError
                                 */
                                public static getAllMeshMigrationSummaries(
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestMeshMigrationSummary>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/migration/mesh/summaries',
                                        query: {
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                        },
                                    });
                                }
                                /**
                                 * Get summary for Mesh migration job
                                 * Gets the summary, including the queue status and progress, of the currently active Mesh migration job.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @returns RestMeshMigrationSummary The summary of the currently active migration job.
                                 * @throws ApiError
                                 */
                                public static getActiveMeshMigrationSummary(): CancelablePromise<RestMeshMigrationSummary> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/migration/mesh/summary',
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            404: `No active migration job found.`,
                                        },
                                    });
                                }
                                /**
                                 * Get Mesh migration job details
                                 * Gets the details, including the current status and progress, of the job identified by the given ID.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param jobId The ID of the job
                                 * @returns any The details of the migration job.
                                 * @throws ApiError
                                 */
                                public static getMeshMigrationJob(
                                    jobId: string,
                                ): CancelablePromise<any> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/migration/mesh/{jobId}',
                                        path: {
                                            'jobId': jobId,
                                        },
                                        errors: {
                                            400: `The job ID parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            404: `The specified job ID does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Cancel Mesh migration job
                                 * Requests the cancellation of a migration job.
                                 *
                                 * The request to cancel a job will be processed successfully if the job is actually still running. If it has already finished (successfully or with errors) or if it has already been canceled before, then an error will be returned.
                                 *
                                 * There might be a small delay between accepting the request and actually cancelling the job. In most cases, the delay will be close to instantaneously. In the unlikely case of communication issues across a cluster, it can however take a few seconds to cancel a job.
                                 *
                                 * A client should always actively query the job status to confirm that a job has been successfully canceled.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param jobId The ID of the job to cancel
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static cancelMeshMigrationJob(
                                    jobId: string,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/migration/mesh/{jobId}/cancel',
                                        path: {
                                            'jobId': jobId,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            404: `The specified job ID does not exist.`,
                                            409: `The migration job has already been canceled or finished.`,
                                        },
                                    });
                                }
                                /**
                                 * Get Mesh migration job messages
                                 * Gets the messages generated by the job.
                                 *
                                 * Without any filter, all messages will be returned, but the response can optionally be filtered for the following severities. The severity parameter can be repeated to include multiple severities in one response.
                                 *
                                 * - INFO
                                 * - WARN
                                 * - ERROR
                                 *
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param jobId The ID of the job
                                 * @param severity The severity to include in the results
                                 * @param subject The subject
                                 * @param start Start number for the page (inclusive). If not passed, first page is assumed.
                                 * @param limit Number of items to return. If not passed, a page size of 25 is used.
                                 * @returns any The details of the migration job.
                                 * @throws ApiError
                                 */
                                public static getMeshMigrationJobMessages(
                                    jobId: string,
                                    severity?: string,
                                    subject?: string,
                                    start?: number,
                                    limit?: number,
                                ): CancelablePromise<{
                                    isLastPage?: boolean;
                                    limit?: number;
                                    nextPageStart?: number;
                                    size?: number;
                                    start?: number;
                                    values?: Array<RestJobMessage>;
                                }> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/migration/mesh/{jobId}/messages',
                                        path: {
                                            'jobId': jobId,
                                        },
                                        query: {
                                            'severity': severity,
                                            'subject': subject,
                                            'start': start,
                                            'limit': limit,
                                        },
                                        errors: {
                                            400: `The job ID parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            404: `The specified job ID does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get Mesh migration job summary
                                 * Gets the summary, including the queue status and progress, of a Mesh migration job.
                                 *
                                 * The authenticated user must have **SYS_ADMIN** permission to call this resource.
                                 * @param jobId The ID of the job
                                 * @returns RestMeshMigrationSummary The summary of the migration job.
                                 * @throws ApiError
                                 */
                                public static getMeshMigrationJobSummary(
                                    jobId: string,
                                ): CancelablePromise<RestMeshMigrationSummary> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/migration/mesh/{jobId}/summary',
                                        path: {
                                            'jobId': jobId,
                                        },
                                        errors: {
                                            400: `The job ID parameter was not supplied.`,
                                            401: `The currently authenticated user has insufficient permissions to call this resource.`,
                                            404: `The specified job ID does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get all users
                                 * Retrieve a page of users, optionally run through provided filters.
                                 *
                                 *
                                 * Only authenticated users may call this resource.
                                 * ### Permission Filters
                                 *
                                 *
                                 * The following three sub-sections list parameters supported for permission filters (where <code>[root]</code> is
                                 * the root permission filter name, e.g. <code>permission</code>, <code>permission.1</code> etc.) depending on the
                                 * permission resource. The system determines which filter to apply (Global, Project or Repository permission)
                                 * based on the `[root]` permission value. E.g. <code>ADMIN</code> is a global permission,
                                 * <code>PROJECT_ADMIN</code> is a project permission and <code>REPO_ADMIN</code> is a repository permission. Note
                                 * that the parameters for a given resource will be looked up in the order as they are listed below, that is e.g.
                                 * for a project resource, if both <code>projectId</code> and <code>projectKey</code> are provided, the system will
                                 * use <code>projectId</code> for the lookup.
                                 * <h4>Global permissions</h4>
                                 *
                                 *
                                 * The permission value under <code>[root]</code> is the only required and recognized parameter, as global
                                 * permissions do not apply to a specific resource.
                                 *
                                 *
                                 * Example valid filter: <code>permission=ADMIN</code>.
                                 * <h4>Project permissions</h4>
                                 *
                                 *
                                 * - <code>[root]</code>- specifies the project permission
                                 * - <code>[root].projectId</code> - specifies the project ID to lookup the project by
                                 * - <code>[root].projectKey</code> - specifies the project key to lookup the project by
                                 *
                                 *
                                 * Example valid filter: <code>permission.1=PROJECT_ADMIN&amp;permission.1.projectKey=TEST_PROJECT</code>.
                                 * #### Repository permissions
                                 *
                                 *
                                 * - <code>[root]</code>- specifies the repository permission
                                 * - <code>[root].projectId</code> - specifies the repository ID to lookup the repository by
                                 * - <code>[root].projectKey</code> and <code>[root].repositorySlug</code>- specifies the project key and     repository slug to lookup the repository by; both values <i>need to</i> be provided for this look up to be     triggered
                                 *
                                 *
                                 * Example valid filter: <code>permission.2=REPO_ADMIN&amp;permission.2.projectKey=TEST_PROJECT&amp;permission.2.repositorySlug=test_repo</code>.
                                 * @param filter Return only users, whose username, name or email address <i>contain</i> the <code> filter</code> value
                                 * @param permissionN The "root" of a single permission filter, similar to the <code>permission</code> parameter, where "N" is a natural number starting from 1. This allows clients to specify multiple permission filters, by providing consecutive filters as <code>permission.1</code>, <code>permission.2</code> etc. Note that the filters numbering has to start with 1 and be continuous for all filters to be processed. The total allowed number of permission filters is 50 and all filters exceeding that limit will be dropped. See the section "Permission Filters" above for more details on how the permission filters are processed.
                                 * @param permission The "root" of a permission filter, whose value must be a valid global, project, or repository permission. Additional filter parameters referring to this filter that specify the resource (project or repository) to apply the filter to must be prefixed with <code>permission.</code>. See the section "Permission Filters" above for more details.
                                 * @param group return only users who are members of the given group
                                 * @returns RestApplicationUser A page of users.
                                 * @throws ApiError
                                 */
                                public static getUsers2(
                                    filter?: string,
                                    permissionN?: string,
                                    permission?: string,
                                    group?: string,
                                ): CancelablePromise<RestApplicationUser> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/users',
                                        query: {
                                            'filter': filter,
                                            'permission.N': permissionN,
                                            'permission': permission,
                                            'group': group,
                                        },
                                        errors: {
                                            400: `The search request was invalid, which may happen for multiple reasons, among
                                            others:
                                            - permission filter for project/repository permission with no parameters specifying the project or     repository to apply the filter to
                                            - invalid permission name
                                            - permission filter for a project/repository permission pointing to a non-existent project or repository
                                            The exact reason for the error and - in most cases - the request parameter name that had invalid value - will be
                                            provided in the error message.`,
                                            401: `Authentication failed or was not attempted.`,
                                        },
                                    });
                                }
                                /**
                                 * Update user details
                                 * Update the currently authenticated user's details. The update will always be applied to the currently authenticated user.
                                 * @param requestBody The user update details
                                 * @returns RestApplicationUser The updated user.
                                 * @throws ApiError
                                 */
                                public static updateUserDetails1(
                                    requestBody?: UserUpdateWithCredentials,
                                ): CancelablePromise<RestApplicationUser> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/users',
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The request was malformed.`,
                                            401: `Authentication failed or was not attempted.`,
                                        },
                                    });
                                }
                                /**
                                 * Set password
                                 * Update the currently authenticated user's password.
                                 * @param requestBody The password update details
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static updateUserPassword1(
                                    requestBody?: UserPasswordUpdate,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'PUT',
                                        url: '/api/latest/users/credentials',
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            400: `The request was malformed or the old password was incorrect.`,
                                            401: `Authentication failed or was not attempted.`,
                                        },
                                    });
                                }
                                /**
                                 * Get user
                                 * Retrieve the user matching the supplied <strong>userSlug</strong>.
                                 * @param userSlug The user slug
                                 * @returns RestApplicationUser The user matching the supplied <strong>userSlug</strong>. Note, this may
                                 * <i>not</i> be the user's username, always use the <strong>user.slug</strong> property.
                                 * @throws ApiError
                                 */
                                public static getUser(
                                    userSlug: string,
                                ): CancelablePromise<RestApplicationUser> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/users/{userSlug}',
                                        path: {
                                            'userSlug': userSlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to view the user.`,
                                            404: `The specified user does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Delete user avatar
                                 * Delete the avatar associated to a user.
                                 *
                                 *
                                 * Users are always allowed to delete their own avatar. To delete someone else's avatar the authenticated user must
                                 * have global <strong>ADMIN</strong> permission, or global <strong>SYS_ADMIN</strong> permission to update a
                                 * <strong>SYS_ADMIN</strong> user's avatar.
                                 * @param userSlug The user slug
                                 * @returns RestNamedLink The new avatar URL if the local avatar was successfully deleted or did not exist
                                 * @throws ApiError
                                 */
                                public static deleteAvatar(
                                    userSlug: string,
                                ): CancelablePromise<RestNamedLink> {
                                    return __request(OpenAPI, {
                                        method: 'DELETE',
                                        url: '/api/latest/users/{userSlug}/avatar.png',
                                        path: {
                                            'userSlug': userSlug,
                                        },
                                        errors: {
                                            401: `The authenticated user has insufficient permissions to delete the specified avatar.`,
                                            404: `The specified user does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Update user avatar
                                 * Update the avatar for the user with the supplied <strong>slug</strong>.
                                 *
                                 *
                                 * This resource accepts POST multipart form data, containing a single image in a form-field named 'avatar'.
                                 *
                                 *
                                 * There are configurable server limits on both the dimensions (1024x1024 pixels by default) and uploaded
                                 * file size (1MB by default). Several different image formats are supported, but <strong>PNG</strong> and
                                 * <strong>JPEG</strong> are preferred due to the file size limit.
                                 *
                                 *
                                 * This resource has Cross-Site Request Forgery (XSRF) protection. To allow the request to
                                 * pass the XSRF check the caller needs to send an <code>X-Atlassian-Token</code> HTTP header with the
                                 * value <code>no-check</code>.
                                 *
                                 *
                                 * An example <a href="http://curl.haxx.se/">curl</a> request to upload an image name 'avatar.png' would be:
                                 * ```
                                 * curl -X POST -u username:password -H "X-Atlassian-Token: no-check" http://example.com/rest/api/latest/users/jdoe/avatar.png -F avatar=@avatar.png
                                 * ```
                                 *
                                 *
                                 * Users are always allowed to update their own avatar. To update someone else's avatar the authenticated user must
                                 * have global <strong>ADMIN</strong> permission, or global <strong>SYS_ADMIN</strong> permission to update a
                                 * <strong>SYS_ADMIN</strong> user's avatar.
                                 * @param userSlug The user slug
                                 * @param xAtlassianToken This resource has Cross-Site Request Forgery (XSRF) protection. To allow the request to pass the XSRF check the caller needs to send an <code>X-Atlassian-Token</code> HTTP header with the value <code>no-check</code>.
                                 * @param formData Multipart form data containing a single image in a form-field named 'avatar'.
                                 * @returns string The avatar was uploaded successfully.
                                 * @throws ApiError
                                 */
                                public static uploadAvatar1(
                                    userSlug: string,
                                    xAtlassianToken?: string,
                                    formData?: ExampleAvatarMultipartFormData,
                                ): CancelablePromise<string> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/users/{userSlug}/avatar.png',
                                        path: {
                                            'userSlug': userSlug,
                                        },
                                        headers: {
                                            'X-Atlassian-Token': xAtlassianToken,
                                        },
                                        formData: formData,
                                        mediaType: 'multipart/form-data',
                                        responseHeader: 'Location',
                                        errors: {
                                            401: `The currently authenticated user has insufficient permissions to update the avatar.`,
                                            404: `The specified user does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Get user settings
                                 * Retrieve a map of user setting key values for a specific user identified by the user slug.
                                 * @param userSlug The user slug.
                                 * @returns ExampleSettingsMap The user settings for the specified user slug.
                                 * @throws ApiError
                                 */
                                public static getUserSettings(
                                    userSlug: string,
                                ): CancelablePromise<ExampleSettingsMap> {
                                    return __request(OpenAPI, {
                                        method: 'GET',
                                        url: '/api/latest/users/{userSlug}/settings',
                                        path: {
                                            'userSlug': userSlug,
                                        },
                                        errors: {
                                            401: `The currently authenticated user does not have permission to view the settings of this user.`,
                                            404: `The specified project, repository, commit, or report does not exist.`,
                                        },
                                    });
                                }
                                /**
                                 * Update user settings
                                 * Update the entries of a map of user setting key/values for a specific user identified by the user slug.
                                 * @param userSlug The user slug.
                                 * @param requestBody A map with the UserSettings entries which must be updated.
                                 * @returns void
                                 * @throws ApiError
                                 */
                                public static updateSettings(
                                    userSlug: string,
                                    requestBody?: ExampleSettingsMap,
                                ): CancelablePromise<void> {
                                    return __request(OpenAPI, {
                                        method: 'POST',
                                        url: '/api/latest/users/{userSlug}/settings',
                                        path: {
                                            'userSlug': userSlug,
                                        },
                                        body: requestBody,
                                        mediaType: 'application/json',
                                        errors: {
                                            401: `The currently authenticated user is not a project administrator.`,
                                        },
                                    });
                                }
                            }

