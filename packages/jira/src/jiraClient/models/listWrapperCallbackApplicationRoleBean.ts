import { z } from 'zod';

export type ListWrapperCallbackApplicationRoleBean = Record<string, any>;

export const ListWrapperCallbackApplicationRoleBeanSchema = z.record(z.string(), z.any()) as unknown as z.ZodType<ListWrapperCallbackApplicationRoleBean>;
