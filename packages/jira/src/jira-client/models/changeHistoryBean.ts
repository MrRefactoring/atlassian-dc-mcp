/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangeItemBean } from './changeItemBean.js';
import type { HistoryMetadata } from './historyMetadata.js';
import type { UserJsonBean } from './userJsonBean.js';
export type ChangeHistoryBean = {
    author?: UserJsonBean;
    created?: string;
    historyMetadata?: HistoryMetadata;
    id?: string;
    items?: Array<ChangeItemBean>;
};

