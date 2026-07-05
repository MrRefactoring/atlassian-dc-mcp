import type { HttpClient } from '../core/types.js';
import { route, pickBody } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { GpgKeySchema } from '../models/index.js';
import type { GpgKey } from '../models/index.js';
import type { AddKey, DeleteKey, GetKeysForUser } from '../parameters/index.js';

export function addKey(client: HttpClient, params: AddKey): Promise<GpgKey> {
  return client.sendRequest({
    url: '/gpg/latest/keys',
    method: 'POST',
    searchParams: { user: params.user },
    body: pickBody(params, GpgKeySchema),
    contentType: 'application/json',
    schema: GpgKeySchema,
  });
}

export function deleteKey(client: HttpClient, params: DeleteKey): Promise<void> {
  return client.sendRequest({
    url: route`/gpg/latest/keys/${params.fingerprintOrId}`,
    method: 'DELETE',
  });
}

export function getKeysForUser(client: HttpClient, params: GetKeysForUser): Promise<RestPage<GpgKey>> {
  return client.sendRequest({
    url: '/gpg/latest/keys',
    method: 'GET',
    searchParams: { user: params.user, start: params.start, limit: params.limit },
    schema: restPage(GpgKeySchema),
  });
}
