/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectPickerResultWrapper } from '../models/ProjectPickerResultWrapper.js';
import type { CancelablePromise } from '../core/CancelablePromise.js';
import { OpenAPI } from '../core/OpenAPI.js';
import { request as __request } from '../core/request.js';
export class ProjectsService {
    /**
     * Get projects matching query
     * Returns a list of projects visible to the user where project name and/or key is matching the given query.
     * Passing an empty (or whitespace only) query will match no projects. The project matches will
     * contain a field with the query highlighted.
     * The number of projects returned can be controlled by passing a value for 'maxResults', but a hard limit of no
     * more than 100 projects is enforced. The projects are wrapped in a single response object that contains
     * a header for use in the picker, specifically 'Showing X of Y matching projects' and the total number
     * of matches for the query.
     * @param maxResults
     * @param query
     * @param allowEmptyQuery
     * @returns ProjectPickerResultWrapper Returned even when no projects match the given query.
     * @throws ApiError
     */
    public static searchForProjects(
        maxResults?: number,
        query: string = '',
        allowEmptyQuery: boolean = false,
    ): CancelablePromise<ProjectPickerResultWrapper> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/2/projects/picker',
            query: {
                'maxResults': maxResults,
                'query': query,
                'allowEmptyQuery': allowEmptyQuery,
            },
        });
    }
}
