import { describeValidationError } from 'datacenter-mcp-core';
import { runSetupCli } from 'datacenter-mcp-core/setup-cli';
import { BITBUCKET_PRODUCT } from './config.js';
import { BitbucketService } from './bitbucket-service.js';

await runSetupCli(BITBUCKET_PRODUCT, {
  validateCredentials: async ({ host, apiBasePath, token, username, password }) => {
    const service = new BitbucketService(
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
