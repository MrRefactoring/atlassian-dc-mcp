import { describeValidationError } from 'datacenter-mcp-core';
import { runSetupCli } from 'datacenter-mcp-core/setup-cli';
import { CONFLUENCE_PRODUCT } from './config.js';
import { ConfluenceService } from './confluence-service.js';

await runSetupCli(CONFLUENCE_PRODUCT, {
  validateCredentials: async ({ host, apiBasePath, token, username, password }) => {
    const service = new ConfluenceService(
      host || undefined,
      token,
      apiBasePath || undefined,
      undefined,
      username,
      password,
    );
    try {
      await service.validateSetup();

      return { ok: true };
    } catch (error) {
      return { ok: false, message: describeValidationError(error) };
    }
  },
});
