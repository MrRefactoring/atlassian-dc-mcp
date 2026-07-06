import { createHttpClient, bindGroup } from 'datacenter-mcp-core';
import type { HttpClientConfig, SendRequestOptions } from 'datacenter-mcp-core';
import * as admin from '../api/admin.js';
import * as attachments from '../api/attachments.js';
import * as content from '../api/content.js';
import * as spaces from '../api/spaces.js';
import * as users from '../api/users.js';
import * as webhooks from '../api/webhooks.js';

/**
 * Create a namespaced Confluence client bound to an instance. Each resource group exposes
 * one method per endpoint taking a single named-parameters object, e.g.
 * `confluence.content.getContentById({ id })`.
 */
export function createConfluenceClient(config: HttpClientConfig) {
  // The api functions return raw responses (no schema validation) — Confluence response
  // shapes are large and only loosely specified upstream, and the service reshapes what
  // it needs. `X-Atlassian-Token: no-check` opts out of Confluence's XSRF form-token
  // check, which bodyless and multipart mutations would otherwise be rejected by.
  const http = createHttpClient({
    ...config,
    headers: { 'X-Atlassian-Token': 'no-check', ...config.headers },
  });

  return {
    admin: bindGroup(admin, http),
    attachments: bindGroup(attachments, http),
    content: bindGroup(content, http),
    spaces: bindGroup(spaces, http),
    users: bindGroup(users, http),
    webhooks: bindGroup(webhooks, http),
    /** Low-level escape hatch for endpoints outside the generated resource groups. */
    request: <T>(options: SendRequestOptions<T>): Promise<T> => http.sendRequest(options),
  };
}

export type ConfluenceClient = ReturnType<typeof createConfluenceClient>;
