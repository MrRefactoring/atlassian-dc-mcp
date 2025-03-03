/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FieldMetaBean } from './FieldMetaBean.js';
import type { StatusJsonBean } from './StatusJsonBean.js';
export type TransitionBean = {
    description?: string;
    fields?: Record<string, FieldMetaBean>;
    id?: string;
    name?: string;
    opsbarSequence?: number;
    to?: StatusJsonBean;
};

