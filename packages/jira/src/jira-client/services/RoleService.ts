/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActorInputBean } from '../models/ActorInputBean.js';
import type { CreateUpdateRoleRequestBean } from '../models/CreateUpdateRoleRequestBean.js';
import type { ProjectRoleActorsBean } from '../models/ProjectRoleActorsBean.js';
import type { ProjectRoleBean } from '../models/ProjectRoleBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class RoleService {
    /**
     * Get all project roles
     * Get all the ProjectRoles available in Jira. Currently this list is global.
     * @returns ProjectRoleBean Returns full details of the roles available in Jira.
     * @throws ApiError
     */
    public static getProjectRoles1(): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/role',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
            },
        });
    }
    /**
     * Create a new project role
     * Creates a new ProjectRole to be available in Jira. The created role does not have any default actors assigned.
     * @param requestBody The role to create
     * @returns ProjectRoleBean Returns full details of the created role
     * @throws ApiError
     */
    public static createProjectRole(
        requestBody: CreateUpdateRoleRequestBean,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/role',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request json does not have a name field or the name field is invalid (empty or starts or ends with whitespace)`,
                401: `Returned if you are not logged in.`,
                403: `Returned if you do not have permissions to create a role.`,
                409: `Returned if a role with given name already exists.`,
            },
        });
    }
    /**
     * Get a specific project role
     * Get a specific ProjectRole available in Jira.
     * @param id
     * @returns ProjectRoleBean Returns full details of the role available in Jira.
     * @throws ApiError
     */
    public static getProjectRolesById(
        id: number,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/role/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
            },
        });
    }
    /**
     * Fully updates a role's name and description
     * Fully updates a roles. Both name and description must be given.
     * @param id
     * @param requestBody
     * @returns ProjectRoleBean Returns updated role.
     * @throws ApiError
     */
    public static fullyUpdateProjectRole(
        id: number,
        requestBody?: CreateUpdateRoleRequestBean,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/role/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned when name or description is not given or the name field is invalid (empty or starts or ends with whitespace).`,
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
            },
        });
    }
    /**
     * Partially updates a role's name or description
     * Partially updates a roles name or description.
     * @param id
     * @param requestBody
     * @returns ProjectRoleBean Returns updated role.
     * @throws ApiError
     */
    public static partialUpdateProjectRole(
        id: number,
        requestBody?: CreateUpdateRoleRequestBean,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/role/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned when both name and description are not given or name field is invalid (empty or starts or ends with whitespace).`,
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
            },
        });
    }
    /**
     * Deletes a role
     * Deletes a role. May return 403 in the future
     * @param id
     * @param swap
     * @returns void
     * @throws ApiError
     */
    public static deleteProjectRole(
        id: number,
        swap?: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/role/{id}',
            path: {
                'id': id,
            },
            query: {
                'swap': swap,
            },
            errors: {
                400: `Returned if given role with given swap id does not exist.`,
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
                409: `Returned if the project role is used in schemes and roleToSwap query parameter is not given.`,
            },
        });
    }
    /**
     * Get default actors for a role
     * Gets default actors for the given role.
     * @param id
     * @returns ProjectRoleActorsBean Returns actor list.
     * @throws ApiError
     */
    public static getProjectRoleActorsForRole(
        id: number,
    ): CancelablePromise<ProjectRoleActorsBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/role/{id}/actors',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
            },
        });
    }
    /**
     * Adds default actors to a role
     * Adds default actors to the given role. The request data should contain a list of usernames or a list of groups to add.
     * @param id
     * @param requestBody
     * @returns ProjectRoleActorsBean Returns actor list.
     * @throws ApiError
     */
    public static addProjectRoleActorsToRole(
        id: number,
        requestBody?: ActorInputBean,
    ): CancelablePromise<ProjectRoleActorsBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/role/{id}/actors',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request json does not have a user or group field or both user and group fields are given.`,
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
            },
        });
    }
    /**
     * Removes default actor from a role
     * Removes default actor from the given role.
     * @param id
     * @param user
     * @param group
     * @returns ProjectRoleActorsBean Returns updated actors list.
     * @throws ApiError
     */
    public static deleteProjectRoleActorsFromRole(
        id: number,
        user?: string,
        group?: string,
    ): CancelablePromise<ProjectRoleActorsBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/role/{id}/actors',
            path: {
                'id': id,
            },
            query: {
                'user': user,
                'group': group,
            },
            errors: {
                400: `Returned if user and group are not given, both user and group are given or provided group or user does not exist.`,
                401: `Returned if the requesting user is not logged in.`,
                403: `Returned if the requesting user is not an admin or a sysadmin.`,
                404: `Returned if the role with the given id does not exist.`,
            },
        });
    }
}
