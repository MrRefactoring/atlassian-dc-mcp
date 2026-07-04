import { connectServer, createMcpServer, formatToolResponse, initializeRuntimeConfig } from 'datacenter-mcp-core';
import type { ConfluenceContent, ConfluenceSpace } from './confluence-service.js';
import { ConfluenceService, confluenceToolSchemas } from './confluence-service.js';
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
const confluenceInstanceType = 'Confluence Data Center edition instance';

// Initialize MCP server
const server = createMcpServer({
  name: 'atlassian-confluence-mcp',
  version,
});

// Add Confluence content tools
server.tool(
  'confluence_getContent',
  `Get Confluence content by ID from the ${confluenceInstanceType}`,
  confluenceToolSchemas.getContent,
  async ({ contentId, expand, bodyMode, maxBodyChars, bodyStart }) => {
    const result = await confluenceService.getContent(contentId, expand, bodyMode, maxBodyChars, bodyStart);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_searchContent',
  `Search for content in ${confluenceInstanceType} using CQL`,
  confluenceToolSchemas.searchContent,
  async ({ cql, limit, start, expand, excerpt }) => {
    const result = await confluenceService.searchContent(cql, limit, start, expand, excerpt);

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

    const result = await confluenceService.createContent(contentObj);
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
    const currentContent = await confluenceService.getContentRaw(contentId);

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

    const result = await confluenceService.updateContent(contentId, updateObj);
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
    const result = await confluenceService.deleteContent(contentId, status);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentHistory',
  `Get the version history of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentHistory,
  async ({ contentId, expand }) => {
    const result = await confluenceService.getContentHistory(contentId, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentChildren',
  `Get the direct children of a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentChildren,
  async ({ contentId, expand, limit, start }) => {
    const result = await confluenceService.getContentChildren(contentId, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentChildrenByType',
  `Get the children of a piece of content limited to a single type in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentChildrenByType,
  async ({ contentId, type, expand, limit, start }) => {
    const result = await confluenceService.getContentChildrenByType(contentId, type, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentComments',
  `Get the comments of a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentComments,
  async ({ contentId, expand, depth, limit, start, location }) => {
    const result = await confluenceService.getContentComments(contentId, expand, depth, limit, start, location);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentDescendants',
  `Get the descendants of a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentDescendants,
  async ({ contentId, expand }) => {
    const result = await confluenceService.getContentDescendants(contentId, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentDescendantsByType',
  `Get the descendants of a piece of content limited to a single type in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentDescendantsByType,
  async ({ contentId, type, expand, limit, start }) => {
    const result = await confluenceService.getContentDescendantsByType(contentId, type, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentLabels',
  `Get the labels attached to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentLabels,
  async ({ contentId, prefix, limit, start }) => {
    const result = await confluenceService.getContentLabels(contentId, prefix, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_addContentLabels',
  `Add one or more labels to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.addContentLabels,
  async ({ contentId, labels }) => {
    const result = await confluenceService.addContentLabels(contentId, labels);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteContentLabel',
  `Remove a label from a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteContentLabel,
  async ({ contentId, name }) => {
    const result = await confluenceService.deleteContentLabel(contentId, name);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentProperties',
  `Get the properties stored on a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentProperties,
  async ({ contentId, expand, limit, start }) => {
    const result = await confluenceService.getContentProperties(contentId, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentProperty',
  `Get a single content property by key in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentProperty,
  async ({ contentId, key, expand }) => {
    const result = await confluenceService.getContentProperty(contentId, key, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_createContentProperty',
  `Create a content property in ${confluenceInstanceType}`,
  confluenceToolSchemas.createContentProperty,
  async ({ contentId, key, value }) => {
    const result = await confluenceService.createContentProperty(contentId, key, value);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateContentProperty',
  `Update a content property in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateContentProperty,
  async ({ contentId, key, value, version }) => {
    const result = await confluenceService.updateContentProperty(contentId, key, value, version);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteContentProperty',
  `Delete a content property in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteContentProperty,
  async ({ contentId, key }) => {
    const result = await confluenceService.deleteContentProperty(contentId, key);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentRestrictions',
  `Get all restrictions on a piece of content, grouped by operation, in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentRestrictions,
  async ({ contentId, expand }) => {
    const result = await confluenceService.getContentRestrictions(contentId, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentRestrictionsByOperation',
  `Get the restrictions on a piece of content for a single operation in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentRestrictionsByOperation,
  async ({ operationKey, contentId, expand, limit, start }) => {
    const result = await confluenceService.getContentRestrictionsByOperation(operationKey, contentId, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateContentRestrictions',
  `Overwrite the restrictions on a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateContentRestrictions,
  async ({ contentId, restrictions, expand }) => {
    const result = await confluenceService.updateContentRestrictions(contentId, restrictions, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getContentWatchers',
  `List the users watching a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getContentWatchers,
  async ({ contentId, limit, start }) => {
    const result = await confluenceService.getContentWatchers(contentId, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_isWatchingContent',
  `Check whether a user is watching a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.isWatchingContent,
  async ({ contentId, key, username }) => {
    const result = await confluenceService.isWatchingContent(contentId, key, username);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_addContentWatcher',
  `Add a watcher to a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.addContentWatcher,
  async ({ contentId, key, username }) => {
    const result = await confluenceService.addContentWatcher(contentId, key, username);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_removeContentWatcher',
  `Remove a watcher from a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.removeContentWatcher,
  async ({ contentId, key, username }) => {
    const result = await confluenceService.removeContentWatcher(contentId, key, username);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getAttachments',
  `Get the attachments on a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.getAttachments,
  async ({ contentId, expand, filename, limit, start, mediaType }) => {
    const result = await confluenceService.getAttachments(contentId, expand, filename, limit, start, mediaType);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_removeAttachment',
  `Remove an attachment from a piece of content in ${confluenceInstanceType}`,
  confluenceToolSchemas.removeAttachment,
  async ({ attachmentId, contentId }) => {
    const result = await confluenceService.removeAttachment(attachmentId, contentId);

    return formatToolResponse(result);
  },
);

server.tool('confluence_searchSpace',
  `Search for spaces in ${confluenceInstanceType}`,
  confluenceToolSchemas.searchSpaces,
  async ({
    searchText,
    limit,
    start,
    expand,
    excerpt,
  }) => {
    const result = await confluenceService.searchSpaces(searchText, limit, start, expand, excerpt);

    return formatToolResponse(result);
  });

server.tool(
  'confluence_getSpace',
  `Get information about a single space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpace,
  async ({ spaceKey, expand }) => {
    const result = await confluenceService.getSpace(spaceKey, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getSpaces',
  `List spaces with optional filters in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaces,
  async ({ spaceKey, type, status, label, favourite, expand, limit, start }) => {
    const result = await confluenceService.getSpaces(spaceKey, type, status, label, favourite, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_createSpace',
  `Create a new space in ${confluenceInstanceType}`,
  confluenceToolSchemas.createSpace,
  async ({ key, name, description, isPrivate }) => {
    const spaceBody: ConfluenceSpace = { key, name };
    if (description) {
      spaceBody.description = { plain: { value: description, representation: 'plain' } };
    }
    const result = await confluenceService.createSpace(spaceBody, isPrivate);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateSpace',
  `Update a space's name and description in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateSpace,
  async ({ spaceKey, name, description }) => {
    const spaceBody: ConfluenceSpace = { key: spaceKey, name };
    if (description) {
      spaceBody.description = { plain: { value: description, representation: 'plain' } };
    }
    const result = await confluenceService.updateSpace(spaceKey, spaceBody);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteSpace',
  `Delete a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteSpace,
  async ({ spaceKey }) => {
    const result = await confluenceService.deleteSpace(spaceKey);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getSpaceContent',
  `Get the content in a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaceContent,
  async ({ spaceKey, type, expand, depth, limit, start }) => {
    const result = await confluenceService.getSpaceContent(spaceKey, type, expand, depth, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_createAttachment',
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
      expand,
    );

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateAttachmentMeta',
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
      minorEdit,
    );

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateAttachmentData',
  `Replace the binary data of an attachment in ${confluenceInstanceType}, adding a new version`,
  confluenceToolSchemas.updateAttachmentData,
  async ({ contentId, attachmentId, fileName, contentBase64, comment, minorEdit }) => {
    const result = await confluenceService.updateAttachmentData(contentId, attachmentId, fileName, contentBase64, comment, minorEdit);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_moveAttachment',
  `Move an attachment to a different content entity in ${confluenceInstanceType}, optionally renaming it`,
  confluenceToolSchemas.moveAttachment,
  async ({ contentId, attachmentId, newContentId, newName }) => {
    const result = await confluenceService.moveAttachment(contentId, attachmentId, newContentId, newName);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteAttachment',
  `Delete an attachment from ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteAttachment,
  async ({ contentId, attachmentId }) => {
    const result = await confluenceService.deleteAttachment(contentId, attachmentId);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_archiveSpace',
  `Archive a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.archiveSpace,
  async ({ spaceKey }) => {
    const result = await confluenceService.archiveSpace(spaceKey);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_restoreSpace',
  `Restore an archived space in ${confluenceInstanceType}`,
  confluenceToolSchemas.restoreSpace,
  async ({ spaceKey }) => {
    const result = await confluenceService.restoreSpace(spaceKey);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getSpaceProperties',
  `Get the properties stored on a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaceProperties,
  async ({ spaceKey, expand, limit, start }) => {
    const result = await confluenceService.getSpaceProperties(spaceKey, expand, limit, start);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getSpaceProperty',
  `Get a single space property by key in ${confluenceInstanceType}`,
  confluenceToolSchemas.getSpaceProperty,
  async ({ spaceKey, key, expand }) => {
    const result = await confluenceService.getSpaceProperty(spaceKey, key, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_createSpaceProperty',
  `Create a space property in ${confluenceInstanceType}`,
  confluenceToolSchemas.createSpaceProperty,
  async ({ spaceKey, key, value }) => {
    const result = await confluenceService.createSpaceProperty(spaceKey, key, value);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateSpaceProperty',
  `Update a space property in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateSpaceProperty,
  async ({ spaceKey, key, value, version }) => {
    const result = await confluenceService.updateSpaceProperty(spaceKey, key, value, version);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteSpaceProperty',
  `Delete a space property in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteSpaceProperty,
  async ({ spaceKey, key }) => {
    const result = await confluenceService.deleteSpaceProperty(spaceKey, key);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteAttachmentVersion',
  `Delete a specific version of an attachment in ${confluenceInstanceType}`,
  confluenceToolSchemas.deleteAttachmentVersion,
  async ({ contentId, attachmentId, version }) => {
    const result = await confluenceService.deleteAttachmentVersion(contentId, attachmentId, version);

    return formatToolResponse(result);
  },
);

// Add Confluence space permissions tools
server.tool(
  'confluence_getAllSpacePermissions',
  `Get all permissions granted to users, groups and the anonymous user in a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getAllSpacePermissions,
  async ({ spaceKey }) => {
    const result = await confluenceService.getAllSpacePermissions(spaceKey);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_setSpacePermissions',
  `Set the full permission set for up to 40 users/groups/anonymous user in a space in ${confluenceInstanceType}. Replaces each listed subject's existing permissions.`,
  confluenceToolSchemas.setSpacePermissions,
  async ({ spaceKey, permissions }) => {
    const result = await confluenceService.setSpacePermissions(spaceKey, permissions);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getAnonymousSpacePermissions',
  `Get the permissions granted to the anonymous user in a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getAnonymousSpacePermissions,
  async ({ spaceKey }) => {
    const result = await confluenceService.getAnonymousSpacePermissions(spaceKey);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getGroupSpacePermissions',
  `Get the permissions granted to a group in a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getGroupSpacePermissions,
  async ({ spaceKey, groupName }) => {
    const result = await confluenceService.getGroupSpacePermissions(spaceKey, groupName);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getUserSpacePermissions',
  `Get the permissions granted to a user in a space in ${confluenceInstanceType}`,
  confluenceToolSchemas.getUserSpacePermissions,
  async ({ spaceKey, userKey }) => {
    const result = await confluenceService.getUserSpacePermissions(spaceKey, userKey);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_grantAnonymousSpacePermissions',
  `Grant space permissions to the anonymous user in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
  confluenceToolSchemas.grantAnonymousSpacePermissions,
  async ({ spaceKey, operations }) => {
    const result = await confluenceService.grantAnonymousSpacePermissions(spaceKey, operations);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_grantGroupSpacePermissions',
  `Grant space permissions to a group in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
  confluenceToolSchemas.grantGroupSpacePermissions,
  async ({ spaceKey, groupName, operations }) => {
    const result = await confluenceService.grantGroupSpacePermissions(spaceKey, groupName, operations);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_grantUserSpacePermissions',
  `Grant space permissions to a user in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
  confluenceToolSchemas.grantUserSpacePermissions,
  async ({ spaceKey, userKey, operations }) => {
    const result = await confluenceService.grantUserSpacePermissions(spaceKey, userKey, operations);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_revokeAnonymousSpacePermissions',
  `Revoke space permissions from the anonymous user in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
  confluenceToolSchemas.revokeAnonymousSpacePermissions,
  async ({ spaceKey, operations }) => {
    const result = await confluenceService.revokeAnonymousSpacePermissions(spaceKey, operations);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_revokeGroupSpacePermissions',
  `Revoke space permissions from a group in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
  confluenceToolSchemas.revokeGroupSpacePermissions,
  async ({ spaceKey, groupName, operations }) => {
    const result = await confluenceService.revokeGroupSpacePermissions(spaceKey, groupName, operations);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_revokeUserSpacePermissions',
  `Revoke space permissions from a user in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
  confluenceToolSchemas.revokeUserSpacePermissions,
  async ({ spaceKey, userKey, operations }) => {
    const result = await confluenceService.revokeUserSpacePermissions(spaceKey, userKey, operations);

    return formatToolResponse(result);
  },
);

// Add Confluence users and groups tools
server.tool(
  'confluence_getCurrentUser',
  `Get information about the current logged in user in ${confluenceInstanceType}`,
  confluenceToolSchemas.getCurrentUser,
  async ({ expand }) => {
    const result = await confluenceService.getCurrentUser(expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getAnonymousUser',
  `Get information about how the anonymous user is represented in ${confluenceInstanceType}`,
  confluenceToolSchemas.getAnonymousUser,
  async ({ expand }) => {
    const result = await confluenceService.getAnonymousUser(expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getUser',
  `Get a user by user key or username in ${confluenceInstanceType}`,
  confluenceToolSchemas.getUser,
  async ({ key, username, expand }) => {
    const result = await confluenceService.getUser(key, username, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getUsers',
  `Get a paginated collection of all registered users in ${confluenceInstanceType}`,
  confluenceToolSchemas.getUsers,
  async ({ limit, start, expand }) => {
    const result = await confluenceService.getUsers(limit, start, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getUserGroups',
  `Get the groups a user is a member of in ${confluenceInstanceType}`,
  confluenceToolSchemas.getUserGroups,
  async ({ key, username, limit, start, expand }) => {
    const result = await confluenceService.getUserGroups(key, username, limit, start, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateCurrentUser',
  `Update the current user's full name and/or email in ${confluenceInstanceType}`,
  confluenceToolSchemas.updateCurrentUser,
  async ({ fullName, email, currentPassword }) => {
    const result = await confluenceService.updateCurrentUser(fullName, email, currentPassword);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_changeCurrentUserPassword',
  `Change the password for the current user in ${confluenceInstanceType}`,
  confluenceToolSchemas.changeCurrentUserPassword,
  async ({ newPassword, oldPassword }) => {
    const result = await confluenceService.changeCurrentUserPassword(newPassword, oldPassword);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getGroup',
  `Get a user group by name in ${confluenceInstanceType}`,
  confluenceToolSchemas.getGroup,
  async ({ groupName, expand }) => {
    const result = await confluenceService.getGroup(groupName, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getGroups',
  `Get a paginated collection of all user groups in ${confluenceInstanceType}`,
  confluenceToolSchemas.getGroups,
  async ({ limit, start, expand }) => {
    const result = await confluenceService.getGroups(limit, start, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getGroupMembers',
  `Get the users that are members of a group in ${confluenceInstanceType}`,
  confluenceToolSchemas.getGroupMembers,
  async ({ groupName, limit, start, expand }) => {
    const result = await confluenceService.getGroupMembers(groupName, limit, start, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getNestedGroupMembers',
  `Get the groups nested directly within a group in ${confluenceInstanceType}`,
  confluenceToolSchemas.getNestedGroupMembers,
  async ({ groupName, limit, start, expand }) => {
    const result = await confluenceService.getNestedGroupMembers(groupName, limit, start, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_addUserToGroup',
  `Add a user to a group in ${confluenceInstanceType}. Idempotent.`,
  confluenceToolSchemas.addUserToGroup,
  async ({ username, groupName }) => {
    const result = await confluenceService.addUserToGroup(username, groupName);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_removeUserFromGroup',
  `Remove a user from a group in ${confluenceInstanceType}. Idempotent.`,
  confluenceToolSchemas.removeUserFromGroup,
  async ({ username, groupName }) => {
    const result = await confluenceService.removeUserFromGroup(username, groupName);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminCreateUser',
  `Create a new user in ${confluenceInstanceType}. Requires system administrator permission.`,
  confluenceToolSchemas.adminCreateUser,
  async ({ userName, fullName, email, password, notifyViaEmail }) => {
    const result = await confluenceService.adminCreateUser(userName, fullName, email, password, notifyViaEmail);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminUpdateUser',
  `Update a user's full name and/or email in ${confluenceInstanceType}. Requires system administrator permission.`,
  confluenceToolSchemas.adminUpdateUser,
  async ({ username, fullName, email }) => {
    const result = await confluenceService.adminUpdateUser(username, fullName, email);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminDeleteUser',
  `Delete a user in ${confluenceInstanceType}. Requires system administrator permission. Runs asynchronously.`,
  confluenceToolSchemas.adminDeleteUser,
  async ({ username }) => {
    const result = await confluenceService.adminDeleteUser(username);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminDisableUser',
  `Disable a user in ${confluenceInstanceType}. Requires system administrator permission. Idempotent.`,
  confluenceToolSchemas.adminDisableUser,
  async ({ username }) => {
    const result = await confluenceService.adminDisableUser(username);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminEnableUser',
  `Enable a user in ${confluenceInstanceType}. Requires system administrator permission. Idempotent.`,
  confluenceToolSchemas.adminEnableUser,
  async ({ username }) => {
    const result = await confluenceService.adminEnableUser(username);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminChangeUserPassword',
  `Change another user's password in ${confluenceInstanceType}. Requires system administrator permission.`,
  confluenceToolSchemas.adminChangeUserPassword,
  async ({ username, password }) => {
    const result = await confluenceService.adminChangeUserPassword(username, password);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminCreateGroup',
  `Create a new user group in ${confluenceInstanceType}. Requires system administrator permission.`,
  confluenceToolSchemas.adminCreateGroup,
  async ({ name }) => {
    const result = await confluenceService.adminCreateGroup(name);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminDeleteGroup',
  `Delete a user group in ${confluenceInstanceType}. Requires system administrator permission.`,
  confluenceToolSchemas.adminDeleteGroup,
  async ({ groupName }) => {
    const result = await confluenceService.adminDeleteGroup(groupName);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_adminGetActiveUsers',
  `Get a paginated collection of active (license-counting) users in ${confluenceInstanceType}`,
  confluenceToolSchemas.adminGetActiveUsers,
  async ({ limit, start, expand }) => {
    const result = await confluenceService.adminGetActiveUsers(limit, start, expand);

    return formatToolResponse(result);
  },
);

// Add Confluence blueprint/template draft-publishing tools
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
    const result = await confluenceService.publishBlueprintSharedDraft(draftId, contentObj, expand);

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
    const result = await confluenceService.publishBlueprintLegacyDraft(draftId, contentObj, expand);

    return formatToolResponse(result);
  },
);

// Add Confluence content body conversion tool
server.tool(
  'confluence_convertContentBody',
  `Convert a content body between representations (e.g. storage to view) in ${confluenceInstanceType}`,
  confluenceToolSchemas.convertContentBody,
  async ({ to, value, representation, expand }) => {
    const result = await confluenceService.convertContentBody(to, value, representation, expand);

    return formatToolResponse(result);
  },
);

// Add Confluence webhook tools
server.tool(
  'confluence_findWebhooks',
  `Find webhooks in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.findWebhooks,
  async ({ limit, start, event, statistics }) => {
    const result = await confluenceService.findWebhooks(limit, start, event, statistics);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_createWebhook',
  `Create a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.createWebhook,
  async ({ name, url, events, active, secret }) => {
    const result = await confluenceService.createWebhook({
      name,
      url,
      events,
      active,
      configuration: secret ? { secret } : undefined,
    });

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getWebhook',
  `Get a webhook by ID in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.getWebhook,
  async ({ webhookId, statistics }) => {
    const result = await confluenceService.getWebhook(webhookId, statistics);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_updateWebhook',
  `Update an existing webhook in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.updateWebhook,
  async ({ webhookId, name, url, events, active, secret }) => {
    const result = await confluenceService.updateWebhook(webhookId, {
      name,
      url,
      events,
      active,
      configuration: secret ? { secret } : undefined,
    });

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_deleteWebhook',
  `Delete a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.deleteWebhook,
  async ({ webhookId }) => {
    const result = await confluenceService.deleteWebhook(webhookId);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getWebhookLatestInvocation',
  `Get the latest invocation of a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.getWebhookLatestInvocation,
  async ({ webhookId, outcomes, event }) => {
    const result = await confluenceService.getWebhookLatestInvocation(webhookId, outcomes, event);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getWebhookStatistics',
  `Get invocation statistics for a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.getWebhookStatistics,
  async ({ webhookId, event }) => {
    const result = await confluenceService.getWebhookStatistics(webhookId, event);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getWebhookStatisticsSummary',
  `Get the invocation statistics summary for a webhook in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.getWebhookStatisticsSummary,
  async ({ webhookId }) => {
    const result = await confluenceService.getWebhookStatisticsSummary(webhookId);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_testWebhook',
  `Test connectivity to a webhook endpoint URL in ${confluenceInstanceType}. Requires administrator permission.`,
  confluenceToolSchemas.testWebhook,
  async ({ url }) => {
    const result = await confluenceService.testWebhook(url);

    return formatToolResponse(result);
  },
);

// Add Confluence server administration tool
server.tool(
  'confluence_getServerInfo',
  `Get build/version information about the ${confluenceInstanceType}`,
  confluenceToolSchemas.getServerInfo,
  async () => {
    const result = await confluenceService.getServerInfo();

    return formatToolResponse(result);
  },
);

// Add Confluence cluster administration tool
server.tool(
  'confluence_getClusterNodes',
  `Get the status of each node in a ${confluenceInstanceType}'s cluster. Requires permission to view cluster information.`,
  confluenceToolSchemas.getClusterNodes,
  async ({ limit, start }) => {
    const result = await confluenceService.getClusterNodes(limit, start);

    return formatToolResponse(result);
  },
);

// Add Confluence long-running task tools
server.tool(
  'confluence_getLongRunningTask',
  `Get information about a single long-running background task (e.g. space export, reindex) in ${confluenceInstanceType}`,
  confluenceToolSchemas.getLongRunningTask,
  async ({ id, expand }) => {
    const result = await confluenceService.getLongRunningTask(id, expand);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getLongRunningTasks',
  `Get all tracked long-running background tasks (e.g. space export, reindex) in ${confluenceInstanceType}`,
  confluenceToolSchemas.getLongRunningTasks,
  async ({ expand, limit, start }) => {
    const result = await confluenceService.getLongRunningTasks(expand, limit, start);

    return formatToolResponse(result);
  },
);

// Add Confluence backup/restore and instance metrics tools
server.tool(
  'confluence_triggerSiteBackup',
  `Start a new site backup job in ${confluenceInstanceType}. Requires permission to create site backups.`,
  confluenceToolSchemas.triggerSiteBackup,
  async ({ settings }) => {
    const result = await confluenceService.triggerSiteBackup(settings);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getBackupRestoreJob',
  `Get a backup/restore job by ID in ${confluenceInstanceType}. Caller must be a system administrator or the job's owner.`,
  confluenceToolSchemas.getBackupRestoreJob,
  async ({ jobId }) => {
    const result = await confluenceService.getBackupRestoreJob(jobId);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_findBackupRestoreJobs',
  `Find backup/restore jobs visible to the calling user in ${confluenceInstanceType}, optionally filtered`,
  confluenceToolSchemas.findBackupRestoreJobs,
  async ({ owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit, jobScope }) => {
    const result = await confluenceService.findBackupRestoreJobs(owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit, jobScope);

    return formatToolResponse(result);
  },
);

server.tool(
  'confluence_getInstanceMetrics',
  `Get simple metrics about the ${confluenceInstanceType} (e.g. content and user counts)`,
  confluenceToolSchemas.getInstanceMetrics,
  async () => {
    const result = await confluenceService.getInstanceMetrics();

    return formatToolResponse(result);
  },
);

server.registerResource(
  'confluence-page',
  new ResourceTemplate('confluence://page/{pageId}', { list: undefined }),
  {
    title: 'Confluence page',
    description: `A content item (page, blog post, ...) in ${confluenceInstanceType}, addressable by its content ID (e.g. confluence://page/123456).`,
    mimeType: 'application/json',
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
  },
);

server.registerPrompt(
  'confluence_buildCqlQuery',
  {
    title: 'Build a CQL query for Confluence search',
    description: `Turns a natural-language content request into a valid CQL (Confluence Query Language) query for confluence_searchContent in ${confluenceInstanceType}.`,
    argsSchema: {
      request: z.string().describe(
        'A natural-language description of what to find, e.g. \'pages about onboarding updated in the last month in the ENG space\'',
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
  }),
);

await connectServer(server);
