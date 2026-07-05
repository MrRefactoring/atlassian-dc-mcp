import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { shapeConfluenceMutationAck } from '../confluenceResponseMapper.js';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService, ConfluenceContent } from '../confluenceService.js';

export function registerContentTools(server: McpServer, service: ConfluenceService) {
  server.tool(
    'confluence_getContent',
    `Get Confluence content by ID from the ${confluenceInstanceType}`,
    confluenceToolSchemas.getContent,
    async ({ contentId, expand, bodyMode, maxBodyChars, bodyStart }) => {
      const result = await service.getContent(contentId, expand, bodyMode, maxBodyChars, bodyStart);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_searchContent',
    `Search for content in ${confluenceInstanceType} using CQL`,
    confluenceToolSchemas.searchContent,
    async ({ cql, limit, start, expand, excerpt }) => {
      const result = await service.searchContent(cql, limit, start, expand, excerpt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_createContent',
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
            representation: 'storage',
          },
        },
      };

      // Add parent page as ancestor if specified
      if (parentId) {
        contentObj.ancestors = [{ id: parentId }];
      }

      const result = await service.createContent(contentObj);
      if (result.success && result.data && output !== 'full') {
        return formatToolResponse({
          ...result,
          data: shapeConfluenceMutationAck(result.data),
        });
      }

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_updateContent',
    `Update existing content in ${confluenceInstanceType}`,
    confluenceToolSchemas.updateContent,
    async ({ contentId, title, content, version, versionComment, output }) => {
      // First get the current content to build upon
      const currentContent = await service.getContentRaw(contentId);

      if (!currentContent.success || !currentContent.data) {
        return formatToolResponse({
          success: false,
          error: `Failed to retrieve content with ID ${contentId}: ${currentContent.error || 'Unknown error'}`,
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
          message: versionComment,
        },
      };

      // Only update body if content is provided
      if (content) {
        updateObj.body = {
          storage: {
            value: content,
            representation: 'storage',
          },
        };
      }

      const result = await service.updateContent(contentId, updateObj);
      if (result.success && result.data && output !== 'full') {
        return formatToolResponse({
          ...result,
          data: shapeConfluenceMutationAck(result.data),
        });
      }

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteContent',
    `Delete (trash or purge) content in ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteContent,
    async ({ contentId, status }) => {
      const result = await service.deleteContent(contentId, status);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentHistory',
    `Get the version history of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentHistory,
    async ({ contentId, expand }) => {
      const result = await service.getContentHistory(contentId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentChildren',
    `Get the direct children of a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentChildren,
    async ({ contentId, expand, limit, start }) => {
      const result = await service.getContentChildren(contentId, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentChildrenByType',
    `Get the children of a piece of content limited to a single type in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentChildrenByType,
    async ({ contentId, type, expand, limit, start }) => {
      const result = await service.getContentChildrenByType(contentId, type, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentComments',
    `Get the comments of a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentComments,
    async ({ contentId, expand, depth, limit, start, location }) => {
      const result = await service.getContentComments(contentId, expand, depth, limit, start, location);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentDescendants',
    `Get the descendants of a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentDescendants,
    async ({ contentId, expand }) => {
      const result = await service.getContentDescendants(contentId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentDescendantsByType',
    `Get the descendants of a piece of content limited to a single type in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentDescendantsByType,
    async ({ contentId, type, expand, limit, start }) => {
      const result = await service.getContentDescendantsByType(contentId, type, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentLabels',
    `Get the labels attached to a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentLabels,
    async ({ contentId, prefix, limit, start }) => {
      const result = await service.getContentLabels(contentId, prefix, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_addContentLabels',
    `Add one or more labels to a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.addContentLabels,
    async ({ contentId, labels }) => {
      const result = await service.addContentLabels(contentId, labels);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteContentLabel',
    `Remove a label from a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteContentLabel,
    async ({ contentId, name }) => {
      const result = await service.deleteContentLabel(contentId, name);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentProperties',
    `Get the properties stored on a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentProperties,
    async ({ contentId, expand, limit, start }) => {
      const result = await service.getContentProperties(contentId, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentProperty',
    `Get a single content property by key in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentProperty,
    async ({ contentId, key, expand }) => {
      const result = await service.getContentProperty(contentId, key, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_createContentProperty',
    `Create a content property in ${confluenceInstanceType}`,
    confluenceToolSchemas.createContentProperty,
    async ({ contentId, key, value }) => {
      const result = await service.createContentProperty(contentId, key, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_updateContentProperty',
    `Update a content property in ${confluenceInstanceType}`,
    confluenceToolSchemas.updateContentProperty,
    async ({ contentId, key, value, version }) => {
      const result = await service.updateContentProperty(contentId, key, value, version);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteContentProperty',
    `Delete a content property in ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteContentProperty,
    async ({ contentId, key }) => {
      const result = await service.deleteContentProperty(contentId, key);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentRestrictions',
    `Get all restrictions on a piece of content, grouped by operation, in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentRestrictions,
    async ({ contentId, expand }) => {
      const result = await service.getContentRestrictions(contentId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentRestrictionsByOperation',
    `Get the restrictions on a piece of content for a single operation in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentRestrictionsByOperation,
    async ({ operationKey, contentId, expand, limit, start }) => {
      const result = await service.getContentRestrictionsByOperation(operationKey, contentId, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_updateContentRestrictions',
    `Overwrite the restrictions on a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.updateContentRestrictions,
    async ({ contentId, restrictions, expand }) => {
      const result = await service.updateContentRestrictions(contentId, restrictions, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getContentWatchers',
    `List the users watching a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getContentWatchers,
    async ({ contentId, limit, start }) => {
      const result = await service.getContentWatchers(contentId, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_isWatchingContent',
    `Check whether a user is watching a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.isWatchingContent,
    async ({ contentId, key, username }) => {
      const result = await service.isWatchingContent(contentId, key, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_addContentWatcher',
    `Add a watcher to a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.addContentWatcher,
    async ({ contentId, key, username }) => {
      const result = await service.addContentWatcher(contentId, key, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_removeContentWatcher',
    `Remove a watcher from a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.removeContentWatcher,
    async ({ contentId, key, username }) => {
      const result = await service.removeContentWatcher(contentId, key, username);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_publishBlueprintSharedDraft',
    `Publish a shared draft created from a content blueprint (template) in ${confluenceInstanceType}, turning it into live content`,
    confluenceToolSchemas.publishBlueprintSharedDraft,
    async ({ draftId, title, spaceKey, content, parentId, expand }) => {
      const contentObj: ConfluenceContent = {
        id: draftId,
        type: 'page',
        status: 'current',
        title,
        space: { key: spaceKey },
        body: {
          storage: {
            value: content,
            representation: 'storage',
          },
        },
      };
      if (parentId) {
        contentObj.ancestors = [{ id: parentId }];
      }
      const result = await service.publishBlueprintSharedDraft(draftId, contentObj, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_publishBlueprintLegacyDraft',
    `Publish a legacy draft created from a content blueprint (template) in ${confluenceInstanceType}, turning it into live content`,
    confluenceToolSchemas.publishBlueprintLegacyDraft,
    async ({ draftId, title, spaceKey, content, parentId, expand }) => {
      const contentObj: ConfluenceContent = {
        id: draftId,
        type: 'page',
        status: 'current',
        title,
        space: { key: spaceKey },
        body: {
          storage: {
            value: content,
            representation: 'storage',
          },
        },
      };
      if (parentId) {
        contentObj.ancestors = [{ id: parentId }];
      }
      const result = await service.publishBlueprintLegacyDraft(draftId, contentObj, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_convertContentBody',
    `Convert a content body between representations (e.g. storage to view) in ${confluenceInstanceType}`,
    confluenceToolSchemas.convertContentBody,
    async ({ to, value, representation, expand }) => {
      const result = await service.convertContentBody(to, value, representation, expand);

      return formatToolResponse(result);
    },
  );
}
