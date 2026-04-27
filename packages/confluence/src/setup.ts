import { describeValidationError, runSetupCli } from '@atlassian-dc-mcp/common';
import { CONFLUENCE_PRODUCT } from './config.js';
import { ConfluenceService } from './confluence-service.js';

await runSetupCli(CONFLUENCE_PRODUCT, {
  validateCredentials: async ({ host, apiBasePath, token }) => {
    const service = new ConfluenceService(host || undefined, token, apiBasePath || undefined);
    try {
      await service.validateSetup();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: describeValidationError(error) };
    }
  },
});
