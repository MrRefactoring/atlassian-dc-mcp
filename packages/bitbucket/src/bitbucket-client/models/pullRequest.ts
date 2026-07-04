/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PullRequestParticipant } from './pullRequestParticipant.js';
import type { PullRequestRef } from './pullRequestRef.js';
export type PullRequest = {
    author?: PullRequestParticipant;
    closed?: boolean;
    closedDate?: string;
    createdDate?: string;
    crossRepository?: boolean;
    description?: string;
    draft?: boolean;
    fromRef?: PullRequestRef;
    id?: number;
    locked?: boolean;
    open?: boolean;
    participants?: Array<PullRequestParticipant>;
    properties?: any;
    reviewers?: Array<PullRequestParticipant>;
    state?: PullRequest.state;
    title?: string;
    toRef?: PullRequestRef;
    updatedDate?: string;
    version?: number;
};
export namespace PullRequest {
    export enum state {
        DECLINED = 'DECLINED',
        MERGED = 'MERGED',
        OPEN = 'OPEN',
    }
}


