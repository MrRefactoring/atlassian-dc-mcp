import { z } from 'zod';

export type HistoryMetadataParticipant = {
  avatarUrl?: string;
  displayName?: string;
  displayNameKey?: string;
  id?: string;
  type?: string;
  url?: string;
};

export const HistoryMetadataParticipantSchema = z.looseObject({
  avatarUrl: z.string().optional(),
  displayName: z.string().optional(),
  displayNameKey: z.string().optional(),
  id: z.string().optional(),
  type: z.string().optional(),
  url: z.string().optional(),
}) as unknown as z.ZodType<HistoryMetadataParticipant>;
