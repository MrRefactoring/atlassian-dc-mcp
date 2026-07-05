import { connectServer, createMcpServer, initializeRuntimeConfig } from 'datacenter-mcp-core';
import { ConfluenceService } from './confluenceService.js';
import { getConfluenceRuntimeConfig, getDefaultPageSize } from './config.js';
import { createRequire } from 'node:module';
import { registerContentTools } from './tools/content.js';
import { registerSpaceTools } from './tools/spaces.js';
import { registerAttachmentTools } from './tools/attachments.js';
import { registerUserTools } from './tools/users.js';
import { registerWebhookTools } from './tools/webhooks.js';
import { registerAdminTools } from './tools/admin.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

const require = createRequire(import.meta.url);

const { version } = require('../package.json');

initializeRuntimeConfig();

const missingEnvVars = ConfluenceService.validateConfig();

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const confluenceConfig = getConfluenceRuntimeConfig();

const confluenceService = new ConfluenceService(
  confluenceConfig.host,
  () => getConfluenceRuntimeConfig().token,
  confluenceConfig.apiBasePath,
  getDefaultPageSize,
  () => getConfluenceRuntimeConfig().username,
  () => getConfluenceRuntimeConfig().password,
);

const server = createMcpServer({
  name: 'atlassian-confluence-mcp',
  version,
});

registerContentTools(server, confluenceService);
registerSpaceTools(server, confluenceService);
registerAttachmentTools(server, confluenceService);
registerUserTools(server, confluenceService);
registerWebhookTools(server, confluenceService);
registerAdminTools(server, confluenceService);
registerResources(server, confluenceService);
registerPrompts(server);

await connectServer(server);
