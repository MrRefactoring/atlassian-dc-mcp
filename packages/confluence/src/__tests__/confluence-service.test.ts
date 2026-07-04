import { ConfluenceService, escapeSearchTextForCql } from '../confluence-service.js';
import {
  AdminGroupService,
  AdminUserService,
  AdminUsersService,
  AttachmentsService,
  ChildContentService,
  ContentBlueprintService,
  ContentBodyService,
  ContentDescendantService,
  ContentLabelsService,
  ContentPropertyService,
  ContentResourceService,
  ContentRestrictionsService,
  ContentWatchersService,
  GroupService,
  OpenAPI,
  SearchService,
  ServerInformationService,
  SpacePermissionsService,
  SpaceService,
  SpacePropertyService,
  UserGroupService,
  UserService,
  UserWatchService,
  WebhooksService,
} from '../confluence-client/index.js';

const CONTENT_RESOURCE = ContentResourceService as unknown as Record<string, jest.Mock>;
const CHILD_CONTENT = ChildContentService as unknown as Record<string, jest.Mock>;
const CONTENT_DESCENDANT = ContentDescendantService as unknown as Record<string, jest.Mock>;
const CONTENT_LABELS = ContentLabelsService as unknown as Record<string, jest.Mock>;
const CONTENT_PROPERTY = ContentPropertyService as unknown as Record<string, jest.Mock>;
const CONTENT_RESTRICTIONS = ContentRestrictionsService as unknown as Record<string, jest.Mock>;
const CONTENT_WATCHERS = ContentWatchersService as unknown as Record<string, jest.Mock>;
const USER_WATCH = UserWatchService as unknown as Record<string, jest.Mock>;
const ATTACHMENTS = AttachmentsService as unknown as Record<string, jest.Mock>;
const SPACE = SpaceService as unknown as Record<string, jest.Mock>;
const SPACE_PROPERTY = SpacePropertyService as unknown as Record<string, jest.Mock>;
const SPACE_PERMISSIONS = SpacePermissionsService as unknown as Record<string, jest.Mock>;
const USER = UserService as unknown as Record<string, jest.Mock>;
const GROUP = GroupService as unknown as Record<string, jest.Mock>;
const USER_GROUP = UserGroupService as unknown as Record<string, jest.Mock>;
const ADMIN_USER = AdminUserService as unknown as Record<string, jest.Mock>;
const ADMIN_GROUP = AdminGroupService as unknown as Record<string, jest.Mock>;
const ADMIN_USERS = AdminUsersService as unknown as Record<string, jest.Mock>;
const CONTENT_BLUEPRINT = ContentBlueprintService as unknown as Record<string, jest.Mock>;
const CONTENT_BODY = ContentBodyService as unknown as Record<string, jest.Mock>;
const WEBHOOKS = WebhooksService as unknown as Record<string, jest.Mock>;
const SERVER_INFORMATION = ServerInformationService as unknown as Record<string, jest.Mock>;

