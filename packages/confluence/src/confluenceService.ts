import { z } from 'zod';
import { AdminGroupService, AdminUserService, AdminUsersService, AttachmentsService, BackupAndRestoreService, ChildContentService, ClusterInformationService, ContentBlueprintService, ContentBodyService, ContentDescendantService, ContentLabelsService, ContentPropertyService, ContentResourceService, ContentRestrictionsService, ContentWatchersService, GroupService, InstanceMetricsService, LongTaskService, OpenAPI, SearchService, ServerInformationService, SpacePermissionsService, SpaceService, SpacePropertyService, UserGroupService, UserService, UserWatchService, WebhooksService } from './confluenceClient/index.js';
import type { Content, MockAttachmentRequest } from './confluenceClient/index.js';
import { handleApiOperation, resolveOpenApiBase } from 'datacenter-mcp-core';
import { CONFLUENCE_PRODUCT, getDefaultPageSize, getMissingConfig } from './config.js';
import type { ConfluenceBodyMode } from './confluenceResponseMapper.js';
import { shapeConfluenceContent } from './confluenceResponseMapper.js';

/**
 * Escapes user input for safe use inside a CQL quoted string.
 * Escapes backslash first, then double quote, so that neither can break out of the phrase.
 * Only call once per value; double-escaping would over-escape and break the query.
 */
