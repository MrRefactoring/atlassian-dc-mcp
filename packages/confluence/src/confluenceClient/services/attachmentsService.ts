/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Content } from '../models/content.js';
import type { MockAttachmentRequest } from '../models/mockAttachmentRequest.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class AttachmentsService {
    /**
     * Get attachment
     * Returns a paginated list of attachment Content entities within a single container.
     * @param id The id of the content the attachment is on.
     * @param expand (optional) a comma separated list of properties to expand on the Attachments returned. Optional.
     * @param filename (optional) filter parameter to return only the Attachment with the matching file name.
     * @param limit (optional) how many items should be returned after the start index.
     * @param start (optional) the index of the first item within the result set that should be returned.
     * @param mediaType (optional) a comma separated list of properties to expand on the Attachments returned.
     * @returns any Returns a JSON representation of a list of attachment Content entities.
     * @throws ApiError
     */
    public static getAttachments(
        id: string,
        expand?: string,
        filename?: string,
        limit?: string,
        start?: string,
        mediaType?: string,
    ): CancelablePromise<{
        results?: Array<Content>;
        totalCount?: number;
        start?: number;
        limit?: number;
        size?: number;
        _links?: {
            base?: string;
            context?: string;
            self?: string;
            next?: string;
            prev?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/content/{id}/child/attachment',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'filename': filename,
                'limit': limit,
                'start': start,
                'mediaType': mediaType,
            },
            errors: {
                404: ` Returned if there is no content with the given id, or if the calling user does not have permission to view the content.`,
            },
        });
    }
    /**
     * Create attachments
     * Add one or more attachments to a Confluence Content entity, with optional comments.
     *
     * **Comments are optional**, but if included there must be as many comments as there are files, and the comments must be in the same order as the files.
     *
     * This resource expects a multipart post. The media-type multipart/form-data is defined in RFC 1867. Most client libraries have classes that make dealing with multipart posts simple. For instance, in Java the Apache HTTP Components library provides a `MultiPartEntity` that makes it simple to submit a multipart POST.
     *
     * In order to protect against XSRF attacks, because this method accepts multipart/form-data, it has XSRF protection on it. This means you must submit a header of `X-Atlassian-Token: nocheck` with the request, otherwise it will be blocked.
     *
     * The name of the multipart/form-data parameter that contains attachments must be 'file'.
     * @param id The id of the content the attachment is on.
     * @param expand (optional) a comma separated list of properties to expand on the Attachments returned. Optional.
     * @param allowDuplicated (optional) allows to upload an attachment with an existing filename.
     * @param status a string containing the status of the attachments content container, supports current or draft, defaults to current
     * @param formData The attachments to be added. The name of the multipart/form-data parameter that contains attachments must be 'file'.
     * @returns Content returns a JSON representation of the attachments added.
     * @throws ApiError
     */
    public static createAttachments(
        id: string,
        expand?: string,
        allowDuplicated?: string,
        status?: string,
        formData?: MockAttachmentRequest,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content/{id}/child/attachment',
            path: {
                'id': id,
            },
            query: {
                'expand': expand,
                'allowDuplicated': allowDuplicated,
                'status': status,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Returned if attachments is disabled or if you don't have permission to add attachments to this content.`,
                404: ` Returned if the requested content is not found, the user does not have permission to view it, or if the attachments exceeds the maximum configured attachment size.`,
            },
        });
    }
    /**
     * Move attachment
     * Move an attachment to a different content entity object.
     *
     * **When moving the attachment**, the name of the attachment can be updated as well.
     *
     * In order to protect against XSRF attacks, because this method accepts multipart/form-data, it has XSRF protection on it. This means you must submit a header of `X-Atlassian-Token: nocheck` with the request, otherwise it will be blocked.
     *
     * A simple example to move an attachment with id "456" in a container with id "123" to a container with "789":
     *
     * `curl -D- -u admin:admin -X POST -H "X-Atlassian-Token: nocheck" "http://myhost/rest/api/content/123/child/attachment/456/move?newContentId=789"`
     *
     * An example to move the same file, while also renaming it to "my-new-name":
     *
     * `curl -D- -u admin:admin -X POST -H "X-Atlassian-Token: nocheck" "http://myhost/rest/api/content/123/child/attachment/456/move?newContentId=789&newName=my-new-name"`
     *
     * This can also be used to only rename an attachment:
     *
     * `curl -D- -u admin:admin -X POST -H "X-Atlassian-Token: nocheck" "http://myhost/rest/api/content/123/child/attachment/456/move?newContentId=123&newName=my-new-name"`
     * @param attachmentId the id of the attachment to upload the new file for.
     * @param id The id of the content the attachment is on.
     * @param newName
     * @param newContentId
     * @returns void
     * @throws ApiError
     */
    public static move(
        attachmentId: string,
        id: string,
        newName?: string,
        newContentId?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content/{id}/child/attachment/{attachmentId}/move',
            path: {
                'attachmentId': attachmentId,
                'id': id,
            },
            query: {
                'newName': newName,
                'newContentId': newContentId,
            },
            errors: {
                400: ` Returned if the attachment id is invalid.`,
                404: ` Returned if no attachment is found for the attachmentId.`,
            },
        });
    }
    /**
     * Update non-binary data of an Attachment
     * Update the non-binary data of an attachment.This resource can be used to update an attachment's filename, media-type, comment, and parent container.
     * @param attachmentId the id of the attachment to update.
     * @param id The id of the content the attachment is on.
     * @param requestBody
     * @returns Content returns a JSON representation of the attachment after being updated.
     * @throws ApiError
     */
    public static update(
        attachmentId: string,
        id: string,
        requestBody?: Content,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/content/{id}/child/attachment/{attachmentId}',
            path: {
                'attachmentId': attachmentId,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` Returned if the attachment id or the attachment version number are invalid.`,
                403: `Returned if you are not permitted to update or move the attachment to a different container.`,
                404: ` Returned if no attachment is found for the attachmentId.`,
                409: `Returned if the version of the supplied Attachment does not match the exact version of the Attachment stored in the database.`,
            },
        });
    }
    /**
     * Remove attachment
     * This method will delete the attachment identified by attachmentId.
     *
     * It returns a boolean response indicating whether the operation was successful or not. If the specified attachment or version does not exist, or if the user does not have permission to remove the attachment, appropriate exceptions are thrown and mapped to their corresponding HTTP responses.
     * @param attachmentId the id of the attachment to be removed.
     * @param id The id of the content the attachment is on.
     * @returns void
     * @throws ApiError
     */
    public static removeAttachment(
        attachmentId: string,
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}/child/attachment/{attachmentId}',
            path: {
                'attachmentId': attachmentId,
                'id': id,
            },
            errors: {
                400: `Returned if the user does not have permission to remove the attachment.`,
                404: ` Returned if the specified attachment does not exist.`,
            },
        });
    }
    /**
     * Remove attachment version
     * This method will delete the specified version of an attachment identified by attachmentId and version.
     *
     * If the operation is successful, it returns a response indicating that no content is returned. If the specified attachment or version does not exist, or if the user does not have permission to remove the attachment, appropriate exceptions are thrown and mapped to their corresponding HTTP responses.
     * @param attachmentId The id of the attachment to be removed.
     * @param id The id of the content the attachment is on.
     * @param version
     * @returns void
     * @throws ApiError
     */
    public static removeAttachmentVersion(
        attachmentId: string,
        id: string,
        version: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rest/api/content/{id}/child/attachment/{attachmentId}/version/{version}',
            path: {
                'attachmentId': attachmentId,
                'id': id,
                'version': version,
            },
            errors: {
                400: `Returned if the user does not have permission to remove the attachment.`,
                404: `Returned if the specified attachment or version does not exist.`,
            },
        });
    }
    /**
     * Update binary data of an attachment
     * Update the binary data of an Attachment, and optionally the comment and the minor edit field.
     *
     * This adds a new version of the attachment, containing the new binary data, filename, and content-type.
     *
     * **When updating the binary data of an attachment**, the comment related to it together with the field that specifies if it's a minor edit can be updated as well, but are not required.
     *
     * If an update is considered to be a minor edit, notifications will not be sent to the watchers of that content.
     *
     * This resource expects a multipart post. The media-type multipart/form-data is defined in RFC 1867. Most client libraries have classes that make dealing with multipart posts simple. For instance, in Java the Apache HTTP Components library provides a `MultiPartEntity` that makes it simple to submit a multipart POST.
     *
     * In order to protect against XSRF attacks, because this method accepts multipart/form-data, it has XSRF protection on it. This means you must submit a header of `X-Atlassian-Token: nocheck` with the request, otherwise it will be blocked.
     *
     * The name of the multipart/form-data parameter that contains attachments must be 'file'.
     * @param attachmentId the id of the attachment to upload the new file for.
     * @param id The id of the content the attachment is on.
     * @param formData The attachment to be updated.
     * @returns Content returns JSON representation of the updated attachment.
     * @throws ApiError
     */
    public static updateData(
        attachmentId: string,
        id: string,
        formData?: MockAttachmentRequest,
    ): CancelablePromise<Content> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/content/{id}/child/attachment/{attachmentId}/data',
            path: {
                'attachmentId': attachmentId,
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: ` Returned if the attachment id is invalid.`,
                404: ` Returned if no attachment is found for the attachmentId.`,
            },
        });
    }
}


