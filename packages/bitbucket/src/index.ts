import { connectServer, createMcpServer, formatToolResponse } from '@atlassian-dc-mcp/common';
import dotenv from 'dotenv';
import { BitbucketService, bitbucketToolSchemas } from './bitbucket-service.js';

// Load environment variables
dotenv.config();

// Check if required environment variables are set
const missingVars = BitbucketService.validateConfig();
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Initialize Bitbucket service
const bitbucketService = new BitbucketService(
  process.env.BITBUCKET_HOST!,
  process.env.BITBUCKET_API_TOKEN!,
  process.env.BITBUCKET_API_BASE_PATH,
);

// Initialize MCP server
const server = createMcpServer({
  name: "atlassian-bitbucket-mcp",
  version: "0.1.0"
});

// Register Bitbucket tools
server.tool(
  "bitbucket_getProjects",
  "Get a list of Bitbucket projects",
  bitbucketToolSchemas.getProjects,
  async ({ name, permission, start, limit }) => {
    const result = await bitbucketService.getProjects(name, permission, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getProject",
  "Get a specific Bitbucket project by key",
  bitbucketToolSchemas.getProject,
  async ({ projectKey }) => {
    const result = await bitbucketService.getProject(projectKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getRepositories",
  "Get repositories for a Bitbucket project",
  bitbucketToolSchemas.getRepositories,
  async ({ projectKey, start, limit }) => {
    const result = await bitbucketService.getRepositories(projectKey, start, limit);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getRepository",
  "Get a specific Bitbucket repository",
  bitbucketToolSchemas.getRepository,
  async ({ projectKey, repositorySlug }) => {
    const result = await bitbucketService.getRepository(projectKey, repositorySlug);
    return formatToolResponse(result);
  }
);

server.tool(
  "bitbucket_getCommits",
  "Get commits for a Bitbucket repository",
  bitbucketToolSchemas.getCommits,
  async ({ projectKey, repositorySlug, path, since, until, limit }) => {
    const result = await bitbucketService.getCommits(projectKey, repositorySlug, path, since, until, limit);
    return formatToolResponse(result);
  }
);

await connectServer(server);