jest.mock('../confluence-client/index.js', () => ({
  ContentResourceService: {
    getContentById: jest.fn(),
    createContent: jest.fn(),
    update2: jest.fn(),
    delete3: jest.fn(),
    getHistory: jest.fn(),
  },
  SearchService: {
    search1: jest.fn(),
  },
  ChildContentService: {
    children: jest.fn(),
    childrenOfType: jest.fn(),
    commentsOfContent: jest.fn(),
  },
  ContentDescendantService: {
    descendants: jest.fn(),
    descendantsOfType: jest.fn(),
  },
  ContentLabelsService: {
    labels: jest.fn(),
    addLabels: jest.fn(),
    deleteLabelWithQueryParam: jest.fn(),
  },
  ContentPropertyService: {
    findAll: jest.fn(),
    findByKey: jest.fn(),
    create1: jest.fn(),
    update1: jest.fn(),
    delete2: jest.fn(),
  },
  ContentRestrictionsService: {
    byOperation: jest.fn(),
    forOperation: jest.fn(),
    updateRestrictions: jest.fn(),
  },
  ContentWatchersService: {
    index: jest.fn(),
  },
  UserWatchService: {
    isWatchingContent: jest.fn(),
    addContentWatcher: jest.fn(),
    removeContentWatcher: jest.fn(),
  },
  AttachmentsService: {
    getAttachments: jest.fn(),
    createAttachments: jest.fn(),
    update: jest.fn(),
    updateData: jest.fn(),
    move: jest.fn(),
    removeAttachment: jest.fn(),
    removeAttachmentVersion: jest.fn(),
  },
  SpaceService: {
    space: jest.fn(),
    spaces: jest.fn(),
    createSpace: jest.fn(),
    createPrivateSpace: jest.fn(),
    update4: jest.fn(),
    delete5: jest.fn(),
    contents: jest.fn(),
    contentsWithType1: jest.fn(),
    archive: jest.fn(),
    restore: jest.fn(),
  },
  SpacePropertyService: {
    get1: jest.fn(),
    get: jest.fn(),
    create3: jest.fn(),
    update3: jest.fn(),
    delete4: jest.fn(),
  },
  SpacePermissionsService: {
    getAllSpacePermissions: jest.fn(),
    setPermissions1: jest.fn(),
    getPermissionsGrantedToAnonymousUsers1: jest.fn(),
    getPermissionsGrantedToGroup1: jest.fn(),
    getPermissionsGrantedToUser1: jest.fn(),
    grantPermissionsToAnonymousUsers1: jest.fn(),
    grantPermissionsToGroup1: jest.fn(),
    grantPermissionsToUser1: jest.fn(),
    revokePermissionsFromAnonymousUser: jest.fn(),
    revokePermissionsFromGroup1: jest.fn(),
    revokePermissionsFromUser1: jest.fn(),
  },
  UserService: {
    getCurrent: jest.fn(),
    getAnonymous: jest.fn(),
    getUser: jest.fn(),
    getUsers: jest.fn(),
    getGroups1: jest.fn(),
    updateUser1: jest.fn(),
    changePassword1: jest.fn(),
  },
  GroupService: {
    getGroup: jest.fn(),
    getGroups: jest.fn(),
    getMembers: jest.fn(),
    getNestedGroupMembers: jest.fn(),
  },
  UserGroupService: {
    update5: jest.fn(),
    delete6: jest.fn(),
  },
  AdminUserService: {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    delete1: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn(),
    changePassword: jest.fn(),
  },
  AdminGroupService: {
    create: jest.fn(),
    delete: jest.fn(),
  },
  AdminUsersService: {
    getActiveUsers: jest.fn(),
  },
  ContentBlueprintService: {
    publishSharedDraft: jest.fn(),
    publishLegacyDraft: jest.fn(),
  },
  ContentBodyService: {
    convert: jest.fn(),
  },
  WebhooksService: {
    findWebhooks: jest.fn(),
    createWebhook: jest.fn(),
    getWebhook: jest.fn(),
    updateWebhook: jest.fn(),
    deleteWebhook: jest.fn(),
    getLatestInvocation: jest.fn(),
    getStatistics: jest.fn(),
    getStatisticsSummary: jest.fn(),
    testWebhook: jest.fn(),
  },
  ServerInformationService: {
    index2: jest.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
}));

describe('constructor Basic auth wiring', () => {
  it('resolves username and password onto OpenAPI for Basic auth', async () => {
    new ConfluenceService('confluence.example.com', '', undefined, () => 25, 'jdoe', 'hunter2');
    expect(await (OpenAPI.USERNAME as () => Promise<string>)()).toBe('jdoe');
    expect(await (OpenAPI.PASSWORD as () => Promise<string>)()).toBe('hunter2');
  });

  it('resolves username/password from getter functions, same as token', async () => {
    new ConfluenceService('confluence.example.com', '', undefined, () => 25, () => 'jdoe', () => 'hunter2');
    expect(await (OpenAPI.USERNAME as () => Promise<string>)()).toBe('jdoe');
    expect(await (OpenAPI.PASSWORD as () => Promise<string>)()).toBe('hunter2');
  });

  it('resolves username/password to an empty string when omitted', async () => {
    new ConfluenceService('confluence.example.com', 'test-token');
    expect(await (OpenAPI.USERNAME as () => Promise<string>)()).toBe('');
    expect(await (OpenAPI.PASSWORD as () => Promise<string>)()).toBe('');
  });
});

describe('escapeSearchTextForCql', () => {
  it('returns plain text unchanged', () => {
    expect(escapeSearchTextForCql('hello')).toBe('hello');
    expect(escapeSearchTextForCql('space name')).toBe('space name');
  });

  it('escapes double quotes', () => {
    expect(escapeSearchTextForCql('say "hello"')).toBe('say \\"hello\\"');
  });

  it('escapes backslashes first so they cannot escape the following quote', () => {
    expect(escapeSearchTextForCql('\\')).toBe('\\\\');
    expect(escapeSearchTextForCql('path\\to\\space')).toBe('path\\\\to\\\\space');
  });

  it('escapes backslash then quote correctly (order matters)', () => {
    expect(escapeSearchTextForCql('\\"')).toBe('\\\\\\"');
  });

  it('escapes quote then backslash correctly', () => {
    expect(escapeSearchTextForCql('"\\')).toBe('\\"\\\\');
  });

  it('prevents CQL injection via quoted phrase breakout', () => {
    const malicious = '" OR type=page AND text ~ "secret';
    const escaped = escapeSearchTextForCql(malicious);
    expect(escaped).toContain('\\"');
    expect(escaped).not.toBe(malicious);
  });

  it('double-escaping is not idempotent (call once only)', () => {
    const input = 'foo"bar\\baz';
    const once = escapeSearchTextForCql(input);
    const twice = escapeSearchTextForCql(once);
    expect(twice).not.toBe(once);
    expect(twice).toContain('\\\\');
  });

  it('handles empty string', () => {
    expect(escapeSearchTextForCql('')).toBe('');
  });
});

describe('ConfluenceService.searchSpaces', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('builds CQL with escaped searchText and calls SearchService', async () => {
    (SearchService.search1 as jest.Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('my space', 10, 0);

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '10',
      '0',
      'none',
      'type=space AND title ~ "my space"'
    );
  });

  it('escapes quotes in searchText in the CQL passed to the API', async () => {
    (SearchService.search1 as jest.Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('say "hello"', 5);

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '5',
      undefined,
      'none',
      'type=space AND title ~ "say \\"hello\\""'
    );
  });

  it('escapes backslashes in searchText in the CQL passed to the API', async () => {
    (SearchService.search1 as jest.Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('path\\to\\space', 5);

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '5',
      undefined,
      'none',
      'type=space AND title ~ "path\\\\to\\\\space"'
    );
  });

  it('forwards API errors via handleApiOperation', async () => {
    const err = new Error('API error');
    (SearchService.search1 as jest.Mock).mockRejectedValue(err);

    const result = await service.searchSpaces('test');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('ConfluenceService token optimization paths', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('keeps storage mode as the default body shape', async () => {
    const mockContent = {
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        storage: {
          value: '<p>Hello</p>',
          representation: 'storage',
        },
      },
    };
    (ContentResourceService.getContentById as jest.Mock).mockResolvedValue(mockContent);

    const result = await service.getContent('123');

    expect(result.success).toBe(true);
    expect(result.data).toBe(mockContent);
    expect(ContentResourceService.getContentById).toHaveBeenCalledWith('123', 'body.storage');
  });

  it('converts storage XML to text when bodyMode is text', async () => {
    (ContentResourceService.getContentById as jest.Mock).mockResolvedValue({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        storage: {
          value: '<p>Hello &amp; <strong>world</strong></p><ul><li>One</li><li>Two</li></ul>',
          representation: 'storage',
        },
      },
      version: { number: 3 },
    });

    const result = await service.getContent('123', 'version', 'text');

    expect(result.success).toBe(true);
    expect(ContentResourceService.getContentById).toHaveBeenCalledWith('123', 'version,body.storage');
    expect(result.data).toMatchObject({
      id: '123',
      type: 'page',
      title: 'Test page',
      version: { number: 3 },
      body: {
        text: {
          representation: 'text',
        },
      },
    });
    expect((result.data as any).body.text.value).toContain('Hello & world');
    expect((result.data as any).body.text.value).toContain('- One');
    expect((result.data as any).body.text.value).toContain('- Two');
  });

  it('truncates text bodies when maxBodyChars is provided', async () => {
    (ContentResourceService.getContentById as jest.Mock).mockResolvedValue({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        storage: {
          value: '<p>Hello world</p>',
          representation: 'storage',
        },
      },
    });

    const result = await service.getContent('123', undefined, 'text', 5);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        text: {
          value: 'Hello',
          representation: 'text',
          truncated: true,
          originalLength: 11,
        },
      },
    });
  });

  it('slices text bodies from a requested start offset', async () => {
    (ContentResourceService.getContentById as jest.Mock).mockResolvedValue({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        storage: {
          value: '<p>0123456789</p>',
          representation: 'storage',
        },
      },
    });

    const result = await service.getContent('123', undefined, 'text', 4, 3);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        text: {
          value: '3456',
          representation: 'text',
          truncated: true,
          originalLength: 10,
          start: 3,
          end: 7,
        },
      },
    });
  });

  it('supports negative start offsets for tail reads', async () => {
    (ContentResourceService.getContentById as jest.Mock).mockResolvedValue({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        storage: {
          value: '<p>0123456789</p>',
          representation: 'storage',
        },
      },
    });

    const result = await service.getContent('123', undefined, 'text', undefined, -4);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        text: {
          value: '6789',
          representation: 'text',
          truncated: true,
          originalLength: 10,
          start: 6,
          end: 10,
        },
      },
    });
  });

  it('omits the body when bodyMode is none', async () => {
    (ContentResourceService.getContentById as jest.Mock).mockResolvedValue({
      id: '123',
      type: 'page',
      title: 'Test page',
      body: {
        storage: {
          value: '<p>Hello</p>',
          representation: 'storage',
        },
      },
      version: { number: 1 },
    });

    const result = await service.getContent('123', undefined, 'none');

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: '123',
      type: 'page',
      title: 'Test page',
      version: { number: 1 },
    });
  });

  it('uses the package default limit and no excerpt for content search', async () => {
    (SearchService.search1 as jest.Mock).mockResolvedValue({ results: [] });

    await service.searchContent('type=page');

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '25',
      undefined,
      'none',
      'type=page'
    );
  });

  it('forwards explicit excerpt for space search', async () => {
    (SearchService.search1 as jest.Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('docs', 5, 10, 'space.icon', 'highlight');

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      'space.icon',
      undefined,
      '5',
      '10',
      'highlight',
      'type=space AND title ~ "docs"'
    );
  });
});

