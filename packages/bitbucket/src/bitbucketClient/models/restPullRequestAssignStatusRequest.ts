/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RestPullRequestAssignStatusRequest = {
    lastReviewedCommit?: string;
    status?: RestPullRequestAssignStatusRequest.status;
};
export namespace RestPullRequestAssignStatusRequest {
    export enum status {
        UNAPPROVED = 'UNAPPROVED',
        NEEDS_WORK = 'NEEDS_WORK',
        APPROVED = 'APPROVED',
    }
}

