/**
 * Opt-in end-to-end smoke test against a real Jira Data Center instance.
 *
 * Every other test in this repo mocks the generated API client — none of
 * them can catch a real auth/network/API-shape regression. This file is the
 * reference template for that: it exercises one safe, read-only call
 * against a live instance and skips itself entirely when no live
 * configuration is present, so `pnpm test` (locally or in CI) stays green
 * with zero setup.
 *
 * To run it: copy `.env.live.example` to `.env.live` in this package
 * directory, fill in a real host + token (or username/password), then:
 *
 *   pnpm --filter jira-datacenter-mcp test -- jira-service.live
 *
 * `.env.live` is gitignored — never commit real credentials. Loading it
 * reuses the same ATLASSIAN_DC_MCP_CONFIG_FILE mechanism the real server
 * supports (see the core config layering), rather than a one-off parser.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR, initializeRuntimeConfig } from 'datacenter-mcp-core';
import { beforeAll, describe, expect, it } from 'vitest';
import { JiraService } from '../../src/jira-service.js';
import { getDefaultPageSize, getJiraRuntimeConfig } from '../../src/config.js';

const LIVE_ENV_PATH = path.resolve(process.cwd(), '.env.live');
const hasLiveConfig = existsSync(LIVE_ENV_PATH);

if (hasLiveConfig) {
  process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR] = LIVE_ENV_PATH;
}

// Skips the whole suite (not just individual assertions) when no
// .env.live is present, instead of failing or hanging on a network call
// that has nowhere to connect.
(hasLiveConfig ? describe : describe.skip)('Jira live smoke test (opt-in, requires .env.live)', () => {
  beforeAll(() => {
    initializeRuntimeConfig();
  });

  it('fetches real projects from the configured instance', async () => {
    const config = getJiraRuntimeConfig();
    const service = new JiraService(
      config.host,
      () => getJiraRuntimeConfig().token,
      config.apiBasePath,
      getDefaultPageSize,
      () => getJiraRuntimeConfig().username,
      () => getJiraRuntimeConfig().password,
    );

    const result = await service.getProjects();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
  }, 30_000);
});
