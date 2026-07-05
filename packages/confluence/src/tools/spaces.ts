import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService, ConfluenceSpace } from '../confluenceService.js';

export function registerSpaceTools(server: McpServer, service: ConfluenceService) {
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
      const result = await service.searchSpaces(searchText, limit, start, expand, excerpt);

      return formatToolResponse(result);
    });

  server.tool(
    'confluence_getSpace',
    `Get information about a single space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getSpace,
    async ({ spaceKey, expand }) => {
      const result = await service.getSpace(spaceKey, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getSpaces',
    `List spaces with optional filters in ${confluenceInstanceType}`,
    confluenceToolSchemas.getSpaces,
    async ({ spaceKey, type, status, label, favourite, expand, limit, start }) => {
      const result = await service.getSpaces(spaceKey, type, status, label, favourite, expand, limit, start);

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
      const result = await service.createSpace(spaceBody, isPrivate);

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
      const result = await service.updateSpace(spaceKey, spaceBody);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteSpace',
    `Delete a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteSpace,
    async ({ spaceKey }) => {
      const result = await service.deleteSpace(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getSpaceContent',
    `Get the content in a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getSpaceContent,
    async ({ spaceKey, type, expand, depth, limit, start }) => {
      const result = await service.getSpaceContent(spaceKey, type, expand, depth, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_archiveSpace',
    `Archive a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.archiveSpace,
    async ({ spaceKey }) => {
      const result = await service.archiveSpace(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_restoreSpace',
    `Restore an archived space in ${confluenceInstanceType}`,
    confluenceToolSchemas.restoreSpace,
    async ({ spaceKey }) => {
      const result = await service.restoreSpace(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getSpaceProperties',
    `Get the properties stored on a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getSpaceProperties,
    async ({ spaceKey, expand, limit, start }) => {
      const result = await service.getSpaceProperties(spaceKey, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getSpaceProperty',
    `Get a single space property by key in ${confluenceInstanceType}`,
    confluenceToolSchemas.getSpaceProperty,
    async ({ spaceKey, key, expand }) => {
      const result = await service.getSpaceProperty(spaceKey, key, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_createSpaceProperty',
    `Create a space property in ${confluenceInstanceType}`,
    confluenceToolSchemas.createSpaceProperty,
    async ({ spaceKey, key, value }) => {
      const result = await service.createSpaceProperty(spaceKey, key, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_updateSpaceProperty',
    `Update a space property in ${confluenceInstanceType}`,
    confluenceToolSchemas.updateSpaceProperty,
    async ({ spaceKey, key, value, version }) => {
      const result = await service.updateSpaceProperty(spaceKey, key, value, version);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteSpaceProperty',
    `Delete a space property in ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteSpaceProperty,
    async ({ spaceKey, key }) => {
      const result = await service.deleteSpaceProperty(spaceKey, key);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getAllSpacePermissions',
    `Get all permissions granted to users, groups and the anonymous user in a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getAllSpacePermissions,
    async ({ spaceKey }) => {
      const result = await service.getAllSpacePermissions(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_setSpacePermissions',
    `Set the full permission set for up to 40 users/groups/anonymous user in a space in ${confluenceInstanceType}. Replaces each listed subject's existing permissions.`,
    confluenceToolSchemas.setSpacePermissions,
    async ({ spaceKey, permissions }) => {
      const result = await service.setSpacePermissions(spaceKey, permissions);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getAnonymousSpacePermissions',
    `Get the permissions granted to the anonymous user in a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getAnonymousSpacePermissions,
    async ({ spaceKey }) => {
      const result = await service.getAnonymousSpacePermissions(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getGroupSpacePermissions',
    `Get the permissions granted to a group in a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getGroupSpacePermissions,
    async ({ spaceKey, groupName }) => {
      const result = await service.getGroupSpacePermissions(spaceKey, groupName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_getUserSpacePermissions',
    `Get the permissions granted to a user in a space in ${confluenceInstanceType}`,
    confluenceToolSchemas.getUserSpacePermissions,
    async ({ spaceKey, userKey }) => {
      const result = await service.getUserSpacePermissions(spaceKey, userKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_grantAnonymousSpacePermissions',
    `Grant space permissions to the anonymous user in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
    confluenceToolSchemas.grantAnonymousSpacePermissions,
    async ({ spaceKey, operations }) => {
      const result = await service.grantAnonymousSpacePermissions(spaceKey, operations);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_grantGroupSpacePermissions',
    `Grant space permissions to a group in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
    confluenceToolSchemas.grantGroupSpacePermissions,
    async ({ spaceKey, groupName, operations }) => {
      const result = await service.grantGroupSpacePermissions(spaceKey, groupName, operations);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_grantUserSpacePermissions',
    `Grant space permissions to a user in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
    confluenceToolSchemas.grantUserSpacePermissions,
    async ({ spaceKey, userKey, operations }) => {
      const result = await service.grantUserSpacePermissions(spaceKey, userKey, operations);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_revokeAnonymousSpacePermissions',
    `Revoke space permissions from the anonymous user in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
    confluenceToolSchemas.revokeAnonymousSpacePermissions,
    async ({ spaceKey, operations }) => {
      const result = await service.revokeAnonymousSpacePermissions(spaceKey, operations);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_revokeGroupSpacePermissions',
    `Revoke space permissions from a group in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
    confluenceToolSchemas.revokeGroupSpacePermissions,
    async ({ spaceKey, groupName, operations }) => {
      const result = await service.revokeGroupSpacePermissions(spaceKey, groupName, operations);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_revokeUserSpacePermissions',
    `Revoke space permissions from a user in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
    confluenceToolSchemas.revokeUserSpacePermissions,
    async ({ spaceKey, userKey, operations }) => {
      const result = await service.revokeUserSpacePermissions(spaceKey, userKey, operations);

      return formatToolResponse(result);
    },
  );
}