export function escapeSearchTextForCql(searchText: string): string {
  return searchText.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export interface ConfluenceContent {
  id?: string;
  type: string;
  title: string;
  status?: string;
  space: {
    key: string;
  };
  body?: {
    storage: {
      value: string;
      representation: 'storage';
    };
  };
  version?: {
    number: number;
    message?: string;
  };
  ancestors?: Array<{ id: string }>;
}

export interface ConfluenceSpace {
  key?: string;
  name?: string;
  description?: {
    plain: {
      value: string;
      representation: 'plain';
    };
  };
}

export interface OperationDescriptionInput {
  targetType: string;
  operationKey: string;
}

export interface SpacePermissionsForSubjectInput {
  userKey?: string;
  groupName?: string;
  operations?: OperationDescriptionInput[];
}

export interface WebhookInput {
  name: string;
  url: string;
  events: string[];
  active?: boolean;
  configuration?: {
    secret?: string;
  };
}

function resolveCredential(value: string | (() => string | undefined) | undefined) {
  return async () => {
    const resolved = typeof value === 'function' ? value() : value;

    return resolved ?? '';
  };
}

export class ConfluenceService {
  private readonly getPageSize: () => number;

  constructor(
    host: string | undefined,
    token: string | (() => string | undefined),
    apiBasePath?: string,
    getPageSize: () => number = getDefaultPageSize,
    username?: string | (() => string | undefined),
    password?: string | (() => string | undefined),
  ) {
    OpenAPI.BASE = resolveOpenApiBase({
      host,
      apiBasePath,
      defaultBasePath: CONFLUENCE_PRODUCT.defaultApiBasePath ?? '',
      strippableSuffixes: CONFLUENCE_PRODUCT.apiBasePathStrippableSuffixes,
    });
    OpenAPI.TOKEN = resolveCredential(token);
    OpenAPI.USERNAME = resolveCredential(username);
    OpenAPI.PASSWORD = resolveCredential(password);
    OpenAPI.VERSION = '1.0';
    // Attachment endpoints (create/update/move) enforce XSRF protection and require this header on every request.
    OpenAPI.HEADERS = { 'X-Atlassian-Token': 'no-check' };
    this.getPageSize = getPageSize;
  }

  /**
   * Get a Confluence page by ID
   * @param contentId The ID of the page to retrieve
   * @param expand Optional comma-separated list of properties to expand
   */
  async getContentRaw(contentId: string, expand?: string) {
    const expandValue = expand || 'body.storage';
    const finalExpand = expand && !expand.includes('body.storage')
      ? `${expand},body.storage`
      : expandValue;

    return handleApiOperation(() => ContentResourceService.getContentById(contentId, finalExpand), 'Error getting content');
  }

  async getContent(
    contentId: string,
    expand?: string,
    bodyMode: ConfluenceBodyMode = 'storage',
    maxBodyChars?: number,
    bodyStart?: number,
  ) {
    const result = await this.getContentRaw(contentId, expand);
    if (result.success && result.data) {
      return {
        ...result,
        data: shapeConfluenceContent(result.data, bodyMode, { maxBodyChars, bodyStart }),
      };
    }

    return result;
  }

  /**
   * Search for content in Confluence using CQL
   * @param cql Confluence Query Language string
   * @param limit Maximum number of results to return
   * @param start Start index for pagination
   * @param expand Optional comma-separated list of properties to expand
   */
  async searchContent(cql: string, limit?: number, start?: number, expand?: string, excerpt: 'none' | 'highlight' = 'none') {
    return handleApiOperation(
      () => SearchService.search1(
        undefined,
        expand,
        undefined,
        (limit ?? this.getPageSize()).toString(),
        start?.toString(),
        excerpt,
        cql,
      ),
      'Error searching for content',
    );
  }

  /**
   * Create a new page in Confluence
   * @param content The content object to create
   */
  async createContent(content: ConfluenceContent) {
    return handleApiOperation(() => ContentResourceService.createContent(content), 'Error creating content');
  }

  /**
   * Update an existing page in Confluence
   * @param contentId The ID of the content to update
   * @param content The updated content object
   */
  async updateContent(contentId: string, content: ConfluenceContent) {
    return handleApiOperation(() => ContentResourceService.update2(contentId, content), 'Error updating content');
  }

  /**
   * Delete a piece of content. Without a status it moves current content to the trash;
   * pass status='trashed' to purge already-trashed content or status='draft' to delete a draft.
   * @param contentId The ID of the content to delete
   * @param status Optional content status selector
   */
  async deleteContent(contentId: string, status?: string) {
    return handleApiOperation(() => ContentResourceService.delete3(contentId, status), 'Error deleting content');
  }

  /**
   * Get the history (versions/contributors) of a piece of content.
   * @param contentId The ID of the content
   * @param expand Optional comma-separated list of properties to expand
   */
  async getContentHistory(contentId: string, expand?: string) {
    return handleApiOperation(() => ContentResourceService.getHistory(contentId, expand), 'Error getting content history');
  }

  /**
   * Get the direct children of a piece of content, keyed by child type.
   * @param contentId The ID of the parent content
   * @param expand Optional comma-separated list of properties to expand on the children
   * @param limit Maximum number of children to return
   * @param start Start index for pagination
   */
  async getContentChildren(contentId: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ChildContentService.children(contentId, expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content children',
    );
  }

  /**
   * Get the direct children of a piece of content limited to a single child type (page, comment, attachment).
   * @param contentId The ID of the parent content
   * @param type The child content type to filter on
   */
  async getContentChildrenByType(contentId: string, type: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ChildContentService.childrenOfType(contentId, type, expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content children by type',
    );
  }

  /**
   * Get the comments of a piece of content.
   * @param contentId The ID of the content
   * @param depth "" (root only, default) or "all"
   * @param location Optional comment location filter (inline, footer, resolved)
   */
  async getContentComments(contentId: string, expand?: string, depth?: string, limit?: number, start?: number, location?: string) {
    return handleApiOperation(
      () => ChildContentService.commentsOfContent(contentId, expand, depth, (limit ?? this.getPageSize()).toString(), start?.toString(), location),
      'Error getting content comments',
    );
  }

  /**
   * Get the descendants of a piece of content, keyed by content type.
   * @param contentId The ID of the content
   * @param expand Optional comma-separated list of properties to expand on the descendants
   */
  async getContentDescendants(contentId: string, expand?: string) {
    return handleApiOperation(
      () => ContentDescendantService.descendants(contentId, expand),
      'Error getting content descendants',
    );
  }

  /**
   * Get the descendants of a piece of content limited to a single content type.
   * @param contentId The ID of the content
   * @param type The content type to filter descendants on
   */
  async getContentDescendantsByType(contentId: string, type: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ContentDescendantService.descendantsOfType(contentId, type, expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content descendants by type',
    );
  }

  /**
   * Get the labels attached to a piece of content.
   * @param contentId The ID of the content
   * @param prefix Optional label prefix filter (global, my, team)
   */
  async getContentLabels(contentId: string, prefix?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ContentLabelsService.labels(contentId, prefix, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content labels',
    );
  }

  /**
   * Add one or more labels to a piece of content.
   * @param contentId The ID of the content
   * @param labels A list of labels ({ name, prefix? }) to add
   */
  async addContentLabels(contentId: string, labels: Array<{ name: string; prefix?: string }>) {
    return handleApiOperation(
      () => ContentLabelsService.addLabels(contentId, labels),
      'Error adding content labels',
    );
  }

  /**
   * Remove a single label from a piece of content (uses the query-param variant so labels
   * containing characters like "/" are handled safely).
   * @param contentId The ID of the content
   * @param name The name of the label to remove
   */
  async deleteContentLabel(contentId: string, name: string) {
    return handleApiOperation(
      () => ContentLabelsService.deleteLabelWithQueryParam(contentId, name),
      'Error deleting content label',
    );
  }

  /**
   * Get the paginated list of properties stored on a piece of content.
   * @param contentId The ID of the content
   */
  async getContentProperties(contentId: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ContentPropertyService.findAll(contentId, expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content properties',
    );
  }

  /**
   * Get a single content property by key.
   * @param contentId The ID of the content
   * @param key The property key
   */
  async getContentProperty(contentId: string, key: string, expand?: string) {
    return handleApiOperation(
      () => ContentPropertyService.findByKey(contentId, key, expand),
      'Error getting content property',
    );
  }

  /**
   * Create a new content property.
   * @param contentId The ID of the content
   * @param key The property key
   * @param value The JSON value to store
   */
  async createContentProperty(contentId: string, key: string, value: unknown) {
    return handleApiOperation(
      () => ContentPropertyService.create1(contentId, { key, value }),
      'Error creating content property',
    );
  }

  /**
   * Update an existing content property. The version number must be the current version + 1.
   * @param contentId The ID of the content
   * @param key The property key
   * @param value The new JSON value
   * @param version The new version number
   */
  async updateContentProperty(contentId: string, key: string, value: unknown, version: number) {
    return handleApiOperation(
      () => ContentPropertyService.update1(contentId, key, undefined, { key, value, version: { number: version } }),
      'Error updating content property',
    );
  }

  /**
   * Delete a content property by key.
   * @param contentId The ID of the content
   * @param key The property key
   */
  async deleteContentProperty(contentId: string, key: string) {
    return handleApiOperation(
      () => ContentPropertyService.delete2(contentId, key),
      'Error deleting content property',
    );
  }

  /**
   * Get all restrictions on a piece of content, grouped by operation.
   * @param contentId The ID of the content
   */
  async getContentRestrictions(contentId: string, expand?: string) {
    return handleApiOperation(
      () => ContentRestrictionsService.byOperation(contentId, expand),
      'Error getting content restrictions',
    );
  }

  /**
   * Get the restrictions on a piece of content for a single operation (read or update).
   * @param operationKey read or update
   * @param contentId The ID of the content
   */
  async getContentRestrictionsByOperation(operationKey: string, contentId: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ContentRestrictionsService.forOperation(operationKey, contentId, expand, limit?.toString(), start?.toString()),
      'Error getting content restrictions by operation',
    );
  }

  /**
   * Overwrite the restrictions on a piece of content. Each entry replaces the existing
   * restrictions for its operation; an empty user/group array clears that restriction.
   * @param contentId The ID of the content
   * @param restrictions The per-operation restrictions to set
   */
  async updateContentRestrictions(
    contentId: string,
    restrictions: Array<{ operation: string; restrictions: unknown }>,
    expand?: string,
    limit?: number,
    start?: number,
  ) {
    return handleApiOperation(
      () => ContentRestrictionsService.updateRestrictions(contentId, expand, limit?.toString(), start?.toString(), restrictions),
      'Error updating content restrictions',
    );
  }

  /**
   * Get the paginated list of users watching a piece of content.
   * Requires Confluence or Space administrator privileges.
   * @param contentId The ID of the content
   */
  async getContentWatchers(contentId: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ContentWatchersService.index(contentId, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content watchers',
    );
  }

  /**
   * Check whether a user is watching a piece of content. Defaults to the current user when
   * neither key nor username is provided.
   * @param contentId The ID of the content
   * @param key Optional user key
   * @param username Optional username
   */
  async isWatchingContent(contentId: string, key?: string, username?: string) {
    return handleApiOperation(
      () => UserWatchService.isWatchingContent(contentId, key, username),
      'Error checking content watch state',
    );
  }

  /**
   * Add a watcher to a piece of content. Defaults to the current user.
   * @param contentId The ID of the content
   * @param key Optional user key
   * @param username Optional username
   */
  async addContentWatcher(contentId: string, key?: string, username?: string) {
    return handleApiOperation(
      () => UserWatchService.addContentWatcher(contentId, key, username),
      'Error adding content watcher',
    );
  }

  /**
   * Remove a watcher from a piece of content. Defaults to the current user.
   * @param contentId The ID of the content
   * @param key Optional user key
   * @param username Optional username
   */
  async removeContentWatcher(contentId: string, key?: string, username?: string) {
    return handleApiOperation(
      () => UserWatchService.removeContentWatcher(contentId, key, username),
      'Error removing content watcher',
    );
  }

  /**
   * Get the attachments on a piece of content.
   * @param contentId The ID of the content the attachments are on
   * @param filename Optional exact filename filter
   * @param mediaType Optional media type filter
   */
  async getAttachments(contentId: string, expand?: string, filename?: string, limit?: number, start?: number, mediaType?: string) {
    return handleApiOperation(
      () => AttachmentsService.getAttachments(contentId, expand, filename, (limit ?? this.getPageSize()).toString(), start?.toString(), mediaType),
      'Error getting attachments',
    );
  }

  /**
   * Remove an attachment from a piece of content.
   * @param attachmentId The ID of the attachment to remove
   * @param contentId The ID of the content the attachment is on
   */
  async removeAttachment(attachmentId: string, contentId: string) {
    return handleApiOperation(
      () => AttachmentsService.removeAttachment(attachmentId, contentId),
      'Error removing attachment',
    );
  }

  /**
   * Search for spaces by text
   * @param searchText Text to search for in space names or descriptions
   * @param limit Maximum number of results to return
   * @param start Start index for pagination
   * @param expand Optional comma-separated list of properties to expand
   */
  async searchSpaces(
    searchText: string,
    limit?: number,
    start?: number,
    expand?: string,
    excerpt: 'none' | 'highlight' = 'none',
  ) {
    // Create a CQL query that searches for spaces
    // The correct syntax for space search is: type=space AND title ~ "searchText"
    const escapedSearchText = escapeSearchTextForCql(searchText);
    const cql = `type=space AND title ~ "${escapedSearchText}"`;

    return handleApiOperation(() => SearchService.search1(
      undefined,
      expand,
      undefined,
      (limit ?? this.getPageSize()).toString(),
      start?.toString(),
      excerpt,
      cql,
    ), 'Error searching for spaces');
  }

  /**
   * Get information about a single space by key.
   * @param spaceKey The key of the space
   * @param expand Optional comma-separated list of properties to expand
   */
  async getSpace(spaceKey: string, expand?: string) {
    return handleApiOperation(() => SpaceService.space(spaceKey, expand), 'Error getting space');
  }

  /**
   * List spaces with optional filters (type, status, label, favourite).
   * @param spaceKey Optional key to fetch a single space's information
   */
  async getSpaces(
    spaceKey?: string,
    type?: string,
    status?: string,
    label?: string,
    favourite?: boolean,
    expand?: string,
    limit?: number,
    start?: number,
  ) {
    return handleApiOperation(
      () => SpaceService.spaces(
        undefined,
        start?.toString(),
        label,
        favourite?.toString(),
        type,
        spaceKey,
        undefined,
        expand,
        undefined,
        (limit ?? this.getPageSize()).toString(),
        undefined,
        undefined,
        undefined,
        status,
      ),
      'Error getting spaces',
    );
  }

  /**
   * Create a new space. Set isPrivate to create a space viewable only by its creator.
   * @param space The space body ({ key, name, description? })
   * @param isPrivate Whether to create a private space
   */
  async createSpace(space: ConfluenceSpace, isPrivate = false) {
    return handleApiOperation(
      () => (isPrivate ? SpaceService.createPrivateSpace(space) : SpaceService.createSpace(space)),
      'Error creating space',
    );
  }

  /**
   * Upload a new attachment to a piece of content
   * @param contentId The ID of the content the attachment is on
   * @param fileName Name of the file being uploaded
   * @param contentBase64 Base64-encoded file content
   */
  async createAttachment(
    contentId: string,
    fileName: string,
    contentBase64: string,
    comment?: string,
    minorEdit?: boolean,
    hidden?: boolean,
    allowDuplicated?: boolean,
    status?: string,
    expand?: string,
  ) {
    return handleApiOperation(() => {
      const file = new File([Buffer.from(contentBase64, 'base64')], fileName);
      const formData = { file, comment, minorEdit, hidden } as unknown as MockAttachmentRequest;

      return AttachmentsService.createAttachments(
        contentId,
        expand,
        allowDuplicated ? 'true' : undefined,
        status,
        formData,
      );
    }, 'Error creating attachment');
  }

  /**
   * Update the non-binary metadata of an attachment (filename, media type, comment)
   * @param contentId The ID of the content the attachment is on
   * @param attachmentId The ID of the attachment to update
   * @param version New version number (must be incremented from the current one)
   */
  async updateAttachmentMeta(
    contentId: string,
    attachmentId: string,
    version: number,
    title?: string,
    versionComment?: string,
    mediaType?: string,
    comment?: string,
    minorEdit?: boolean,
  ) {
    const body: Content = {
      id: attachmentId,
      type: 'attachment',
      version: { number: version, message: versionComment, minorEdit },
      ...(title ? { title } : {}),
      ...(mediaType || comment ? { metadata: { mediaType, comment } } : {}),
    };

    return handleApiOperation(
      () => AttachmentsService.update(attachmentId, contentId, body),
      'Error updating attachment metadata',
    );
  }

  /**
   * Update a space's name and/or description.
   * @param spaceKey The key of the space to update
   * @param space The space body ({ name, description? })
   */
  async updateSpace(spaceKey: string, space: ConfluenceSpace) {
    return handleApiOperation(() => SpaceService.update4(spaceKey, space), 'Error updating space');
  }

  /**
   * Delete a space. Deletion runs as a long-running task; the response points to its status.
   * @param spaceKey The key of the space to delete
   */
  async deleteSpace(spaceKey: string) {
    return handleApiOperation(() => SpaceService.delete5(spaceKey), 'Error deleting space');
  }

  /**
   * Get the content in a space, optionally limited to a single content type (page or blogpost).
   * @param spaceKey The key of the space
   * @param type Optional content type filter (page, blogpost)
   * @param depth "all" (default) or "root" to return only top-level content
   */
  async getSpaceContent(spaceKey: string, type?: string, expand?: string, depth?: string, limit?: number, start?: number) {
    const limitValue = (limit ?? this.getPageSize()).toString();

    return handleApiOperation(
      () => (type
        ? SpaceService.contentsWithType1(spaceKey, type, expand, depth, limitValue, start?.toString())
        : SpaceService.contents(spaceKey, expand, depth, limitValue, start?.toString())),
      'Error getting space content',
    );
  }

  /**
   * Replace the binary data of an attachment, adding a new version
   * @param contentId The ID of the content the attachment is on
   * @param attachmentId The ID of the attachment to update
   * @param fileName Name of the new file being uploaded
   * @param contentBase64 Base64-encoded new file content
   */
  async updateAttachmentData(
    contentId: string,
    attachmentId: string,
    fileName: string,
    contentBase64: string,
    comment?: string,
    minorEdit?: boolean,
  ) {
    return handleApiOperation(() => {
      const file = new File([Buffer.from(contentBase64, 'base64')], fileName);
      const formData = { file, comment, minorEdit } as unknown as MockAttachmentRequest;

      return AttachmentsService.updateData(attachmentId, contentId, formData);
    }, 'Error updating attachment data');
  }

  /**
   * Move an attachment to a different content entity, optionally renaming it
   * @param contentId The ID of the content the attachment is currently on
   * @param attachmentId The ID of the attachment to move
   */
  async moveAttachment(contentId: string, attachmentId: string, newContentId?: string, newName?: string) {
    return handleApiOperation(
      () => AttachmentsService.move(attachmentId, contentId, newName, newContentId),
      'Error moving attachment',
    );
  }

  /**
   * Archive a space. Idempotent: archiving an already-archived space is a no-op.
   * @param spaceKey The key of the space to archive
   */
  async archiveSpace(spaceKey: string) {
    return handleApiOperation(() => SpaceService.archive(spaceKey), 'Error archiving space');
  }

  /**
   * Restore an archived space. Idempotent: restoring an already-current space is a no-op.
   * @param spaceKey The key of the space to restore
   */
  async restoreSpace(spaceKey: string) {
    return handleApiOperation(() => SpaceService.restore(spaceKey), 'Error restoring space');
  }

  /**
   * Get the paginated list of properties stored on a space.
   * @param spaceKey The key of the space
   */
  async getSpaceProperties(spaceKey: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => SpacePropertyService.get1(spaceKey, expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting space properties',
    );
  }

  /**
   * Delete an attachment
   * @param contentId The ID of the content the attachment is on
   * @param attachmentId The ID of the attachment to delete
   */
  async deleteAttachment(contentId: string, attachmentId: string) {
    return handleApiOperation(
      () => AttachmentsService.removeAttachment(attachmentId, contentId),
      'Error deleting attachment',
    );
  }

  /**
   * Get a single space property by key.
   * @param spaceKey The key of the space
   * @param key The property key
   */
  async getSpaceProperty(spaceKey: string, key: string, expand?: string) {
    return handleApiOperation(
      () => SpacePropertyService.get(spaceKey, key, expand),
      'Error getting space property',
    );
  }

  /**
   * Create a new space property.
   * @param spaceKey The key of the space
   * @param key The property key
   * @param value The JSON value to store
   */
  async createSpaceProperty(spaceKey: string, key: string, value: unknown) {
    return handleApiOperation(
      () => SpacePropertyService.create3(spaceKey, { key, value }),
      'Error creating space property',
    );
  }

  /**
   * Update an existing space property. The version number must be the current version + 1.
   * @param spaceKey The key of the space
   * @param key The property key
   * @param value The new JSON value
   * @param version The new version number
   */
  async updateSpaceProperty(spaceKey: string, key: string, value: unknown, version: number) {
    return handleApiOperation(
      () => SpacePropertyService.update3(spaceKey, key, { key, value, version: { number: version } }),
      'Error updating space property',
    );
  }

  /**
   * Delete a space property by key.
   * @param spaceKey The key of the space
   * @param key The property key
   */
  async deleteSpaceProperty(spaceKey: string, key: string) {
    return handleApiOperation(
      () => SpacePropertyService.delete4(spaceKey, key),
      'Error deleting space property',
    );
  }

  /**
   * Delete a specific version of an attachment
   * @param contentId The ID of the content the attachment is on
   * @param attachmentId The ID of the attachment
   * @param version The version number to delete
   */
  async deleteAttachmentVersion(contentId: string, attachmentId: string, version: number) {
    return handleApiOperation(
      () => AttachmentsService.removeAttachmentVersion(attachmentId, contentId, version),
      'Error deleting attachment version',
    );
  }

  /**
   * Get all space permissions granted to users, groups and the anonymous user in a space.
   * @param spaceKey The key of the space
   */
  async getAllSpacePermissions(spaceKey: string) {
    return handleApiOperation(
      () => SpacePermissionsService.getAllSpacePermissions(spaceKey),
      'Error getting space permissions',
    );
  }

  /**
   * Set the full permission set for multiple users/groups/anonymous user in a space.
   * Replaces each listed subject's existing permissions; subjects not mentioned are left untouched.
   * @param spaceKey The key of the space
   * @param permissions Up to 40 subjects, each with the full set of operations they should have
   */
  async setSpacePermissions(spaceKey: string, permissions: SpacePermissionsForSubjectInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.setPermissions1(spaceKey, permissions),
      'Error setting space permissions',
    );
  }

  /**
   * Get the permissions granted to the anonymous user in a space.
   * @param spaceKey The key of the space
   */
  async getAnonymousSpacePermissions(spaceKey: string) {
    return handleApiOperation(
      () => SpacePermissionsService.getPermissionsGrantedToAnonymousUsers1(spaceKey),
      'Error getting anonymous space permissions',
    );
  }

  /**
   * Get the permissions granted to a group in a space.
   * @param spaceKey The key of the space
   * @param groupName The name of the group
   */
  async getGroupSpacePermissions(spaceKey: string, groupName: string) {
    return handleApiOperation(
      () => SpacePermissionsService.getPermissionsGrantedToGroup1(spaceKey, groupName),
      'Error getting group space permissions',
    );
  }

  /**
   * Get the permissions granted to a user in a space.
   * @param spaceKey The key of the space
   * @param userKey The key of the user
   */
  async getUserSpacePermissions(spaceKey: string, userKey: string) {
    return handleApiOperation(
      () => SpacePermissionsService.getPermissionsGrantedToUser1(spaceKey, userKey),
      'Error getting user space permissions',
    );
  }

  /**
   * Grant space permissions to the anonymous user. Adds to existing permissions, does not override them.
   * @param spaceKey The key of the space
   * @param operations Operations to grant, e.g. { targetType: 'space', operationKey: 'read' }
   */
  async grantAnonymousSpacePermissions(spaceKey: string, operations: OperationDescriptionInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.grantPermissionsToAnonymousUsers1(spaceKey, operations),
      'Error granting anonymous space permissions',
    );
  }

  /**
   * Grant space permissions to a group. Adds to existing permissions, does not override them.
   * @param spaceKey The key of the space
   * @param groupName The name of the group
   * @param operations Operations to grant, e.g. { targetType: 'space', operationKey: 'read' }
   */
  async grantGroupSpacePermissions(spaceKey: string, groupName: string, operations: OperationDescriptionInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.grantPermissionsToGroup1(spaceKey, groupName, operations),
      'Error granting group space permissions',
    );
  }

  /**
   * Grant space permissions to a user. Adds to existing permissions, does not override them.
   * @param spaceKey The key of the space
   * @param userKey The key of the user
   * @param operations Operations to grant, e.g. { targetType: 'space', operationKey: 'read' }
   */
  async grantUserSpacePermissions(spaceKey: string, userKey: string, operations: OperationDescriptionInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.grantPermissionsToUser1(spaceKey, userKey, operations),
      'Error granting user space permissions',
    );
  }

  /**
   * Revoke space permissions from the anonymous user. Permissions not currently held are silently skipped.
   * @param spaceKey The key of the space
   * @param operations Operations to revoke, e.g. { targetType: 'space', operationKey: 'read' }
   */
  async revokeAnonymousSpacePermissions(spaceKey: string, operations: OperationDescriptionInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.revokePermissionsFromAnonymousUser(spaceKey, operations),
      'Error revoking anonymous space permissions',
    );
  }

  /**
   * Revoke space permissions from a group. Permissions not currently held are silently skipped.
   * @param spaceKey The key of the space
   * @param groupName The name of the group
   * @param operations Operations to revoke, e.g. { targetType: 'space', operationKey: 'read' }
   */
  async revokeGroupSpacePermissions(spaceKey: string, groupName: string, operations: OperationDescriptionInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.revokePermissionsFromGroup1(spaceKey, groupName, operations),
      'Error revoking group space permissions',
    );
  }

  /**
   * Revoke space permissions from a user. Permissions not currently held are silently skipped.
   * @param spaceKey The key of the space
   * @param userKey The key of the user
   * @param operations Operations to revoke, e.g. { targetType: 'space', operationKey: 'read' }
   */
  async revokeUserSpacePermissions(spaceKey: string, userKey: string, operations: OperationDescriptionInput[]) {
    return handleApiOperation(
      () => SpacePermissionsService.revokePermissionsFromUser1(spaceKey, userKey, operations),
      'Error revoking user space permissions',
    );
  }

  /**
   * Get information about the current logged in user.
   */
  async getCurrentUser(expand?: string) {
    return handleApiOperation(() => UserService.getCurrent(expand), 'Error getting current user');
  }

  /**
   * Get information about how the anonymous user is represented.
   */
  async getAnonymousUser(expand?: string) {
    return handleApiOperation(() => UserService.getAnonymous(expand), 'Error getting anonymous user');
  }

  /**
   * Get a user by user key or username. Exactly one of key or username should be supplied.
   */
  async getUser(key?: string, username?: string, expand?: string) {
    return handleApiOperation(() => UserService.getUser(expand, key, username), 'Error getting user');
  }

  /**
   * Get a paginated collection of all registered users.
   */
  async getUsers(limit?: number, start?: number, expand?: string) {
    return handleApiOperation(
      () => UserService.getUsers(expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting users',
    );
  }

  /**
   * Get a paginated collection of groups that a user is a member of. Exactly one of key or username should be supplied.
   */
  async getUserGroups(key?: string, username?: string, limit?: number, start?: number, expand?: string) {
    return handleApiOperation(
      () => UserService.getGroups1(expand, (limit ?? this.getPageSize()).toString(), start?.toString(), key, username),
      'Error getting user groups',
    );
  }

  /**
   * Update the current user's details (full name, email).
   */
  async updateCurrentUser(fullName?: string, email?: string, currentPassword?: string) {
    return handleApiOperation(
      () => UserService.updateUser1({ fullName, email, currentPassword }),
      'Error updating current user',
    );
  }

  /**
   * Change the password for the current user.
   */
  async changeCurrentUserPassword(newPassword: string, oldPassword?: string) {
    return handleApiOperation(
      () => UserService.changePassword1({ newPassword, oldPassword }),
      'Error changing current user password',
    );
  }

  /**
   * Get a user group by name.
   */
  async getGroup(groupName: string, expand?: string) {
    return handleApiOperation(() => GroupService.getGroup(groupName, expand), 'Error getting group');
  }

  /**
   * Get a paginated collection of all user groups.
   */
  async getGroups(limit?: number, start?: number, expand?: string) {
    return handleApiOperation(
      () => GroupService.getGroups(expand, limit ?? this.getPageSize(), start),
      'Error getting groups',
    );
  }

  /**
   * Get a paginated collection of the users that are members of a group.
   */
  async getGroupMembers(groupName: string, limit?: number, start?: number, expand?: string) {
    return handleApiOperation(
      () => GroupService.getMembers(groupName, expand, limit ?? this.getPageSize(), start),
      'Error getting group members',
    );
  }

  /**
   * Get a paginated collection of the groups nested directly within a group.
   */
  async getNestedGroupMembers(groupName: string, limit?: number, start?: number, expand?: string) {
    return handleApiOperation(
      () => GroupService.getNestedGroupMembers(groupName, expand, limit ?? this.getPageSize(), start),
      'Error getting nested group members',
    );
  }

  /**
   * Add a user to a group. Idempotent: adding an existing membership is a no-op.
   */
  async addUserToGroup(username: string, groupName: string) {
    return handleApiOperation(
      () => UserGroupService.update5(groupName, username),
      'Error adding user to group',
    );
  }

  /**
   * Remove a user from a group. Idempotent: removing a non-existent membership is a no-op.
   */
  async removeUserFromGroup(username: string, groupName: string) {
    return handleApiOperation(
      () => UserGroupService.delete6(groupName, username),
      'Error removing user from group',
    );
  }

  /**
   * Create a new user. Requires system administrator permission.
   * Either supply a password, or set notifyViaEmail to invite the user by email.
   */
  async adminCreateUser(userName: string, fullName: string, email: string, password?: string, notifyViaEmail?: boolean) {
    return handleApiOperation(
      () => AdminUserService.createUser({ userName, fullName, email, password, notifyViaEmail }),
      'Error creating user',
    );
  }

  /**
   * Update a user's full name and/or email. Requires system administrator permission.
   */
  async adminUpdateUser(username: string, fullName?: string, email?: string) {
    return handleApiOperation(
      () => AdminUserService.updateUser(username, { fullName, email }),
      'Error updating user',
    );
  }

  /**
   * Delete a user. Requires system administrator permission. Runs asynchronously as a long-running task.
   */
  async adminDeleteUser(username: string) {
    return handleApiOperation(() => AdminUserService.delete1(username), 'Error deleting user');
  }

  /**
   * Disable (deactivate) a user. Requires system administrator permission. Idempotent.
   */
  async adminDisableUser(username: string) {
    return handleApiOperation(() => AdminUserService.disable(username), 'Error disabling user');
  }

  /**
   * Enable (reactivate) a user. Requires system administrator permission. Idempotent.
   */
  async adminEnableUser(username: string) {
    return handleApiOperation(() => AdminUserService.enable(username), 'Error enabling user');
  }

  /**
   * Change another user's password. Requires system administrator permission.
   */
  async adminChangeUserPassword(username: string, password: string) {
    return handleApiOperation(
      () => AdminUserService.changePassword(username, { password }),
      'Error changing user password',
    );
  }

  /**
   * Create a new user group. Requires system administrator permission.
   */
  async adminCreateGroup(name: string) {
    return handleApiOperation(() => AdminGroupService.create({ name }), 'Error creating group');
  }

  /**
   * Delete a user group. Requires system administrator permission.
   */
  async adminDeleteGroup(groupName: string) {
    return handleApiOperation(() => AdminGroupService.delete(groupName), 'Error deleting group');
  }

  /**
   * Get a paginated collection of active users (those counting towards the license) via the search index.
   */
  async adminGetActiveUsers(limit?: number, start?: number, expand?: string) {
    return handleApiOperation(
      () => AdminUsersService.getActiveUsers(expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting active users',
    );
  }

  /**
   * Publish a shared draft created from a content blueprint (template), turning it into live content.
   * @param draftId The ID of the draft (also used as the ID of the published content)
   * @param content The content to publish, with status "current" and the same ID as the draft
   * @param expand Optional comma-separated list of properties to expand on the response
   */
  async publishBlueprintSharedDraft(draftId: string, content: ConfluenceContent, expand?: string) {
    return handleApiOperation(
      () => ContentBlueprintService.publishSharedDraft(draftId, expand, 'draft', content),
      'Error publishing shared blueprint draft',
    );
  }

  /**
   * Publish a legacy draft created from a content blueprint (template), turning it into live content.
   * @param draftId The ID of the draft (also used as the ID of the published content)
   * @param content The content to publish, with status "current" and the same ID as the draft
   * @param expand Optional comma-separated list of properties to expand on the response
   */
  async publishBlueprintLegacyDraft(draftId: string, content: ConfluenceContent, expand?: string) {
    return handleApiOperation(
      () => ContentBlueprintService.publishLegacyDraft(draftId, expand, 'draft', content),
      'Error publishing legacy blueprint draft',
    );
  }

  /**
   * Convert a content body between representations. Supported conversions:
   * storage -> view,export_view,styled_view,editor; editor -> storage.
   * @param to The representation to convert to
   * @param value The body content to convert
   * @param representation The representation of the supplied value (e.g. storage, editor)
   * @param expand Optional comma-separated list of properties to expand on the response
   */
  async convertContentBody(to: string, value: string, representation: string, expand?: string) {
    return handleApiOperation(
      () => ContentBodyService.convert(to, expand, { value, representation }),
      'Error converting content body',
    );
  }

  /**
   * Find webhooks. Requires administrator permission.
   */
  async findWebhooks(limit?: number, start?: number, event?: string, statistics?: boolean) {
    return handleApiOperation(
      () => WebhooksService.findWebhooks(
        (limit ?? this.getPageSize()).toString(),
        start?.toString(),
        event,
        statistics?.toString(),
      ),
      'Error finding webhooks',
    );
  }

  /**
   * Create a webhook. Requires administrator permission.
   */
  async createWebhook(webhook: WebhookInput) {
    return handleApiOperation(() => WebhooksService.createWebhook(webhook), 'Error creating webhook');
  }

  /**
   * Get a webhook by ID. Requires administrator permission.
   */
  async getWebhook(webhookId: string, statistics?: boolean) {
    return handleApiOperation(() => WebhooksService.getWebhook(webhookId, statistics), 'Error getting webhook');
  }

  /**
   * Update an existing webhook. Requires administrator permission.
   */
  async updateWebhook(webhookId: string, webhook: WebhookInput) {
    return handleApiOperation(() => WebhooksService.updateWebhook(webhookId, webhook), 'Error updating webhook');
  }

  /**
   * Delete a webhook. Requires administrator permission.
   */
  async deleteWebhook(webhookId: string) {
    return handleApiOperation(() => WebhooksService.deleteWebhook(webhookId), 'Error deleting webhook');
  }

  /**
   * Get the latest invocation of a webhook, optionally filtered by outcome and/or event. Requires administrator permission.
   */
  async getWebhookLatestInvocation(webhookId: string, outcomes?: string, event?: string) {
    return handleApiOperation(
      () => WebhooksService.getLatestInvocation(webhookId, outcomes, event),
      'Error getting webhook latest invocation',
    );
  }

  /**
   * Get invocation statistics for a webhook. Requires administrator permission.
   */
  async getWebhookStatistics(webhookId: string, event?: string) {
    return handleApiOperation(
      () => WebhooksService.getStatistics(webhookId, event),
      'Error getting webhook statistics',
    );
  }

  /**
   * Get the invocation statistics summary for a webhook. Requires administrator permission.
   */
  async getWebhookStatisticsSummary(webhookId: string) {
    return handleApiOperation(
      () => WebhooksService.getStatisticsSummary(webhookId),
      'Error getting webhook statistics summary',
    );
  }

  /**
   * Test connectivity to a webhook endpoint URL. Requires administrator permission.
   */
  async testWebhook(url: string) {
    return handleApiOperation(() => WebhooksService.testWebhook(url), 'Error testing webhook');
  }

  /**
   * Get information about the application build running on this Confluence instance
   * (version, build number, etc). Requires authentication.
   */
  async getServerInfo() {
    return handleApiOperation(() => ServerInformationService.index2(), 'Error getting server information');
  }

  /**
   * Get a paginated list of node statuses in a Confluence cluster. Requires permission
   * to view cluster information.
   */
  async getClusterNodes(limit?: number, start?: number) {
    return handleApiOperation(
      () => ClusterInformationService.getClusterNodeStatuses(limit?.toString(), start?.toString()),
      'Error getting cluster node statuses',
    );
  }

  /**
   * Get information about a single long-running background task (e.g. space export, reindex) by ID.
   */
  async getLongRunningTask(id: string, expand?: string) {
    return handleApiOperation(() => LongTaskService.getTask(id, expand), 'Error getting long-running task');
  }

  /**
   * Get a paginated list of all tracked long-running background tasks.
   */
  async getLongRunningTasks(expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => LongTaskService.getTasks(expand, limit?.toString(), start?.toString()),
      'Error getting long-running tasks',
    );
  }

  /**
   * Start a new site backup job. Settings are passed through as-is to the API;
   * see the target instance's REST API documentation for supported fields.
   */
  async triggerSiteBackup(settings?: Record<string, unknown>) {
    return handleApiOperation(
      () => BackupAndRestoreService.createSiteBackupJob(settings),
      'Error triggering site backup',
    );
  }

  /**
   * Get a backup/restore job by ID. The caller must be a system administrator or the job's owner.
   */
  async getBackupRestoreJob(jobId: string) {
    return handleApiOperation(() => BackupAndRestoreService.getJob(jobId), 'Error getting backup/restore job');
  }

  /**
   * Find backup/restore jobs visible to the calling user, optionally filtered.
   */
  async findBackupRestoreJobs(
    owner?: string,
    spaceKey?: string,
    fromDate?: string,
    jobStates?: string,
    toDate?: string,
    jobOperation?: string,
    limit?: number,
    jobScope?: string,
  ) {
    return handleApiOperation(
      () => BackupAndRestoreService.findJobs(owner, spaceKey, fromDate, jobStates, toDate, jobOperation, limit?.toString(), jobScope),
      'Error finding backup/restore jobs',
    );
  }

  /**
   * Get simple metrics about this Confluence instance (e.g. content and user counts).
   */
  async getInstanceMetrics() {
    return handleApiOperation(() => InstanceMetricsService.index1(), 'Error getting instance metrics');
  }

  async validateSetup(): Promise<void> {
    await UserService.getCurrent();
  }

  static validateConfig(): string[] {
    return getMissingConfig();
  }
}

