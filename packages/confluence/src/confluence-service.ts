import { z } from 'zod';
import { AttachmentsService, ChildContentService, ContentDescendantService, ContentLabelsService, ContentPropertyService, ContentResourceService, ContentRestrictionsService, ContentWatchersService, OpenAPI, SearchService, SpaceService, UserService, UserWatchService } from './confluence-client/index.js';
import { handleApiOperation, resolveOpenApiBase } from 'datacenter-mcp-core';
import { CONFLUENCE_PRODUCT, getDefaultPageSize, getMissingConfig } from './config.js';
import { ConfluenceBodyMode, shapeConfluenceContent } from './confluence-response-mapper.js';

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

function resolveToken(token: string | (() => string | undefined)) {
  return async () => {
    const resolvedToken = typeof token === 'function' ? token() : token;
    return resolvedToken ?? '';
  };
}

export class ConfluenceService {
  private readonly getPageSize: () => number;

  constructor(
    host: string | undefined,
    token: string | (() => string | undefined),
    apiBasePath?: string,
    getPageSize: () => number = getDefaultPageSize,
  ) {
    OpenAPI.BASE = resolveOpenApiBase({
      host,
      apiBasePath,
      defaultBasePath: CONFLUENCE_PRODUCT.defaultApiBasePath ?? '',
      strippableSuffixes: CONFLUENCE_PRODUCT.apiBasePathStrippableSuffixes,
    });
    OpenAPI.TOKEN = resolveToken(token);
    OpenAPI.VERSION = '1.0';
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
        cql
      ),
      'Error searching for content'
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
      'Error getting content children'
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
      'Error getting content children by type'
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
      'Error getting content comments'
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
      'Error getting content descendants'
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
      'Error getting content descendants by type'
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
      'Error getting content labels'
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
      'Error adding content labels'
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
      'Error deleting content label'
    );
  }

  /**
   * Get the paginated list of properties stored on a piece of content.
   * @param contentId The ID of the content
   */
  async getContentProperties(contentId: string, expand?: string, limit?: number, start?: number) {
    return handleApiOperation(
      () => ContentPropertyService.findAll(contentId, expand, (limit ?? this.getPageSize()).toString(), start?.toString()),
      'Error getting content properties'
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
      'Error getting content property'
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
      'Error creating content property'
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
      'Error updating content property'
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
      'Error deleting content property'
    );
  }

  /**
   * Get all restrictions on a piece of content, grouped by operation.
   * @param contentId The ID of the content
   */
  async getContentRestrictions(contentId: string, expand?: string) {
    return handleApiOperation(
      () => ContentRestrictionsService.byOperation(contentId, expand),
      'Error getting content restrictions'
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
      'Error getting content restrictions by operation'
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
      'Error updating content restrictions'
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
      'Error getting content watchers'
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
      'Error checking content watch state'
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
      'Error adding content watcher'
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
      'Error removing content watcher'
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
      'Error getting attachments'
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
      'Error removing attachment'
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
    excerpt: 'none' | 'highlight' = 'none'
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
      cql
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
      'Error getting spaces'
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
      'Error creating space'
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

  async validateSetup(): Promise<void> {
    await UserService.getCurrent();
  }

  static validateConfig(): string[] {
    return getMissingConfig();
  }
}

export const confluenceToolSchemas = {
  getContent: {
    contentId: z.string().describe("Confluence Data Center content ID"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand"),
    bodyMode: z.enum(['storage', 'text', 'none']).optional().describe("How to return the page body. Defaults to storage for backward compatibility."),
    maxBodyChars: z.number().optional().describe("Maximum number of characters to keep when bodyMode is text"),
    bodyStart: z.number().int().optional().describe("Character offset to start the text body slice when bodyMode is text. Non-negative values start from the beginning; negative values start from the end, e.g. -2000 returns the last 2000 characters.")
  },
  searchContent: {
    cql: z.string().describe("Confluence Query Language (CQL) search string for Confluence Data Center"),
    limit: z.number().optional().describe("Maximum number of results to return"),
    start: z.number().optional().describe("Start index for pagination"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand"),
    excerpt: z.enum(['none', 'highlight']).optional().describe("Excerpt mode for search results. Defaults to none.")
  },
  createContent: {
    title: z.string().describe("Title of the content"),
    spaceKey: z.string().describe("Space key where content will be created"),
    type: z.string().default("page").describe("Content type (page, blogpost, etc)"),
    content: z.string().describe("Content body in Confluence Data Center \"storage\" format (confluence XML)"),
    parentId: z.string().optional().describe("ID of the parent page (if creating a child page)"),
    output: z.enum(['ack', 'full']).optional().describe("Return a compact acknowledgement or the full API response. Defaults to ack.")
  },
  updateContent: {
    contentId: z.string().describe("ID of the content to update"),
    title: z.string().optional().describe("New title of the content"),
    content: z.string().optional().describe("New content body in Confluence Data Center storage format (XML-based)"),
    version: z.number().describe("New version number (must be incremented)"),
    versionComment: z.string().optional().describe("Comment for this version"),
    output: z.enum(['ack', 'full']).optional().describe("Return a compact acknowledgement or the full API response. Defaults to ack.")
  },
  deleteContent: {
    contentId: z.string().describe("ID of the content to delete"),
    status: z.string().optional().describe("Content status selector. Omit to move current content to the trash; pass 'trashed' to permanently purge already-trashed content, or 'draft' to delete a draft.")
  },
  getContentHistory: {
    contentId: z.string().describe("ID of the content to fetch history for"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand (e.g. previousVersion,nextVersion,lastUpdated,contributors). Defaults to previousVersion,nextVersion,lastUpdated.")
  },
  getContentChildren: {
    contentId: z.string().describe("ID of the parent content"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the children (e.g. page,comment,attachment). Without an expand only the available child types are listed."),
    limit: z.number().optional().describe("Maximum number of children to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  getContentChildrenByType: {
    contentId: z.string().describe("ID of the parent content"),
    type: z.string().describe("Child content type to filter on (page, comment, attachment)"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the children"),
    limit: z.number().optional().describe("Maximum number of children to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  getContentComments: {
    contentId: z.string().describe("ID of the content to fetch comments for"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the comments (e.g. body.view,extensions.resolution)"),
    depth: z.string().optional().describe("Depth of the comments: empty string for ROOT only (default) or 'all' for the full thread"),
    limit: z.number().optional().describe("Maximum number of comments to return"),
    start: z.number().optional().describe("Start index for pagination"),
    location: z.string().optional().describe("Comment location filter: inline, footer or resolved. Omit for all locations.")
  },
  getContentDescendants: {
    contentId: z.string().describe("ID of the content to fetch descendants for"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the descendants (e.g. comment). Without an expand only the available descendant types are listed.")
  },
  getContentDescendantsByType: {
    contentId: z.string().describe("ID of the content to fetch descendants for"),
    type: z.string().describe("Content type to filter descendants on (currently only comment is supported)"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the descendants"),
    limit: z.number().optional().describe("Maximum number of descendants to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  getContentLabels: {
    contentId: z.string().describe("ID of the content to fetch labels for"),
    prefix: z.string().optional().describe("Label prefix filter: global, my or team. Omit for all prefixes."),
    limit: z.number().optional().describe("Maximum number of labels to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  addContentLabels: {
    contentId: z.string().describe("ID of the content to add labels to"),
    labels: z.array(z.object({
      name: z.string().describe("The label name (without prefix)"),
      prefix: z.string().optional().describe("Label prefix, defaults to 'global' on the server")
    })).min(1).describe("One or more labels to add to the content")
  },
  deleteContentLabel: {
    contentId: z.string().describe("ID of the content to remove the label from"),
    name: z.string().describe("Name of the label to remove")
  },
  getContentProperties: {
    contentId: z.string().describe("ID of the content to fetch properties for"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand (e.g. content,version). Defaults to version."),
    limit: z.number().optional().describe("Maximum number of properties to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  getContentProperty: {
    contentId: z.string().describe("ID of the content"),
    key: z.string().describe("Key of the content property to fetch"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand (e.g. content,version). Defaults to version.")
  },
  createContentProperty: {
    contentId: z.string().describe("ID of the content to store the property on"),
    key: z.string().describe("Key of the content property to create"),
    value: z.any().describe("JSON value to store for the property (object, array, string, number or boolean)")
  },
  updateContentProperty: {
    contentId: z.string().describe("ID of the content"),
    key: z.string().describe("Key of the content property to update"),
    value: z.any().describe("New JSON value for the property"),
    version: z.number().describe("New version number (must be the current version + 1)")
  },
  deleteContentProperty: {
    contentId: z.string().describe("ID of the content"),
    key: z.string().describe("Key of the content property to delete")
  },
  getContentRestrictions: {
    contentId: z.string().describe("ID of the content to fetch restrictions for"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand (e.g. restrictions.user,restrictions.group). Defaults to group.")
  },
  getContentRestrictionsByOperation: {
    operationKey: z.string().describe("The operation to fetch restrictions for: read or update"),
    contentId: z.string().describe("ID of the content"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand. Defaults to group."),
    limit: z.number().optional().describe("Maximum number of restriction entries to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  updateContentRestrictions: {
    contentId: z.string().describe("ID of the content (pages and blog posts only)"),
    restrictions: z.array(z.object({
      operation: z.enum(['read', 'update']).describe("The operation the restriction applies to"),
      restrictions: z.object({
        user: z.array(z.object({
          type: z.string().optional().describe("User type, e.g. 'known'"),
          username: z.string().optional().describe("Username of the user"),
          userKey: z.string().optional().describe("User key of the user")
        })).optional().describe("Users allowed to perform the operation. An empty array clears the user restriction."),
        group: z.array(z.object({
          type: z.string().optional().describe("Group type, e.g. 'group'"),
          name: z.string().optional().describe("Group name")
        })).optional().describe("Groups allowed to perform the operation. An empty array clears the group restriction.")
      }).describe("The users and groups the operation is restricted to")
    })).min(1).describe("Per-operation restrictions to set. Each entry overwrites the existing restrictions for that operation."),
    expand: z.string().optional().describe("Comma-separated list of properties to expand in the response. Defaults to restrictions.user,restrictions.group.")
  },
  getContentWatchers: {
    contentId: z.string().describe("ID of the content to list watchers for (requires admin privileges)"),
    limit: z.number().optional().describe("Maximum number of watchers to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  isWatchingContent: {
    contentId: z.string().describe("ID of the content"),
    key: z.string().optional().describe("User key of the user to check. Omit to check the current user."),
    username: z.string().optional().describe("Username of the user to check. Omit to check the current user.")
  },
  addContentWatcher: {
    contentId: z.string().describe("ID of the content to watch"),
    key: z.string().optional().describe("User key of the user to add as watcher. Omit to add the current user."),
    username: z.string().optional().describe("Username of the user to add as watcher. Omit to add the current user.")
  },
  removeContentWatcher: {
    contentId: z.string().describe("ID of the content to unwatch"),
    key: z.string().optional().describe("User key of the user to remove. Omit to remove the current user."),
    username: z.string().optional().describe("Username of the user to remove. Omit to remove the current user.")
  },
  getAttachments: {
    contentId: z.string().describe("ID of the content the attachments are on"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the attachments (e.g. version,container)"),
    filename: z.string().optional().describe("Return only the attachment matching this exact file name"),
    limit: z.number().optional().describe("Maximum number of attachments to return"),
    start: z.number().optional().describe("Start index for pagination"),
    mediaType: z.string().optional().describe("Return only attachments matching this media type (e.g. image/png)")
  },
  removeAttachment: {
    attachmentId: z.string().describe("ID of the attachment to remove"),
    contentId: z.string().describe("ID of the content the attachment is on")
  },
  searchSpaces: {
    searchText: z.string().describe("Text to search for in Confluence Data Center space names or descriptions. Quotes and backslashes are escaped for CQL; pass the literal search phrase only (do not pre-escape)."),
    limit: z.number().optional().describe("Maximum number of results to return"),
    start: z.number().optional().describe("Start index for pagination"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand"),
    excerpt: z.enum(['none', 'highlight']).optional().describe("Excerpt mode for search results. Defaults to none.")
  },
  getSpace: {
    spaceKey: z.string().describe("Key of the space to fetch"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand (e.g. description.plain,homepage,metadata.labels)")
  },
  getSpaces: {
    spaceKey: z.string().optional().describe("Fetch information for a single space by key"),
    type: z.enum(['global', 'personal']).optional().describe("Filter spaces by type"),
    status: z.enum(['current', 'archived']).optional().describe("Filter spaces by status"),
    label: z.string().optional().describe("Filter spaces by label"),
    favourite: z.boolean().optional().describe("Filter to only the calling user's favourite spaces"),
    expand: z.string().optional().describe("Comma-separated list of properties to expand on the spaces"),
    limit: z.number().optional().describe("Maximum number of spaces to return"),
    start: z.number().optional().describe("Start index for pagination")
  },
  createSpace: {
    key: z.string().describe("Key for the new space (unique, uppercase letters/numbers)"),
    name: z.string().describe("Name of the new space"),
    description: z.string().optional().describe("Plain-text description of the space"),
    isPrivate: z.boolean().optional().describe("Create a private space viewable only by its creator. Defaults to false.")
  },
  updateSpace: {
    spaceKey: z.string().describe("Key of the space to update"),
    name: z.string().describe("New name for the space"),
    description: z.string().optional().describe("New plain-text description of the space")
  },
  deleteSpace: {
    spaceKey: z.string().describe("Key of the space to delete. Deletion runs as a long-running task.")
  }
};
