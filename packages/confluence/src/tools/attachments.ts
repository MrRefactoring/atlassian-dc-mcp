import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse, registerAnnotatedTool } from 'datacenter-mcp-core';
import { confluenceInstanceType } from '../constants.js';
import { confluenceToolSchemas } from '../confluenceService.js';
import type { ConfluenceService } from '../confluenceService.js';

export function registerAttachmentTools(server: McpServer, service: ConfluenceService) {
  registerAnnotatedTool(server,
    'confluence_get_attachments',
    {
      description: `Get the attachments on a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.getAttachments,
    },
    async ({ contentId, expand, filename, limit, start, mediaType }) => {
      const result = await service.getAttachments(contentId, expand, filename, limit, start, mediaType);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_remove_attachment',
    {
      description: `Remove an attachment from a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.removeAttachment,
    },
    async ({ attachmentId, contentId }) => {
      const result = await service.removeAttachment(attachmentId, contentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_create_attachment',
    {
      description: `Upload a new attachment to a piece of content in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.createAttachment,
    },
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

  registerAnnotatedTool(server,
    'confluence_update_attachment_meta',
    {
      description: `Update an attachment's metadata (filename, media type, comment) in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.updateAttachmentMeta,
    },
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

  registerAnnotatedTool(server,
    'confluence_update_attachment_data',
    {
      description: `Replace the binary data of an attachment in ${confluenceInstanceType}, adding a new version`,
      inputSchema: confluenceToolSchemas.updateAttachmentData,
    },
    async ({ contentId, attachmentId, fileName, contentBase64, comment, minorEdit }) => {
      const result = await service.updateAttachmentData(contentId, attachmentId, fileName, contentBase64, comment, minorEdit);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_move_attachment',
    {
      description: `Move an attachment to a different content entity in ${confluenceInstanceType}, optionally renaming it`,
      inputSchema: confluenceToolSchemas.moveAttachment,
    },
    async ({ contentId, attachmentId, newContentId, newName }) => {
      const result = await service.moveAttachment(contentId, attachmentId, newContentId, newName);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_delete_attachment',
    {
      description: `Delete an attachment from ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteAttachment,
    },
    async ({ contentId, attachmentId }) => {
      const result = await service.deleteAttachment(contentId, attachmentId);

      return formatToolResponse(result);
    },
  );

  registerAnnotatedTool(server,
    'confluence_delete_attachment_version',
    {
      description: `Delete a specific version of an attachment in ${confluenceInstanceType}`,
      inputSchema: confluenceToolSchemas.deleteAttachmentVersion,
    },
    async ({ contentId, attachmentId, version }) => {
      const result = await service.deleteAttachmentVersion(contentId, attachmentId, version);

      return formatToolResponse(result);
    },
  );
}
