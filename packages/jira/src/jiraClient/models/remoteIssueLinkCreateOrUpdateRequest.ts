import { z } from 'zod';
import { ApplicationSchema, type Application } from './application.js';
import { RemoteObjectSchema, type RemoteObject } from './remoteObject.js';

export type RemoteIssueLinkCreateOrUpdateRequest = {
    application?: Application;
    globalId?: string;
    object?: RemoteObject;
    relationship?: string;
};

export const RemoteIssueLinkCreateOrUpdateRequestSchema = z.lazy(() => z.looseObject({
  application: ApplicationSchema.optional(),
  globalId: z.string().optional(),
  object: RemoteObjectSchema.optional(),
  relationship: z.string().optional(),
})) as unknown as z.ZodType<RemoteIssueLinkCreateOrUpdateRequest>;
