/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IndexReplicationQueueSummaryBean } from './IndexReplicationQueueSummaryBean.js';
import type { IssueIndexSummaryBean } from './IssueIndexSummaryBean.js';
export type IndexSummaryBean = {
    issueIndex?: IssueIndexSummaryBean;
    nodeId?: string;
    replicationQueues?: Record<string, IndexReplicationQueueSummaryBean>;
    reportTime?: string;
};