export const confluenceToolSchemas = {
  getContent: {
    contentId: z.string().describe('Confluence Data Center content ID'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
    bodyMode: z.enum(['storage', 'text', 'none']).optional().describe('How to return the page body. Defaults to storage for backward compatibility.'),
    maxBodyChars: z.number().optional().describe('Maximum number of characters to keep when bodyMode is text'),
    bodyStart: z.number().int().optional().describe('Character offset to start the text body slice when bodyMode is text. Non-negative values start from the beginning; negative values start from the end, e.g. -2000 returns the last 2000 characters.'),
  },
  searchContent: {
    cql: z.string().describe('Confluence Query Language (CQL) search string for Confluence Data Center'),
    limit: z.number().optional().describe('Maximum number of results to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
    excerpt: z.enum(['none', 'highlight']).optional().describe('Excerpt mode for search results. Defaults to none.'),
  },
  createContent: {
    title: z.string().describe('Title of the content'),
    spaceKey: z.string().describe('Space key where content will be created'),
    type: z.string().default('page').describe('Content type (page, blogpost, etc)'),
    content: z.string().describe('Content body in Confluence Data Center "storage" format (confluence XML)'),
    parentId: z.string().optional().describe('ID of the parent page (if creating a child page)'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  updateContent: {
    contentId: z.string().describe('ID of the content to update'),
    title: z.string().optional().describe('New title of the content'),
    content: z.string().optional().describe('New content body in Confluence Data Center storage format (XML-based)'),
    version: z.number().describe('New version number (must be incremented)'),
    versionComment: z.string().optional().describe('Comment for this version'),
    output: z.enum(['ack', 'full']).optional().describe('Return a compact acknowledgement or the full API response. Defaults to ack.'),
  },
  deleteContent: {
    contentId: z.string().describe('ID of the content to delete'),
    status: z.string().optional().describe('Content status selector. Omit to move current content to the trash; pass \'trashed\' to permanently purge already-trashed content, or \'draft\' to delete a draft.'),
  },
  getContentHistory: {
    contentId: z.string().describe('ID of the content to fetch history for'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. previousVersion,nextVersion,lastUpdated,contributors). Defaults to previousVersion,nextVersion,lastUpdated.'),
  },
  getContentChildren: {
    contentId: z.string().describe('ID of the parent content'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the children (e.g. page,comment,attachment). Without an expand only the available child types are listed.'),
    limit: z.number().optional().describe('Maximum number of children to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  getContentChildrenByType: {
    contentId: z.string().describe('ID of the parent content'),
    type: z.string().describe('Child content type to filter on (page, comment, attachment)'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the children'),
    limit: z.number().optional().describe('Maximum number of children to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  getContentComments: {
    contentId: z.string().describe('ID of the content to fetch comments for'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the comments (e.g. body.view,extensions.resolution)'),
    depth: z.string().optional().describe('Depth of the comments: empty string for ROOT only (default) or \'all\' for the full thread'),
    limit: z.number().optional().describe('Maximum number of comments to return'),
    start: z.number().optional().describe('Start index for pagination'),
    location: z.string().optional().describe('Comment location filter: inline, footer or resolved. Omit for all locations.'),
  },
  getContentDescendants: {
    contentId: z.string().describe('ID of the content to fetch descendants for'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the descendants (e.g. comment). Without an expand only the available descendant types are listed.'),
  },
  getContentDescendantsByType: {
    contentId: z.string().describe('ID of the content to fetch descendants for'),
    type: z.string().describe('Content type to filter descendants on (currently only comment is supported)'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the descendants'),
    limit: z.number().optional().describe('Maximum number of descendants to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  getContentLabels: {
    contentId: z.string().describe('ID of the content to fetch labels for'),
    prefix: z.string().optional().describe('Label prefix filter: global, my or team. Omit for all prefixes.'),
    limit: z.number().optional().describe('Maximum number of labels to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  addContentLabels: {
    contentId: z.string().describe('ID of the content to add labels to'),
    labels: z.array(z.object({
      name: z.string().describe('The label name (without prefix)'),
      prefix: z.string().optional().describe('Label prefix, defaults to \'global\' on the server'),
    })).min(1).describe('One or more labels to add to the content'),
  },
  deleteContentLabel: {
    contentId: z.string().describe('ID of the content to remove the label from'),
    name: z.string().describe('Name of the label to remove'),
  },
  getContentProperties: {
    contentId: z.string().describe('ID of the content to fetch properties for'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. content,version). Defaults to version.'),
    limit: z.number().optional().describe('Maximum number of properties to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  getContentProperty: {
    contentId: z.string().describe('ID of the content'),
    key: z.string().describe('Key of the content property to fetch'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. content,version). Defaults to version.'),
  },
  createContentProperty: {
    contentId: z.string().describe('ID of the content to store the property on'),
    key: z.string().describe('Key of the content property to create'),
    value: z.any().describe('JSON value to store for the property (object, array, string, number or boolean)'),
  },
  updateContentProperty: {
    contentId: z.string().describe('ID of the content'),
    key: z.string().describe('Key of the content property to update'),
    value: z.any().describe('New JSON value for the property'),
    version: z.number().describe('New version number (must be the current version + 1)'),
  },
  deleteContentProperty: {
    contentId: z.string().describe('ID of the content'),
    key: z.string().describe('Key of the content property to delete'),
  },
  getContentRestrictions: {
    contentId: z.string().describe('ID of the content to fetch restrictions for'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. restrictions.user,restrictions.group). Defaults to group.'),
  },
  getContentRestrictionsByOperation: {
    operationKey: z.string().describe('The operation to fetch restrictions for: read or update'),
    contentId: z.string().describe('ID of the content'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand. Defaults to group.'),
    limit: z.number().optional().describe('Maximum number of restriction entries to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  updateContentRestrictions: {
    contentId: z.string().describe('ID of the content (pages and blog posts only)'),
    restrictions: z.array(z.object({
      operation: z.enum(['read', 'update']).describe('The operation the restriction applies to'),
      restrictions: z.object({
        user: z.array(z.object({
          type: z.string().optional().describe('User type, e.g. \'known\''),
          username: z.string().optional().describe('Username of the user'),
          userKey: z.string().optional().describe('User key of the user'),
        })).optional().describe('Users allowed to perform the operation. An empty array clears the user restriction.'),
        group: z.array(z.object({
          type: z.string().optional().describe('Group type, e.g. \'group\''),
          name: z.string().optional().describe('Group name'),
        })).optional().describe('Groups allowed to perform the operation. An empty array clears the group restriction.'),
      }).describe('The users and groups the operation is restricted to'),
    })).min(1).describe('Per-operation restrictions to set. Each entry overwrites the existing restrictions for that operation.'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand in the response. Defaults to restrictions.user,restrictions.group.'),
  },
  getContentWatchers: {
    contentId: z.string().describe('ID of the content to list watchers for (requires admin privileges)'),
    limit: z.number().optional().describe('Maximum number of watchers to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  isWatchingContent: {
    contentId: z.string().describe('ID of the content'),
    key: z.string().optional().describe('User key of the user to check. Omit to check the current user.'),
    username: z.string().optional().describe('Username of the user to check. Omit to check the current user.'),
  },
  addContentWatcher: {
    contentId: z.string().describe('ID of the content to watch'),
    key: z.string().optional().describe('User key of the user to add as watcher. Omit to add the current user.'),
    username: z.string().optional().describe('Username of the user to add as watcher. Omit to add the current user.'),
  },
  removeContentWatcher: {
    contentId: z.string().describe('ID of the content to unwatch'),
    key: z.string().optional().describe('User key of the user to remove. Omit to remove the current user.'),
    username: z.string().optional().describe('Username of the user to remove. Omit to remove the current user.'),
  },
  getAttachments: {
    contentId: z.string().describe('ID of the content the attachments are on'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the attachments (e.g. version,container)'),
    filename: z.string().optional().describe('Return only the attachment matching this exact file name'),
    limit: z.number().optional().describe('Maximum number of attachments to return'),
    start: z.number().optional().describe('Start index for pagination'),
    mediaType: z.string().optional().describe('Return only attachments matching this media type (e.g. image/png)'),
  },
  removeAttachment: {
    attachmentId: z.string().describe('ID of the attachment to remove'),
    contentId: z.string().describe('ID of the content the attachment is on'),
  },
  searchSpaces: {
    searchText: z.string().describe('Text to search for in Confluence Data Center space names or descriptions. Quotes and backslashes are escaped for CQL; pass the literal search phrase only (do not pre-escape).'),
    limit: z.number().optional().describe('Maximum number of results to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
    excerpt: z.enum(['none', 'highlight']).optional().describe('Excerpt mode for search results. Defaults to none.'),
  },
  getSpace: {
    spaceKey: z.string().describe('Key of the space to fetch'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. description.plain,homepage,metadata.labels)'),
  },
  getSpaces: {
    spaceKey: z.string().optional().describe('Fetch information for a single space by key'),
    type: z.enum(['global', 'personal']).optional().describe('Filter spaces by type'),
    status: z.enum(['current', 'archived']).optional().describe('Filter spaces by status'),
    label: z.string().optional().describe('Filter spaces by label'),
    favourite: z.boolean().optional().describe('Filter to only the calling user\'s favourite spaces'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the spaces'),
    limit: z.number().optional().describe('Maximum number of spaces to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  createSpace: {
    key: z.string().describe('Key for the new space (unique, uppercase letters/numbers)'),
    name: z.string().describe('Name of the new space'),
    description: z.string().optional().describe('Plain-text description of the space'),
    isPrivate: z.boolean().optional().describe('Create a private space viewable only by its creator. Defaults to false.'),
  },
  updateSpace: {
    spaceKey: z.string().describe('Key of the space to update'),
    name: z.string().describe('New name for the space'),
    description: z.string().optional().describe('New plain-text description of the space'),
  },
  deleteSpace: {
    spaceKey: z.string().describe('Key of the space to delete. Deletion runs as a long-running task.'),
  },
  getSpaceContent: {
    spaceKey: z.string().describe('Key of the space to fetch content from'),
    type: z.enum(['page', 'blogpost']).optional().describe('Limit results to a single content type. Omit to return all content types.'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the content (e.g. history,version,body.storage)'),
    depth: z.enum(['all', 'root']).optional().describe('\'all\' (default) for the full tree or \'root\' for only top-level content'),
    limit: z.number().optional().describe('Maximum number of content items to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  archiveSpace: {
    spaceKey: z.string().describe('Key of the space to archive'),
  },
  restoreSpace: {
    spaceKey: z.string().describe('Key of the archived space to restore'),
  },
  getSpaceProperties: {
    spaceKey: z.string().describe('Key of the space to fetch properties for'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. space,version). Defaults to version.'),
    limit: z.number().optional().describe('Maximum number of properties to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  getSpaceProperty: {
    spaceKey: z.string().describe('Key of the space'),
    key: z.string().describe('Key of the space property to fetch'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand (e.g. space,version). Defaults to version.'),
  },
  createSpaceProperty: {
    spaceKey: z.string().describe('Key of the space to store the property on'),
    key: z.string().describe('Key of the space property to create'),
    value: z.any().describe('JSON value to store for the property (object, array, string, number or boolean)'),
  },
  updateSpaceProperty: {
    spaceKey: z.string().describe('Key of the space'),
    key: z.string().describe('Key of the space property to update'),
    value: z.any().describe('New JSON value for the property'),
    version: z.number().describe('New version number (must be the current version + 1)'),
  },
  deleteSpaceProperty: {
    spaceKey: z.string().describe('Key of the space'),
    key: z.string().describe('Key of the space property to delete'),
  },
  createAttachment: {
    contentId: z.string().describe('The ID of the content to attach the file to'),
    fileName: z.string().describe('Name of the file being uploaded'),
    contentBase64: z.string().describe('Base64-encoded file content'),
    comment: z.string().optional().describe('Comment to attach to the uploaded file'),
    minorEdit: z.boolean().optional().describe('If true, no notification email will be generated for this attachment'),
    hidden: z.boolean().optional().describe('If true, no notification email or activity stream entry will be generated'),
    allowDuplicated: z.boolean().optional().describe('Allow uploading an attachment with an already-existing filename'),
    status: z.string().optional().describe('Status of the attachment\'s content container, e.g. current or draft'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the attachment returned'),
  },
  updateAttachmentMeta: {
    contentId: z.string().describe('The ID of the content the attachment is on'),
    attachmentId: z.string().describe('The ID of the attachment to update'),
    version: z.number().describe('New version number (must be incremented from the attachment\'s current version)'),
    title: z.string().optional().describe('New filename for the attachment'),
    versionComment: z.string().optional().describe('Comment for this version'),
    mediaType: z.string().optional().describe('New media type for the attachment'),
    comment: z.string().optional().describe('New comment metadata for the attachment'),
    minorEdit: z.boolean().optional().describe('If true, no notification email will be generated for this update'),
  },
  updateAttachmentData: {
    contentId: z.string().describe('The ID of the content the attachment is on'),
    attachmentId: z.string().describe('The ID of the attachment to upload a new file for'),
    fileName: z.string().describe('Name of the new file being uploaded'),
    contentBase64: z.string().describe('Base64-encoded new file content'),
    comment: z.string().optional().describe('Comment to attach to the new version'),
    minorEdit: z.boolean().optional().describe('If true, no notification email will be generated for this update'),
  },
  moveAttachment: {
    contentId: z.string().describe('The ID of the content the attachment is currently on'),
    attachmentId: z.string().describe('The ID of the attachment to move'),
    newContentId: z.string().optional().describe('The ID of the content to move the attachment to'),
    newName: z.string().optional().describe('New name for the attachment while moving it'),
  },
  deleteAttachment: {
    contentId: z.string().describe('The ID of the content the attachment is on'),
    attachmentId: z.string().describe('The ID of the attachment to delete'),
  },
  deleteAttachmentVersion: {
    contentId: z.string().describe('The ID of the content the attachment is on'),
    attachmentId: z.string().describe('The ID of the attachment'),
    version: z.number().describe('The version number to delete'),
  },
  getAllSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to fetch permissions for'),
  },
  setSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to set permissions on'),
    permissions: z.array(z.object({
      userKey: z.string().optional().describe('User key to set permissions for (mutually exclusive with groupName)'),
      groupName: z.string().optional().describe('Group name to set permissions for (mutually exclusive with userKey)'),
      operations: z.array(z.object({
        targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
        operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
      })).optional().describe('Full set of operations this subject should have. Omit or pass an empty array to revoke all of the subject\'s existing permissions.'),
    })).min(1).max(40).describe('Up to 40 subjects (user/group/anonymous). Each entry replaces that subject\'s entire permission set in the space; subjects not listed are left unchanged.'),
  },
  getAnonymousSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to fetch anonymous permissions for'),
  },
  getGroupSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to fetch permissions for'),
    groupName: z.string().describe('Name of the group to fetch permissions for'),
  },
  getUserSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to fetch permissions for'),
    userKey: z.string().describe('Key of the user to fetch permissions for'),
  },
  grantAnonymousSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to grant permissions in'),
    operations: z.array(z.object({
      targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
      operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
    })).min(1).describe('Operations to grant. Adds to existing permissions; does not override them.'),
  },
  grantGroupSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to grant permissions in'),
    groupName: z.string().describe('Name of the group to grant permissions to'),
    operations: z.array(z.object({
      targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
      operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
    })).min(1).describe('Operations to grant. Adds to existing permissions; does not override them.'),
  },
  grantUserSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to grant permissions in'),
    userKey: z.string().describe('Key of the user to grant permissions to'),
    operations: z.array(z.object({
      targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
      operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
    })).min(1).describe('Operations to grant. Adds to existing permissions; does not override them.'),
  },
  revokeAnonymousSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to revoke permissions from'),
    operations: z.array(z.object({
      targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
      operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
    })).min(1).describe('Operations to revoke. Permissions not currently held are silently skipped.'),
  },
  revokeGroupSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to revoke permissions from'),
    groupName: z.string().describe('Name of the group to revoke permissions from'),
    operations: z.array(z.object({
      targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
      operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
    })).min(1).describe('Operations to revoke. Permissions not currently held are silently skipped.'),
  },
  revokeUserSpacePermissions: {
    spaceKey: z.string().describe('Key of the space to revoke permissions from'),
    userKey: z.string().describe('Key of the user to revoke permissions from'),
    operations: z.array(z.object({
      targetType: z.string().describe('The resource type the operation applies to, e.g. \'space\', \'page\', \'blogpost\', \'comment\', \'attachment\''),
      operationKey: z.string().describe('The operation key, e.g. \'read\', \'administer\', \'export\', \'restrict\', \'delete_own\', \'delete_mail\', \'create\', \'delete\''),
    })).min(1).describe('Operations to revoke. Permissions not currently held are silently skipped.'),
  },
  getCurrentUser: {
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the user'),
  },
  getAnonymousUser: {
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the user'),
  },
  getUser: {
    key: z.string().optional().describe('User key of the user to fetch (mutually exclusive with username)'),
    username: z.string().optional().describe('Username of the user to fetch (mutually exclusive with key)'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the user'),
  },
  getUsers: {
    limit: z.number().optional().describe('Maximum number of users to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the users (e.g. status)'),
  },
  getUserGroups: {
    key: z.string().optional().describe('User key of the user (mutually exclusive with username)'),
    username: z.string().optional().describe('Username of the user (mutually exclusive with key)'),
    limit: z.number().optional().describe('Maximum number of groups to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
  },
  updateCurrentUser: {
    fullName: z.string().optional().describe('New full name for the current user'),
    email: z.string().optional().describe('New email address for the current user'),
    currentPassword: z.string().optional().describe('Current password, required when changing the email address'),
  },
  changeCurrentUserPassword: {
    newPassword: z.string().describe('The new password. Cannot be null or blank.'),
    oldPassword: z.string().optional().describe('The current password'),
  },
  getGroup: {
    groupName: z.string().describe('Name of the group to fetch'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
  },
  getGroups: {
    limit: z.number().optional().describe('Maximum number of groups to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
  },
  getGroupMembers: {
    groupName: z.string().describe('Name of the group to fetch members for'),
    limit: z.number().optional().describe('Maximum number of members to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
  },
  getNestedGroupMembers: {
    groupName: z.string().describe('Name of the group to fetch nested group members for'),
    limit: z.number().optional().describe('Maximum number of groups to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand'),
  },
  addUserToGroup: {
    username: z.string().describe('Username of the user to add'),
    groupName: z.string().describe('Name of the group to add the user to'),
  },
  removeUserFromGroup: {
    username: z.string().describe('Username of the user to remove'),
    groupName: z.string().describe('Name of the group to remove the user from'),
  },
  adminCreateUser: {
    userName: z.string().describe('Username for the new user (lowercase, no whitespace or \\ , + < > \' " characters, not \'anonymous\')'),
    fullName: z.string().describe('Full name for the new user'),
    email: z.string().describe('Email address for the new user'),
    password: z.string().optional().describe('Password for the new user. Required unless notifyViaEmail is true.'),
    notifyViaEmail: z.boolean().optional().describe('If true, email the user an invitation instead of setting a password directly'),
  },
  adminUpdateUser: {
    username: z.string().describe('Username of the user to update'),
    fullName: z.string().optional().describe('New full name for the user'),
    email: z.string().optional().describe('New email address for the user'),
  },
  adminDeleteUser: {
    username: z.string().describe('Username of the user to delete. Requires system administrator permission.'),
  },
  adminDisableUser: {
    username: z.string().describe('Username of the user to disable. Requires system administrator permission.'),
  },
  adminEnableUser: {
    username: z.string().describe('Username of the user to enable. Requires system administrator permission.'),
  },
  adminChangeUserPassword: {
    username: z.string().describe('Username of the user whose password will be changed'),
    password: z.string().describe('The new password. Cannot be null or blank.'),
  },
  adminCreateGroup: {
    name: z.string().describe('Name for the new group. Requires system administrator permission.'),
  },
  adminDeleteGroup: {
    groupName: z.string().describe('Name of the group to delete. Requires system administrator permission.'),
  },
  adminGetActiveUsers: {
    limit: z.number().optional().describe('Maximum number of users to return'),
    start: z.number().optional().describe('Start index for pagination'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the users (e.g. status)'),
  },
  publishBlueprintSharedDraft: {
    draftId: z.string().describe('ID of the shared draft (created from a content blueprint/template) to publish'),
    title: z.string().describe('Title of the published content'),
    spaceKey: z.string().describe('Space key where the content will be published'),
    content: z.string().describe('Content body in Confluence Data Center "storage" format (confluence XML)'),
    parentId: z.string().optional().describe('ID of the parent page (if publishing as a child page)'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the response'),
  },
  publishBlueprintLegacyDraft: {
    draftId: z.string().describe('ID of the legacy draft (created from a content blueprint/template) to publish'),
    title: z.string().describe('Title of the published content'),
    spaceKey: z.string().describe('Space key where the content will be published'),
    content: z.string().describe('Content body in Confluence Data Center "storage" format (confluence XML)'),
    parentId: z.string().optional().describe('ID of the parent page (if publishing as a child page)'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the response'),
  },
  convertContentBody: {
    to: z.enum(['view', 'export_view', 'styled_view', 'editor', 'storage']).describe('The representation to convert to. Supported conversions: storage -> view/export_view/styled_view/editor; editor -> storage.'),
    value: z.string().describe('The body content to convert'),
    representation: z.enum(['storage', 'editor', 'view', 'export_view', 'styled_view']).describe('The representation of the supplied value'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the response'),
  },
  findWebhooks: {
    limit: z.number().optional().describe('Maximum number of webhooks to return'),
    start: z.number().optional().describe('Start index for pagination'),
    event: z.string().optional().describe('Filter by webhook event ID (e.g. page_created)'),
    statistics: z.boolean().optional().describe('Include invocation statistics for each webhook'),
  },
  createWebhook: {
    name: z.string().describe('Name for the webhook'),
    url: z.string().describe('The endpoint URL the webhook will POST event payloads to'),
    events: z.array(z.string()).min(1).describe('Events to subscribe to, e.g. [\'page_created\', \'page_updated\', \'page_removed\']'),
    active: z.boolean().optional().describe('Whether the webhook is enabled. Defaults to true.'),
    secret: z.string().optional().describe('Optional secret used to sign webhook payloads for verification'),
  },
  getWebhook: {
    webhookId: z.string().describe('ID of the webhook to fetch'),
    statistics: z.boolean().optional().describe('Include invocation statistics. Defaults to false.'),
  },
  updateWebhook: {
    webhookId: z.string().describe('ID of the webhook to update'),
    name: z.string().describe('Name for the webhook'),
    url: z.string().describe('The endpoint URL the webhook will POST event payloads to'),
    events: z.array(z.string()).min(1).describe('Events to subscribe to, e.g. [\'page_created\', \'page_updated\', \'page_removed\']'),
    active: z.boolean().optional().describe('Whether the webhook is enabled'),
    secret: z.string().optional().describe('Optional secret used to sign webhook payloads for verification'),
  },
  deleteWebhook: {
    webhookId: z.string().describe('ID of the webhook to delete'),
  },
  getWebhookLatestInvocation: {
    webhookId: z.string().describe('ID of the webhook'),
    outcomes: z.string().optional().describe('Filter by outcome: SUCCESS, FAILURE or ERROR. Omit for all outcomes.'),
    event: z.string().optional().describe('Filter to the last invocation of a specific event'),
  },
  getWebhookStatistics: {
    webhookId: z.string().describe('ID of the webhook'),
    event: z.string().optional().describe('Filter statistics to a specific event'),
  },
  getWebhookStatisticsSummary: {
    webhookId: z.string().describe('ID of the webhook'),
  },
  testWebhook: {
    url: z.string().describe('The endpoint URL to test connectivity against'),
  },
  getServerInfo: {},
  getClusterNodes: {
    limit: z.number().optional().describe('Maximum number of node statuses to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  getLongRunningTask: {
    id: z.string().describe('The key of the long-running task to fetch'),
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the task'),
  },
  getLongRunningTasks: {
    expand: z.string().optional().describe('Comma-separated list of properties to expand on the tasks'),
    limit: z.number().optional().describe('Maximum number of tasks to return'),
    start: z.number().optional().describe('Start index for pagination'),
  },
  triggerSiteBackup: {
    settings: z.record(z.string(), z.any()).optional().describe('Site backup settings, passed through as-is to the API. Consult the target instance\'s REST API documentation for supported fields.'),
  },
  getBackupRestoreJob: {
    jobId: z.string().describe('ID of the backup/restore job to fetch. Caller must be a system administrator or the job\'s owner.'),
  },
  findBackupRestoreJobs: {
    owner: z.string().optional().describe('Filter by the username of the user who created the job'),
    spaceKey: z.string().optional().describe('Filter by the key of the space the job applies to'),
    fromDate: z.string().optional().describe('Minimum job creation date, format yyyy-MM-ddTHH:mm:ss.SSSZ'),
    jobStates: z.string().optional().describe('Comma-separated list of job states to filter by: QUEUED, PROCESSING, FINISHED, CANCELLING, CANCELLED, FAILED'),
    toDate: z.string().optional().describe('Maximum job creation date, format yyyy-MM-ddTHH:mm:ss.SSSZ'),
    jobOperation: z.enum(['BACKUP', 'RESTORE']).optional().describe('Filter by job operation'),
    limit: z.number().optional().describe('Maximum number of jobs to return'),
    jobScope: z.enum(['SPACE', 'SITE']).optional().describe('Filter by job scope'),
  },
  getInstanceMetrics: {},
};
