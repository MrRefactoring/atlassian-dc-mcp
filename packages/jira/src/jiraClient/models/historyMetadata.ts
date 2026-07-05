import { z } from 'zod';
import { HistoryMetadataParticipantSchema, type HistoryMetadataParticipant } from './historyMetadataParticipant.js';

export type HistoryMetadata = {
    activityDescription?: string;
    activityDescriptionKey?: string;
    actor?: HistoryMetadataParticipant;
    cause?: HistoryMetadataParticipant;
    description?: string;
    descriptionKey?: string;
    emailDescription?: string;
    emailDescriptionKey?: string;
    extraData?: Record<string, string>;
    generator?: HistoryMetadataParticipant;
    type?: string;
};

export const HistoryMetadataSchema = z.lazy(() => z.looseObject({
  activityDescription: z.string().optional(),
  activityDescriptionKey: z.string().optional(),
  actor: HistoryMetadataParticipantSchema.optional(),
  cause: HistoryMetadataParticipantSchema.optional(),
  description: z.string().optional(),
  descriptionKey: z.string().optional(),
  emailDescription: z.string().optional(),
  emailDescriptionKey: z.string().optional(),
  extraData: z.record(z.string(), z.string()).optional(),
  generator: HistoryMetadataParticipantSchema.optional(),
  type: z.string().optional(),
})) as unknown as z.ZodType<HistoryMetadata>;
