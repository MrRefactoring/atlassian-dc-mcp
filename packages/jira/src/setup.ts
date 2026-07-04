import { describeValidationError } from 'datacenter-mcp-core';
import { runSetupCli } from 'datacenter-mcp-core/setup-cli';
import { JIRA_PRODUCT } from './config.js';
import { JiraService } from './jiraService.js';

await runSetupCli(JIRA_PRODUCT, {
  validateCredentials: async ({ host, apiBasePath, token, username, password }) => {
    const service = new JiraService(
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