describe('ConfluenceService content lifecycle (delete + history)', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('deletes content without a status (trash)', async () => {
    CONTENT_RESOURCE.delete3.mockResolvedValue(undefined);

    const result = await service.deleteContent('123');

    expect(CONTENT_RESOURCE.delete3).toHaveBeenCalledWith('123', undefined);
    expect(result.success).toBe(true);
  });

  it('forwards the status selector when purging trashed content', async () => {
    CONTENT_RESOURCE.delete3.mockResolvedValue(undefined);

    await service.deleteContent('123', 'trashed');

    expect(CONTENT_RESOURCE.delete3).toHaveBeenCalledWith('123', 'trashed');
  });

  it('gets content history with an expand list', async () => {
    CONTENT_RESOURCE.getHistory.mockResolvedValue({ latest: true });

    const result = await service.getContentHistory('123', 'contributors');

    expect(CONTENT_RESOURCE.getHistory).toHaveBeenCalledWith('123', 'contributors');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ latest: true });
  });

  it('forwards API errors via handleApiOperation', async () => {
    CONTENT_RESOURCE.delete3.mockRejectedValue(new Error('boom'));

    const result = await service.deleteContent('123');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('ConfluenceService children & descendants', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets children with the default page-size limit', async () => {
    CHILD_CONTENT.children.mockResolvedValue({ results: [] });

    await service.getContentChildren('123', 'page');

    expect(CHILD_CONTENT.children).toHaveBeenCalledWith('123', 'page', '25', undefined);
  });

  it('passes an explicit limit and start as strings for children', async () => {
    CHILD_CONTENT.children.mockResolvedValue({ results: [] });

    await service.getContentChildren('123', undefined, 10, 5);

    expect(CHILD_CONTENT.children).toHaveBeenCalledWith('123', undefined, '10', '5');
  });

  it('gets children filtered by type', async () => {
    CHILD_CONTENT.childrenOfType.mockResolvedValue({ results: [] });

    await service.getContentChildrenByType('123', 'comment', 'body.view', 3, 0);

    expect(CHILD_CONTENT.childrenOfType).toHaveBeenCalledWith('123', 'comment', 'body.view', '3', '0');
  });

  it('gets comments forwarding depth and location', async () => {
    CHILD_CONTENT.commentsOfContent.mockResolvedValue({ results: [] });

    await service.getContentComments('123', 'body.view', 'all', 7, 2, 'inline');

    expect(CHILD_CONTENT.commentsOfContent).toHaveBeenCalledWith('123', 'body.view', 'all', '7', '2', 'inline');
  });

  it('gets descendants (no pagination params)', async () => {
    CONTENT_DESCENDANT.descendants.mockResolvedValue({ results: [] });

    await service.getContentDescendants('123', 'comment');

    expect(CONTENT_DESCENDANT.descendants).toHaveBeenCalledWith('123', 'comment');
  });

  it('gets descendants filtered by type with pagination', async () => {
    CONTENT_DESCENDANT.descendantsOfType.mockResolvedValue({ results: [] });

    await service.getContentDescendantsByType('123', 'comment', undefined, 50, 10);

    expect(CONTENT_DESCENDANT.descendantsOfType).toHaveBeenCalledWith('123', 'comment', undefined, '50', '10');
  });
});

describe('ConfluenceService content labels', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets labels with prefix filter and default limit', async () => {
    CONTENT_LABELS.labels.mockResolvedValue({ results: [] });

    await service.getContentLabels('123', 'global');

    expect(CONTENT_LABELS.labels).toHaveBeenCalledWith('123', 'global', '25', undefined);
  });

  it('adds labels forwarding the list as the request body', async () => {
    CONTENT_LABELS.addLabels.mockResolvedValue({ results: [] });
    const labels = [{ name: 'docs' }, { prefix: 'global', name: 'api' }];

    await service.addContentLabels('123', labels);

    expect(CONTENT_LABELS.addLabels).toHaveBeenCalledWith('123', labels);
  });

  it('deletes a label using the query-param variant', async () => {
    CONTENT_LABELS.deleteLabelWithQueryParam.mockResolvedValue(undefined);

    const result = await service.deleteContentLabel('123', 'docs');

    expect(CONTENT_LABELS.deleteLabelWithQueryParam).toHaveBeenCalledWith('123', 'docs');
    expect(result.success).toBe(true);
  });
});

describe('ConfluenceService content properties', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('lists properties with the default page-size limit', async () => {
    CONTENT_PROPERTY.findAll.mockResolvedValue({ results: [] });

    await service.getContentProperties('123', 'version');

    expect(CONTENT_PROPERTY.findAll).toHaveBeenCalledWith('123', 'version', '25', undefined);
  });

  it('gets a single property by key', async () => {
    CONTENT_PROPERTY.findByKey.mockResolvedValue({ key: 'k' });

    await service.getContentProperty('123', 'my-key', 'content');

    expect(CONTENT_PROPERTY.findByKey).toHaveBeenCalledWith('123', 'my-key', 'content');
  });

  it('creates a property wrapping key and value into the body', async () => {
    CONTENT_PROPERTY.create1.mockResolvedValue({ key: 'k' });

    await service.createContentProperty('123', 'my-key', { enabled: true });

    expect(CONTENT_PROPERTY.create1).toHaveBeenCalledWith('123', { key: 'my-key', value: { enabled: true } });
  });

  it('updates a property with the new version number', async () => {
    CONTENT_PROPERTY.update1.mockResolvedValue({ key: 'k' });

    await service.updateContentProperty('123', 'my-key', 'new-value', 2);

    expect(CONTENT_PROPERTY.update1).toHaveBeenCalledWith(
      '123',
      'my-key',
      undefined,
      { key: 'my-key', value: 'new-value', version: { number: 2 } }
    );
  });

  it('deletes a property by key', async () => {
    CONTENT_PROPERTY.delete2.mockResolvedValue(undefined);

    const result = await service.deleteContentProperty('123', 'my-key');

    expect(CONTENT_PROPERTY.delete2).toHaveBeenCalledWith('123', 'my-key');
    expect(result.success).toBe(true);
  });
});

describe('ConfluenceService content restrictions', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets all restrictions grouped by operation', async () => {
    CONTENT_RESTRICTIONS.byOperation.mockResolvedValue({ read: {} });

    await service.getContentRestrictions('123', 'restrictions.user');

    expect(CONTENT_RESTRICTIONS.byOperation).toHaveBeenCalledWith('123', 'restrictions.user');
  });

  it('gets restrictions for a single operation with pagination', async () => {
    CONTENT_RESTRICTIONS.forOperation.mockResolvedValue({ results: [] });

    await service.getContentRestrictionsByOperation('read', '123', 'restrictions.group', 10, 0);

    expect(CONTENT_RESTRICTIONS.forOperation).toHaveBeenCalledWith('read', '123', 'restrictions.group', '10', '0');
  });

  it('forwards the restrictions array as the request body when updating', async () => {
    CONTENT_RESTRICTIONS.updateRestrictions.mockResolvedValue({ results: [] });
    const restrictions = [
      { operation: 'update', restrictions: { user: [{ type: 'known', username: 'admin' }] } },
    ];

    await service.updateContentRestrictions('123', restrictions, 'restrictions.user');

    expect(CONTENT_RESTRICTIONS.updateRestrictions).toHaveBeenCalledWith(
      '123',
      'restrictions.user',
      undefined,
      undefined,
      restrictions
    );
  });
});

