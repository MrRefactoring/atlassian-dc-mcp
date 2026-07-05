import type { HttpClient } from '../core/types.js';
import { enc } from '../core/types.js';
import { restPage, type RestPage } from '../core/page.js';
import { AccessTokenSchema, RawAccessTokenSchema, SshKeySchema } from '../models/index.js';
import type { AccessToken, AccessTokenRequest, RawAccessToken, SshKey } from '../models/index.js';

/** POST /ssh/latest/keys */
export interface AddSshKey {
  user?: any;
  requestBody?: {
    algorithmType?: string;
    bitLength?: number;
    readonly createdDate?: string;
    expiryDays?: number;
    readonly fingerprint?: string;
    readonly id?: number;
    label?: string;
    readonly lastAuthenticated?: string;
    text?: string;
    /**
             * Contains a warning about the key, for example that it's deprecated
             */
    readonly warning?: string;
  };
}
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

/** PUT /access-tokens/latest/projects/{projectKey} */
export interface CreateProjectAccessToken {
  projectKey: string;
  requestBody?: AccessTokenRequest;
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

/** PUT /access-tokens/latest/projects/{projectKey}/repos/{repositorySlug} */
export interface CreateRepositoryAccessToken {
  projectKey: string;
  repositorySlug: string;
  requestBody?: AccessTokenRequest;
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

/** PUT /access-tokens/latest/users/{userSlug} */
export interface CreateUserAccessToken {
  userSlug: string;
  requestBody?: AccessTokenRequest;
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

/** DELETE /access-tokens/latest/projects/{projectKey}/{tokenId} */
export interface DeleteProjectAccessToken {
  projectKey: string;
  tokenId: string;
}
export function deleteProjectAccessToken(client: HttpClient, params: DeleteProjectAccessToken): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/${enc(params.tokenId)}`,
  });
}

/** DELETE /access-tokens/latest/projects/{projectKey}/repos/{repositorySlug}/{tokenId} */
export interface DeleteRepositoryAccessToken {
  projectKey: string;
  tokenId: string;
  repositorySlug: string;
}
export function deleteRepositoryAccessToken(client: HttpClient, params: DeleteRepositoryAccessToken): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}/${enc(params.tokenId)}`,
  });
}

/** DELETE /ssh/latest/keys/{keyId} */
export interface DeleteSshKey {
  keyId: string;
}
export function deleteSshKey(client: HttpClient, params: DeleteSshKey): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/ssh/latest/keys/${enc(params.keyId)}`,
  });
}

/** DELETE /access-tokens/latest/users/{userSlug}/{tokenId} */
export interface DeleteUserAccessToken {
  tokenId: string;
  userSlug: string;
}
export function deleteUserAccessToken(client: HttpClient, params: DeleteUserAccessToken): Promise<void> {
  return client.sendRequest({
    method: 'DELETE',
    url: `/access-tokens/latest/users/${enc(params.userSlug)}/${enc(params.tokenId)}`,
  });
}

/** GET /access-tokens/latest/projects/{projectKey} */
export interface GetProjectAccessTokens {
  projectKey: string;
  start?: number;
  limit?: number;
}
export function getProjectAccessTokens(client: HttpClient, params: GetProjectAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    method: 'GET',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}

/** GET /access-tokens/latest/projects/{projectKey}/repos/{repositorySlug} */
export interface GetRepositoryAccessTokens {
  projectKey: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
export function getRepositoryAccessTokens(client: HttpClient, params: GetRepositoryAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    method: 'GET',
    url: `/access-tokens/latest/projects/${enc(params.projectKey)}/repos/${enc(params.repositorySlug)}`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}

/** GET /ssh/latest/keys */
export interface GetSshKeys {
  userName?: string;
  user?: string;
  start?: number;
  limit?: number;
}
export function getSshKeys(client: HttpClient, params: GetSshKeys): Promise<RestPage<SshKey>> {
  return client.sendRequest({
    method: 'GET',
    url: '/ssh/latest/keys',
    searchParams: { userName: params.userName, user: params.user, start: params.start, limit: params.limit },
    schema: restPage(SshKeySchema),
  });
}

/** GET /access-tokens/latest/users/{userSlug} */
export interface GetUserAccessTokens {
  userSlug: string;
  start?: number;
  limit?: number;
}
export function getUserAccessTokens(client: HttpClient, params: GetUserAccessTokens): Promise<RestPage<AccessToken>> {
  return client.sendRequest({
    method: 'GET',
    url: `/access-tokens/latest/users/${enc(params.userSlug)}`,
    searchParams: { start: params.start, limit: params.limit },
    schema: restPage(AccessTokenSchema),
  });
}
