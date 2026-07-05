import { z } from 'zod';

export const SettingsSchema = z.looseObject({});

export type Settings = z.infer<typeof SettingsSchema>;
