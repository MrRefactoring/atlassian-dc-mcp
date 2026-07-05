import { z } from 'zod';

export type TimeTrackingConfigurationBean = {
  workingHoursPerDay?: number;
  workingDaysPerWeek?: number;
  timeFormat?: string;
  defaultUnit?: string;
};

export type ConfigurationBean = {
  votingEnabled?: boolean;
  watchingEnabled?: boolean;
  unassignedIssuesAllowed?: boolean;
  subTasksEnabled?: boolean;
  issueLinkingEnabled?: boolean;
  timeTrackingEnabled?: boolean;
  attachmentsEnabled?: boolean;
  timeTrackingConfiguration?: TimeTrackingConfigurationBean;
};

export const ConfigurationBeanSchema = z.looseObject({
  votingEnabled: z.boolean().optional(),
  watchingEnabled: z.boolean().optional(),
  unassignedIssuesAllowed: z.boolean().optional(),
  subTasksEnabled: z.boolean().optional(),
  issueLinkingEnabled: z.boolean().optional(),
  timeTrackingEnabled: z.boolean().optional(),
  attachmentsEnabled: z.boolean().optional(),
  timeTrackingConfiguration: z.looseObject({
    workingHoursPerDay: z.number().optional(),
    workingDaysPerWeek: z.number().optional(),
    timeFormat: z.string().optional(),
    defaultUnit: z.string().optional(),
  }).optional(),
}) as unknown as z.ZodType<ConfigurationBean>;
