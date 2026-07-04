/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExampleMultipartFormData } from '../models/exampleMultipartFormData.js';
import type { FileInfo } from '../models/fileInfo.js';
import type { JobDetails } from '../models/jobDetails.js';
import type { SiteBackupJobDetails } from '../models/siteBackupJobDetails.js';
import type { SiteBackupSettings } from '../models/siteBackupSettings.js';
import type { SiteRestoreJobDetails } from '../models/siteRestoreJobDetails.js';
import type { SiteRestoreSettings } from '../models/siteRestoreSettings.js';
import type { SpaceBackupJobDetails } from '../models/spaceBackupJobDetails.js';
import type { SpaceBackupSettings } from '../models/spaceBackupSettings.js';
import type { SpaceRestoreJobDetails } from '../models/spaceRestoreJobDetails.js';
import type { SpaceRestoreSettings } from '../models/spaceRestoreSettings.js';
import type { CancelablePromise } from '../core/cancelablePromise.js';
import { OpenAPI } from '../core/openAPI.js';
import { request as __request } from '../core/request.js';
export class BackupAndRestoreService {
    /**
     * Cancel all queued jobs
     * Cancels all queued jobs. Does not affect jobs that are being processed at the moment.
     * @returns any Returns the number of cancelled jobs. If no jobs were cancelled, 0 is returned.
     * Example response: `1`
     * @throws ApiError
     */
    public static cancelAllQueuedJobs(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/backup-restore/jobs/clear-queue',
            errors: {
                403: `Returned if user doesn't have permission to cancel jobs`,
            },
        });
    }
    /**
     * Cancel job
     * Cancels the job. If the job is already cancelled or failed, the method will do nothing.
     * @param jobId id of the backup/restore job
     * @returns JobDetails Returns a JSON representation of the cancelled job.
     * @throws ApiError
     */
    public static cancelJob(
        jobId: string,
    ): CancelablePromise<JobDetails> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/rest/api/backup-restore/jobs/{jobId}/cancel',
            path: {
                'jobId': jobId,
            },
            errors: {
                404: `Returned if job not found or user doesn't have permission to cancel it`,
            },
        });
    }
    /**
     * Create site backup job
     * Starts the new site backup job.
     * @param requestBody Site backup settings
     * @returns SiteBackupJobDetails Returns a JSON representation of the site backup job details.
     * @throws ApiError
     */
    public static createSiteBackupJob(
        requestBody?: SiteBackupSettings,
    ): CancelablePromise<SiteBackupJobDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/backup-restore/backup/site',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` Returned if invalid settings provided`,
                409: `Returned if user doesn't have permission to create site backups`,
            },
        });
    }
    /**
     * Create site restore job
     * Starts the new site restore job.
     * @param requestBody space restore settings
     * @returns SiteRestoreJobDetails Returns a JSON representation of the site restore job.
     * @throws ApiError
     */
    public static createSiteRestoreJob(
        requestBody?: SiteRestoreSettings,
    ): CancelablePromise<SiteRestoreJobDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/backup-restore/restore/site',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` Returned if invalid filename provided`,
                403: `Returned if user doesn't have permission to restore site`,
            },
        });
    }
    /**
     * Create site restore job for upload backup file
     * This resource expects a multipart post. The media-type multipart/form-data is defined in RFC 1867.
     *
     * Most client libraries have classes that make dealing with multipart posts simple.
     *
     * For instance, in Java the Apache HTTP Components library provides a MultiPartEntity that makes it simple to submit a multipart POST.
     *
     * In order to protect against XSRF attacks, because this method accepts multipart/form-data, it has XSRF protection on it.  This means you must submit a header of X-Atlassian-Token: nocheck with the request, otherwise it will be blocked.
     *
     * The name of the multipart/form-data parameter that contains attachments must be "file".
     *
     * An example to attach the file:
     *
     * curl -D- -u admin:admin -X POST -H "X-Atlassian-Token: nocheck" -F  file=@myfile.zip http://myhost/rest/api/backup-restore/restore/space/upload
     *
     * .
     * @param formData Backup file to be uploaded. Has to be a zip file.
     * @returns SiteRestoreJobDetails Returns a JSON representation of the site restore job details.
     * @throws ApiError
     */
    public static createSiteRestoreJobForUploadedBackupFile(
        formData?: ExampleMultipartFormData,
    ): CancelablePromise<SiteRestoreJobDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/backup-restore/restore/site/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: ` Returned if the uploaded file is not a zip file`,
                403: ` Returned if user doesn't have permission to restore space`,
            },
        });
    }
    /**
     * Create space backup job
     * Creates new space backup job and adds it to the queue.
     * @param requestBody Space backup settings
     * @returns SpaceBackupJobDetails Returns a JSON representation of the space backup job
     * @throws ApiError
     */
    public static createSpaceBackupJob(
        requestBody?: SpaceBackupSettings,
    ): CancelablePromise<SpaceBackupJobDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/backup-restore/backup/space',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Returned if invalid settings provided`,
                403: `Returned if user doesn't have permission to create space backups`,
                409: `Returned if backup with the same spaces selected is already in PROGRESS or QUEUED`,
            },
        });
    }
    /**
     * Create space restore job
     * Creates new space restore job and adds it to the queue.
     * @param requestBody space restore settings
     * @returns SpaceRestoreJobDetails Returns a JSON representation of the space restore job.
     * @throws ApiError
     */
    public static createSpaceRestoreJob(
        requestBody?: SpaceRestoreSettings,
    ): CancelablePromise<SpaceRestoreJobDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/backup-restore/restore/space',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: ` Returned if invalid filename provided`,
                403: `Returned if user doesn't have permission to restore spaces`,
            },
        });
    }
    /**
     * Create space restore job for upload backup file
     * This resource expects a multipart post. The media-type multipart/form-data is defined in RFC 1867.
     *
     * Most client libraries have classes that make dealing with multipart posts simple.
     *
     * For instance, in Java the Apache HTTP Components library provides a MultiPartEntity that makes it simple to submit a multipart POST.
     *
     * In order to protect against XSRF attacks, because this method accepts multipart/form-data, it has XSRF protection on it.  This means you must submit a header of X-Atlassian-Token: nocheck with the request, otherwise it will be blocked.
     *
     * The name of the multipart/form-data parameter that contains attachments must be "file".
     *
     * An example to attach the file:
     *
     * curl -D- -u admin:admin -X POST -H "X-Atlassian-Token: nocheck" -F  file=@myfile.zip http://myhost/rest/api/backup-restore/restore/space/upload
     *
     * .
     * @param formData backup file uploaded. Has to be a zip file.
     * @returns SpaceRestoreJobDetails Returns a JSON representation of the space restore job details.
     * @throws ApiError
     */
    public static createSpaceRestoreJobForUploadedBackupFile(
        formData?: ExampleMultipartFormData,
    ): CancelablePromise<SpaceRestoreJobDetails> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rest/api/backup-restore/restore/space/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: ` Returned if the uploaded file is not a zip file`,
                403: ` Returned if user doesn't have permission to restore space`,
            },
        });
    }
    /**
     * Download backup file
     * Downloads the backup file for the given job. Requires site admin or space export permissions for all spaces included in the backup job.
     * @param jobId id of the backup/restore job
     * @returns JobDetails Returns a data stream of the backup file content.
     * @throws ApiError
     */
    public static downloadBackupFile(
        jobId: string,
    ): CancelablePromise<JobDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/backup-restore/jobs/{jobId}/download',
            path: {
                'jobId': jobId,
            },
            errors: {
                404: `Returned if job not found or user doesn't have permissions for the job or the file is missing`,
            },
        });
    }
    /**
     * Find jobs by filters
     * Returns jobs based on the filters provided. The user must have permission to see the jobs.
     * @param owner userName of user who had created a job.
     * @param spaceKey the key of the Space the User is attempting to view.
     * @param fromDate minimum job creation date. Supported date format is `yyyy-MM-ddTHH:mm:ss.SSSZ`
     * @param jobStates list of job states. Acceptable values: "QUEUED", "PROCESSING", "FINISHED", "CANCELLING", "CANCELLED", "FAILED"
     * @param toDate maximum job create date. Supported date format is `yyyy-MM-ddTHH:mm:ss.SSSZ`
     * @param jobOperation job operation. Acceptable values: "BACKUP" and "RESTORE"
     * @param limit amount of jobs that should be returned
     * @param jobScope scope of the job. Acceptable values: "SPACE" and "SITE"
     * @returns JobDetails Returns the List of backup/restore jobs visible to user based on the filter provided and the user's permissions.
     * @throws ApiError
     */
    public static findJobs(
        owner?: string,
        spaceKey?: string,
        fromDate?: string,
        jobStates?: string,
        toDate?: string,
        jobOperation?: string,
        limit?: string,
        jobScope?: string,
    ): CancelablePromise<Array<JobDetails>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/backup-restore/jobs',
            query: {
                'owner': owner,
                'spaceKey': spaceKey,
                'fromDate': fromDate,
                'jobStates': jobStates,
                'toDate': toDate,
                'jobOperation': jobOperation,
                'limit': limit,
                'jobScope': jobScope,
            },
            errors: {
                400: `Returned if invalid filter parameters were passed`,
            },
        });
    }
    /**
     * Get files in restore directory
     * returns list of information on files in conf-home/restore/(jobScope).
     * @param jobScope name of type of restore job (SITE or SPACE or null), if null, all backup files are listed
     * @returns FileInfo Returns a list of FileInfo objects, containing fileName, fileCreationTime, fileSize, and jobScope.
     * @throws ApiError
     */
    public static getFiles(
        jobScope?: string,
    ): CancelablePromise<Array<FileInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/backup-restore/restore/files',
            query: {
                'jobScope': jobScope,
            },
            errors: {
                400: `Returned if user is not a system administrator`,
            },
        });
    }
    /**
     * Get job by ID
     * Get job by id. The user must be a sysadmin or the owner of the job.
     * @param jobId id of the backup/restore job
     * @returns JobDetails Returns a JSON representation of the backup/restore job
     * @throws ApiError
     */
    public static getJob(
        jobId: string,
    ): CancelablePromise<JobDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rest/api/backup-restore/jobs/{jobId}',
            path: {
                'jobId': jobId,
            },
            errors: {
                400: ` Returned if jobId is null`,
                403: ` Returned if job not found or user doesn't have permission to see it`,
            },
        });
    }
}


