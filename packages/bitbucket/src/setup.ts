import { describeValidationError, runSetupCli } from '@atlassian-dc-mcp/common';
import { BITBUCKET_PRODUCT } from './config.js';
import { BitbucketService } from './bitbucket-service.js';

await runSetupCli(BITBUCKET_PRODUCT, {
  validateCredentials: async ({ host, apiBasePath, token }) => {
    const service = new BitbucketService(host || undefined, token, apiBasePath || undefined);
    try {
      await service.validateSetup();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: describeValidationError(error) };
    }
  },
});
