/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertyBean } from './EntityPropertyBean.js';
import type { FieldOperation } from './FieldOperation.js';
import type { HistoryMetadata } from './HistoryMetadata.js';
import type { TransitionBean } from './TransitionBean.js';
export type IssueUpdateBean = {
    fields?: Record<string, Record<string, any>>;
    historyMetadata?: HistoryMetadata;
    properties?: Array<EntityPropertyBean>;
    transition?: TransitionBean;
    update?: Record<string, Array<FieldOperation>>;
};

