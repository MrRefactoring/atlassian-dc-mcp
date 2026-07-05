import { z } from 'zod';
import { ChangelogBeanSchema, type ChangelogBean } from './changelogBean.js';
import { EditMetaBeanSchema, type EditMetaBean } from './editMetaBean.js';
import { IncludedFieldsSchema, type IncludedFields } from './includedFields.js';
import { JsonTypeBeanSchema, type JsonTypeBean } from './jsonTypeBean.js';
import { OpsbarBeanSchema, type OpsbarBean } from './opsbarBean.js';
import { PropertiesBeanSchema, type PropertiesBean } from './propertiesBean.js';
import { TransitionBeanSchema, type TransitionBean } from './transitionBean.js';

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

export const IssueBeanSchema = z.lazy(() => z.looseObject({
  changelog: ChangelogBeanSchema.optional(),
  editmeta: EditMetaBeanSchema.optional(),
  fields: z.record(z.string(), z.record(z.string(), z.any())).optional(),
  fieldsToInclude: IncludedFieldsSchema.optional(),
  id: z.string().optional(),
  key: z.string().optional(),
  names: z.record(z.string(), z.string()).optional(),
  operations: OpsbarBeanSchema.optional(),
  properties: PropertiesBeanSchema.optional(),
  renderedFields: z.record(z.string(), z.record(z.string(), z.any())).optional(),
  schema: z.record(z.string(), JsonTypeBeanSchema).optional(),
  self: z.string().optional(),
  transitionBeans: z.array(TransitionBeanSchema).optional(),
  transitions: z.array(TransitionBeanSchema).optional(),
  versionedRepresentations: z.record(z.string(), z.record(z.string(), z.record(z.string(), z.any()))).optional(),
})) as unknown as z.ZodType<IssueBean>;
