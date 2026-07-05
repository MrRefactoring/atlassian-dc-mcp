import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerAttachmentTools(server: McpServer, service: ConfluenceService) {
  server.tool(
    'confluence_getAttachments',
    `Get the attachments on a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.getAttachments,
    async ({ contentId, expand, filename, limit, start, mediaType }) => {
      const result = await service.getAttachments(contentId, expand, filename, limit, start, mediaType);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_removeAttachment',
    `Remove an attachment from a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.removeAttachment,
    async ({ attachmentId, contentId }) => {
      const result = await service.removeAttachment(attachmentId, contentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_createAttachment',
    `Upload a new attachment to a piece of content in ${confluenceInstanceType}`,
    confluenceToolSchemas.createAttachment,
    async ({ contentId, fileName, contentBase64, comment, minorEdit, hidden, allowDuplicated, status, expand }) => {
      const result = await service.createAttachment(
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
      const result = await service.updateAttachmentMeta(
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
      const result = await service.updateAttachmentData(contentId, attachmentId, fileName, contentBase64, comment, minorEdit);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_moveAttachment',
    `Move an attachment to a different content entity in ${confluenceInstanceType}, optionally renaming it`,
    confluenceToolSchemas.moveAttachment,
    async ({ contentId, attachmentId, newContentId, newName }) => {
      const result = await service.moveAttachment(contentId, attachmentId, newContentId, newName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteAttachment',
    `Delete an attachment from ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteAttachment,
    async ({ contentId, attachmentId }) => {
      const result = await service.deleteAttachment(contentId, attachmentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'confluence_deleteAttachmentVersion',
    `Delete a specific version of an attachment in ${confluenceInstanceType}`,
    confluenceToolSchemas.deleteAttachmentVersion,
    async ({ contentId, attachmentId, version }) => {
      const result = await service.deleteAttachmentVersion(contentId, attachmentId, version);

      return formatToolResponse(result);
    },
  );
}
