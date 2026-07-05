import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { AccessTokenSchema, RawAccessTokenSchema, SshKeySchema } from '../models/index.js';
import type { AccessToken, RawAccessToken, SshKey } from '../models/index.js';
import type { AddSshKey, CreateProjectAccessToken, CreateRepositoryAccessToken, CreateUserAccessToken, DeleteProjectAccessToken, DeleteRepositoryAccessToken, DeleteSshKey, DeleteUserAccessToken, GetProjectAccessTokens, GetRepositoryAccessTokens, GetSshKeys, GetUserAccessTokens } from '../parameters/index.js';

export function addSshKey(client: HttpClient, params: AddSshKey): Promise<SshKey> {
  return client.sendRequest({
    method: 'POST',
    url: '/ssh/latest/keys',
    searchParams: { user: params.user },
    body: params.requestBody,
    mediaType: 'application/json',
    schema: SshKeySchema,
  });
}

export function createProjectAccessToken(client: HttpClient, params: CreateProjectAccessToken): Promise<RawAccessToken> {
  return client.sendRequest({
    method: 'PUT',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RawAccessTokenSchema,
  });
}

export function createRepositoryAccessToken(client: HttpClient, params: CreateRepositoryAccessToken): Promise<RawAccessToken> {
  return client.sendRequest({
    method: 'PUT',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RawAccessTokenSchema,
  });
}

export function createUserAccessToken(client: HttpClient, params: CreateUserAccessToken): Promise<RawAccessToken> {
  return client.sendRequest({
    method: 'PUT',
    url: `/access-tokens/latest/users/${enc(params.userSlug)}`,
    body: params.requestBody,
    mediaType: 'application/json',
    schema: RawAccessTokenSchema,
  });
}

export function deleteProjectAccessToken(client: HttpClient, params: DeleteProjectAccessToken): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/${enc(params.tokenId)}`,
  });
}

export function deleteRepositoryAccessToken(client: HttpClient, params: DeleteRepositoryAccessToken): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/${enc(params.tokenId)}`,
  });
}

export function deleteSshKey(client: HttpClient, params: DeleteSshKey): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/ssh/latest/keys/${enc(params.keyId)}`,
  });
}

export function deleteUserAccessToken(client: HttpClient, params: DeleteUserAccessToken): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/access-tokens/latest/users/${enc(params.userSlug)}/${enc(params.tokenId)}`,
  });
}

export function getProjectAccessTokens(client: HttpClient, params: GetProjectAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    method: 'GET',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}

export function getRepositoryAccessTokens(client: HttpClient, params: GetRepositoryAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    method: 'GET',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}

export function getSshKeys(client: HttpClient, params: GetSshKeys): Promise<RestPage<SshKey>> {
  return client.sendRequest({
    method: 'GET',
    url: '/ssh/latest/keys',
    searchParams: { userName: params.userName, user: params.user, start: params.start, limit: params.limit },
    schema: restPage(SshKeySchema),
  });
}

export function getUserAccessTokens(client: HttpClient, params: GetUserAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    method: 'GET',
    url: `/access-tokens/latest/users/${enc(params.userSlug)}`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}