describe('ConfluenceService content watchers', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('lists watchers with the default page-size limit', async () => {
    CONTENT_WATCHERS.index.mockResolvedValue({ results: [] });

    await service.getContentWatchers('123');

    expect(CONTENT_WATCHERS.index).toHaveBeenCalledWith('123', '25', undefined);
  });

  it('checks the current user watch state when no user is given', async () => {
    USER_WATCH.isWatchingContent.mockResolvedValue({ watching: true });

    await service.isWatchingContent('123');

    expect(USER_WATCH.isWatchingContent).toHaveBeenCalledWith('123', undefined, undefined);
  });

  it('adds a watcher for a named user', async () => {
    USER_WATCH.addContentWatcher.mockResolvedValue({ watching: true });

    await service.addContentWatcher('123', undefined, 'jblogs');

    expect(USER_WATCH.addContentWatcher).toHaveBeenCalledWith('123', undefined, 'jblogs');
  });

  it('removes a watcher by user key', async () => {
    USER_WATCH.removeContentWatcher.mockResolvedValue(undefined);

    const result = await service.removeContentWatcher('123', 'user-key');

    expect(USER_WATCH.removeContentWatcher).toHaveBeenCalledWith('123', 'user-key', undefined);
    expect(result.success).toBe(true);
  });
});

describe('ConfluenceService attachments', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('lists attachments with the default page-size limit and filters', async () => {
    ATTACHMENTS.getAttachments.mockResolvedValue({ results: [] });

    await service.getAttachments('123', 'version', 'diagram.png', undefined, undefined, 'image/png');

    expect(ATTACHMENTS.getAttachments).toHaveBeenCalledWith('123', 'version', 'diagram.png', '25', undefined, 'image/png');
  });

  it('removes an attachment', async () => {
    ATTACHMENTS.removeAttachment.mockResolvedValue(undefined);

    const result = await service.removeAttachment('att-1', '123');

    expect(ATTACHMENTS.removeAttachment).toHaveBeenCalledWith('att-1', '123');
    expect(result.success).toBe(true);
  });

  it('sends the X-Atlassian-Token header required by attachment endpoints', () => {
    const { OpenAPI } = jest.requireMock('../confluence-client/index.js') as { OpenAPI: { HEADERS?: Record<string, string> } };
    expect(OpenAPI.HEADERS).toEqual({ 'X-Atlassian-Token': 'no-check' });
  });

  it('lists attachments with the package default page size', async () => {
    (AttachmentsService.getAttachments as jest.Mock).mockResolvedValue({ results: [] });

    const result = await service.getAttachments('123');

    expect(result.success).toBe(true);
    expect(AttachmentsService.getAttachments).toHaveBeenCalledWith('123', undefined, undefined, '25', undefined, undefined);
  });

  it('forwards explicit paging and filters when listing attachments', async () => {
    (AttachmentsService.getAttachments as jest.Mock).mockResolvedValue({ results: [] });

    await service.getAttachments('123', 'version', 'report.pdf', 5, 10, 'application/pdf');

    expect(AttachmentsService.getAttachments).toHaveBeenCalledWith('123', 'version', 'report.pdf', '5', '10', 'application/pdf');
  });

  it('creates an attachment from base64 content as multipart form data', async () => {
    (AttachmentsService.createAttachments as jest.Mock).mockResolvedValue({ id: 'att1' });

    const result = await service.createAttachment('123', 'notes.txt', Buffer.from('hello').toString('base64'), 'a comment', true);

    expect(result.success).toBe(true);
    expect(AttachmentsService.createAttachments).toHaveBeenCalledWith(
      '123',
      undefined,
      undefined,
      undefined,
      expect.objectContaining({ comment: 'a comment', minorEdit: true, hidden: undefined })
    );
    const formData = (AttachmentsService.createAttachments as jest.Mock).mock.calls[0][4];
    expect(formData.file).toBeInstanceOf(File);
    expect(formData.file.name).toBe('notes.txt');
  });

  it('passes allowDuplicated as a string flag when creating an attachment', async () => {
    (AttachmentsService.createAttachments as jest.Mock).mockResolvedValue({ id: 'att1' });

    await service.createAttachment('123', 'notes.txt', 'aGVsbG8=', undefined, undefined, undefined, true, 'current', 'version');

    expect(AttachmentsService.createAttachments).toHaveBeenCalledWith(
      '123',
      'version',
      'true',
      'current',
      expect.anything()
    );
  });

  it('updates attachment metadata with an incremented version', async () => {
    (AttachmentsService.update as jest.Mock).mockResolvedValue({ id: 'att1' });

    const result = await service.updateAttachmentMeta('123', 'att1', 2, 'renamed.txt', 'renaming', 'text/plain', 'new comment');

    expect(result.success).toBe(true);
    expect(AttachmentsService.update).toHaveBeenCalledWith('att1', '123', {
      id: 'att1',
      type: 'attachment',
      version: { number: 2, message: 'renaming', minorEdit: undefined },
      title: 'renamed.txt',
      metadata: { mediaType: 'text/plain', comment: 'new comment' },
    });
  });

  it('replaces attachment binary data as multipart form data', async () => {
    (AttachmentsService.updateData as jest.Mock).mockResolvedValue({ id: 'att1' });

    const result = await service.updateAttachmentData('123', 'att1', 'notes-v2.txt', 'aGVsbG8=', 'updated');

    expect(result.success).toBe(true);
    expect(AttachmentsService.updateData).toHaveBeenCalledWith(
      'att1',
      '123',
      expect.objectContaining({ comment: 'updated' })
    );
    const formData = (AttachmentsService.updateData as jest.Mock).mock.calls[0][2];
    expect(formData.file.name).toBe('notes-v2.txt');
  });

  it('moves an attachment to a new content container and renames it', async () => {
    (AttachmentsService.move as jest.Mock).mockResolvedValue(undefined);

    const result = await service.moveAttachment('123', 'att1', '789', 'new-name.txt');

    expect(result.success).toBe(true);
    expect(AttachmentsService.move).toHaveBeenCalledWith('att1', '123', 'new-name.txt', '789');
  });

  it('deletes an attachment', async () => {
    (AttachmentsService.removeAttachment as jest.Mock).mockResolvedValue(undefined);

    const result = await service.deleteAttachment('123', 'att1');

    expect(result.success).toBe(true);
    expect(AttachmentsService.removeAttachment).toHaveBeenCalledWith('att1', '123');
  });

  it('deletes a specific attachment version', async () => {
    (AttachmentsService.removeAttachmentVersion as jest.Mock).mockResolvedValue(undefined);

    const result = await service.deleteAttachmentVersion('123', 'att1', 2);

    expect(result.success).toBe(true);
    expect(AttachmentsService.removeAttachmentVersion).toHaveBeenCalledWith('att1', '123', 2);
  });

  it('forwards API errors via handleApiOperation', async () => {
    (AttachmentsService.getAttachments as jest.Mock).mockRejectedValue(new Error('boom'));

    const result = await service.getAttachments('123');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('ConfluenceService space CRUD', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets a single space by key', async () => {
    SPACE.space.mockResolvedValue({ key: 'DEV' });

    await service.getSpace('DEV', 'description.plain');

    expect(SPACE.space).toHaveBeenCalledWith('DEV', 'description.plain');
  });

  it('lists spaces mapping filters onto the generated positional params', async () => {
    SPACE.spaces.mockResolvedValue({ results: [] });

    await service.getSpaces('DEV', 'global', 'current', 'team', true, 'description.plain', 10, 5);

    expect(SPACE.spaces).toHaveBeenCalledWith(
      undefined,
      '5',
      'team',
      'true',
      'global',
      'DEV',
      undefined,
      'description.plain',
      undefined,
      '10',
      undefined,
      undefined,
      undefined,
      'current'
    );
  });

  it('defaults the limit to the package page size when listing spaces', async () => {
    SPACE.spaces.mockResolvedValue({ results: [] });

    await service.getSpaces();

    expect(SPACE.spaces).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      '25',
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  it('creates a public space via createSpace', async () => {
    SPACE.createSpace.mockResolvedValue({ key: 'DEV' });
    const body = { key: 'DEV', name: 'Dev' };

    await service.createSpace(body);

    expect(SPACE.createSpace).toHaveBeenCalledWith(body);
    expect(SPACE.createPrivateSpace).not.toHaveBeenCalled();
  });

  it('creates a private space when isPrivate is true', async () => {
    SPACE.createPrivateSpace.mockResolvedValue({ key: 'DEV' });
    const body = { key: 'DEV', name: 'Dev' };

    await service.createSpace(body, true);

    expect(SPACE.createPrivateSpace).toHaveBeenCalledWith(body);
    expect(SPACE.createSpace).not.toHaveBeenCalled();
  });

  it('updates a space', async () => {
    SPACE.update4.mockResolvedValue({ key: 'DEV' });
    const body = { key: 'DEV', name: 'Dev renamed' };

    await service.updateSpace('DEV', body);

    expect(SPACE.update4).toHaveBeenCalledWith('DEV', body);
  });

  it('deletes a space', async () => {
    SPACE.delete5.mockResolvedValue({ id: 'task-1' });

    const result = await service.deleteSpace('DEV');

    expect(SPACE.delete5).toHaveBeenCalledWith('DEV');
    expect(result.success).toBe(true);
  });
});

describe('ConfluenceService space content & archival lifecycle', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets all space content when no type is given', async () => {
    SPACE.contents.mockResolvedValue({ results: [] });

    await service.getSpaceContent('DEV', undefined, 'history', 'root');

    expect(SPACE.contents).toHaveBeenCalledWith('DEV', 'history', 'root', '25', undefined);
    expect(SPACE.contentsWithType1).not.toHaveBeenCalled();
  });

  it('gets space content filtered by type', async () => {
    SPACE.contentsWithType1.mockResolvedValue({ results: [] });

    await service.getSpaceContent('DEV', 'page', undefined, undefined, 10, 5);

    expect(SPACE.contentsWithType1).toHaveBeenCalledWith('DEV', 'page', undefined, undefined, '10', '5');
    expect(SPACE.contents).not.toHaveBeenCalled();
  });

  it('archives a space', async () => {
    SPACE.archive.mockResolvedValue(undefined);

    const result = await service.archiveSpace('DEV');

    expect(SPACE.archive).toHaveBeenCalledWith('DEV');
    expect(result.success).toBe(true);
  });

  it('restores a space', async () => {
    SPACE.restore.mockResolvedValue(undefined);

    const result = await service.restoreSpace('DEV');

    expect(SPACE.restore).toHaveBeenCalledWith('DEV');
    expect(result.success).toBe(true);
  });
});

