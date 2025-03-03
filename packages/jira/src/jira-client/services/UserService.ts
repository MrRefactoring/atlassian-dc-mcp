/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { A11yPersonalSettingBean } from '../models/A11yPersonalSettingBean.js';
import type { AvatarBean } from '../models/AvatarBean.js';
import type { AvatarCroppingBean } from '../models/AvatarCroppingBean.js';
import type { ColumnOptions } from '../models/ColumnOptions.js';
import type { PasswordBean } from '../models/PasswordBean.js';
import type { UserAnonymizationRequestBean } from '../models/UserAnonymizationRequestBean.js';
import type { UserAnonymizationRerunRequestBean } from '../models/UserAnonymizationRerunRequestBean.js';
import type { UserAnonymizationValidationBean } from '../models/UserAnonymizationValidationBean.js';
import type { UserBean } from '../models/UserBean.js';
import type { UserPickerResultsBean } from '../models/UserPickerResultsBean.js';
import type { UserWriteBean } from '../models/UserWriteBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class UserService {
    /**
     * Get user by username or key
     * Returns a user.
     * @param includeDeleted
     * @param key
     * @param username
     * @returns UserBean Returns a user.
     * @throws ApiError
     */
    public static getUser1(
        includeDeleted: boolean = false,
        key?: string,
        username?: string,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user',
            query: {
                'includeDeleted': includeDeleted,
                'key': key,
                'username': username,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the caller does not have permission to perform operation.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Update user details
     * Modify user. The 'value' fields present will override the existing value. Fields skipped in request will not be changed.
     * @param requestBody User details
     * @param key
     * @param username
     * @returns UserWriteBean Returned if the user exists and the caller has permission to edit it.
     * @throws ApiError
     */
    public static updateUser1(
        requestBody: UserWriteBean,
        key?: string,
        username?: string,
    ): CancelablePromise<UserWriteBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/user',
            query: {
                'key': key,
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to edit the user.`,
                404: `Returned if the caller does have permission to edit the user but the user does not exist.`,
            },
        });
    }
    /**
     * Create new user
     * Create user. By default created user will not be notified with email. If password field is not set then password will be randomly generated.
     * @param requestBody User details
     * @returns UserWriteBean Returned if the user was created.
     * @throws ApiError
     */
    public static createUser(
        requestBody: UserWriteBean,
    ): CancelablePromise<UserWriteBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to create the user.`,
                500: `Returned if the user was not created because of other error.`,
            },
        });
    }
    /**
     * Delete user
     * Removes user and its references (like project roles associations, watches, history). Note: user references will not be removed if multiple User Directories are used and there is a user with the same name existing in another directory (shadowing user).
     * @param key
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static removeUser(
        key?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user',
            query: {
                'key': key,
                'username': username,
            },
            errors: {
                400: `Returned if the request is invalid or some other server error occurred.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller does not have permission to remove the user.`,
                404: `Returned if the caller does have permission to remove user but the user does not exist.`,
            },
        });
    }
    /**
     * Get available accessibility personal settings
     * Returns available accessibility personal settings along with `enabled` property that indicates the currently logged-in user preference.
     * @returns A11yPersonalSettingBean Returned when validation succeeded.
     * @throws ApiError
     */
    public static getA11YPersonalSettings(): CancelablePromise<A11yPersonalSettingBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/a11y/personal-settings',
        });
    }
    /**
     * Get validation for user anonymization
     * Validates user anonymization process.
     * @param expand
     * @param userKey
     * @returns any Returned when validation succeeded.
     * @throws ApiError
     */
    public static validateUserAnonymization(
        expand?: string,
        userKey?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/anonymization',
            query: {
                'expand': expand,
                'userKey': userKey,
            },
            errors: {
                400: `Returned if a mandatory parameter was not provided or validation failed.`,
                403: `Returned if the logged-in user cannot anonymize users.`,
            },
        });
    }
    /**
     * Schedule user anonymization
     * Schedules a user anonymization process. Requires system admin permission.
     * @param requestBody JSON containing parameters to schedule the anonymization process with
     * @returns any Returned if the process was scheduled. Note that it can still fail the extended validation once its execution starts.
     * @throws ApiError
     */
    public static scheduleUserAnonymization(
        requestBody: UserAnonymizationRequestBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/user/anonymization',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if a mandatory parameter was not provided.`,
                403: `Returned if the logged-in user cannot anonymize users.`,
                409: `Returned if another user anonymization process is already in progress.`,
            },
        });
    }
    /**
     * Get user anonymization progress
     * Returns information about a user anonymization operation progress.
     * @param taskId
     * @returns any Returns a representation of the progress of the user anonymization operation.
     * @throws ApiError
     */
    public static getProgress1(
        taskId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/anonymization/progress',
            query: {
                'taskId': taskId,
            },
            errors: {
                403: `Returned if the logged-in user cannot anonymize users.`,
                404: `Returned if there is no user anonymization task found.`,
            },
        });
    }
    /**
     * Get validation for user anonymization rerun
     * Validates user anonymization re-run process.
     * @param expand
     * @param oldUserKey
     * @param oldUserName
     * @param userKey
     * @returns UserAnonymizationValidationBean Returned when validation succeeded.
     * @throws ApiError
     */
    public static validateUserAnonymizationRerun(
        expand?: string,
        oldUserKey?: string,
        oldUserName?: string,
        userKey?: string,
    ): CancelablePromise<UserAnonymizationValidationBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/anonymization/rerun',
            query: {
                'expand': expand,
                'oldUserKey': oldUserKey,
                'oldUserName': oldUserName,
                'userKey': userKey,
            },
            errors: {
                400: `Returned if a mandatory parameter was not provided or validation failed.`,
                403: `Returned if the logged-in user cannot anonymize users.`,
            },
        });
    }
    /**
     * Schedule user anonymization rerun
     * Schedules a user anonymization process. Requires system admin permission.
     * @param requestBody JSON containing parameters to schedule the anonymization process with
     * @returns any Returned if the process was scheduled. Note that it can still fail the extended validation once its execution starts.
     * @throws ApiError
     */
    public static scheduleUserAnonymizationRerun(
        requestBody: UserAnonymizationRerunRequestBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/user/anonymization/rerun',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if a mandatory parameter was not provided.`,
                403: `Returned if the logged-in user cannot anonymize users.`,
                409: `Returned if another user anonymization process is already in progress.`,
            },
        });
    }
    /**
     * Delete stale user anonymization task
     * Removes stale user anonymization task, for scenarios when the node that was executing it is no longer alive. Use it only after making sure that the parent node of the task is actually down, and not just having connectivity issues.
     * @returns void
     * @throws ApiError
     */
    public static unlockAnonymization(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user/anonymization/unlock',
            errors: {
                400: `Returned if called when Jira is running in a non-clustered mode.`,
                403: `Returned if the logged-in user cannot remove anonymization tasks.`,
                404: `Returned if there is no user anonymization task found.`,
                409: `Returned if the node executing the anonymization is still running.`,
            },
        });
    }
    /**
     * Add user to application
     * Add user to given application. Admin permission will be required to perform this operation.
     * @param applicationKey
     * @param username
     * @returns any Returned if the user exists, the caller has permission to add user to application and user was successfully added to application.
     * @throws ApiError
     */
    public static addUserToApplication1(
        applicationKey?: string,
        username?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/user/application',
            query: {
                'applicationKey': applicationKey,
                'username': username,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to add user to application.`,
            },
        });
    }
    /**
     * Remove user from application
     * Remove user from given application. Admin permission will be required to perform this operation.
     * @param applicationKey
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static removeUserFromApplication1(
        applicationKey?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user/application',
            query: {
                'applicationKey': applicationKey,
                'username': username,
            },
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller user does not have permission to remove user from application.`,
            },
        });
    }
    /**
     * Find bulk assignable users
     * Returns a list of users that match the search string and can be assigned issues for all the given projects.
     * @param maxResults
     * @param projectKeys
     * @param username
     * @returns UserBean Returns a list of users that match the search string.
     * @throws ApiError
     */
    public static findBulkAssignableUsers(
        maxResults: number = 50,
        projectKeys?: string,
        username?: string,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/assignable/multiProjectSearch',
            query: {
                'maxResults': maxResults,
                'projectKeys': projectKeys,
                'username': username,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user has no permission to browse project.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Find assignable users by username
     * Returns a list of users that match the search string. This resource cannot be accessed anonymously. Please note that this resource should be called with an issue key when a list of assignable users is retrieved. For create only a project key should be supplied. The list of assignable users may be incorrect if it's called with the project key for editing.
     * @param issueKey
     * @param maxResults
     * @param project
     * @param actionDescriptorId
     * @param username
     * @returns UserBean Returns a list of users that match the search string.
     * @throws ApiError
     */
    public static findAssignableUsers1(
        issueKey?: string,
        maxResults: number = 50,
        project?: string,
        actionDescriptorId?: number,
        username?: string,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/assignable/search',
            query: {
                'issueKey': issueKey,
                'maxResults': maxResults,
                'project': project,
                'actionDescriptorId': actionDescriptorId,
                'username': username,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Update user avatar
     * Updates the avatar for the user.
     * @param requestBody New avatar details
     * @param username
     * @returns AvatarBean Returns updated avatar
     * @throws ApiError
     */
    public static updateUserAvatar1(
        requestBody: AvatarBean,
        username?: string,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/user/avatar',
            query: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the avatar details are invalid`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the currently authenticated user does not have permission to update avatar`,
                404: `Returned if user from parameter does not exist`,
                500: `Returned if an error occurs while updating the avatar`,
            },
        });
    }
    /**
     * Create avatar from temporary
     * Converts temporary avatar into a real avatar
     * @param requestBody Cropping instructions
     * @param username
     * @returns AvatarBean Returns created avatar
     * @throws ApiError
     */
    public static createAvatarFromTemporary4(
        requestBody: AvatarCroppingBean,
        username?: string,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/user/avatar',
            query: {
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the cropping coordinates are invalid`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the currently authenticated user does not have permission to pick avatar`,
                404: `Returned if user from parameter does not exist`,
                500: `Returned if an error occurs while converting temporary avatar to real avatar`,
            },
        });
    }
    /**
     * Store temporary avatar using multipart
     * Creates temporary avatar using multipart. The response is sent back as JSON stored in a textarea. This is because the client uses remote iframing to submit avatars using multipart. So we must send them a valid HTML page back from which the client parses the JSON from.
     * Creating a temporary avatar is part of a 3-step process in uploading a new avatar for a user: upload, crop, confirm. This endpoint allows you to use a multipart upload instead of sending the image directly as the request body.
     * You *must* use "avatar" as the name of the upload parameter:
     * curl -c cookiejar.txt -X POST -u admin:admin -H "X-Atlassian-Token: no-check" \
     * -F "avatar=@mynewavatar.png;type=image/png" \
     * 'http://localhost:8090/jira/rest/api/2/user/avatar/temporary?username=admin'
     * @param requestBody The file data
     * @param username
     * @returns AvatarCroppingBean Returns temporary avatar cropping instructions embeded in HTML page. Error messages will also be embeded in the page.
     * @throws ApiError
     */
    public static storeTemporaryAvatarUsingMultiPart3(
        requestBody: any,
        username?: string,
    ): CancelablePromise<AvatarCroppingBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/user/avatar/temporary',
            query: {
                'username': username,
            },
            body: requestBody,
            errors: {
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the currently authenticated user does not have permission to store the avatar or XSRF token is invalid.`,
                404: `Returned if user does NOT exist`,
                500: `Returned if an error occurs while converting temporary avatar to real avatar`,
            },
        });
    }
    /**
     * Delete avatar
     * Deletes avatar
     * @param id
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static deleteAvatar2(
        id: number,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user/avatar/{id}',
            path: {
                'id': id,
            },
            query: {
                'username': username,
            },
            errors: {
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the currently authenticated user does not have permission to delete the avatar.`,
                404: `Returned if the avatar does not exist.`,
            },
        });
    }
    /**
     * Get all avatars for user
     * Returns all avatars which are visible for the currently logged in user.
     * @param username
     * @returns AvatarBean Returns a map containing a list of avatars for both custom an system avatars
     * @throws ApiError
     */
    public static getAllAvatars1(
        username?: string,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/avatars',
            query: {
                'username': username,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                404: `Returned if the requested user is not found.`,
                500: `Returned if an error occurs while retrieving the list of avatars.`,
            },
        });
    }
    /**
     * Get default columns for user
     * Returns the default columns for the given user. Admin permission will be required to get columns for a user other than the currently logged in user.
     * @param username
     * @returns ColumnOptions Returns a list of columns for configured for the given user
     * @throws ApiError
     */
    public static defaultColumns(
        username?: string,
    ): CancelablePromise<ColumnOptions> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/columns',
            query: {
                'username': username,
            },
            errors: {
                401: `Returned if the current user is not permitted to request the columns for the given user.`,
                404: `Returned if the requested user is not found.`,
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
    /**
     * Set default columns for user
     * Sets the default columns for the given user. Admin permission will be required to get columns for a user other than the currently logged in user.
     * @param formData
     * @returns any Returned when the columns is saved successfully
     * @throws ApiError
     */
    public static setColumnsUrlEncoded(
        formData?: {
            username?: string;
            columns?: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/user/columns',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                500: `Returned if an error occurs while retrieving the column configuration.`,
            },
        });
    }
    /**
     * Reset default columns to system default
     * Reset the default columns for the given user to the system default. Admin permission will be required to get columns for a user other than the currently logged in user.
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static resetColumns(
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user/columns',
            query: {
                'username': username,
            },
            errors: {
                401: `Returned if the current user is not permitted to request the columns for the given user.`,
                500: `Returned if an error occurs while resetting the column configuration.`,
            },
        });
    }
    /**
     * Get duplicated users count
     * Returns a list of users that match the search string. This resource cannot be accessed anonymously.
     * Duplicated means that the user has an account in more than one directory
     * and either more than one account is active or the only active account does not belong to the directory
     * with the highest priority.
     * The data returned by this endpoint is cached for 10 minutes and the cache is flushed when any User Directory
     * is added, removed, enabled, disabled, or synchronized.
     * A System Administrator can also flush the cache manually.
     * Related JAC ticket: https://jira.atlassian.com/browse/JRASERVER-68797
     * @param flush
     * @returns UserBean Returns a list of users that match the search string.
     * @throws ApiError
     */
    public static getDuplicatedUsersCount(
        flush?: boolean,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/duplicated/count',
            query: {
                'flush': flush,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Get duplicated users mapping
     * Returns duplicated users mapped to their directories with an indication if their accounts are active or not.
     * Duplicated means that the user has an account in more than one directory and either more than one account is active
     * or the only active account does not belong to the directory with the highest priority.
     * The data returned by this endpoint is cached for 10 minutes and the cache is flushed when any User Directory
     * is added, removed, enabled, disabled, or synchronized.
     * A System Administrator can also flush the cache manually.
     * Related JAC ticket: https://jira.atlassian.com/browse/JRASERVER-68797
     * @param flush
     * @returns AvatarBean Returns all avatars which are visible for the currently logged in user.
     * @throws ApiError
     */
    public static getDuplicatedUsersMapping(
        flush?: boolean,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/duplicated/list',
            query: {
                'flush': flush,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if user is not an admin.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Update user password
     * Modify user password.
     * @param requestBody Password details
     * @param key
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static changeUserPassword(
        requestBody: PasswordBean,
        key?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/user/password',
            query: {
                'key': key,
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the user is not authenticated.`,
                403: `Returned if the caller does not have permission to change the user password.`,
                404: `Returned if the caller does have permission to change user password but the user does not exist.`,
            },
        });
    }
    /**
     * @deprecated
     * Find users with all specified permissions
     * Returns a list of active users that match the search string and have all specified permissions for the project or issue. This resource can be accessed by users with ADMINISTER_PROJECT permission for the project or global ADMIN or SYSADMIN rights. This endpoint can cause serious performance issues and will be removed in Jira 9.0.
     * @param projectKey
     * @param issueKey
     * @param maxResults
     * @param permissions
     * @param startAt
     * @param username
     * @returns UserBean Returns a list of users that match the search string.
     * @throws ApiError
     */
    public static findUsersWithAllPermissions(
        projectKey?: string,
        issueKey?: string,
        maxResults?: number,
        permissions?: string,
        startAt?: number,
        username?: string,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/permission/search',
            query: {
                'projectKey': projectKey,
                'issueKey': issueKey,
                'maxResults': maxResults,
                'permissions': permissions,
                'startAt': startAt,
                'username': username,
            },
            errors: {
                400: `Returned if no project or issue key was provided or when permissions list is empty or contains an invalid entry`,
                401: `Returned if the current user is not authenticated.`,
                403: `Returned if the current user does not have admin rights for the project.`,
                404: `Returned if the requested issue or project is not found.`,
            },
        });
    }
    /**
     * Find users for picker by query
     * Returns a list of users matching query with highlighting.
     * @param maxResults
     * @param query
     * @param exclude
     * @param showAvatar
     * @returns UserPickerResultsBean Returns a list of users matching query with highlighting.
     * @throws ApiError
     */
    public static findUsersForPicker(
        maxResults?: number,
        query?: string,
        exclude?: Array<string>,
        showAvatar?: boolean,
    ): CancelablePromise<UserPickerResultsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/picker',
            query: {
                'maxResults': maxResults,
                'query': query,
                'exclude': exclude,
                'showAvatar': showAvatar,
            },
            errors: {
                401: `Returned if the current user is not authenticated.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Get keys of all properties for a user
     * Returns the keys of all properties for the user identified by the key or by the id.
     * @param userKey
     * @param username
     * @returns any Returned if the user was found.
     * @throws ApiError
     */
    public static getPropertiesKeys4(
        userKey?: string,
        username?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/properties',
            query: {
                'userKey': userKey,
                'username': username,
            },
            errors: {
                400: `Returned if the user key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to browse the user.`,
                404: `Returned if the user with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Get the value of a specified user's property
     * Returns the value of the property with a given key from the user identified by the key or by the id.
     * @param propertyKey
     * @param userKey
     * @param username
     * @returns any Returned if the user property was found.
     * @throws ApiError
     */
    public static getProperty6(
        propertyKey: string,
        userKey?: string,
        username?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
            },
            query: {
                'userKey': userKey,
                'username': username,
            },
            errors: {
                400: `Returned if the user key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to browse the user.`,
                404: `Returned if the user with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Set the value of a specified user's property
     * Sets the value of the specified user's property.
     * You can use this resource to store a custom data against the user identified by the key or by the id. The user
     * who stores the data is required to have permissions to administer the user.
     * @param propertyKey
     * @param userKey
     * @param username
     * @param requestBody The request containing value of the user's property. The value has to be a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns any Returned if the user property is successfully updated.
     * @throws ApiError
     */
    public static setProperty5(
        propertyKey: string,
        userKey?: string,
        username?: string,
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/user/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
            },
            query: {
                'userKey': userKey,
                'username': username,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the user key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer the user.`,
                404: `Returned if the user with given key or id does not exist.`,
            },
        });
    }
    /**
     * Delete a specified user's property
     * Removes the property from the user identified by the key or by the id. The user who removes the property is required to have permissions to administer the user.
     * @param propertyKey
     * @param userKey
     * @param username
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty6(
        propertyKey: string,
        userKey?: string,
        username?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
            },
            query: {
                'userKey': userKey,
                'username': username,
            },
            errors: {
                400: `Returned if the user key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the user.`,
                404: `Returned if the user with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Find users by username
     * Finds users.
     * @param includeInactive
     * @param maxResults
     * @param includeActive
     * @param startAt
     * @param username
     * @returns UserBean Returns a list of users.
     * @throws ApiError
     */
    public static findUsers(
        includeInactive?: boolean,
        maxResults?: number,
        includeActive?: boolean,
        startAt?: number,
        username?: string,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/search',
            query: {
                'includeInactive': includeInactive,
                'maxResults': maxResults,
                'includeActive': includeActive,
                'startAt': startAt,
                'username': username,
            },
            errors: {
                400: `Returned if an invalid parameter value was provided with more details in the response body.`,
                401: `Returned if the current user is not authenticated.`,
                404: `Returned if the requested user is not found.`,
            },
        });
    }
    /**
     * Delete user session
     * Invalidates session of given user.
     * @param username a String containing username.
     * @returns any Returned when the session is invalidated successfully.
     * @throws ApiError
     */
    public static deleteSession(
        username: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/user/session/{username}',
            path: {
                'username': username,
            },
            errors: {
                401: `Returned if the user is not logged.`,
                403: `Returned if the user does not have admin permission.`,
                404: `Returned if the username does not exist.`,
            },
        });
    }
    /**
     * Find users with browse permission
     * Returns a list of active users that match the search string. This resource cannot be accessed anonymously and requires the Browse Users global permission. Given an issue key this resource will provide a list of users that match the search string and have the browse issue permission for the issue provided.
     * @param projectKey
     * @param issueKey
     * @param maxResults
     * @param username
     * @returns UserBean Returns a list of users that match the search string.
     * @throws ApiError
     */
    public static findUsersWithBrowsePermission(
        projectKey?: string,
        issueKey?: string,
        maxResults?: number,
        username?: string,
    ): CancelablePromise<UserBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/user/viewissue/search',
            query: {
                'projectKey': projectKey,
                'issueKey': issueKey,
                'maxResults': maxResults,
                'username': username,
            },
            errors: {
                400: `Returned if no project or issue key was provided`,
                401: `Returned if the current user is not authenticated.`,
                404: `Returned if the requested issue or project is not found.`,
            },
        });
    }
}
