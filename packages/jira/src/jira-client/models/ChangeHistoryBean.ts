/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangeItemBean } from './ChangeItemBean.js';
import type { HistoryMetadata } from './HistoryMetadata.js';
import type { UserJsonBean } from './UserJsonBean.js';
export type ChangeHistoryBean = {
    author?: UserJsonBean;
    created?: string;
    historyMetadata?: HistoryMetadata;
    id?: string;
    items?: Array<ChangeItemBean>;
};

