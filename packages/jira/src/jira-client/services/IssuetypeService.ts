/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvatarBean } from '../models/AvatarBean.js';
import type { AvatarCroppingBean } from '../models/AvatarCroppingBean.js';
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EntityPropertyBean } from '../models/EntityPropertyBean.js';
import type { FilePart } from '../models/FilePart.js';
import type { IssueTypeCreateBean } from '../models/IssueTypeCreateBean.js';
import type { IssueTypeJsonBean } from '../models/IssueTypeJsonBean.js';
import type { IssueTypeUpdateBean } from '../models/IssueTypeUpdateBean.js';
import type { PropertyBean } from '../models/PropertyBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IssuetypeService {
    /**
     * Get list of all issue types visible to user
     * Returns a list of all issue types visible to the user
     * @returns IssueTypeJsonBean Returns a list of issue types.
     * @throws ApiError
     */
    public static getIssueAllTypes(): CancelablePromise<IssueTypeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetype',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not have the administrator permission.`,
            },
        });
    }
    /**
     * Create an issue type from JSON representation
     * Creates an issue type from a JSON representation and adds the issue newly created issue type to the default issue type scheme.
     * @param requestBody All information about the issue type.
     * @returns any The new issue type has been created.
     * @throws ApiError
     */
    public static createIssueType(
        requestBody: IssueTypeCreateBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issuetype',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid. This happens when the name is invalid or issue type is subtask on instance which has subtasks disabled.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                409: `Returned if there already exists an issue type with the specified name.`,
            },
        });
    }
    /**
     * Get paginated list of filtered issue types
     * Returns paginated list of filtered issue types
     * @param xRequestedWith
     * @param maxResults
     * @param query
     * @param projectIds
     * @param startAt
     * @returns IssueTypeJsonBean Returns paginated list of issue types.
     * @throws ApiError
     */
    public static getPaginatedIssueTypes(
        xRequestedWith?: string,
        maxResults: number = 100,
        query: string = '',
        projectIds?: Array<number>,
        startAt?: number,
    ): CancelablePromise<IssueTypeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetype/page',
            headers: {
                'X-Requested-With': xRequestedWith,
            },
            query: {
                'maxResults': maxResults,
                'query': query,
                'projectIds': projectIds,
                'startAt': startAt,
            },
        });
    }
    /**
     * Get full representation of issue type by id
     * Returns a full representation of the issue type that has the given id.
     * @param id The issue type id.
     * @returns IssueTypeJsonBean Returns the issue type with the given id.
     * @throws ApiError
     */
    public static getIssueType1(
        id: string,
    ): CancelablePromise<IssueTypeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetype/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the issue type does not exist, or is not visible to the calling user.`,
            },
        });
    }
    /**
     * Update specified issue type from JSON representation
     * Updates the specified issue type from a JSON representation.
     * @param id The issue type id.
     * @param requestBody All information about the issue type.
     * @returns any Returned if the issue type was updated successfully.
     * @throws ApiError
     */
    public static updateIssueType(
        id: string,
        requestBody: IssueTypeUpdateBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issuetype/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid. This happens when the name is invalid or if the avatar with given id does not exist.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type to update does not exist.`,
                409: `Returned if there already exists an issue type with the specified name.`,
            },
        });
    }
    /**
     * Delete specified issue type and migrate associated issues
     * Deletes the specified issue type. If the issue type has any associated issues, these issues will be migrated to the alternative issue type specified in the parameter.
     * @param id The issue type id.
     * @param alternativeIssueTypeId The id of an issue type to which issues associated with the removed issue type will be migrated.
     * @returns void
     * @throws ApiError
     */
    public static deleteIssueType1(
        id: string,
        alternativeIssueTypeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issuetype/{id}',
            path: {
                'id': id,
                'alternativeIssueTypeId': alternativeIssueTypeId,
            },
            errors: {
                400: `Returned if the request is invalid. It happens when there are associated issues with the issue type which is being removed, but it is impossible to migrate these issues to the alternative issue type.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type to update does not exist.`,
            },
        });
    }
    /**
     * Get list of alternative issue types for given id
     * Returns a list of all alternative issue types for the given issue type id.
     * @param id The issue type id.
     * @returns IssueTypeJsonBean Returns a list of issue types.
     * @throws ApiError
     */
    public static getAlternativeIssueTypes(
        id: string,
    ): CancelablePromise<IssueTypeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetype/{id}/alternatives',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the issue type does not exist, or is not visible to the calling user.`,
            },
        });
    }
    /**
     * Convert temporary avatar into a real avatar
     * Converts temporary avatar into a real avatar
     * @param id The issue type id.
     * @param requestBody Cropping instructions.
     * @returns AvatarBean Returns created avatar.
     * @throws ApiError
     */
    public static createAvatarFromTemporary1(
        id: string,
        requestBody: AvatarCroppingBean,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issuetype/{id}/avatar',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the cropping coordinates are invalid.`,
                403: `Returned if the currently authenticated user does not have permission to pick avatar.`,
                404: `Returned if the currently authenticated user does not have EDIT PROJECT permission.`,
                500: `Returned if an error occurs while converting temporary avatar to real avatar.`,
            },
        });
    }
    /**
     * Create temporary avatar using multipart for issue type
     * Creates temporary avatar using multipart. The response is sent back as JSON stored in a textarea. This is because
     * the client uses remote iframing to submit avatars using multipart. So we must send them a valid HTML page back from
     * which the client parses the JSON from.
     * Creating a temporary avatar is part of a 3-step process in uploading a new
     * avatar for an issue type: upload, crop, confirm. This endpoint allows you to use a multipart upload
     * instead of sending the image directly as the request body.
     * You *must* use "avatar" as the name of the upload parameter:
     * curl -c cookiejar.txt -X POST -u admin:admin -H "X-Atlassian-Token: no-check" \
     * -F "avatar=@mynewavatar.png;type=image/png" \
     * 'http://localhost:8090/jira/rest/api/2/issuetype/1/avatar/temporary'
     * @param id The issue type id.
     * @param formData
     * @returns AvatarCroppingBean Temporary avatar cropping instructions embeded in HTML page. Error messages will also be embeded in the page.
     * @throws ApiError
     */
    public static storeTemporaryAvatarUsingMultiPart(
        id: string,
        formData?: FilePart,
    ): CancelablePromise<AvatarCroppingBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issuetype/{id}/avatar/temporary',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type to update does not exist or if the request does not contain valid XSRF token.`,
            },
        });
    }
    /**
     * Get all properties keys for issue type
     * Returns the keys of all properties for the issue type identified by the id
     * @param issueTypeId The issue type from which the keys will be returned.
     * @returns EntityPropertiesKeysBean Returns keys of all properties for the issue type.
     * @throws ApiError
     */
    public static getPropertyKeys(
        issueTypeId: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetype/{issueTypeId}/properties',
            path: {
                'issueTypeId': issueTypeId,
            },
            errors: {
                400: `Returned if the issue type id is invalid.`,
                404: `Returned if the issue type with given id does not exist or if the user does not have permissions to view this issue type.`,
            },
        });
    }
    /**
     * Get value of specified issue type's property
     * Returns the value of the property with a given key from the issue type identified by the id
     * @param propertyKey The key of the property to return.
     * @param issueTypeId The issue type from which the property will be returned.
     * @returns EntityPropertyBean Returns the value of the property with a given key from the issue type.
     * @throws ApiError
     */
    public static getProperty4(
        propertyKey: string,
        issueTypeId: string,
    ): CancelablePromise<EntityPropertyBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetype/{issueTypeId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'issueTypeId': issueTypeId,
            },
            errors: {
                400: `Returned if the issue type id is invalid.`,
                404: `Returned if the issue type with given id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Update specified issue type's property
     * Sets the value of the specified issue type's property
     * @param propertyKey The key of the issue type's property. The maximum length of the key is 255 bytes
     * @param issueTypeId The issue type on which the property will be set.
     * @param requestBody The value of the issue type's property. The value has to be a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns any Returned if the issue type property is successfully updated.
     * @throws ApiError
     */
    public static setProperty3(
        propertyKey: string,
        issueTypeId: string,
        requestBody: PropertyBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issuetype/{issueTypeId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'issueTypeId': issueTypeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the issue type id is invalid.`,
                404: `Returned if the issue type with given id does not exist or if the user does not have permissions to edit this issue type.`,
            },
        });
    }
    /**
     * Delete specified issue type's property
     * Removes the property from the issue type identified by the id
     * @param propertyKey The key of the property to remove.
     * @param issueTypeId The issue type from which the property will be removed.
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty4(
        propertyKey: string,
        issueTypeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issuetype/{issueTypeId}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'issueTypeId': issueTypeId,
            },
            errors: {
                400: `Returned if the issue type id is invalid.`,
                404: `Returned if the issue type with given id does not exist or if the property with given key is not found.`,
            },
        });
    }
}
