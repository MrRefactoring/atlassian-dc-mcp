import { connectServer, createMcpServer, formatToolResponse, initializeRuntimeConfig } from 'datacenter-mcp-core';
import { ConfluenceService, ConfluenceContent, confluenceToolSchemas } from './confluence-service.js';
import { shapeConfluenceMutationAck } from './confluence-response-mapper.js';
import { getConfluenceRuntimeConfig, getDefaultPageSize } from './config.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

initializeRuntimeConfig();

// Validate required environment variables
const missingEnvVars = ConfluenceService.validateConfig();
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize Confluence service
const confluenceConfig = getConfluenceRuntimeConfig();
const confluenceService = new ConfluenceService(
  confluenceConfig.host,
  () => getConfluenceRuntimeConfig().token,
  confluenceConfig.apiBasePath,
  getDefaultPageSize
);

// Define Confluence instance type
const confluenceInstanceType = "Confluence Data Center edition instance";

// Initialize MCP server
const server = createMcpServer({
  name: "atlassian-confluence-mcp",
  version
});

// Add Confluence content tools
server.tool(
  "confluence_getContent",
  `Get Confluence content by ID from the ${confluenceInstanceType}`,
  confluenceToolSchemas.getContent,
  async ({ contentId, expand, bodyMode, maxBodyChars, bodyStart }) => {
    const result = await confluenceService.getContent(contentId, expand, bodyMode, maxBodyChars, bodyStart);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_searchContent",
  `Search for content in ${confluenceInstanceType} using CQL`,
  confluenceToolSchemas.searchContent,
  async ({ cql, limit, start, expand, excerpt }) => {
    const result = await confluenceService.searchContent(cql, limit, start, expand, excerpt);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_createContent",
  `Create new content in ${confluenceInstanceType}`,
  confluenceToolSchemas.createContent,
  async ({ title, spaceKey, type, content, parentId, output }) => {
    const contentObj: ConfluenceContent = {
      type: type || 'page',
      title,
      space: { key: spaceKey },
      body: {
        storage: {
          value: content,
          representation: 'storage'
        }
      }
    };

    // Add parent page as ancestor if specified
    if (parentId) {
      contentObj.ancestors = [{ id: parentId }];
    }

    const result = await confluenceService.createContent(contentObj);
    if (result.success && result.data && output !== 'full') {
      return formatToolResponse({
        ...result,
        data: shapeConfluenceMutationAck(result.data),
      });
    }
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateContent",
  `Update existing content in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateContent,
  async ({ contentId, title, content, version, versionComment, output }) => {
    // First get the current content to build upon
    const currentContent = await confluenceService.getContentRaw(contentId);

    if (!currentContent.success || !currentContent.data) {
      return formatToolResponse({
        success: false,
        error: `Failed to retrieve content with ID ${contentId}: ${currentContent.error || 'Unknown error'}`
      });
    }

    // Type assertion to help TypeScript understand the structure
    const contentData = currentContent.data as {
      type: string;
      title: string;
      space: { key: string };
    };

    const updateObj: ConfluenceContent = {
      id: contentId,
      type: contentData.type,
      title: title || contentData.title,
      space: contentData.space,
      version: {
        number: version,
        message: versionComment
      }
    };

    // Only update body if content is provided
    if (content) {
      updateObj.body = {
        storage: {
          value: content,
          representation: 'storage'
        }
      };
    }

    const result = await confluenceService.updateContent(contentId, updateObj);
    if (result.success && result.data && output !== 'full') {
      return formatToolResponse({
        ...result,
        data: shapeConfluenceMutationAck(result.data),
      });
    }
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteContent",
  `Delete (trash or purge) content in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteContent,
  async ({ contentId, status }) => {
    const result = await confluenceService.deleteContent(contentId, status);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentHistory",
  `Get the version history of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentHistory,
  async ({ contentId, expand }) => {
    const result = await confluenceService.getContentHistory(contentId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentChildren",
  `Get the direct children of a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentChildren,
  async ({ contentId, expand, limit, start }) => {
    const result = await confluenceService.getContentChildren(contentId, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentChildrenByType",
  `Get the children of a piece of content limited to a single type in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentChildrenByType,
  async ({ contentId, type, expand, limit, start }) => {
    const result = await confluenceService.getContentChildrenByType(contentId, type, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentComments",
  `Get the comments of a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentComments,
  async ({ contentId, expand, depth, limit, start, location }) => {
    const result = await confluenceService.getContentComments(contentId, expand, depth, limit, start, location);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentDescendants",
  `Get the descendants of a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentDescendants,
  async ({ contentId, expand }) => {
    const result = await confluenceService.getContentDescendants(contentId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentDescendantsByType",
  `Get the descendants of a piece of content limited to a single type in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentDescendantsByType,
  async ({ contentId, type, expand, limit, start }) => {
    const result = await confluenceService.getContentDescendantsByType(contentId, type, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentLabels",
  `Get the labels attached to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentLabels,
  async ({ contentId, prefix, limit, start }) => {
    const result = await confluenceService.getContentLabels(contentId, prefix, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_addContentLabels",
  `Add one or more labels to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.addContentLabels,
  async ({ contentId, labels }) => {
    const result = await confluenceService.addContentLabels(contentId, labels);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteContentLabel",
  `Remove a label from a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteContentLabel,
  async ({ contentId, name }) => {
    const result = await confluenceService.deleteContentLabel(contentId, name);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentProperties",
  `Get the properties stored on a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentProperties,
  async ({ contentId, expand, limit, start }) => {
    const result = await confluenceService.getContentProperties(contentId, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentProperty",
  `Get a single content property by key in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentProperty,
  async ({ contentId, key, expand }) => {
    const result = await confluenceService.getContentProperty(contentId, key, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_createContentProperty",
  `Create a content property in ${confluenceInstanceType}`,
  confluenceToolSchemas.createContentProperty,
  async ({ contentId, key, value }) => {
    const result = await confluenceService.createContentProperty(contentId, key, value);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateContentProperty",
  `Update a content property in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateContentProperty,
  async ({ contentId, key, value, version }) => {
    const result = await confluenceService.updateContentProperty(contentId, key, value, version);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteContentProperty",
  `Delete a content property in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteContentProperty,
  async ({ contentId, key }) => {
    const result = await confluenceService.deleteContentProperty(contentId, key);
    return formatToolResponse(result);
  }
);

server.tool('confluence_searchSpace',
  `Search for spaces in ${confluenceInstanceType}`,
  confluenceToolSchemas.searchSpaces,
  async ({
           searchText,
           limit,
           start,
           expand,
           excerpt
         }) => {
    const result = await confluenceService.searchSpaces(searchText, limit, start, expand, excerpt);
    return formatToolResponse(result);
  });

await connectServer(server);
