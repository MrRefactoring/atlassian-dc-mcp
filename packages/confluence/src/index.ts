import { connectServer, createMcpServer, formatToolResponse, initializeRuntimeConfig } from 'datacenter-mcp-core';
import { ConfluenceService, ConfluenceContent, ConfluenceSpace, confluenceToolSchemas } from './confluence-service.js';
import { shapeConfluenceMutationAck } from './confluence-response-mapper.js';
import { getConfluenceRuntimeConfig, getDefaultPageSize } from './config.js';
import { createRequire } from 'node:module';
import { z } from 'zod';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

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
  getDefaultPageSize,
  () => getConfluenceRuntimeConfig().username,
  () => getConfluenceRuntimeConfig().password,
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

server.tool(
  "confluence_getContentRestrictions",
  `Get all restrictions on a piece of content, grouped by operation, in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentRestrictions,
  async ({ contentId, expand }) => {
    const result = await confluenceService.getContentRestrictions(contentId, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentRestrictionsByOperation",
  `Get the restrictions on a piece of content for a single operation in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentRestrictionsByOperation,
  async ({ operationKey, contentId, expand, limit, start }) => {
    const result = await confluenceService.getContentRestrictionsByOperation(operationKey, contentId, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateContentRestrictions",
  `Overwrite the restrictions on a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateContentRestrictions,
  async ({ contentId, restrictions, expand }) => {
    const result = await confluenceService.updateContentRestrictions(contentId, restrictions, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getContentWatchers",
  `List the users watching a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentWatchers,
  async ({ contentId, limit, start }) => {
    const result = await confluenceService.getContentWatchers(contentId, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_isWatchingContent",
  `Check whether a user is watching a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.isWatchingContent,
  async ({ contentId, key, username }) => {
    const result = await confluenceService.isWatchingContent(contentId, key, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_addContentWatcher",
  `Add a watcher to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.addContentWatcher,
  async ({ contentId, key, username }) => {
    const result = await confluenceService.addContentWatcher(contentId, key, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_removeContentWatcher",
  `Remove a watcher from a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.removeContentWatcher,
  async ({ contentId, key, username }) => {
    const result = await confluenceService.removeContentWatcher(contentId, key, username);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getAttachments",
  `Get the attachments on a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getAttachments,
  async ({ contentId, expand, filename, limit, start, mediaType }) => {
    const result = await confluenceService.getAttachments(contentId, expand, filename, limit, start, mediaType);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_removeAttachment",
  `Remove an attachment from a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.removeAttachment,
  async ({ attachmentId, contentId }) => {
    const result = await confluenceService.removeAttachment(attachmentId, contentId);
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

server.tool(
  "confluence_getSpace",
  `Get information about a single space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpace,
  async ({ spaceKey, expand }) => {
    const result = await confluenceService.getSpace(spaceKey, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getSpaces",
  `List spaces with optional filters in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaces,
  async ({ spaceKey, type, status, label, favourite, expand, limit, start }) => {
    const result = await confluenceService.getSpaces(spaceKey, type, status, label, favourite, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_createSpace",
  `Create a new space in ${confluenceInstanceType}`,
  confluenceToolSchemas.createSpace,
  async ({ key, name, description, isPrivate }) => {
    const spaceBody: ConfluenceSpace = { key, name };
    if (description) {
      spaceBody.description = { plain: { value: description, representation: 'plain' } };
    }
    const result = await confluenceService.createSpace(spaceBody, isPrivate);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateSpace",
  `Update a space's name and description in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateSpace,
  async ({ spaceKey, name, description }) => {
    const spaceBody: ConfluenceSpace = { key: spaceKey, name };
    if (description) {
      spaceBody.description = { plain: { value: description, representation: 'plain' } };
    }
    const result = await confluenceService.updateSpace(spaceKey, spaceBody);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteSpace",
  `Delete a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteSpace,
  async ({ spaceKey }) => {
    const result = await confluenceService.deleteSpace(spaceKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getSpaceContent",
  `Get the content in a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaceContent,
  async ({ spaceKey, type, expand, depth, limit, start }) => {
    const result = await confluenceService.getSpaceContent(spaceKey, type, expand, depth, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_createAttachment",
  `Upload a new attachment to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.createAttachment,
  async ({ contentId, fileName, contentBase64, comment, minorEdit, hidden, allowDuplicated, status, expand }) => {
    const result = await confluenceService.createAttachment(
      contentId,
      fileName,
      contentBase64,
      comment,
      minorEdit,
      hidden,
      allowDuplicated,
      status,
      expand
    );
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateAttachmentMeta",
  `Update an attachment's metadata (filename, media type, comment) in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateAttachmentMeta,
  async ({ contentId, attachmentId, version, title, versionComment, mediaType, comment, minorEdit }) => {
    const result = await confluenceService.updateAttachmentMeta(
      contentId,
      attachmentId,
      version,
      title,
      versionComment,
      mediaType,
      comment,
      minorEdit
    );
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateAttachmentData",
  `Replace the binary data of an attachment in ${confluenceInstanceType}, adding a new version`,
  confluenceToolSchemas.updateAttachmentData,
  async ({ contentId, attachmentId, fileName, contentBase64, comment, minorEdit }) => {
    const result = await confluenceService.updateAttachmentData(contentId, attachmentId, fileName, contentBase64, comment, minorEdit);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_moveAttachment",
  `Move an attachment to a different content entity in ${confluenceInstanceType}, optionally renaming it`,
  confluenceToolSchemas.moveAttachment,
  async ({ contentId, attachmentId, newContentId, newName }) => {
    const result = await confluenceService.moveAttachment(contentId, attachmentId, newContentId, newName);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteAttachment",
  `Delete an attachment from ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteAttachment,
  async ({ contentId, attachmentId }) => {
    const result = await confluenceService.deleteAttachment(contentId, attachmentId);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_archiveSpace",
  `Archive a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.archiveSpace,
  async ({ spaceKey }) => {
    const result = await confluenceService.archiveSpace(spaceKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_restoreSpace",
  `Restore an archived space in ${confluenceInstanceType}`,
  confluenceToolSchemas.restoreSpace,
  async ({ spaceKey }) => {
    const result = await confluenceService.restoreSpace(spaceKey);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getSpaceProperties",
  `Get the properties stored on a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaceProperties,
  async ({ spaceKey, expand, limit, start }) => {
    const result = await confluenceService.getSpaceProperties(spaceKey, expand, limit, start);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_getSpaceProperty",
  `Get a single space property by key in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaceProperty,
  async ({ spaceKey, key, expand }) => {
    const result = await confluenceService.getSpaceProperty(spaceKey, key, expand);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_createSpaceProperty",
  `Create a space property in ${confluenceInstanceType}`,
  confluenceToolSchemas.createSpaceProperty,
  async ({ spaceKey, key, value }) => {
    const result = await confluenceService.createSpaceProperty(spaceKey, key, value);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_updateSpaceProperty",
  `Update a space property in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateSpaceProperty,
  async ({ spaceKey, key, value, version }) => {
    const result = await confluenceService.updateSpaceProperty(spaceKey, key, value, version);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteSpaceProperty",
  `Delete a space property in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteSpaceProperty,
  async ({ spaceKey, key }) => {
    const result = await confluenceService.deleteSpaceProperty(spaceKey, key);
    return formatToolResponse(result);
  }
);

server.tool(
  "confluence_deleteAttachmentVersion",
  `Delete a specific version of an attachment in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteAttachmentVersion,
  async ({ contentId, attachmentId, version }) => {
    const result = await confluenceService.deleteAttachmentVersion(contentId, attachmentId, version);
    return formatToolResponse(result);
  }
);

server.registerResource(
  "confluence-page",
  new ResourceTemplate("confluence://page/{pageId}", { list: undefined }),
  {
    title: "Confluence page",
    description: `A content item (page, blog post, ...) in ${confluenceInstanceType}, addressable by its content ID (e.g. confluence://page/123456).`,
    mimeType: "application/json",
  },
  async (uri, { pageId }) => {
    const result = await confluenceService.getContent(firstValue(pageId));
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result),
        },
      ],
    };
  }
);

server.registerPrompt(
  "confluence_buildCqlQuery",
  {
    title: "Build a CQL query for Confluence search",
    description: `Turns a natural-language content request into a valid CQL (Confluence Query Language) query for confluence_searchContent in ${confluenceInstanceType}.`,
    argsSchema: {
      request: z.string().describe(
        "A natural-language description of what to find, e.g. 'pages about onboarding updated in the last month in the ENG space'"
      ),
    },
  },
  ({ request }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Translate this request into a CQL query: "${request}"

Common CQL fields: type (page, blogpost, attachment, comment), space, title, text, label, creator, contributor, created, lastmodified, ancestor.
Operators: =, !=, ~, !~, in, not in, and, or, not. Relative dates use forms like now("-1m") or now("-7d").
Example: type=page and space=ENG and lastmodified >= now("-30d") and title ~ "onboarding"

Produce the CQL string, then call confluence_searchContent with it and summarize the results.`,
        },
      },
    ],
  })
);

await connectServer(server);
