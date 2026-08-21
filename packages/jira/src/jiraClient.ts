import { createServerClient, type ServerClient } from 'jira.js/server';
import { createClient, type AuthBasic, type AuthBearer, type SendRequestOptions } from 'jira.js/core';
import { logger, type CredentialSource } from 'datacenter-mcp-core';

/**
 * The Jira Data Center client this server talks to, which is jira.js.
 *
 * jira.js takes its credentials once, at construction; this server reads them per request, because the shared config
 * file can be rewritten while the process runs and a rotated token has to be picked up without a restart. The two are
 * reconciled here: the thunks are resolved on every call, and a client is rebuilt only when what they resolve to has
 * changed. Building one is a config validation and a few closures, so the rare rebuild costs nothing, and the common
 * case — credentials unchanged — hands back the same instance.
 *
 * Resolution order matches what this server has always done: a username and password together win over a token, and
 * neither means anonymous, which Jira allows for public projects.
 */
export interface JiraClientConfig {
  /** The instance's base URL, without the `/rest` suffix — jira.js puts that on each request itself. */
  host: string;
  /** A personal access token → `Authorization: Bearer`. */
  token?: CredentialSource;
  /** A local account name, used with `password` → `Authorization: Basic`; overrides `token`. */
  username?: CredentialSource;
  password?: CredentialSource;
}

/**
 * The typed surface, plus a way past it.
 *
 * `request` reaches the endpoints jira.js does not generate — Jira publishes no specification for the development
 * status API, and the operations Atlassian has deprecated are stripped on the way through the generator. Everything
 * else goes through the typed modules.
 */
export type JiraClient = ServerClient & {
  request<T>(options: SendRequestOptions<T>): Promise<T>;
};

/** Hands back a client built for whatever the credentials resolve to right now. */
export type JiraClientProvider = () => JiraClient;

function resolve(source: CredentialSource): string | undefined {
  const value = typeof source === 'function' ? source() : source;

  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function resolveAuth(config: JiraClientConfig): AuthBasic | AuthBearer | undefined {
  const username = resolve(config.username);
  const password = resolve(config.password);

  if (username !== undefined && password !== undefined) {
    return { type: 'basic', username, password };
  }

  const token = resolve(config.token);

  return token === undefined ? undefined : { type: 'bearer', token };
}

/**
 * A credential set, flattened to something two of them can be compared by.
 *
 * Comparing the resolved values rather than the thunks is the point: two calls to the same thunk return equal strings
 * while nothing has changed, and a different string the moment the config file is rewritten.
 */
function fingerprint(auth: AuthBasic | AuthBearer | undefined): string {
  if (auth === undefined) return 'anonymous';

  if (auth.type === 'basic' && 'username' in auth) return `basic:${auth.username}:${auth.password}`;

  if (auth.type === 'bearer' && 'token' in auth) return `bearer:${auth.token}`;

  return auth.type;
}

export function createJiraClient(config: JiraClientConfig): JiraClientProvider {
  let cached: JiraClient | undefined;
  let cachedFingerprint: string | undefined;

  return () => {
    const auth = resolveAuth(config);
    const current = fingerprint(auth);

    if (cached === undefined || current !== cachedFingerprint) {
      const client = createClient({
        host: config.host,
        auth,
        // Opts out of Jira's XSRF form-token check. A no-op for the many endpoints that already exempt requests with a
        // JSON body, but bodyless mutations (e.g. PUT .../showWhenEmpty/{value}) are otherwise refused with
        // "XSRF check failed".
        headers: { 'X-Atlassian-Token': 'no-check' },
        // A response Jira sends in a shape jira.js does not describe is reported and handed back unvalidated rather
        // than rejected. A wrong schema is this server's problem to fix; it should never cost a caller their answer.
        onSchemaMismatch: report =>
          logger.warn('Jira response did not match its schema', {
            endpoint: report.endpoint,
            issues: report.issues,
          }),
      });

      cached = { ...createServerClient(client), request: options => client.sendRequest(options) };
      cachedFingerprint = current;
    }

    return cached;
  };
}
