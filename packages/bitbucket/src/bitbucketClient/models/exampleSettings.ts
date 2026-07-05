import { z } from 'zod';

export const ExampleSettingsSchema = z.looseObject({});

export type ExampleSettings = z.infer<typeof ExampleSettingsSchema>;
