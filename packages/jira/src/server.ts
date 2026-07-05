import { connectServer, createMcpServer, initializeRuntimeConfig } from 'datacenter-mcp-core';
import { JiraService } from './jiraService.js';
import { getDefaultPageSize, getJiraRuntimeConfig } from './config.js';
import { createRequire } from 'node:module';
import { registerIssueTools } from './tools/issues.js';
import { registerProjectTools } from './tools/projects.js';
import { registerUserTools } from './tools/users.js';
import { registerWorkflowTools } from './tools/workflows.js';
import { registerAgileTools } from './tools/agile.js';
import { registerAdminTools } from './tools/admin.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

const require = createRequire(import.meta.url);

const { version } = require('../package.json');

initializeRuntimeConfig();

const missingEnvVars = JiraService.validateConfig();

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const jiraConfig = getJiraRuntimeConfig();

const jiraService = new JiraService(
  jiraConfig.host,
  () => getJiraRuntimeConfig().token,
  jiraConfig.apiBasePath,
  getDefaultPageSize,
  () => getJiraRuntimeConfig().username,
  () => getJiraRuntimeConfig().password,
);

const server = createMcpServer({
  name: 'atlassian-jira-mcp',
  version,
});

registerIssueTools(server, jiraService);
registerProjectTools(server, jiraService);
registerUserTools(server, jiraService);
registerWorkflowTools(server, jiraService);
registerAgileTools(server, jiraService);
registerAdminTools(server, jiraService);
registerResources(server, jiraService);
registerPrompts(server);

await connectServer(server);
