import type { HttpClient } from '../interface/index.js';
import { route, pickBody } from '../core/helpers.js';
import { restPage } from '../core/page.js';
import type { RestPage } from '../interface/index.js';
import { AccessTokenSchema, RawAccessTokenSchema, SshKeySchema, AccessTokenRequestSchema } from '../models/index.js';
import type { AccessToken, RawAccessToken, SshKey } from '../models/index.js';
import type { AddSshKey, CreateProjectAccessToken, CreateRepositoryAccessToken, CreateUserAccessToken, DeleteProjectAccessToken, DeleteRepositoryAccessToken, DeleteSshKey, DeleteUserAccessToken, GetProjectAccessTokens, GetRepositoryAccessTokens, GetSshKeys, GetUserAccessTokens } from '../parameters/index.js';

export function addSshKey(client: HttpClient, params: AddSshKey): Promise<SshKey> {
  return client.sendRequest({
    url: '/ssh/latest/keys',
    method: 'POST',
    searchParams: { user: params.user },
    body: pickBody(params, ['algorithmType', 'bitLength', 'createdDate', 'expiryDays', 'fingerprint', 'id', 'label', 'lastAuthenticated', 'text', 'warning']),
    contentType: 'application/json',
    schema: SshKeySchema,
  });
}

export function createProjectAccessToken(client: HttpClient, params: CreateProjectAccessToken): Promise<RawAccessToken> {
  return client.sendRequest({
    url: route`/access-tokens/latest/projects/${params.projectKey}`,
    method: 'PUT',
    body: pickBody(params, AccessTokenRequestSchema),
    contentType: 'application/json',
    schema: RawAccessTokenSchema,
  });
}

export function createRepositoryAccessToken(client: HttpClient, params: CreateRepositoryAccessToken): Promise<RawAccessToken> {
  return client.sendRequest({
    url: route`/access-tokens/latest/projects/${params.projectKey}/repos/${params.repositorySlug}`,
    method: 'PUT',
    body: pickBody(params, AccessTokenRequestSchema),
    contentType: 'application/json',
    schema: RawAccessTokenSchema,
  });
}

export function createUserAccessToken(client: HttpClient, params: CreateUserAccessToken): Promise<RawAccessToken> {
  return client.sendRequest({
    url: route`/access-tokens/latest/users/${params.userSlug}`,
    method: 'PUT',
    body: pickBody(params, AccessTokenRequestSchema),
    contentType: 'application/json',
    schema: RawAccessTokenSchema,
  });
}

export function deleteProjectAccessToken(client: HttpClient, params: DeleteProjectAccessToken): Promise<void> {
  return client.sendRequest({
    url: route`/access-tokens/latest/projects/${params.projectKey}/${params.tokenId}`,
    method: 'DELETE',
  });
}

export function deleteRepositoryAccessToken(client: HttpClient, params: DeleteRepositoryAccessToken): Promise<void> {
  return client.sendRequest({
    url: route`/access-tokens/latest/projects/${params.projectKey}/repos/${params.repositorySlug}/${params.tokenId}`,
    method: 'DELETE',
  });
}

export function deleteSshKey(client: HttpClient, params: DeleteSshKey): Promise<void> {
  return client.sendRequest({
    url: route`/ssh/latest/keys/${params.keyId}`,
    method: 'DELETE',
  });
}

export function deleteUserAccessToken(client: HttpClient, params: DeleteUserAccessToken): Promise<void> {
  return client.sendRequest({
    url: route`/access-tokens/latest/users/${params.userSlug}/${params.tokenId}`,
    method: 'DELETE',
  });
}

export function getProjectAccessTokens(client: HttpClient, params: GetProjectAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    url: route`/access-tokens/latest/projects/${params.projectKey}`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}

export function getRepositoryAccessTokens(client: HttpClient, params: GetRepositoryAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    url: route`/access-tokens/latest/projects/${params.projectKey}/repos/${params.repositorySlug}`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}

export function getSshKeys(client: HttpClient, params: GetSshKeys): Promise<RestPage<SshKey>> {
  return client.sendRequest({
    url: '/ssh/latest/keys',
    method: 'GET',
    searchParams: { userName: params.userName, user: params.user, start: params.start, limit: params.limit },
    schema: restPage(SshKeySchema),
  });
}

export function getUserAccessTokens(client: HttpClient, params: GetUserAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    url: route`/access-tokens/latest/users/${params.userSlug}`,
    method: 'GET',
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}
