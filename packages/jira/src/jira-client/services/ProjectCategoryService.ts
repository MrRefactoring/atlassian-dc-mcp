/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectCategoryBean } from '../models/ProjectCategoryBean.js';
import type { ProjectCategoryJsonBean } from '../models/ProjectCategoryJsonBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ProjectCategoryService {
    /**
     * Get all project categories
     * Returns all project categories
     * @returns ProjectCategoryJsonBean Returns a list of all project categories.
     * @throws ApiError
     */
    public static getAllProjectCategories(): CancelablePromise<ProjectCategoryJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/projectCategory',
            errors: {
                500: `Returned if an error occurs while retrieving the list of projects.`,
            },
        });
    }
    /**
     * Create project category
     * Create a project category.
     * @param requestBody The project category to create.
     * @returns ProjectCategoryJsonBean Returned if the project category is created successfully.
     * @throws ApiError
     */
    public static createProjectCategory(
        requestBody: ProjectCategoryBean,
    ): CancelablePromise<ProjectCategoryJsonBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/projectCategory',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the caller is not logged in so does not have permission to create project categories.`,
                403: `Returned if the caller is authenticated and does not have permission to create project categories (is not global admin).`,
                409: `Returned if a project category with the given name already exists.`,
            },
        });
    }
    /**
     * Get project category by ID
     * Returns a full representation of the project category that has the given id.
     * @param id
     * @returns ProjectCategoryJsonBean Returned if the project category exists and is visible by the calling user.
     * @throws ApiError
     */
    public static getProjectCategoryById(
        id: number,
    ): CancelablePromise<ProjectCategoryJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/projectCategory/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Returned if the project category does not exist, or is not visible to the calling user.`,
            },
        });
    }
    /**
     * Update project category
     * Modify a project category.
     * @param id
     * @param requestBody The project category to modify.
     * @returns ProjectCategoryJsonBean Returned if the project category exists and the currently authenticated user has permission to edit it.
     * @throws ApiError
     */
    public static updateProjectCategory(
        id: number,
        requestBody: ProjectCategoryBean,
    ): CancelablePromise<ProjectCategoryJsonBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/projectCategory/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the caller is not logged in so does not have permission to change project categories.`,
                403: `Returned if the caller is authenticated and does not have permission to change project categories (is not global admin).`,
                404: `Returned if the project category does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
    /**
     * Delete project category
     * Delete a project category.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static removeProjectCategory(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/projectCategory/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Returned if the caller is not logged in so does not have permission to delete project categories.`,
                403: `Returned if the caller is authenticated and does not have permission to delete project categories (is not global admin).`,
                404: `Returned if the project category does not exist or the currently authenticated user does not have permission to view it.`,
            },
        });
    }
}
