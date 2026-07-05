import { z } from 'zod';

export type CustomFieldDefinitionJsonBean = {
  description?: string;
  id?: string;
  issueTypeIds?: Array<string>;
  name?: string;
  projectIds?: Array<number>;
  searcherKey?: string;
  self?: string;
  type?: string;
};

export const CustomFieldDefinitionJsonBeanSchema = z.looseObject({
  description: z.string().optional(),
  id: z.string().optional(),
  issueTypeIds: z.array(z.string()).optional(),
  name: z.string().optional(),
  projectIds: z.array(z.number()).optional(),
  searcherKey: z.string().optional(),
  self: z.string().optional(),
  type: z.string().optional(),
}) as unknown as z.ZodType<CustomFieldDefinitionJsonBean>;
