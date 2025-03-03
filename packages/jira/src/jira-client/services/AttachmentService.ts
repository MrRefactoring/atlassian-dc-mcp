/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentArchiveImpl } from '../models/AttachmentArchiveImpl.js';
import type { AttachmentBean } from '../models/AttachmentBean.js';
import type { AttachmentMetaBean } from '../models/AttachmentMetaBean.js';
import type { HumanReadableArchive } from '../models/HumanReadableArchive.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class AttachmentService {
    /**
     * Get attachment capabilities
     * Returns the meta information for an attachments, specifically if they are enabled and the maximum upload size allowed.
     * @returns AttachmentMetaBean JSON representation of the attachment capabilities. Consumers of this resource may also need to check if the logged in user has permission to upload or otherwise manipulate attachments using the com.atlassian.jira.rest.v2.permission.PermissionsResource
     * @throws ApiError
     */
    public static getAttachmentMeta(): CancelablePromise<AttachmentMetaBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/attachment/meta',
        });
    }
    /**
     * Get the meta-data for an attachment, including the URI of the actual attached file
     * Returns the meta-data for an attachment, including the URI of the actual attached file.
     * @param id id of the attachment to view
     * @returns AttachmentBean JSON representation of the attachment meta-data. The representation does not contain the attachment itself, but contains a URI that can be used to download the actual attached file.
     * @throws ApiError
     */
    public static getAttachment(
        id: string,
    ): CancelablePromise<AttachmentBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/attachment/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `The calling user is not permitted to view the requested attachment.`,
                404: `Any of: there is no attachment with the requested id, attachments feature is disabled`,
            },
        });
    }
    /**
     * Delete an attachment from an issue
     * Remove an attachment from an issue.
     * @param id id of the attachment to remove
     * @returns void
     * @throws ApiError
     */
    public static removeAttachment(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/attachment/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `The calling user is not permitted to remove the requested attachment.`,
            },
        });
    }
    /**
     * Get human-readable attachment expansion
     * Tries to expand an attachment. Output is human-readable and subject to change.
     * @param id the id of the attachment to expand.
     * @returns HumanReadableArchive JSON representation of the attachment expanded contents. Empty entry list means that attachment cannot be expanded. It's either empty, corrupt or not an archive at all.
     * @throws ApiError
     */
    public static expandForHumans(
        id: string,
    ): CancelablePromise<HumanReadableArchive> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/attachment/{id}/expand/human',
            path: {
                'id': id,
            },
            errors: {
                403: `The calling user is not permitted to view the requested attachment.`,
                404: `Any of: there is no attachment with the requested id, attachments feature is disabled`,
                409: `The archive format is not supported. since v6.4`,
            },
        });
    }
    /**
     * Get raw attachment expansion
     * Tries to expand an attachment. Output is raw and should be backwards-compatible through the course of time.
     * @param id the id of the attachment to expand.
     * @returns AttachmentArchiveImpl JSON representation of the attachment expanded contents. Empty entry list means that attachment cannot be expanded. It's either empty, corrupt or not an archive at all.
     * @throws ApiError
     */
    public static expandForMachines(
        id: string,
    ): CancelablePromise<AttachmentArchiveImpl> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/attachment/{id}/expand/raw',
            path: {
                'id': id,
            },
            errors: {
                403: `The calling user is not permitted to view the requested attachment.`,
                404: `Any of: there is no attachment with the requested id, attachments feature is disabled`,
                409: `The archive format is not supported. since v6.4`,
            },
        });
    }
}
