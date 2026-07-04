/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangelogBean } from './changelogBean.js';
import type { EditMetaBean } from './editMetaBean.js';
import type { IncludedFields } from './includedFields.js';
import type { JsonTypeBean } from './jsonTypeBean.js';
import type { OpsbarBean } from './opsbarBean.js';
import type { PropertiesBean } from './propertiesBean.js';
import type { TransitionBean } from './transitionBean.js';
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

