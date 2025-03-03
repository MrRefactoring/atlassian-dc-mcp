/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvatarBean } from '../models/AvatarBean.js';
import type { AvatarCroppingBean } from '../models/AvatarCroppingBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class AvatarService {
    /**
     * Get all system avatars
     * Returns all system avatars of the given type.
     * @param type the avatar type
     * @returns AvatarBean Returns a map containing a list of system avatars. A map is returned to be consistent with the shape of the project/KEY/avatars REST end point.
     * @throws ApiError
     */
    public static getAllSystemAvatars(
        type: string,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/avatar/{type}/system',
            path: {
                'type': type,
            },
            errors: {
                401: `Returned if accessed by anonymous user`,
                500: `Returned if an error occurs while retrieving the list of avatars.`,
            },
        });
    }
    /**
     * Create temporary avatar
     * Creates temporary avatar
     * @param type the avatar type
     * @param filename name of file being uploaded
     * @param size size of file
     * @returns AvatarCroppingBean temporary avatar cropping instructions
     * @throws ApiError
     */
    public static storeTemporaryAvatar(
        type: string,
        filename?: string,
        size?: string,
    ): CancelablePromise<AvatarCroppingBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/avatar/{type}/temporary',
            path: {
                'type': type,
            },
            query: {
                'filename': filename,
                'size': size,
            },
            errors: {
                400: `Validation failed. For example filesize is beyond max attachment size.`,
                403: `Returned if the request does not contain a valid XSRF token`,
                500: `Returned if an error occurs while converting temporary avatar to real avatar`,
            },
        });
    }
    /**
     * Update avatar cropping
     * Updates the cropping instructions of the temporary avatar
     * @param type the avatar type
     * @param requestBody cropping instructions
     * @returns void
     * @throws ApiError
     */
    public static createAvatarFromTemporary(
        type: string,
        requestBody?: AvatarCroppingBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/avatar/{type}/temporaryCrop',
            path: {
                'type': type,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the cropping coordinates are invalid`,
                500: `Returned if an error occurs while cropping the temporary avatar`,
            },
        });
    }
}
