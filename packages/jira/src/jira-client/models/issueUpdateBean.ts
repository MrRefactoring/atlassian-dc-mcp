/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityPropertyBean } from './entityPropertyBean.js';
import type { FieldOperation } from './fieldOperation.js';
import type { HistoryMetadata } from './historyMetadata.js';
import type { TransitionBean } from './transitionBean.js';
export type IssueUpdateBean = {
    fields?: Record<string, string | Record<string, any>>;
    historyMetadata?: HistoryMetadata;
    properties?: Array<EntityPropertyBean>;
    transition?: TransitionBean;
    update?: Record<string, Array<FieldOperation>>;
};

