import { z } from 'zod';

export const RestRepositoryHookSchema = z.looseObject({
  details: z.looseObject({
    key: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
    version: z.string().optional(),
    scopeTypes: z.array(z.string()).optional(),
    configFormKey: z.string().optional(),
  }).optional(),
  enabled: z.boolean().optional(),
  configured: z.boolean().optional(),
  scope: z.looseObject({
    type: z.string().optional(),
    resourceId: z.number().optional(),
  }).optional(),
});

export type RestRepositoryHook = z.infer<typeof RestRepositoryHookSchema>;