describe('ConfluenceService space properties', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('lists space properties with the default page-size limit', async () => {
    SPACE_PROPERTY.get1.mockResolvedValue({ results: [] });

    await service.getSpaceProperties('DEV', 'version');

    expect(SPACE_PROPERTY.get1).toHaveBeenCalledWith('DEV', 'version', '25', undefined);
  });

  it('gets a single space property by key', async () => {
    SPACE_PROPERTY.get.mockResolvedValue({ key: 'k' });

    await service.getSpaceProperty('DEV', 'my-key', 'space');

    expect(SPACE_PROPERTY.get).toHaveBeenCalledWith('DEV', 'my-key', 'space');
  });

  it('creates a space property wrapping key and value into the body', async () => {
    SPACE_PROPERTY.create3.mockResolvedValue({ key: 'k' });

    await service.createSpaceProperty('DEV', 'my-key', { enabled: true });

    expect(SPACE_PROPERTY.create3).toHaveBeenCalledWith('DEV', { key: 'my-key', value: { enabled: true } });
  });

  it('updates a space property with the new version number', async () => {
    SPACE_PROPERTY.update3.mockResolvedValue({ key: 'k' });

    await service.updateSpaceProperty('DEV', 'my-key', 'new-value', 2);

    expect(SPACE_PROPERTY.update3).toHaveBeenCalledWith(
      'DEV',
      'my-key',
      { key: 'my-key', value: 'new-value', version: { number: 2 } }
    );
  });

  it('deletes a space property by key', async () => {
    SPACE_PROPERTY.delete4.mockResolvedValue(undefined);

    const result = await service.deleteSpaceProperty('DEV', 'my-key');

    expect(SPACE_PROPERTY.delete4).toHaveBeenCalledWith('DEV', 'my-key');
    expect(result.success).toBe(true);
  });
});

