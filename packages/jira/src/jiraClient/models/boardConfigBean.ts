/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnConfigBean } from './columnConfigBean.js';
import type { EstimationConfigBean } from './estimationConfigBean.js';
import type { RankingConfigBean } from './rankingConfigBean.js';
import type { RelationBean } from './relationBean.js';
import type { SubqueryBean } from './subqueryBean.js';
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

