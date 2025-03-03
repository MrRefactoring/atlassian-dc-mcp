/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvatarBean } from '../models/AvatarBean.js';
import type { AvatarCroppingBean } from '../models/AvatarCroppingBean.js';
import type { FilePart } from '../models/FilePart.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class UniversalAvatarService {
    /**
     * Get all avatars for a type and owner
     * Returns a list of all avatars
     * @param type
     * @param owningObjectId
     * @returns AvatarBean Returns a list of all Jira avatars in JSON format, that are visible to the user.
     * @throws ApiError
     */
    public static getAvatars(
        type: string,
        owningObjectId: string,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/universal_avatar/type/{type}/owner/{owningObjectId}',
            path: {
                'type': type,
                'owningObjectId': owningObjectId,
            },
            errors: {
                404: `Returned if no avatars are found, or the user does not have permission to view them.`,
            },
        });
    }
    /**
     * Create avatar from temporary
     * Creates avatar from temporary
     * @param type
     * @param owningObjectId
     * @param requestBody
     * @returns AvatarBean Returns the created avatar.
     * @throws ApiError
     */
    public static createAvatarFromTemporary3(
        type: string,
        owningObjectId: string,
        requestBody?: AvatarCroppingBean,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/universal_avatar/type/{type}/owner/{owningObjectId}/avatar',
            path: {
                'type': type,
                'owningObjectId': owningObjectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the provided data isn't valid.`,
                403: `Returned if the user doesn't have admin permissions.`,
                404: `Returned if the feature is turned off via a feature flag.`,
            },
        });
    }
    /**
     * Delete avatar by ID
     * Deletes avatar
     * @param id
     * @param type
     * @param owningObjectId
     * @returns any Returns the status of the deletion.
     * @throws ApiError
     */
    public static deleteAvatar1(
        id: number,
        type: string,
        owningObjectId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/universal_avatar/type/{type}/owner/{owningObjectId}/avatar/{id}',
            path: {
                'id': id,
                'type': type,
                'owningObjectId': owningObjectId,
            },
            errors: {
                400: `Returned if the provided data isn't valid.`,
                403: `Returned if the user doesn't have admin permissions.`,
                404: `Returned if the feature is turned off via a feature flag.`,
            },
        });
    }
    /**
     * Create temporary avatar using multipart upload
     * Creates temporary avatar
     * @param type
     * @param owningObjectId
     * @param formData
     * @returns AvatarCroppingBean Returns temporary avatar cropping instructions.
     * @throws ApiError
     */
    public static storeTemporaryAvatarUsingMultiPart2(
        type: string,
        owningObjectId: string,
        formData?: FilePart,
    ): CancelablePromise<AvatarCroppingBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/universal_avatar/type/{type}/owner/{owningObjectId}/temp',
            path: {
                'type': type,
                'owningObjectId': owningObjectId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Returned if the provided data isn't valid.`,
                403: `Returned if the user doesn't have admin permissions.`,
                404: `Returned if the feature is turned off via a feature flag.`,
            },
        });
    }
}
