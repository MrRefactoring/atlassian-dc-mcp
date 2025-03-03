/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangelogBean } from './ChangelogBean.js';
import type { EditMetaBean } from './EditMetaBean.js';
import type { IncludedFields } from './IncludedFields.js';
import type { JsonTypeBean } from './JsonTypeBean.js';
import type { OpsbarBean } from './OpsbarBean.js';
import type { PropertiesBean } from './PropertiesBean.js';
import type { TransitionBean } from './TransitionBean.js';
export type IssueBean = {
    changelog?: ChangelogBean;
    editmeta?: EditMetaBean;
    fields?: Record<string, Record<string, any>>;
    fieldsToInclude?: IncludedFields;
    id?: string;
    key?: string;
    names?: Record<string, string>;
    operations?: OpsbarBean;
    properties?: PropertiesBean;
    renderedFields?: Record<string, Record<string, any>>;
    schema?: Record<string, JsonTypeBean>;
    self?: string;
    transitionBeans?: Array<TransitionBean>;
    transitions?: Array<TransitionBean>;
    versionedRepresentations?: Record<string, Record<string, Record<string, any>>>;
};