describe('ConfluenceService space permissions', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets all space permissions', async () => {
    SPACE_PERMISSIONS.getAllSpacePermissions.mockResolvedValue([{ spaceKey: 'DEV' }]);

    const result = await service.getAllSpacePermissions('DEV');

    expect(SPACE_PERMISSIONS.getAllSpacePermissions).toHaveBeenCalledWith('DEV');
    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ spaceKey: 'DEV' }]);
  });

  it('forwards API errors when getting all space permissions', async () => {
    SPACE_PERMISSIONS.getAllSpacePermissions.mockRejectedValue(new Error('boom'));

    const result = await service.getAllSpacePermissions('DEV');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('sets space permissions for multiple subjects', async () => {
    SPACE_PERMISSIONS.setPermissions1.mockResolvedValue({});
    const permissions = [{ userKey: 'u1', operations: [{ targetType: 'space', operationKey: 'read' }] }];

    const result = await service.setSpacePermissions('DEV', permissions);

    expect(SPACE_PERMISSIONS.setPermissions1).toHaveBeenCalledWith('DEV', permissions);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when setting space permissions', async () => {
    SPACE_PERMISSIONS.setPermissions1.mockRejectedValue(new Error('boom'));

    const result = await service.setSpacePermissions('DEV', []);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('gets anonymous space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToAnonymousUsers1.mockResolvedValue([]);

    const result = await service.getAnonymousSpacePermissions('DEV');

    expect(SPACE_PERMISSIONS.getPermissionsGrantedToAnonymousUsers1).toHaveBeenCalledWith('DEV');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting anonymous space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToAnonymousUsers1.mockRejectedValue(new Error('boom'));

    const result = await service.getAnonymousSpacePermissions('DEV');

    expect(result.success).toBe(false);
  });

  it('gets group space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToGroup1.mockResolvedValue([]);

    const result = await service.getGroupSpacePermissions('DEV', 'developers');

    expect(SPACE_PERMISSIONS.getPermissionsGrantedToGroup1).toHaveBeenCalledWith('DEV', 'developers');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting group space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToGroup1.mockRejectedValue(new Error('boom'));

    const result = await service.getGroupSpacePermissions('DEV', 'developers');

    expect(result.success).toBe(false);
  });

  it('gets user space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToUser1.mockResolvedValue([]);

    const result = await service.getUserSpacePermissions('DEV', 'user-key-1');

    expect(SPACE_PERMISSIONS.getPermissionsGrantedToUser1).toHaveBeenCalledWith('DEV', 'user-key-1');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting user space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToUser1.mockRejectedValue(new Error('boom'));

    const result = await service.getUserSpacePermissions('DEV', 'user-key-1');

    expect(result.success).toBe(false);
  });

  it('grants anonymous space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToAnonymousUsers1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.grantAnonymousSpacePermissions('DEV', operations);

    expect(SPACE_PERMISSIONS.grantPermissionsToAnonymousUsers1).toHaveBeenCalledWith('DEV', operations);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when granting anonymous space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToAnonymousUsers1.mockRejectedValue(new Error('boom'));

    const result = await service.grantAnonymousSpacePermissions('DEV', []);

    expect(result.success).toBe(false);
  });

  it('grants group space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToGroup1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.grantGroupSpacePermissions('DEV', 'developers', operations);

    expect(SPACE_PERMISSIONS.grantPermissionsToGroup1).toHaveBeenCalledWith('DEV', 'developers', operations);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when granting group space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToGroup1.mockRejectedValue(new Error('boom'));

    const result = await service.grantGroupSpacePermissions('DEV', 'developers', []);

    expect(result.success).toBe(false);
  });

  it('grants user space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToUser1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.grantUserSpacePermissions('DEV', 'user-key-1', operations);

    expect(SPACE_PERMISSIONS.grantPermissionsToUser1).toHaveBeenCalledWith('DEV', 'user-key-1', operations);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when granting user space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToUser1.mockRejectedValue(new Error('boom'));

    const result = await service.grantUserSpacePermissions('DEV', 'user-key-1', []);

    expect(result.success).toBe(false);
  });

  it('revokes anonymous space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromAnonymousUser.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.revokeAnonymousSpacePermissions('DEV', operations);

    expect(SPACE_PERMISSIONS.revokePermissionsFromAnonymousUser).toHaveBeenCalledWith('DEV', operations);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when revoking anonymous space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromAnonymousUser.mockRejectedValue(new Error('boom'));

    const result = await service.revokeAnonymousSpacePermissions('DEV', []);

    expect(result.success).toBe(false);
  });

  it('revokes group space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromGroup1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.revokeGroupSpacePermissions('DEV', 'developers', operations);

    expect(SPACE_PERMISSIONS.revokePermissionsFromGroup1).toHaveBeenCalledWith('DEV', 'developers', operations);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when revoking group space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromGroup1.mockRejectedValue(new Error('boom'));

    const result = await service.revokeGroupSpacePermissions('DEV', 'developers', []);

    expect(result.success).toBe(false);
  });

  it('revokes user space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromUser1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.revokeUserSpacePermissions('DEV', 'user-key-1', operations);

    expect(SPACE_PERMISSIONS.revokePermissionsFromUser1).toHaveBeenCalledWith('DEV', 'user-key-1', operations);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when revoking user space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromUser1.mockRejectedValue(new Error('boom'));

    const result = await service.revokeUserSpacePermissions('DEV', 'user-key-1', []);

    expect(result.success).toBe(false);
  });
});

