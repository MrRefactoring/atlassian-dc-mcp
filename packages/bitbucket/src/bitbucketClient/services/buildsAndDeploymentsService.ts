/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RestBuildStats } from '../models/restBuildStats.js';
import type { RestBuildStatus } from '../models/restBuildStatus.js';
import type { RestBuildStatusSetRequest } from '../models/restBuildStatusSetRequest.js';
import type { RestBulkAddInsightAnnotationRequest } from '../models/restBulkAddInsightAnnotationRequest.js';
import type { RestDeployment } from '../models/restDeployment.js';
import type { RestDeploymentSetRequest } from '../models/restDeploymentSetRequest.js';
import type { RestInsightAnnotationsResponse } from '../models/restInsightAnnotationsResponse.js';
import type { RestInsightReport } from '../models/restInsightReport.js';
import type { RestMultipleBuildStats } from '../models/restMultipleBuildStats.js';
import type { RestRequiredBuildCondition } from '../models/restRequiredBuildCondition.js';
import type { RestRequiredBuildConditionSetRequest } from '../models/restRequiredBuildConditionSetRequest.js';
import type { RestSetInsightReportRequest } from '../models/restSetInsightReportRequest.js';
import type { RestSingleAddInsightAnnotationRequest } from '../models/restSingleAddInsightAnnotationRequest.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class BuildsAndDeploymentsService {
    /**
     * Create a required builds merge check
     * Create a required build merge check for the given repository.
     *
     * The authenticated user must have **REPO_ADMIN** permission for the target repository to register a required build merge check.
     *
     * The contents of the required build merge check request are:
     *
     * These fields are **required**:
     *
     * - **buildParentKeys**: A non-empty list of build parent keys that require green builds for this merge check to pass
     * - **refMatcher.id**: The value to match refs against in the target branch
     * - **refMatcher.type.id**: The type of ref matcher, one of: "ANY_REF", "BRANCH", "PATTERN", "MODEL_CATEGORY" or "MODEL_BRANCH"
     *
     *
     * These fields are optional:
     *
     * - **exemptRefMatcher.id** The value to exempt refs in the source branch from this check
     * - **exemptRefMatcher.type.id**: The type of exempt ref matcher, one of: "ANY_REF", "BRANCH", "PATTERN", "MODEL_CATEGORY" or "MODEL_BRANCH"
     *
     *
     *
     * @param projectKey The project that the repository belongs to
     * @param repositorySlug The repository being used
     * @param requestBody The request specifying the required build parent keys, ref matcher and exemption matcher
     * @returns RestRequiredBuildCondition A response containing the newly created required build merge check.
     * @throws ApiError
     */
    public static createRequiredBuildsMergeCheck(
        projectKey: string,
        repositorySlug: string,
        requestBody?: RestRequiredBuildConditionSetRequest,
    ): CancelablePromise<RestRequiredBuildCondition> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/condition',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request was malformed. This could be caused because:
                - The build parent key list is empty
                - Either of the provided ref matchers is of an unrecognized type
                - Either of the provided ref matchers could not be created with the provided type and id
                `,
                401: `The currently authenticated user has insufficient permissions to create a required build merge check in this repository.`,
            },
        });
    }
    /**
     * Delete a required builds merge check
     * Deletes a required build existing merge check, given it's ID.
     *
     * The authenticated user must have **REPO_ADMIN** permission for the target repository to delete a required build merge check.
     * @param projectKey The project that the repository belongs to
     * @param id
     * @param repositorySlug The repository being used
     * @returns void
     * @throws ApiError
     */
    public static deleteRequiredBuildsMergeCheck(
        projectKey: string,
        id: number,
        repositorySlug: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete a required build merge check in this repository.`,
            },
        });
    }
    /**
     * Update a required builds merge check
     * Update the required builds merge check for the given ID.
     *
     * The authenticated user must have **REPO_ADMIN** permission for the target repository to update a required build merge check.
     *
     * The contents of the required build merge check request are:
     *
     * These fields are **required**:
     *
     * - **buildParentKeys**: A non-empty list of build parent keys that require green builds for this merge check to pass
     * - **refMatcher.id**: The value to match refs against in the target branch
     * - **refMatcher.type.id**: The type of ref matcher, one of: "ANY_REF", "BRANCH", "PATTERN", "MODEL_CATEGORY" or "MODEL_BRANCH"
     *
     *
     * These fields are optional:
     *
     * - **exemptRefMatcher.id** The value to exempt refs in the source branch from this check
     * - **exemptRefMatcher.type.id**: The type of exempt ref matcher, one of: "ANY_REF", "BRANCH", "PATTERN", "MODEL_CATEGORY" or "MODEL_BRANCH"
     *
     *
     *
     * @param projectKey The project that the repository belongs to
     * @param id
     * @param repositorySlug The repository being used
     * @param requestBody The request specifying the required build parent keys, ref matcher and exemption matcher
     * @returns RestRequiredBuildCondition The details needed to update a required build merge check.
     * @throws ApiError
     */
    public static updateRequiredBuildsMergeCheck(
        projectKey: string,
        id: number,
        repositorySlug: string,
        requestBody?: RestRequiredBuildConditionSetRequest,
    ): CancelablePromise<RestRequiredBuildCondition> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/condition/{id}',
            path: {
                'projectKey': projectKey,
                'id': id,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The request was malformed. This could be caused because:
                - The build parent key list is empty
                - Either of the provided ref matchers is of an unrecognized type
                - Either of the provided ref matchers could not be created with the provided type and id
                `,
                401: `The currently authenticated user has insufficient permissions to create a required build merge check in this repository.`,
            },
        });
    }
    /**
     * Get required builds merge checks
     * Returns a page of required build merge checks that have been configured for this repository.
     *
     * The authenticated user must have **REPO_READ** permission for the target repository to request a page of required build merge checks.
     * @param projectKey The project that the repository belongs to
     * @param repositorySlug The repository being used
     * @param start Start number for the page (inclusive). If not passed, first page is assumed.
     * @param limit Number of items to return. If not passed, a page size of 25 is used.
     * @returns any The required build merge checks associated with the provided repository.
     * @throws ApiError
     */
    public static getPageOfRequiredBuildsMergeChecks(
        projectKey: string,
        repositorySlug: string,
        start?: number,
        limit?: number,
    ): CancelablePromise<{
        isLastPage?: boolean;
        limit?: number;
        nextPageStart?: number;
        size?: number;
        start?: number;
        values?: Array<RestRequiredBuildCondition>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/required-builds/latest/projects/{projectKey}/repos/{repositorySlug}/conditions',
            path: {
                'projectKey': projectKey,
                'repositorySlug': repositorySlug,
            },
            query: {
                'start': start,
                'limit': limit,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to request a page of required build merge checks in this repository.`,
            },
        });
    }
    /**
     * Delete a Code Insights report
     * Delete a report for the given commit. Also deletes any annotations associated with this report.
     * @param projectKey The project key.
     * @param commitId The commit ID on which to record the annotation. This must be a full 40 character commit hash.
     * @param repositorySlug The repository slug.
     * @param key The key of the report to which this annotation belongs.
     * @returns void
     * @throws ApiError
     */
    public static deleteACodeInsightsReport(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
                'key': key,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete insight reports or was not the author (<code>REPO_READ</code> for author otherwise <code>REPO_ADMIN</code>).`,
                404: `The specified project, repository, commit or report does not exist.`,
            },
        });
    }
    /**
     * Get a Code Insights report
     * Retrieve the specified report.
     * @param projectKey The project key.
     * @param commitId The commit ID on which to record the annotation. This must be a full 40 character commit hash.
     * @param repositorySlug The repository slug.
     * @param key The report key.
     * @returns RestInsightReport The specified report.
     * @throws ApiError
     */
    public static getACodeInsightsReport(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
    ): CancelablePromise<RestInsightReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
                'key': key,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions (<code>REPO_READ needed</code>) to get insight reports.`,
                404: `The specified project, repository, commit, or report does not exist.`,
            },
        });
    }
    /**
     * Create a Code Insights report
     * Create a new insight report, or replace the existing one if a report already exists for the given repository, commit, and report key. A request to replace an existing report will be rejected if the authenticated user was not the creator of the specified report.
     *
     * The report key should be a unique string chosen by the reporter and should be unique enough not to potentially clash with report keys from other reporters. We recommend using reverse DNS namespacing or a similar standard to ensure that collision is avoided.<h1>Report parameters</h1><table summary="Report parameters">    <tr>        <th>Parameter</th>        <th>Description</th>        <th>Required?</th>        <th>Restrictions</th>        <th>Type</th>    </tr>    <tr>        <td>title</td>        <td>A short string representing the name of the report</td>        <td>Yes</td>        <td>Max length: 450 characters (but we recommend that it is shorter so that the display is nicer)</td>        <td>String</td>    </tr>    <tr>        <td>details</td>        <td>             A string to describe the purpose of the report. This string may contain             escaped newlines and if it does it will display the content accordingly.        </td>        <td>No</td>        <td>Max length: 2000 characters</td>        <td>String</td>    </tr>    <tr>        <td>result</td>        <td>Indicates whether the report is in a passed or failed state</td>        <td>No</td>        <td>One of: PASS, FAIL</td>        <td>String</td>    </tr>    <tr>        <td>data</td>        <td>An array of data fields (described below) to display information on the report</td>        <td>No</td>        <td>Maximum 6 data fields</td>        <td>Array</td>    </tr>    <tr>        <td>reporter</td>        <td>A string to describe the tool or company who created the report</td>        <td>No</td>        <td>Max length: 450 characters</td>        <td>String</td>    </tr>    <tr>        <td>link</td>        <td>A URL linking to the results of the report in an external tool.</td>        <td>No</td>        <td>Must be a valid http or https URL</td>        <td>String</td>    </tr>    <tr>        <td>logoUrl</td>        <td>A URL to the report logo. If none is provided, the default insights logo will be used.</td>        <td>No</td>        <td>Must be a valid http or https URL</td>        <td>String</td>    </tr></table><h1>Data parameters</h1>The data field on the report is an array with at most 6 data fields (JSON maps) containing information that is to be displayed on the report (see the request example).<table summary="Data parameters">    <tr>        <th>Parameter</th>        <th>Description</th>        <th>Type</th>    </tr>    <tr>        <td>title</td>        <td>A string describing what this data field represents</td>        <td>String</td>    </tr>    <tr>        <td>type</td>        <td>             The type of data contained in the value field. If not provided,             then the value will be detected as a boolean, number or string.             One of: BOOLEAN, DATE, DURATION, LINK, NUMBER, PERCENTAGE, TEXT        </td>        <td>String</td>    </tr>    <tr>        <td>value</td>        <td>            A value based on the type provided. Either a raw value             (string, number or boolean) or a map. See below.        </td>    </tr></table><table summary="Types">    <tr>        <th>Type Field</th>        <th>Value Field Type</th>        <th>Value Field Display</th>    </tr>    <tr>        <td>None/Omitted</td>        <td>Number, String or Boolean (not an array or object)</td>        <td>Plain text</td>    </tr>    <tr>        <td>BOOLEAN</td>        <td>Boolean</td>        <td>The value will be read as a JSON boolean and displayed as 'Yes' or 'No'.</td>    </tr>    <tr>        <td>DATE</td>        <td>Number</td>        <td>             The value will be read as a JSON number in the form of a Unix timestamp              (milliseconds) and will be displayed as a relative date if the date is less             than one week ago, otherwise it will be displayed as an absolute date.        </td>    </tr>    <tr>        <td>DURATION</td>        <td>Number</td>        <td>             The value will be read as a JSON number in milliseconds and             will be displayed in a human readable duration format.        </td>    </tr>    <tr>        <td>LINK</td>        <td>Object: {"linktext": "Link text here", "href": "https://link.to.annotation/in/external/tool"}</td>        <td>             The value will be read as a JSON object containing the fields "linktext"             and "href" and will be displayed as a clickable link on the report.        </td>    </tr>    <tr>        <td>NUMBER</td>        <td>Number</td>        <td>             The value will be read as a JSON number and large numbers will             be displayed in a human readable format (e.g. 14.3k).        </td>    </tr>    <tr>        <td>PERCENTAGE</td>        <td>Number (between 0 and 100)</td>        <td>             The value will be read as a JSON number between 0 and 100              and will be displayed with a percentage sign.        </td>    </tr>    <tr>        <td>TEXT</td>        <td>String</td>        <td>The value will be read as a JSON string and will be displayed as-is</td>    </tr></table>
     * @param projectKey The project key.
     * @param commitId The commit ID on which to record the annotation. This must be a full 40 character commit hash.
     * @param repositorySlug The repository slug.
     * @param key A unique string representing the report as chosen by the reporter. This should be unique enough to not clash with other report's keys. To do this, we recommend namespacing the key using reverse DNS
     * @param requestBody The request object containing the details of the report to create (see example).
     * @returns RestInsightReport The created report.
     * @throws ApiError
     */
    public static setACodeInsightsReport(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
        requestBody?: RestSetInsightReportRequest,
    ): CancelablePromise<RestInsightReport> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `One of the following error cases occurred (check the error message for more details):
                - The request does not contain a report title.
                - The data field contains unsupported objects.
                - The request does not contain a report key/
                - The provided commit hash is invalid, according to  the validation rules mentioned for the commitId above.
                `,
                401: `The currently authenticated user is not permitted to create an insight report or authentication failed.`,
            },
        });
    }
    /**
     * Delete Code Insights annotations
     * Delete annotations for a given report that match the given external IDs, or all annotations if no external IDs are provided.
     * @param projectKey The project key.
     * @param commitId The commit ID on which to record the annotation. This must be a full 40 character commit hash.
     * @param repositorySlug The repository slug.
     * @param key The key of the report to which this annotation belongs.
     * @param externalId The external IDs for the annotations that are to be deleted. Can be specified more than once to delete by more than one external ID, or can be unspecified to delete all annotations.
     * @returns void
     * @throws ApiError
     */
    public static deleteAnnotations(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
        externalId?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}/annotations',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
                'key': key,
            },
            query: {
                'externalId': externalId,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions to delete insight reports or was not the author (<code>REPO_READ</code> for author otherwise <code>REPO_ADMIN</code>).`,
                404: `The specified project, repository, commit or report does not exist.`,
            },
        });
    }
    /**
     * Get Code Insights annotations for a report
     * Retrieve the specified report's annotations.
     * @param projectKey The project key.
     * @param commitId The commit ID on which to record the annotation. This must be a full 40 character commit hash.
     * @param repositorySlug The repository slug.
     * @param key The report key.
     * @returns RestInsightAnnotationsResponse The specified annotations.
     * @throws ApiError
     */
    public static getAnnotations(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
    ): CancelablePromise<RestInsightAnnotationsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}/annotations',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
                'key': key,
            },
            errors: {
                401: `The currently authenticated user has insufficient permissions (<code>REPO_READ needed</code>) to get insight reports.`,
                404: `The specified project, repository, commit, or report does not exist.`,
            },
        });
    }
    /**
     * Add Code Insights annotations
     * Add annotations to the given report. The request should be a JSON object mapping the string "annotations" to an array of maps containing the annotation data, as described below. See also the example request.
     *
     * A few things to note:- Annotations are an extension of a report, so a report must first exist in order to post annotations.   Annotations are posted separately from the report, and can be posted in bulk using this endpoint.
     * - Only the annotations that are on lines changed in the unified diff will be displayed. This means it is  likely not all annotations posted will be displayed on the pull request  It also means that if the user is viewing a side-by-side diff,  commit diff or iterative review diff they will not be able to view the annotations.
     * - A report cannot have more than 1000 annotations by default, however this property is congurable at an  instance level. If the request would result in more than the maximum number of annotations being stored  then the entire request is rejected and no new annotations are stored.
     * - There is no de-duplication of annotations on Bitbucket so be sure that reruns of builds will first  delete the report and annotations before creating them.
     *
     * # Annotation parameters
     *
     * |Parameter|Description|Required?|Restrictions|Type|
     * |--- |--- |--- |--- |--- |
     * |path|The path of the file on which this annotation should be placed. This is the path of the filerelative to the git repository. If no path is provided, then it will appear in the overview modalon all pull requests where the tip of the branch is the given commit, regardless of which files weremodified.|No||String|
     * |line|The line number that the annotation should belong to. If no line number is provided, then it willdefault to 0 and in a pull request it will appear at the top of the file specified by the path field.|No|Non-negative integer|Integer|
     * |message|The message to display to users|Yes|The maximum length accepted is 2000 characters, however the user interface may truncate this valuefor display purposes. We recommend that the message is short and succinct, with further detailsavailable to the user if needed on the page linked to by the the annotation link.|String|
     * |severity|The severity of the annotation|Yes|One of: LOW, MEDIUM, HIGH|String|
     * |link|An http or https URL representing the location of the annotation in the external tool|No||String|
     * |type|The type of annotation posted|No|One of: VULNERABILITY, CODE_SMELL, BUG|String|
     * |externalId|If the caller requires a link to get or modify this annotation, then an ID must be provided. It isnot used or required by Bitbucket, but only by the annotation creator for updating or deleting thisspecific annotation.|No|A string value shorter than 450 characters|String|
     * @param projectKey The project key.
     * @param commitId The commit ID on which to record the annotation. This must be a full 40 character commit hash.
     * @param repositorySlug The repository slug.
     * @param key The key of the report to which this annotation belongs.
     * @param requestBody The annotations to add.
     * @returns void
     * @throws ApiError
     */
    public static addAnnotations(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
        requestBody?: RestBulkAddInsightAnnotationRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/insights/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/reports/{key}/annotations',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The currently authenticated user is not the author of the report, or the author no longer has sufficient permissions (<code>REPO_READ</code>).`,
                404: `The specified project, repository, commit, or report does not exist.`,
            },
        });
    }
    /**
     * Get a specific build status
     * Get a specific build status.
     *
     *
     * The authenticated user must have **REPO_READ** permission for the provided repository.The request can also be made with anonymous 2-legged OAuth.<br>Since 7.14
     * @param projectKey The project key.
     * @param commitId The commit.
     * @param repositorySlug The repository slug.
     * @param key the key of the build status
     * @returns RestBuildStatus The build status associated with the provided commit and key
     * @throws ApiError
     */
    public static get(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        key: string,
    ): CancelablePromise<RestBuildStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/builds',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
            },
            query: {
                'key': key,
            },
            errors: {
                400: `The request has failed validation`,
                401: `The currently authenticated user has insufficient permissions this repository`,
                404: `The specified repository, commit or build status does not exist`,
            },
        });
    }
    /**
     * Store a build status
     * Store a build status.
     *
     *
     * The authenticated user must have **REPO_READ** permission for the repository that this build status is for. The request can also be made with anonymous 2-legged OAuth.
     * @param projectKey The project key.
     * @param commitId The commit.
     * @param repositorySlug The repository slug.
     * @param requestBody The contents of the build status request are:
     * These fields are **required**:
     *
     *
     * - **key**: The string referring to this branch plan/job
     * - **state**: The build status state, one of: "SUCCESSFUL", "FAILED", "INPROGRESS", "CANCELLED", "UNKNOWN"
     * - **url**: URL referring to the build result page in the CI tool.
     *
     *
     * These fields are optional:
     *
     *
     * - **buildNumber** (optional): A unique identifier for this particular run of a plan<
     * - **dateAdded** (optional): milliseconds since epoch. If not provided current date is used.
     * - **description** (optional): Describes the build result
     * - **duration** (optional): Duration of a completed build in milliseconds.
     * - **name** (optional): A short string that describes the build plan
     * - **parent** (optional): The identifier for the plan or job that ran the branch plan that produced this build status.
     * - **ref** (optional): The fully qualified git reference e.g. refs/heads/master.
     * - **testResults** (optional): A summary of the passed, failed and skipped tests.
     *
     * @returns void
     * @throws ApiError
     */
    public static add(
        projectKey: string,
        commitId: string,
        repositorySlug: string,
        requestBody?: RestBuildStatusSetRequest,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/latest/projects/{projectKey}/repos/{repositorySlug}/commits/{commitId}/builds',
            path: {
                'projectKey': projectKey,
                'commitId': commitId,
                'repositorySlug': repositorySlug,
            },
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `The build status was not added as the request was invalid. This could be because of a number of things:
                - an invalid commit hash was provided
                - build key was blank or longer than 255 characters
                - invalid branch was provided
                - invalid state was provided
                - build status url was blank or longer than 450 characters
                The specifics will be included in the error message.`,
                401: `The currently authenticated user has insufficient permissions to push a build status to this repository`,
                404: `The specified repository does not exist`,
            },
        });
    }
}

