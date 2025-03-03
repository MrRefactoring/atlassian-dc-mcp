/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActorsMap } from '../models/ActorsMap.js';
import type { AvatarBean } from '../models/AvatarBean.js';
import type { AvatarCroppingBean } from '../models/AvatarCroppingBean.js';
import type { ComponentBean } from '../models/ComponentBean.js';
import type { EntityPropertiesKeysBean } from '../models/EntityPropertiesKeysBean.js';
import type { EntityPropertyBean } from '../models/EntityPropertyBean.js';
import type { FilePart } from '../models/FilePart.js';
import type { IdBean } from '../models/IdBean.js';
import type { IssueTypeWithStatusJsonBean } from '../models/IssueTypeWithStatusJsonBean.js';
import type { NotificationSchemeBean } from '../models/NotificationSchemeBean.js';
import type { PageBean } from '../models/PageBean.js';
import type { PermissionSchemeBean } from '../models/PermissionSchemeBean.js';
import type { PrioritySchemeBean } from '../models/PrioritySchemeBean.js';
import type { ProjectBean } from '../models/ProjectBean.js';
import type { ProjectIdentity } from '../models/ProjectIdentity.js';
import type { ProjectInputBean } from '../models/ProjectInputBean.js';
import type { ProjectRoleActorsUpdateBean } from '../models/ProjectRoleActorsUpdateBean.js';
import type { ProjectRoleBean } from '../models/ProjectRoleBean.js';
import type { ProjectTypeBean } from '../models/ProjectTypeBean.js';
import type { ProjectUpdateBean } from '../models/ProjectUpdateBean.js';
import type { PropertyBean } from '../models/PropertyBean.js';
import type { SecurityListLevelJsonBean } from '../models/SecurityListLevelJsonBean.js';
import type { SecuritySchemeJsonBean } from '../models/SecuritySchemeJsonBean.js';
import type { VersionBean } from '../models/VersionBean.js';
import type { WorkflowSchemeBean } from '../models/WorkflowSchemeBean.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ProjectService {
    /**
     * Get all visible projects
     * Returns all projects which are visible for the currently logged in user. If no user is logged in, it returns the list of projects that are visible when using anonymous access.
     * @param includeArchived
     * @param expand
     * @param recent
     * @param browseArchive
     * @returns ProjectBean Project data
     * @throws ApiError
     */
    public static getAllProjects(
        includeArchived?: boolean,
        expand?: string,
        recent?: number,
        browseArchive?: boolean,
    ): CancelablePromise<ProjectBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project',
            query: {
                'includeArchived': includeArchived,
                'expand': expand,
                'recent': recent,
                'browseArchive': browseArchive,
            },
            errors: {
                401: `Returned if the user is not authenticated`,
                403: `Returned if the user does not have rights to view projects`,
            },
        });
    }
    /**
     * Create a new project
     * Creates a new project
     * @param requestBody Project data
     * @returns ProjectIdentity Created project data
     * @throws ApiError
     */
    public static createProject(
        requestBody: ProjectInputBean,
    ): CancelablePromise<ProjectIdentity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/project',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is not valid and the project could not be created`,
                401: `Returned if the user is not authenticated`,
                403: `Returned if the user does not have rights to create projects`,
                409: `Returned if requested workflowScheme could not be assigned to created project`,
            },
        });
    }
    /**
     * Get all project types
     * Returns all the project types defined on the Jira instance, not taking into account whether the license to use those project types is valid or not. In case of anonymous checks if they can access at least one project.
     * @returns ProjectTypeBean Returns a list with all the project types defined on the Jira instance
     * @throws ApiError
     */
    public static getAllProjectTypes(): CancelablePromise<ProjectTypeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/type',
            errors: {
                401: `A response status of 401 indicates that there is not a logged in user and therefore this operation can't be performed`,
            },
        });
    }
    /**
     * Get project type by key
     * Returns the project type with the given key. In case of anonymous checks if they can access at least one project.
     * @param projectTypeKey
     * @returns ProjectTypeBean Returns a representation of the project type with the given id
     * @throws ApiError
     */
    public static getProjectTypeByKey(
        projectTypeKey: string,
    ): CancelablePromise<ProjectTypeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/type/{projectTypeKey}',
            path: {
                'projectTypeKey': projectTypeKey,
            },
            errors: {
                401: `A response status of 401 indicates that there is not a logged in user and therefore this operation can't be performed`,
            },
        });
    }
    /**
     * Get project type by key
     * Returns the project type with the given key, if it is accessible to the logged in user. This takes into account whether the user is licensed on the Application that defines the project type.
     * @param projectTypeKey
     * @returns ProjectTypeBean Returns a representation of the project type with the given id
     * @throws ApiError
     */
    public static getAccessibleProjectTypeByKey(
        projectTypeKey: string,
    ): CancelablePromise<ProjectTypeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/type/{projectTypeKey}/accessible',
            path: {
                'projectTypeKey': projectTypeKey,
            },
            errors: {
                401: `A response status of 401 indicates that there is not a logged in user and therefore this operation can't be performed`,
                404: `A response status of 404 indicates that the project type is not accessible for the logged in user`,
            },
        });
    }
    /**
     * Get a project by ID or key
     * Returns a full representation of a project in JSON format. All project keys associated with the project will only be returned if <code>expand=projectKeys</code>.
     * @param projectIdOrKey
     * @param expand
     * @returns ProjectBean Project data
     * @throws ApiError
     */
    public static getProject(
        projectIdOrKey: string,
        expand?: string,
    ): CancelablePromise<ProjectBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Update a project
     * Updates a project. Only non null values sent in JSON will be updated in the project. Values available for the assigneeType field are: "PROJECT_LEAD" and "UNASSIGNED".
     * @param projectIdOrKey
     * @param requestBody Project update data
     * @param expand
     * @returns ProjectBean Updated project data
     * @throws ApiError
     */
    public static updateProject(
        projectIdOrKey: string,
        requestBody: ProjectUpdateBean,
        expand?: string,
    ): CancelablePromise<ProjectBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is not valid and the project could not be updated`,
                401: `Returned if the user is not authenticated`,
                403: `Returned if the user does not have rights to update projects`,
                404: `Returned if the project does not exist`,
            },
        });
    }
    /**
     * Delete a project
     * Deletes a project
     * @param projectIdOrKey
     * @returns void
     * @throws ApiError
     */
    public static deleteProject(
        projectIdOrKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/project/{projectIdOrKey}',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                401: `Returned if the user is not authenticated`,
                403: `Returned if the currently authenticated user does not have permission to delete the project`,
                404: `Returned if the project does not exist`,
            },
        });
    }
    /**
     * Archive a project
     * Archives a project
     * @param projectIdOrKey
     * @returns void
     * @throws ApiError
     */
    public static archiveProject(
        projectIdOrKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}/archive',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                401: `Returned if the user is not authenticated`,
                403: `Returned if the currently authenticated user does not have permission to archive the project or doesn't have DC license or project is already archived`,
                404: `Returned if the project does not exist`,
            },
        });
    }
    /**
     * Update project avatar
     * Updates an avatar for a project. This is step 3/3 of changing an avatar for a project.
     * @param projectIdOrKey
     * @param requestBody Avatar data
     * @returns void
     * @throws ApiError
     */
    public static updateProjectAvatar(
        projectIdOrKey: string,
        requestBody: AvatarBean,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}/avatar',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the avatar does not exist`,
                401: `Returned if the user is not logged in`,
                404: `Returned if the project does not exist`,
            },
        });
    }
    /**
     * Create avatar from temporary
     * Converts the temporary avatar into the final one. This is step 2/3 of changing an avatar for a project:
     * - Upload (store temporary avatar)
     * - Crop (create avatar from temporary)
     * - Update (update project avatar)
     * @param projectIdOrKey
     * @param requestBody Cropping instructions
     * @returns AvatarBean Avatar data
     * @throws ApiError
     */
    public static createAvatarFromTemporary2(
        projectIdOrKey: string,
        requestBody: AvatarCroppingBean,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/project/{projectIdOrKey}/avatar',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the cropping coordinates are invalid`,
                401: `Returned if the user is not authenticated`,
                403: `Returned if the currently authenticated user does not have permission to pick avatar`,
                404: `Returned if the currently authenticated user does not have EDIT PROJECT permission`,
            },
        });
    }
    /**
     * Store temporary avatar using multipart
     * Creates temporary avatar using multipart. The response is sent back as JSON stored in a textarea. This is because
     * the client uses remote iframing to submit avatars using multipart. So we must send them a valid HTML page back from
     * which the client parses the JSON.
     *
     * @param projectIdOrKey
     * @param formData
     * @returns AvatarCroppingBean Temporary avatar cropping instructions embeded in HTML page. Error messages will also be embeded in the page.
     * @throws ApiError
     */
    public static storeTemporaryAvatarUsingMultiPart1(
        projectIdOrKey: string,
        formData?: FilePart,
    ): CancelablePromise<AvatarCroppingBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/project/{projectIdOrKey}/avatar/temporary',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                404: `Returned if the currently authenticated user does not have EDIT PROJECT permission`,
            },
        });
    }
    /**
     * Delete an avatar
     * Deletes avatar
     * @param projectIdOrKey
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteAvatar(
        projectIdOrKey: string,
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/project/{projectIdOrKey}/avatar/{id}',
            path: {
                'projectIdOrKey': projectIdOrKey,
                'id': id,
            },
            errors: {
                403: `Returned if the currently authenticated user does not have permission to delete the avatar`,
                404: `Returned if the avatar or project does not exist`,
            },
        });
    }
    /**
     * Get all avatars for a project
     * Returns all avatars which are visible for the currently logged in user. The avatars are grouped into system and custom.
     * @param projectIdOrKey
     * @returns AvatarBean Avatars
     * @throws ApiError
     */
    public static getAllAvatars(
        projectIdOrKey: string,
    ): CancelablePromise<AvatarBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/avatars',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Get project components
     * Contains a full representation of the specified project's components.
     * @param projectIdOrKey
     * @returns ComponentBean Project components
     * @throws ApiError
     */
    public static getProjectComponents(
        projectIdOrKey: string,
    ): CancelablePromise<ComponentBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/components',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Get keys of all properties for project
     * Returns the keys of all properties for the project identified by the key or by the id.
     * @param projectIdOrKey
     * @returns EntityPropertiesKeysBean Returned if the project was found.
     * @throws ApiError
     */
    public static getPropertiesKeys3(
        projectIdOrKey: string,
    ): CancelablePromise<EntityPropertiesKeysBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/properties',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                400: `Returned if the project key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to browse the project.`,
                404: `Returned if the project with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Get value of property from project
     * Returns the value of the property with a given key from the project identified by the key or by the id.
     * @param propertyKey
     * @param projectIdOrKey
     * @returns EntityPropertyBean Returned if the project property was found.
     * @throws ApiError
     */
    public static getProperty5(
        propertyKey: string,
        projectIdOrKey: string,
    ): CancelablePromise<EntityPropertyBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                400: `Returned if the project key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to browse the project.`,
                404: `Returned if the project with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Set value of specified project's property
     * Sets the value of the specified project's property. You can use this resource to store a custom data against the project identified by the key or by the id. The user who stores the data is required to have permissions to administer the project.
     * @param propertyKey
     * @param projectIdOrKey
     * @param requestBody The request containing value of the project's property. The value has to be a valid, non-empty JSON conforming to http://tools.ietf.org/html/rfc4627. The maximum length of the property value is 32768 bytes.
     * @returns any Returned if the project property is successfully updated.
     * @throws ApiError
     */
    public static setProperty4(
        propertyKey: string,
        projectIdOrKey: string,
        requestBody: PropertyBean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'projectIdOrKey': projectIdOrKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the project key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to administer the project.`,
                404: `Returned if the project with given key or id does not exist.`,
            },
        });
    }
    /**
     * Delete property from project
     * Removes the property from the project identified by the key or by the id.
     * @param propertyKey
     * @param projectIdOrKey
     * @returns void
     * @throws ApiError
     */
    public static deleteProperty5(
        propertyKey: string,
        projectIdOrKey: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/project/{projectIdOrKey}/properties/{propertyKey}',
            path: {
                'propertyKey': propertyKey,
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                400: `Returned if the project key or id is invalid.`,
                401: `Returned if the calling user is not authenticated.`,
                403: `Returned if the calling user does not have permission to edit the project.`,
                404: `Returned if the project with given key or id does not exist or if the property with given key is not found.`,
            },
        });
    }
    /**
     * Restore an archived project
     * Restores an archived project. In case of success restored project should be re-indexed.
     * @param projectIdOrKey
     * @returns any Returned if the project is successfully restored
     * @throws ApiError
     */
    public static restoreProject(
        projectIdOrKey: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}/restore',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                401: `Returned if the user is not authenticated`,
                403: `Returned if the currently authenticated user does not have permission to restore the project or doesn't have DC license or project is already restored`,
                404: `Returned if the project does not exist`,
            },
        });
    }
    /**
     * Get all roles in project
     * Returns all roles in the given project Id or key, with links to full details on each role.
     * @param projectIdOrKey
     * @returns any List of roles and URIs to full details
     * @throws ApiError
     */
    public static getProjectRoles(
        projectIdOrKey: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/role',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it.`,
            },
        });
    }
    /**
     * Get details for a project role
     * Returns the details for a given project role in a project.
     * @param projectIdOrKey
     * @param id
     * @returns ProjectRoleBean Role details and its actors
     * @throws ApiError
     */
    public static getProjectRole(
        projectIdOrKey: string,
        id: number,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/role/{id}',
            path: {
                'projectIdOrKey': projectIdOrKey,
                'id': id,
            },
            errors: {
                404: `Returned if the project or role is not found, or the calling user does not have permission to view it.`,
            },
        });
    }
    /**
     * Update project role with actors
     * Updates a project role to include the specified actors (users or groups). Can be also used to clear roles to not include any users or groups. For user actors, their usernames should be used.
     * @param projectIdOrKey
     * @param id
     * @param requestBody The actors to set for the role
     * @returns ProjectRoleBean Role details and its actors after modification
     * @throws ApiError
     */
    public static setActors(
        projectIdOrKey: string,
        id: number,
        requestBody: ProjectRoleActorsUpdateBean,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}/role/{id}',
            path: {
                'projectIdOrKey': projectIdOrKey,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Returned if the actor could not be added to the project role`,
            },
        });
    }
    /**
     * Add actor to project role
     * Adds an actor (user or group) to a project role. For user actors, their usernames should be used.
     * @param projectIdOrKey
     * @param id
     * @param requestBody The actors to add to the role
     * @returns ProjectRoleBean Role details and its actors after modification
     * @throws ApiError
     */
    public static addActorUsers(
        projectIdOrKey: string,
        id: number,
        requestBody: ActorsMap,
    ): CancelablePromise<ProjectRoleBean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/2/project/{projectIdOrKey}/role/{id}',
            path: {
                'projectIdOrKey': projectIdOrKey,
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Returned if the project or role is not found, the calling user does not have permission to view it or does not have permission to modify the actors in the project role.`,
                410: `Returned if none of the specified groups and users exist.`,
            },
        });
    }
    /**
     * Delete actors from project role
     * Deletes actors (users or groups) from a project role.
     * @param projectIdOrKey
     * @param id
     * @param user
     * @param group
     * @returns void
     * @throws ApiError
     */
    public static deleteActor(
        projectIdOrKey: string,
        id: number,
        user?: string,
        group?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/project/{projectIdOrKey}/role/{id}',
            path: {
                'projectIdOrKey': projectIdOrKey,
                'id': id,
            },
            query: {
                'user': user,
                'group': group,
            },
            errors: {
                404: `Returned if the project or role is not found, the calling user does not have permission to view it or does not have permission to modify the actors in the project role.`,
                410: `Returned if none of the specified groups and users exist.`,
            },
        });
    }
    /**
     * Get all issue types with statuses for a project
     * Get all issue types with valid status values for a project
     * @param projectIdOrKey
     * @returns IssueTypeWithStatusJsonBean Issue types with status values
     * @throws ApiError
     */
    public static getAllStatuses(
        projectIdOrKey: string,
    ): CancelablePromise<IssueTypeWithStatusJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/statuses',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Update project type
     * Updates the type of a project
     * @param projectIdOrKey
     * @param newProjectTypeKey
     * @returns ProjectBean Updated project data
     * @throws ApiError
     */
    public static updateProjectType(
        projectIdOrKey: string,
        newProjectTypeKey: string,
    ): CancelablePromise<ProjectBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectIdOrKey}/type/{newProjectTypeKey}',
            path: {
                'projectIdOrKey': projectIdOrKey,
                'newProjectTypeKey': newProjectTypeKey,
            },
            errors: {
                400: `Returned if the request is not valid and the project type could not be updated`,
                401: `Returned if the user is not authenticated`,
                403: `Returned if the user does not have rights to update projects`,
                404: `Returned if the project does not exist`,
            },
        });
    }
    /**
     * Get paginated project versions
     * Returns all versions for the specified project. Results are paginated. Results can be ordered by the following fields: sequence, name, startDate, releaseDate.
     * @param projectIdOrKey
     * @param expand
     * @param maxResults
     * @param orderBy
     * @param startAt
     * @returns PageBean Project versions
     * @throws ApiError
     */
    public static getProjectVersionsPaginated(
        projectIdOrKey: string,
        expand?: string,
        maxResults?: number,
        orderBy?: string,
        startAt?: number,
    ): CancelablePromise<PageBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/version',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            query: {
                'expand': expand,
                'maxResults': maxResults,
                'orderBy': orderBy,
                'startAt': startAt,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Get project versions
     * Contains a full representation of a the specified project's versions.
     * @param projectIdOrKey
     * @param expand
     * @returns VersionBean Project versions
     * @throws ApiError
     */
    public static getProjectVersions(
        projectIdOrKey: string,
        expand?: string,
    ): CancelablePromise<VersionBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectIdOrKey}/versions',
            path: {
                'projectIdOrKey': projectIdOrKey,
            },
            query: {
                'expand': expand,
            },
            errors: {
                404: `Returned if the project is not found, or the calling user does not have permission to view it`,
            },
        });
    }
    /**
     * Get issue security scheme for project
     * Returns the issue security scheme for project.
     * @param projectKeyOrId
     * @returns SecuritySchemeJsonBean Issue security scheme
     * @throws ApiError
     */
    public static getIssueSecurityScheme1(
        projectKeyOrId: string,
    ): CancelablePromise<SecuritySchemeJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectKeyOrId}/issuesecuritylevelscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the project is visible for calling user, but the user doesn't have administrative permissions`,
                404: `Returned if the project does not exist, or is not visible to the calling user`,
            },
        });
    }
    /**
     * Get notification scheme associated with the project
     * Gets a notification scheme associated with the project. Follow the documentation of /notificationscheme/{id} resource for all details about returned value.
     * @param projectKeyOrId
     * @param expand
     * @returns NotificationSchemeBean Returns a full representation of the notification scheme with given id
     * @throws ApiError
     */
    public static getNotificationScheme1(
        projectKeyOrId: string,
        expand?: string,
    ): CancelablePromise<NotificationSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectKeyOrId}/notificationscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `The user is not logged in`,
                403: `The user is allowed to access the project, but is not an administrator of the project or Jira and therefore can't see the notification scheme of the project`,
                404: `The notification scheme does not exist, or is not visible to the calling user`,
            },
        });
    }
    /**
     * Get assigned permission scheme
     * Gets a permission scheme assigned with a project
     * @param projectKeyOrId
     * @param expand
     * @returns PermissionSchemeBean The associated permission scheme.
     * @throws ApiError
     */
    public static getAssignedPermissionScheme(
        projectKeyOrId: string,
        expand?: string,
    ): CancelablePromise<PermissionSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectKeyOrId}/permissionscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            query: {
                'expand': expand,
            },
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not have permissions to view the project's configuration. In practice the user needs to be a Jira administrator.`,
                404: `Returned if the project is not found (or the user does not have permissions to view the project).`,
            },
        });
    }
    /**
     * Assign permission scheme to project
     * Assigns a permission scheme with a project
     * @param projectKeyOrId
     * @param requestBody Object that contains an id of the scheme
     * @param expand
     * @returns PermissionSchemeBean Shortened details of the newly associated permission scheme.
     * @throws ApiError
     */
    public static assignPermissionScheme(
        projectKeyOrId: string,
        requestBody: IdBean,
        expand?: string,
    ): CancelablePromise<PermissionSchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectKeyOrId}/permissionscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            query: {
                'expand': expand,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Returned if the user is not logged in.`,
                403: `Returned if the user does not have permissions to edit project's permission schemes. In practice the user needs to be a Jira administrator.`,
                404: `Returned if the project or permission scheme is not found.`,
            },
        });
    }
    /**
     * Get assigned priority scheme
     * Gets a full representation of a priority scheme in JSON format used by specified project. User must be global administrator or project administrator. All project keys associated with the priority scheme will only be returned if additional query parameter is provided expand=projectKeys.
     * @param projectKeyOrId
     * @returns PrioritySchemeBean Returned if the priority scheme exists and the user has permission to view it.
     * @throws ApiError
     */
    public static getAssignedPriorityScheme(
        projectKeyOrId: string,
    ): CancelablePromise<PrioritySchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectKeyOrId}/priorityscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            errors: {
                403: `Returned if the user does not have rights to view priority scheme.`,
                404: `Returned if project or priority scheme is not found.`,
            },
        });
    }
    /**
     * Assign project with priority scheme
     * Assigns project with priority scheme. Priority scheme assign with migration is possible from the UI. Operation will fail if migration is needed as a result of operation eg. there are issues with priorities invalid in the destination scheme. All project keys associated with the priority scheme will only be returned if additional query parameter is provided expand=projectKeys.
     * @param projectKeyOrId
     * @param requestBody Object that contains an id of the scheme
     * @returns PrioritySchemeBean Affected priority scheme.
     * @throws ApiError
     */
    public static assignPriorityScheme(
        projectKeyOrId: string,
        requestBody: IdBean,
    ): CancelablePromise<PrioritySchemeBean> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/2/project/{projectKeyOrId}/priorityscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if the request is not valid and the priority scheme could not be updated. Eg. migration is needed as a result of operation.`,
                403: `Returned if the user does not have rights to assign priority schemes.`,
                404: `Returned if project or priority scheme is not found.`,
            },
        });
    }
    /**
     * Unassign project from priority scheme
     * Unassigns project from priority scheme. Operation will fail for defualt priority scheme, project is not found or project is not associated with provided priority scheme. All project keys associated with the priority scheme will only be returned if additional query parameter is provided expand=projectKeys.
     * @param schemeId
     * @param projectKeyOrId
     * @returns PrioritySchemeBean Affected priority scheme.
     * @throws ApiError
     */
    public static unassignPriorityScheme(
        schemeId: number,
        projectKeyOrId: string,
    ): CancelablePromise<PrioritySchemeBean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/2/project/{projectKeyOrId}/priorityscheme/{schemeId}',
            path: {
                'schemeId': schemeId,
                'projectKeyOrId': projectKeyOrId,
            },
            errors: {
                400: `Returned if the request is not valid and the priority scheme could not be updated. Eg. provided scheme is default priority scheme or project is not associated with scheme.`,
                403: `Returned if the user does not have rights to assign priority schemes.`,
                404: `Returned if project or priority scheme is not found.`,
            },
        });
    }
    /**
     * Get all security levels for project
     * Returns all security levels for the project that the current logged in user has access to. If the user does not have the Set Issue Security permission, the list will be empty.
     * @param projectKeyOrId
     * @returns SecurityListLevelJsonBean Returns a list of all security levels in a project for which the current user has access.
     * @throws ApiError
     */
    public static getSecurityLevelsForProject(
        projectKeyOrId: string,
    ): CancelablePromise<SecurityListLevelJsonBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectKeyOrId}/securitylevel',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            errors: {
                404: `Returned if the project is not found or the user does not have permissions to browse it.`,
            },
        });
    }
    /**
     * Get workflow scheme for project
     * Returns the workflow scheme that is associated with requested project.
     * @param projectKeyOrId
     * @returns WorkflowSchemeBean Returned if requested project exist and has associated workflow scheme, and the user has permission to see it.
     * @throws ApiError
     */
    public static getWorkflowSchemeForProject(
        projectKeyOrId: string,
    ): CancelablePromise<WorkflowSchemeBean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/project/{projectKeyOrId}/workflowscheme',
            path: {
                'projectKeyOrId': projectKeyOrId,
            },
            errors: {
                401: `Returned if the requested user is not authenticated.`,
                403: `Returned if the requested user does not have permission to administer Jira.`,
                404: `Returned if the requested project does not exist.`,
            },
        });
    }
}
