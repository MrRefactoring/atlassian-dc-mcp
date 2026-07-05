import { z } from 'zod';

export type LicenseValidationResults = {
  errors?: Record<string, string>;
  licenseString?: string;
};

export const LicenseValidationResultsSchema = z.looseObject({
  errors: z.record(z.string(), z.string()).optional(),
  licenseString: z.string().optional(),
}) as unknown as z.ZodType<LicenseValidationResults>;
