import { z } from 'zod';

export type IssueIndexSummaryBean = {
  countInArchive?: number;
  countInDatabase?: number;
  countInIndex?: number;
  indexReadable?: boolean;
  lastUpdatedInDatabase?: string;
  lastUpdatedInIndex?: string;
};

export const IssueIndexSummaryBeanSchema = z.looseObject({
  countInArchive: z.number().optional(),
  countInDatabase: z.number().optional(),
  countInIndex: z.number().optional(),
  indexReadable: z.boolean().optional(),
  lastUpdatedInDatabase: z.string().optional(),
  lastUpdatedInIndex: z.string().optional(),
}) as unknown as z.ZodType<IssueIndexSummaryBean>;
