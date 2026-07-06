import { z } from 'zod';
import { ColumnConfigBeanSchema, type ColumnConfigBean } from './columnConfigBean.js';
import { EstimationConfigBeanSchema, type EstimationConfigBean } from './estimationConfigBean.js';
import { RankingConfigBeanSchema, type RankingConfigBean } from './rankingConfigBean.js';
import { RelationBeanSchema, type RelationBean } from './relationBean.js';
import { SubqueryBeanSchema, type SubqueryBean } from './subqueryBean.js';

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

export const BoardConfigBeanSchema = z.lazy(() => z.looseObject({
  columnConfig: ColumnConfigBeanSchema.optional(),
  estimation: EstimationConfigBeanSchema.optional(),
  filter: RelationBeanSchema.optional(),
  id: z.number().optional(),
  name: z.string().optional(),
  ranking: RankingConfigBeanSchema.optional(),
  self: z.string().optional(),
  subQuery: SubqueryBeanSchema.optional(),
  type: z.string().optional(),
})) as unknown as z.ZodType<BoardConfigBean>;
