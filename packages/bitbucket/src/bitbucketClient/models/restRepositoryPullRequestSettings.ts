import { z } from 'zod';

export const RestRepositoryPullRequestSettingsSchema = z.looseObject({
  mergeConfig: z.looseObject({
    commitSummaries: z.number().optional(),
    defaultStrategy: z.looseObject({
      description: z.string().optional(),
      enabled: z.boolean().optional(),
      flag: z.string().optional(),
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
    strategies: z.array(z.looseObject({
      description: z.string().optional(),
      enabled: z.boolean().optional(),
      flag: z.string().optional(),
      id: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
    type: z.string().optional(),
  }).optional(),
  'com.atlassian.bitbucket.server.bitbucket-bundled-hooks:requiredApprovers': z.looseObject({
    enable: z.boolean().optional(),
    count: z.number().optional(),
  }).optional(),
  requiredAllApprovers: z.boolean().optional(),
  needsWork: z.boolean().optional(),
  requiredApprovers: z.number().optional(),
  requiredAllTasksComplete: z.boolean().optional(),
  'com.atlassian.bitbucket.server.bitbucket-build:requiredBuilds': z.looseObject({
    enable: z.boolean().optional(),
    count: z.number().optional(),
  }).optional(),
  requiredSuccessfulBuilds: z.number().optional(),
});

export type RestRepositoryPullRequestSettings = z.infer<typeof RestRepositoryPullRequestSettingsSchema>;
