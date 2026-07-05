import { z } from 'zod';

export type IssuePickerSuggestionIssue = {
  id?: number;
  key?: string;
  keyHtml?: string;
  img?: string;
  summary?: string;
  summaryText?: string;
};

export type IssuePickerSuggestionSection = {
  label?: string;
  sub?: string;
  id?: string;
  msg?: string;
  issues?: Array<IssuePickerSuggestionIssue>;
};

export type IssuePickerResults = {
  sections?: Array<IssuePickerSuggestionSection>;
};

export const IssuePickerResultsSchema = z.looseObject({
  sections: z.array(z.looseObject({
    label: z.string().optional(),
    sub: z.string().optional(),
    id: z.string().optional(),
    msg: z.string().optional(),
    issues: z.array(z.looseObject({
      id: z.number().optional(),
      key: z.string().optional(),
      keyHtml: z.string().optional(),
      img: z.string().optional(),
      summary: z.string().optional(),
      summaryText: z.string().optional(),
    })).optional(),
  })).optional(),
}) as unknown as z.ZodType<IssuePickerResults>;
