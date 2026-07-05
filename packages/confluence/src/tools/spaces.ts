import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService, ConfluenceSpace } from '../confluenceService.js';

export function registerSpaceTools(server: McpServer, service: ConfluenceService) {
  server.registerTool('confluence_searchSpace',
    {
      description: `Search for spaces in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.searchSpaces,
    },
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

  server.registerTool(
    'confluence_getSpace',
    {
      description: `Get information about a single space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getSpace,
    },
    async ({ spaceKey, expand }) => {
      const result = await service.getSpace(spaceKey, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getSpaces',
    {
      description: `List spaces with optional filters in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getSpaces,
    },
    async ({ spaceKey, type, status, label, favourite, expand, limit, start }) => {
      const result = await service.getSpaces(spaceKey, type, status, label, favourite, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_createSpace',
    {
      description: `Create a new space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.createSpace,
    },
    async ({ key, name, description, isPrivate }) => {
      const spaceBody: ConfluenceSpace = { key, name };
      if (description) {
        spaceBody.description = { plain: { value: description, representation: 'plain' } };
      }
      const result = await service.createSpace(spaceBody, isPrivate);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_updateSpace',
    {
      description: `Update a space's name and description in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateSpace,
    },
    async ({ spaceKey, name, description }) => {
      const spaceBody: ConfluenceSpace = { key: spaceKey, name };
      if (description) {
        spaceBody.description = { plain: { value: description, representation: 'plain' } };
      }
      const result = await service.updateSpace(spaceKey, spaceBody);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_deleteSpace',
    {
      description: `Delete a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteSpace,
    },
    async ({ spaceKey }) => {
      const result = await service.deleteSpace(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getSpaceContent',
    {
      description: `Get the content in a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getSpaceContent,
    },
    async ({ spaceKey, type, expand, depth, limit, start }) => {
      const result = await service.getSpaceContent(spaceKey, type, expand, depth, limit, start);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_archiveSpace',
    {
      description: `Archive a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.archiveSpace,
    },
    async ({ spaceKey }) => {
      const result = await service.archiveSpace(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_restoreSpace',
    {
      description: `Restore an archived space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.restoreSpace,
    },
    async ({ spaceKey }) => {
      const result = await service.restoreSpace(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getSpaceProperties',
    {
      description: `Get the properties stored on a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getSpaceProperties,
    },
    async ({ spaceKey, expand, limit, start }) => {
      const result = await service.getSpaceProperties(spaceKey, expand, limit, start);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getSpaceProperty',
    {
      description: `Get a single space property by key in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getSpaceProperty,
    },
    async ({ spaceKey, key, expand }) => {
      const result = await service.getSpaceProperty(spaceKey, key, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_createSpaceProperty',
    {
      description: `Create a space property in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.createSpaceProperty,
    },
    async ({ spaceKey, key, value }) => {
      const result = await service.createSpaceProperty(spaceKey, key, value);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_updateSpaceProperty',
    {
      description: `Update a space property in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateSpaceProperty,
    },
    async ({ spaceKey, key, value, version }) => {
      const result = await service.updateSpaceProperty(spaceKey, key, value, version);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_deleteSpaceProperty',
    {
      description: `Delete a space property in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteSpaceProperty,
    },
    async ({ spaceKey, key }) => {
      const result = await service.deleteSpaceProperty(spaceKey, key);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getAllSpacePermissions',
    {
      description: `Get all permissions granted to users, groups and the anonymous user in a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getAllSpacePermissions,
    },
    async ({ spaceKey }) => {
      const result = await service.getAllSpacePermissions(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_setSpacePermissions',
    {
      description: `Set the full permission set for up to 40 users/groups/anonymous user in a space in ${confluenceInstanceType}. Replaces each listed subject's existing permissions.`,
      inputSchema: confluenceToolSchemas.setSpacePermissions,
    },
    async ({ spaceKey, permissions }) => {
      const result = await service.setSpacePermissions(spaceKey, permissions);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getAnonymousSpacePermissions',
    {
      description: `Get the permissions granted to the anonymous user in a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getAnonymousSpacePermissions,
    },
    async ({ spaceKey }) => {
      const result = await service.getAnonymousSpacePermissions(spaceKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getGroupSpacePermissions',
    {
      description: `Get the permissions granted to a group in a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getGroupSpacePermissions,
    },
    async ({ spaceKey, groupName }) => {
      const result = await service.getGroupSpacePermissions(spaceKey, groupName);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_getUserSpacePermissions',
    {
      description: `Get the permissions granted to a user in a space in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getUserSpacePermissions,
    },
    async ({ spaceKey, userKey }) => {
      const result = await service.getUserSpacePermissions(spaceKey, userKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_grantAnonymousSpacePermissions',
    {
      description: `Grant space permissions to the anonymous user in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
      inputSchema: confluenceToolSchemas.grantAnonymousSpacePermissions,
    },
    async ({ spaceKey, operations }) => {
      const result = await service.grantAnonymousSpacePermissions(spaceKey, operations);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_grantGroupSpacePermissions',
    {
      description: `Grant space permissions to a group in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
      inputSchema: confluenceToolSchemas.grantGroupSpacePermissions,
    },
    async ({ spaceKey, groupName, operations }) => {
      const result = await service.grantGroupSpacePermissions(spaceKey, groupName, operations);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_grantUserSpacePermissions',
    {
      description: `Grant space permissions to a user in ${confluenceInstanceType}. Adds to existing permissions; does not override them.`,
      inputSchema: confluenceToolSchemas.grantUserSpacePermissions,
    },
    async ({ spaceKey, userKey, operations }) => {
      const result = await service.grantUserSpacePermissions(spaceKey, userKey, operations);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_revokeAnonymousSpacePermissions',
    {
      description: `Revoke space permissions from the anonymous user in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
      inputSchema: confluenceToolSchemas.revokeAnonymousSpacePermissions,
    },
    async ({ spaceKey, operations }) => {
      const result = await service.revokeAnonymousSpacePermissions(spaceKey, operations);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_revokeGroupSpacePermissions',
    {
      description: `Revoke space permissions from a group in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
      inputSchema: confluenceToolSchemas.revokeGroupSpacePermissions,
    },
    async ({ spaceKey, groupName, operations }) => {
      const result = await service.revokeGroupSpacePermissions(spaceKey, groupName, operations);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'confluence_revokeUserSpacePermissions',
    {
      description: `Revoke space permissions from a user in ${confluenceInstanceType}. Permissions not currently held are silently skipped.`,
      inputSchema: confluenceToolSchemas.revokeUserSpacePermissions,
    },
    async ({ spaceKey, userKey, operations }) => {
      const result = await service.revokeUserSpacePermissions(spaceKey, userKey, operations);

      return formatToolResponse(result);
    },
  );
}