describe('ConfluenceService users and groups', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets the current user', async () => {
    USER.getCurrent.mockResolvedValue({ username: 'me' });

    const result = await service.getCurrentUser('status');

    expect(USER.getCurrent).toHaveBeenCalledWith('status');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ username: 'me' });
  });

  it('forwards API errors when getting the current user', async () => {
    USER.getCurrent.mockRejectedValue(new Error('boom'));

    const result = await service.getCurrentUser();

    expect(result.success).toBe(false);
  });

  it('gets the anonymous user representation', async () => {
    USER.getAnonymous.mockResolvedValue({ username: 'anonymous' });

    const result = await service.getAnonymousUser();

    expect(USER.getAnonymous).toHaveBeenCalledWith(undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the anonymous user', async () => {
    USER.getAnonymous.mockRejectedValue(new Error('boom'));

    const result = await service.getAnonymousUser();

    expect(result.success).toBe(false);
  });

  it('gets a user by key or username', async () => {
    USER.getUser.mockResolvedValue({ username: 'jdoe' });

    const result = await service.getUser('key-1', undefined, 'status');

    expect(USER.getUser).toHaveBeenCalledWith('status', 'key-1', undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a user', async () => {
    USER.getUser.mockRejectedValue(new Error('boom'));

    const result = await service.getUser('key-1');

    expect(result.success).toBe(false);
  });

  it('lists registered users with the default page-size limit', async () => {
    USER.getUsers.mockResolvedValue({ results: [] });

    await service.getUsers();

    expect(USER.getUsers).toHaveBeenCalledWith(undefined, '25', undefined);
  });

  it('forwards API errors when listing users', async () => {
    USER.getUsers.mockRejectedValue(new Error('boom'));

    const result = await service.getUsers();

    expect(result.success).toBe(false);
  });

  it('gets the groups a user is a member of', async () => {
    USER.getGroups1.mockResolvedValue({ results: [] });

    await service.getUserGroups(undefined, 'jdoe', 10, 0, 'status');

    expect(USER.getGroups1).toHaveBeenCalledWith('status', '10', '0', undefined, 'jdoe');
  });

  it('forwards API errors when getting user groups', async () => {
    USER.getGroups1.mockRejectedValue(new Error('boom'));

    const result = await service.getUserGroups(undefined, 'jdoe');

    expect(result.success).toBe(false);
  });

  it('updates the current user', async () => {
    USER.updateUser1.mockResolvedValue(undefined);

    const result = await service.updateCurrentUser('Jane Doe', 'jane@example.com', 'oldpw');

    expect(USER.updateUser1).toHaveBeenCalledWith({ fullName: 'Jane Doe', email: 'jane@example.com', currentPassword: 'oldpw' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating the current user', async () => {
    USER.updateUser1.mockRejectedValue(new Error('boom'));

    const result = await service.updateCurrentUser('Jane Doe');

    expect(result.success).toBe(false);
  });

  it('changes the current user password', async () => {
    USER.changePassword1.mockResolvedValue(undefined);

    const result = await service.changeCurrentUserPassword('newpw', 'oldpw');

    expect(USER.changePassword1).toHaveBeenCalledWith({ newPassword: 'newpw', oldPassword: 'oldpw' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when changing the current user password', async () => {
    USER.changePassword1.mockRejectedValue(new Error('boom'));

    const result = await service.changeCurrentUserPassword('newpw');

    expect(result.success).toBe(false);
  });

  it('gets a group by name', async () => {
    GROUP.getGroup.mockResolvedValue({ name: 'developers' });

    const result = await service.getGroup('developers', 'status');

    expect(GROUP.getGroup).toHaveBeenCalledWith('developers', 'status');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a group', async () => {
    GROUP.getGroup.mockRejectedValue(new Error('boom'));

    const result = await service.getGroup('developers');

    expect(result.success).toBe(false);
  });

  it('lists groups with the default page-size limit', async () => {
    GROUP.getGroups.mockResolvedValue({ results: [] });

    await service.getGroups();

    expect(GROUP.getGroups).toHaveBeenCalledWith(undefined, 25, undefined);
  });

  it('forwards API errors when listing groups', async () => {
    GROUP.getGroups.mockRejectedValue(new Error('boom'));

    const result = await service.getGroups();

    expect(result.success).toBe(false);
  });

  it('gets the members of a group', async () => {
    GROUP.getMembers.mockResolvedValue({ results: [] });

    await service.getGroupMembers('developers', 10, 0, 'status');

    expect(GROUP.getMembers).toHaveBeenCalledWith('developers', 'status', 10, 0);
  });

  it('forwards API errors when getting group members', async () => {
    GROUP.getMembers.mockRejectedValue(new Error('boom'));

    const result = await service.getGroupMembers('developers');

    expect(result.success).toBe(false);
  });

  it('gets the nested group members of a group', async () => {
    GROUP.getNestedGroupMembers.mockResolvedValue({ results: [] });

    await service.getNestedGroupMembers('developers', 10, 0, 'status');

    expect(GROUP.getNestedGroupMembers).toHaveBeenCalledWith('developers', 'status', 10, 0);
  });

  it('forwards API errors when getting nested group members', async () => {
    GROUP.getNestedGroupMembers.mockRejectedValue(new Error('boom'));

    const result = await service.getNestedGroupMembers('developers');

    expect(result.success).toBe(false);
  });

  it('adds a user to a group', async () => {
    USER_GROUP.update5.mockResolvedValue(undefined);

    const result = await service.addUserToGroup('jdoe', 'developers');

    expect(USER_GROUP.update5).toHaveBeenCalledWith('developers', 'jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when adding a user to a group', async () => {
    USER_GROUP.update5.mockRejectedValue(new Error('boom'));

    const result = await service.addUserToGroup('jdoe', 'developers');

    expect(result.success).toBe(false);
  });

  it('removes a user from a group', async () => {
    USER_GROUP.delete6.mockResolvedValue(undefined);

    const result = await service.removeUserFromGroup('jdoe', 'developers');

    expect(USER_GROUP.delete6).toHaveBeenCalledWith('developers', 'jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when removing a user from a group', async () => {
    USER_GROUP.delete6.mockRejectedValue(new Error('boom'));

    const result = await service.removeUserFromGroup('jdoe', 'developers');

    expect(result.success).toBe(false);
  });

  it('creates a user as an admin', async () => {
    ADMIN_USER.createUser.mockResolvedValue({ key: 'new-key' });

    const result = await service.adminCreateUser('jdoe', 'Jane Doe', 'jane@example.com', 'secret');

    expect(ADMIN_USER.createUser).toHaveBeenCalledWith({
      userName: 'jdoe',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret',
      notifyViaEmail: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a user as an admin', async () => {
    ADMIN_USER.createUser.mockRejectedValue(new Error('boom'));

    const result = await service.adminCreateUser('jdoe', 'Jane Doe', 'jane@example.com');

    expect(result.success).toBe(false);
  });

  it('updates a user as an admin', async () => {
    ADMIN_USER.updateUser.mockResolvedValue(undefined);

    const result = await service.adminUpdateUser('jdoe', 'Jane Doe', 'jane@example.com');

    expect(ADMIN_USER.updateUser).toHaveBeenCalledWith('jdoe', { fullName: 'Jane Doe', email: 'jane@example.com' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating a user as an admin', async () => {
    ADMIN_USER.updateUser.mockRejectedValue(new Error('boom'));

    const result = await service.adminUpdateUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('deletes a user as an admin', async () => {
    ADMIN_USER.delete1.mockResolvedValue({ status: 'ACCEPTED' });

    const result = await service.adminDeleteUser('jdoe');

    expect(ADMIN_USER.delete1).toHaveBeenCalledWith('jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a user as an admin', async () => {
    ADMIN_USER.delete1.mockRejectedValue(new Error('boom'));

    const result = await service.adminDeleteUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('disables a user as an admin', async () => {
    ADMIN_USER.disable.mockResolvedValue(undefined);

    const result = await service.adminDisableUser('jdoe');

    expect(ADMIN_USER.disable).toHaveBeenCalledWith('jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when disabling a user as an admin', async () => {
    ADMIN_USER.disable.mockRejectedValue(new Error('boom'));

    const result = await service.adminDisableUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('enables a user as an admin', async () => {
    ADMIN_USER.enable.mockResolvedValue(undefined);

    const result = await service.adminEnableUser('jdoe');

    expect(ADMIN_USER.enable).toHaveBeenCalledWith('jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when enabling a user as an admin', async () => {
    ADMIN_USER.enable.mockRejectedValue(new Error('boom'));

    const result = await service.adminEnableUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('changes a user password as an admin', async () => {
    ADMIN_USER.changePassword.mockResolvedValue(undefined);

    const result = await service.adminChangeUserPassword('jdoe', 'newpw');

    expect(ADMIN_USER.changePassword).toHaveBeenCalledWith('jdoe', { password: 'newpw' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when changing a user password as an admin', async () => {
    ADMIN_USER.changePassword.mockRejectedValue(new Error('boom'));

    const result = await service.adminChangeUserPassword('jdoe', 'newpw');

    expect(result.success).toBe(false);
  });

  it('creates a group as an admin', async () => {
    ADMIN_GROUP.create.mockResolvedValue({ name: 'developers' });

    const result = await service.adminCreateGroup('developers');

    expect(ADMIN_GROUP.create).toHaveBeenCalledWith({ name: 'developers' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a group as an admin', async () => {
    ADMIN_GROUP.create.mockRejectedValue(new Error('boom'));

    const result = await service.adminCreateGroup('developers');

    expect(result.success).toBe(false);
  });

  it('deletes a group as an admin', async () => {
    ADMIN_GROUP.delete.mockResolvedValue(undefined);

    const result = await service.adminDeleteGroup('developers');

    expect(ADMIN_GROUP.delete).toHaveBeenCalledWith('developers');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a group as an admin', async () => {
    ADMIN_GROUP.delete.mockRejectedValue(new Error('boom'));

    const result = await service.adminDeleteGroup('developers');

    expect(result.success).toBe(false);
  });

  it('lists active users with the default page-size limit', async () => {
    ADMIN_USERS.getActiveUsers.mockResolvedValue({ results: [] });

    await service.adminGetActiveUsers();

    expect(ADMIN_USERS.getActiveUsers).toHaveBeenCalledWith(undefined, '25', undefined);
  });

  it('forwards API errors when listing active users', async () => {
    ADMIN_USERS.getActiveUsers.mockRejectedValue(new Error('boom'));

    const result = await service.adminGetActiveUsers();

    expect(result.success).toBe(false);
  });
});

describe('ConfluenceService blueprint draft publishing', () => {
  let service: ConfluenceService;
  const draftContent = {
    id: 'draft-1',
    type: 'page',
    status: 'current',
    title: 'From template',
    space: { key: 'DEV' },
  };

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('publishes a shared blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishSharedDraft.mockResolvedValue({ id: 'draft-1' });

    const result = await service.publishBlueprintSharedDraft('draft-1', draftContent);

    expect(CONTENT_BLUEPRINT.publishSharedDraft).toHaveBeenCalledWith('draft-1', undefined, 'draft', draftContent);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when publishing a shared blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishSharedDraft.mockRejectedValue(new Error('boom'));

    const result = await service.publishBlueprintSharedDraft('draft-1', draftContent);

    expect(result.success).toBe(false);
  });

  it('publishes a legacy blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishLegacyDraft.mockResolvedValue({ id: 'draft-1' });

    const result = await service.publishBlueprintLegacyDraft('draft-1', draftContent, 'history');

    expect(CONTENT_BLUEPRINT.publishLegacyDraft).toHaveBeenCalledWith('draft-1', 'history', 'draft', draftContent);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when publishing a legacy blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishLegacyDraft.mockRejectedValue(new Error('boom'));

    const result = await service.publishBlueprintLegacyDraft('draft-1', draftContent);

    expect(result.success).toBe(false);
  });
});

describe('ConfluenceService.convertContentBody', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('converts a content body between representations', async () => {
    CONTENT_BODY.convert.mockResolvedValue({ value: '<p>Hello</p>', representation: 'view' });

    const result = await service.convertContentBody('view', '<p>Hello</p>', 'storage');

    expect(CONTENT_BODY.convert).toHaveBeenCalledWith('view', undefined, { value: '<p>Hello</p>', representation: 'storage' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ value: '<p>Hello</p>', representation: 'view' });
  });

  it('forwards API errors when converting a content body', async () => {
    CONTENT_BODY.convert.mockRejectedValue(new Error('boom'));

    const result = await service.convertContentBody('view', '<p>Hello</p>', 'storage');

    expect(result.success).toBe(false);
  });
});

describe('ConfluenceService webhooks', () => {
  let service: ConfluenceService;
  const webhook = { name: 'my webhook', url: 'https://example.com/webhook', events: ['page_created'], active: true };

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('finds webhooks with the default page-size limit', async () => {
    WEBHOOKS.findWebhooks.mockResolvedValue({ results: [] });

    await service.findWebhooks();

    expect(WEBHOOKS.findWebhooks).toHaveBeenCalledWith('25', undefined, undefined, undefined);
  });

  it('forwards API errors when finding webhooks', async () => {
    WEBHOOKS.findWebhooks.mockRejectedValue(new Error('boom'));

    const result = await service.findWebhooks();

    expect(result.success).toBe(false);
  });

  it('creates a webhook', async () => {
    WEBHOOKS.createWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.createWebhook(webhook);

    expect(WEBHOOKS.createWebhook).toHaveBeenCalledWith(webhook);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a webhook', async () => {
    WEBHOOKS.createWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.createWebhook(webhook);

    expect(result.success).toBe(false);
  });

  it('gets a webhook by ID', async () => {
    WEBHOOKS.getWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.getWebhook('wh-1', true);

    expect(WEBHOOKS.getWebhook).toHaveBeenCalledWith('wh-1', true);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a webhook', async () => {
    WEBHOOKS.getWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhook('wh-1');

    expect(result.success).toBe(false);
  });

  it('updates a webhook', async () => {
    WEBHOOKS.updateWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.updateWebhook('wh-1', webhook);

    expect(WEBHOOKS.updateWebhook).toHaveBeenCalledWith('wh-1', webhook);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating a webhook', async () => {
    WEBHOOKS.updateWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.updateWebhook('wh-1', webhook);

    expect(result.success).toBe(false);
  });

  it('deletes a webhook', async () => {
    WEBHOOKS.deleteWebhook.mockResolvedValue(undefined);

    const result = await service.deleteWebhook('wh-1');

    expect(WEBHOOKS.deleteWebhook).toHaveBeenCalledWith('wh-1');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a webhook', async () => {
    WEBHOOKS.deleteWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.deleteWebhook('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets the latest invocation of a webhook', async () => {
    WEBHOOKS.getLatestInvocation.mockResolvedValue({ outcome: 'SUCCESS' });

    const result = await service.getWebhookLatestInvocation('wh-1', 'SUCCESS', 'page_created');

    expect(WEBHOOKS.getLatestInvocation).toHaveBeenCalledWith('wh-1', 'SUCCESS', 'page_created');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the latest invocation', async () => {
    WEBHOOKS.getLatestInvocation.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookLatestInvocation('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets webhook statistics', async () => {
    WEBHOOKS.getStatistics.mockResolvedValue({ successCount: 1 });

    const result = await service.getWebhookStatistics('wh-1', 'page_created');

    expect(WEBHOOKS.getStatistics).toHaveBeenCalledWith('wh-1', 'page_created');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting webhook statistics', async () => {
    WEBHOOKS.getStatistics.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookStatistics('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets the webhook statistics summary', async () => {
    WEBHOOKS.getStatisticsSummary.mockResolvedValue({ successCount: 1 });

    const result = await service.getWebhookStatisticsSummary('wh-1');

    expect(WEBHOOKS.getStatisticsSummary).toHaveBeenCalledWith('wh-1');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the webhook statistics summary', async () => {
    WEBHOOKS.getStatisticsSummary.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookStatisticsSummary('wh-1');

    expect(result.success).toBe(false);
  });

  it('tests connectivity to a webhook endpoint', async () => {
    WEBHOOKS.testWebhook.mockResolvedValue({ ok: true });

    const result = await service.testWebhook('https://example.com/webhook');

    expect(WEBHOOKS.testWebhook).toHaveBeenCalledWith('https://example.com/webhook');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when testing a webhook', async () => {
    WEBHOOKS.testWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.testWebhook('https://example.com/webhook');

    expect(result.success).toBe(false);
  });
});

describe('ConfluenceService.getServerInfo', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    jest.clearAllMocks();
  });

  it('gets server information', async () => {
    SERVER_INFORMATION.index2.mockResolvedValue({ version: '8.5.0', buildNumber: 8500 });

    const result = await service.getServerInfo();

    expect(SERVER_INFORMATION.index2).toHaveBeenCalledWith();
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting server information', async () => {
    SERVER_INFORMATION.index2.mockRejectedValue(new Error('boom'));

    const result = await service.getServerInfo();

    expect(result.success).toBe(false);
  });
});
