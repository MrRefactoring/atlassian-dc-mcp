/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssociateProjectsBean } from '../models/AssociateProjectsBean.js';
import type { IssueTypeSchemeBean } from '../models/IssueTypeSchemeBean.js';
import type { IssueTypeSchemeCreateUpdateBean } from '../models/IssueTypeSchemeCreateUpdateBean.js';
import type { IssueTypeSchemeListBean } from '../models/IssueTypeSchemeListBean.js';
import type { ProjectBean } from '../models/ProjectBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class IssuetypeschemeService {
    /**
     * Get list of all issue type schemes visible to user
     * Returns a list of all issue type schemes visible to the user. All issue types associated with the scheme will only be returned if an additional query parameter is provided: expand=schemes.issueTypes. Similarly, the default issue type associated with the scheme (if one exists) will only be returned if an additional query parameter is provided: expand=schemes.defaultIssueType. Note that both query parameters can be used together: expand=schemes.issueTypes,schemes.defaultIssueType.
     * @returns IssueTypeSchemeListBean Returns a list of issue type schemes.
     * @throws ApiError
     */
    public static getAllIssueTypeSchemes(): CancelablePromise<IssueTypeSchemeListBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetypescheme',
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
            },
        });
    }
    /**
     * Create an issue type scheme from JSON representation
     * Creates an issue type scheme from a JSON representation
     * @param requestBody Issue type scheme creation details.
     * @returns IssueTypeSchemeBean Returns a JSON representation of the newly created IssueTypeScheme if successful.
     * @throws ApiError
     */
    public static createIssueTypeScheme(
        requestBody: IssueTypeSchemeCreateUpdateBean,
    ): CancelablePromise<IssueTypeSchemeBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issuetypescheme',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
            },
        });
    }
    /**
     * Get full representation of issue type scheme by id
     * Returns a full representation of the issue type scheme that has the given id
     * @param schemeId A String containing an issue type scheme's id.
     * @returns IssueTypeSchemeBean Returns a full representation of the issue type scheme with the given id.
     * @throws ApiError
     */
    public static getIssueTypeScheme(
        schemeId: string,
    ): CancelablePromise<IssueTypeSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetypescheme/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type scheme does not exist.`,
            },
        });
    }
    /**
     * Update specified issue type scheme from JSON representation
     * Updates the specified issue type scheme from a JSON representation
     * @param schemeId The id of the issue type scheme to update.
     * @param requestBody Specifies the new set of attributes that the issue type scheme will take on.
     * @returns IssueTypeSchemeBean Returns a JSON representation of the updated issue type scheme.
     * @throws ApiError
     */
    public static updateIssueTypeScheme(
        schemeId: string,
        requestBody: IssueTypeSchemeCreateUpdateBean,
    ): CancelablePromise<IssueTypeSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issuetypescheme/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid. This happens when the name or issue types are invalid. It also occurs when the default issue type isn't found in the associated issue types collection.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type scheme to update does not exist.`,
            },
        });
    }
    /**
     * Delete specified issue type scheme
     * Deletes the specified issue type scheme. Any projects associated with this IssueTypeScheme will be automatically associated with the global default IssueTypeScheme.
     * @param schemeId The id of the issue type scheme to remove.
     * @returns void
     * @throws ApiError
     */
    public static deleteIssueTypeScheme(
        schemeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issuetypescheme/{schemeId}',
            path: {
                'schemeId': schemeId,
            },
            errors: {
                400: `Returned if the request is invalid. It happens when there are associated issues with the issue type which is being removed, but it is impossible to migrate these issues to the alternative issue type.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira or if an attempt is made to delete the default IssueTypeScheme.`,
                404: `Returned if the issue type scheme which is supposed to be removed does not exist.`,
            },
        });
    }
    /**
     * Get all of the associated projects for specified scheme
     * For the specified issue type scheme, returns all of the associated projects
     * @param schemeId Id of the issue type scheme whose projects we're accessing
     * @param expand
     * @returns ProjectBean The collection of projects associated with this issue type scheme.
     * @throws ApiError
     */
    public static getAssociatedProjects(
        schemeId: string,
        expand?: string,
    ): CancelablePromise<ProjectBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/issuetypescheme/{schemeId}/associations',
            path: {
                'schemeId': schemeId,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the specified issue type scheme does not exist.`,
            },
        });
    }
    /**
     * Set project associations for scheme
     * Associates the given projects with the specified issue type scheme
     * @param schemeId The id of the issue type scheme whose project associations we're replacing.
     * @param requestBody Collection of projects, specified by id or key, to associate with this issue type scheme
     * @returns any Confirmation that the association was successful.
     * @throws ApiError
     */
    public static setProjectAssociationsForScheme(
        schemeId: string,
        requestBody: AssociateProjectsBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/issuetypescheme/{schemeId}/associations',
            path: {
                'schemeId': schemeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid. This occurs when the supplied project ids/keys are invalid. It also happens if performing the association would require an issue type migration for any of the newly associated projects.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type scheme to update does not exist.`,
            },
        });
    }
    /**
     * Add project associations to scheme
     * Adds additional projects to those already associated with the specified issue type scheme
     * @param schemeId The id of the issue type scheme whose project associations we're adding to.
     * @param requestBody Collection of projects, specified by id or key, to associate with this issue type scheme
     * @returns any Confirmation that the association was successful.
     * @throws ApiError
     */
    public static addProjectAssociationsToScheme(
        schemeId: string,
        requestBody: AssociateProjectsBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/issuetypescheme/{schemeId}/associations',
            path: {
                'schemeId': schemeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is invalid. This occurs when the supplied project ids/keys are invalid. It also happens if performing the association would require an issue type migration for any of the projects.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira.`,
                404: `Returned if the issue type scheme to update does not exist.`,
            },
        });
    }
    /**
     * Remove all project associations for specified scheme
     * Removes all project associations for the specified issue type scheme
     * @param schemeId The id of the issue type scheme whose project associations we're removing
     * @returns void
     * @throws ApiError
     */
    public static removeAllProjectAssociations(
        schemeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issuetypescheme/{schemeId}/associations',
            path: {
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira or if an attempt is made to remove associations for the default/global issue type scheme.`,
                404: `Returned if the specified issue type scheme does not exist.`,
            },
        });
    }
    /**
     * Remove given project association for specified scheme
     * For the specified issue type scheme, removes the given project association
     * @param projIdOrKey The id or key of the project that is to be un-associated with the issue type scheme
     * @param schemeId The id of the issue type scheme whose project association we're removing
     * @returns void
     * @throws ApiError
     */
    public static removeProjectAssociation(
        projIdOrKey: string,
        schemeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/issuetypescheme/{schemeId}/associations/{projIdOrKey}',
            path: {
                'projIdOrKey': projIdOrKey,
                'schemeId': schemeId,
            },
            errors: {
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer Jira or if an attempt is made to remove an association for the default/global issue type scheme.`,
                404: `Returned if the specified issue type scheme or project does not exist.`,
            },
        });
    }
}
