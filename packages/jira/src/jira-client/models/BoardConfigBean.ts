/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnConfigBean } from './ColumnConfigBean.js';
import type { EstimationConfigBean } from './EstimationConfigBean.js';
import type { RankingConfigBean } from './RankingConfigBean.js';
import type { RelationBean } from './RelationBean.js';
import type { SubqueryBean } from './SubqueryBean.js';
export type BoardConfigBean = {
    columnConfig?: ColumnConfigBean;
    estimation?: EstimationConfigBean;
    filter?: RelationBean;
    id?: number;
    name?: string;
    ranking?: RankingConfigBean;
    self?: string;
    subQuery?: SubqueryBean;
    type?: string;
};

