import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { GpgKeySchema } from '../models/index.js';
import type { GpgKey } from '../models/index.js';

/** POST /gpg/latest/keys */
export interface AddKey {
  user?: string;
  requestBody?: GpgKey;
}
export function addKey(client: HttpClient, params: AddKey): Promise<GpgKey> {
  return client.sendRequest({
    method: 'POST',
    url: '/gpg/latest/keys',
    searchParams: { user: params.user },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: GpgKeySchema,
  });
}

/** DELETE /gpg/latest/keys/{fingerprintOrId} */
export interface DeleteKey {
  fingerprintOrId: string;
}
export function deleteKey(client: HttpClient, params: DeleteKey): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/gpg/latest/keys/${enc(params.fingerprintOrId)}`,
  });
}

/** GET /gpg/latest/keys */
export interface GetKeysForUser {
  user?: string;
  start?: number;
  limit?: number;
}
export function getKeysForUser(client: HttpClient, params: GetKeysForUser): Promise<RestPage<GpgKey>> {
  return client.sendRequest({
    method: 'GET',
    url: '/gpg/latest/keys',
    searchParams: { user: params.user, start: params.start, limit: params.limit },
    schema: restPage(GpgKeySchema),
  });
}
