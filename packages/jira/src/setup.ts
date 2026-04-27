import { describeValidationError, runSetupCli } from '@atlassian-dc-mcp/common';
import { JIRA_PRODUCT } from './config.js';
import { JiraService } from './jira-service.js';

await runSetupCli(JIRA_PRODUCT, {
  validateCredentials: async ({ host, apiBasePath, token }) => {
    const service = new JiraService(host || undefined, token, apiBasePath || undefined);
    try {
      await service.validateSetup();
      return { ok: true };
    } catch (error) {
      return { ok: false, message: describeValidationError(error) };
    }
  },
});
