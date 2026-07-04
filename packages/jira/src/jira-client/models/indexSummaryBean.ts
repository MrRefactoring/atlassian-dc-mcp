/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IndexReplicationQueueSummaryBean } from './indexReplicationQueueSummaryBean.js';
import type { IssueIndexSummaryBean } from './issueIndexSummaryBean.js';
export type IndexSummaryBean = {
    issueIndex?: IssueIndexSummaryBean;
    nodeId?: string;
    replicationQueues?: Record<string, IndexReplicationQueueSummaryBean>;
    reportTime?: string;
};

