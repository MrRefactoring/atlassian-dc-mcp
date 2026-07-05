import { connectServer, createMcpServer, initializeRuntimeConfig, logger } from 'datacenter-mcp-core';
import { BitbucketService } from './bitbucketService.js';
import { getBitbucketRuntimeConfig, getDefaultPageSize } from './config.js';
import { createRequire } from 'node:module';
import { registerProjectTools } from './tools/projects.js';
import { registerRepositoryTools } from './tools/repositories.js';
import { registerPullRequestTools } from './tools/pullRequests.js';
import { registerBuildTools } from './tools/builds.js';
import { registerPermissionTools } from './tools/permissions.js';
import { registerAuthenticationTools } from './tools/authentication.js';
import { registerSecurityTools } from './tools/security.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

const require = createRequire(import.meta.url);

const { version } = require('../package.json');

initializeRuntimeConfig();

const missingVars = BitbucketService.validateConfig();

if (missingVars.length > 0) {
  logger.error(`Missing required environment variables: ${missingVars.join(', ')}`, { missingVars });
  process.exit(1);
}

const bitbucketConfig = getBitbucketRuntimeConfig();

const bitbucketService = new BitbucketService(
  bitbucketConfig.host,
  () => getBitbucketRuntimeConfig().token,
  bitbucketConfig.apiBasePath,
  getDefaultPageSize,
  () => getBitbucketRuntimeConfig().username,
  () => getBitbucketRuntimeConfig().password,
);

const server = createMcpServer({
  name: 'atlassian-bitbucket-mcp',
  version,
});

registerProjectTools(server, bitbucketService);
registerRepositoryTools(server, bitbucketService);
registerPullRequestTools(server, bitbucketService);
registerBuildTools(server, bitbucketService);
registerPermissionTools(server, bitbucketService);
registerAuthenticationTools(server, bitbucketService);
registerSecurityTools(server, bitbucketService);
registerResources(server, bitbucketService);
registerPrompts(server);

await connectServer(server);
