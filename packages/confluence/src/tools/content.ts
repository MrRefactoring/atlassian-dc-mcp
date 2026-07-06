import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse, registerAnnotatedTool } from 'datacenter-mcp-core';
import { shapeConfluenceMutationAck } from '../confluenceResponseMapper.js';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService, ConfluenceContent } from '../confluenceService.js';

export function registerContentTools(server: McpServer, service: ConfluenceService) {
  registerAnnotatedTool(server,
    'confluence_get_content',
    {
      description: `Get Confluence content by ID from the ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContent,
    },
    async ({ contentId, expand, bodyMode, maxBodyChars, bodyStart }) => {
      const result = await service.getContent(contentId, expand, bodyMode, maxBodyChars, bodyStart);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_search_content',
    {
      description: `Search for content in ${confluenceInstanceType} using CQL`,
      inputSchema: confluenceToolSchemas.searchContent,
    },
    async ({ cql, limit, start, expand, excerpt }) => {
      const result = await service.searchContent(cql, limit, start, expand, excerpt);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_create_content',
    {
      description: `Create new content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.createContent,
    },
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

  registerAnnotatedTool(server,
    'confluence_update_content',
    {
      description: `Update existing content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateContent,
    },
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

  registerAnnotatedTool(server,
    'confluence_delete_content',
    {
      description: `Delete (trash or purge) content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteContent,
    },
    async ({ contentId, status }) => {
      const result = await service.deleteContent(contentId, status);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_history',
    {
      description: `Get the version history of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentHistory,
    },
    async ({ contentId, expand }) => {
      const result = await service.getContentHistory(contentId, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_children',
    {
      description: `Get the direct children of a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentChildren,
    },
    async ({ contentId, expand, limit, start }) => {
      const result = await service.getContentChildren(contentId, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_children_by_type',
    {
      description: `Get the children of a piece of content limited to a single type in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentChildrenByType,
    },
    async ({ contentId, type, expand, limit, start }) => {
      const result = await service.getContentChildrenByType(contentId, type, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_comments',
    {
      description: `Get the comments of a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentComments,
    },
    async ({ contentId, expand, depth, limit, start, location }) => {
      const result = await service.getContentComments(contentId, expand, depth, limit, start, location);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_descendants',
    {
      description: `Get the descendants of a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentDescendants,
    },
    async ({ contentId, expand }) => {
      const result = await service.getContentDescendants(contentId, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_descendants_by_type',
    {
      description: `Get the descendants of a piece of content limited to a single type in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentDescendantsByType,
    },
    async ({ contentId, type, expand, limit, start }) => {
      const result = await service.getContentDescendantsByType(contentId, type, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_labels',
    {
      description: `Get the labels attached to a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentLabels,
    },
    async ({ contentId, prefix, limit, start }) => {
      const result = await service.getContentLabels(contentId, prefix, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_add_content_labels',
    {
      description: `Add one or more labels to a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.addContentLabels,
    },
    async ({ contentId, labels }) => {
      const result = await service.addContentLabels(contentId, labels);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_delete_content_label',
    {
      description: `Remove a label from a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteContentLabel,
    },
    async ({ contentId, name }) => {
      const result = await service.deleteContentLabel(contentId, name);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_properties',
    {
      description: `Get the properties stored on a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentProperties,
    },
    async ({ contentId, expand, limit, start }) => {
      const result = await service.getContentProperties(contentId, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_property',
    {
      description: `Get a single content property by key in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentProperty,
    },
    async ({ contentId, key, expand }) => {
      const result = await service.getContentProperty(contentId, key, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_create_content_property',
    {
      description: `Create a content property in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.createContentProperty,
    },
    async ({ contentId, key, value }) => {
      const result = await service.createContentProperty(contentId, key, value);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_update_content_property',
    {
      description: `Update a content property in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateContentProperty,
    },
    async ({ contentId, key, value, version }) => {
      const result = await service.updateContentProperty(contentId, key, value, version);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_delete_content_property',
    {
      description: `Delete a content property in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteContentProperty,
    },
    async ({ contentId, key }) => {
      const result = await service.deleteContentProperty(contentId, key);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_restrictions',
    {
      description: `Get all restrictions on a piece of content, grouped by operation, in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentRestrictions,
    },
    async ({ contentId, expand }) => {
      const result = await service.getContentRestrictions(contentId, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_restrictions_by_operation',
    {
      description: `Get the restrictions on a piece of content for a single operation in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentRestrictionsByOperation,
    },
    async ({ operationKey, contentId, expand, limit, start }) => {
      const result = await service.getContentRestrictionsByOperation(operationKey, contentId, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_update_content_restrictions',
    {
      description: `Overwrite the restrictions on a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateContentRestrictions,
    },
    async ({ contentId, restrictions, expand }) => {
      const result = await service.updateContentRestrictions(contentId, restrictions, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_content_watchers',
    {
      description: `List the users watching a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getContentWatchers,
    },
    async ({ contentId, limit, start }) => {
      const result = await service.getContentWatchers(contentId, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_is_watching_content',
    {
      description: `Check whether a user is watching a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.isWatchingContent,
    },
    async ({ contentId, key, username }) => {
      const result = await service.isWatchingContent(contentId, key, username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_add_content_watcher',
    {
      description: `Add a watcher to a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.addContentWatcher,
    },
    async ({ contentId, key, username }) => {
      const result = await service.addContentWatcher(contentId, key, username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_remove_content_watcher',
    {
      description: `Remove a watcher from a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.removeContentWatcher,
    },
    async ({ contentId, key, username }) => {
      const result = await service.removeContentWatcher(contentId, key, username);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_publish_blueprint_shared_draft',
    {
      description: `Publish a shared draft created from a content blueprint (template) in ${confluenceInstanceType}, turning it into live content`,
      inputSchema: confluenceToolSchemas.publishBlueprintSharedDraft,
    },
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

  registerAnnotatedTool(server,
    'confluence_publish_blueprint_legacy_draft',
    {
      description: `Publish a legacy draft created from a content blueprint (template) in ${confluenceInstanceType}, turning it into live content`,
      inputSchema: confluenceToolSchemas.publishBlueprintLegacyDraft,
    },
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

  registerAnnotatedTool(server,
    'confluence_convert_content_body',
    {
      description: `Convert a content body between representations (e.g. storage to view) in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.convertContentBody,
    },
    async ({ to, value, representation, expand }) => {
      const result = await service.convertContentBody(to, value, representation, expand);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_recently_used_labels',
    {
      description: `Get the labels most recently used across the whole ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getRecentlyUsedLabels,
    },
    async ({ limit, start }) => {
      const result = await service.getRecentlyUsedLabels(limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_get_related_labels',
    {
      description: `Get labels related to a given label (co-occurring on the same content) in the ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getRelatedLabels,
    },
    async ({ labelName, limit, start }) => {
      const result = await service.getRelatedLabels(labelName, limit, start);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_delete_content_version',
    {
      description: `Delete a specific historical version of a piece of content in the ${confluenceInstanceType}. This is irreversible.`,
      inputSchema: confluenceToolSchemas.deleteContentVersion,
    },
    async ({ contentId, versionNumber }) => {
      const result = await service.deleteContentVersion(contentId, versionNumber);

      return formatToolResponse(result);
    },
  );
}
