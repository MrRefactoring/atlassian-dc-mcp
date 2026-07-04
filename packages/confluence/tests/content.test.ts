import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  SearchService,
  ContentResourceService,
  ChildContentService,
  ContentDescendantService,
  ContentLabelsService,
  ContentPropertyService,
  ContentRestrictionsService,
  ContentWatchersService,
  UserWatchService,
} from '../src/confluenceClient/index.js';
import { ConfluenceService } from '../src/confluenceService.js';

const CONTENT_RESOURCE = ContentResourceService as unknown as Record<string, Mock>;
const CHILD_CONTENT = ChildContentService as unknown as Record<string, Mock>;
const CONTENT_DESCENDANT = ContentDescendantService as unknown as Record<string, Mock>;
const CONTENT_LABELS = ContentLabelsService as unknown as Record<string, Mock>;
const CONTENT_PROPERTY = ContentPropertyService as unknown as Record<string, Mock>;
const CONTENT_RESTRICTIONS = ContentRestrictionsService as unknown as Record<string, Mock>;
const CONTENT_WATCHERS = ContentWatchersService as unknown as Record<string, Mock>;
const USER_WATCH = UserWatchService as unknown as Record<string, Mock>;

vi.mock('../src/confluenceClient/index.js', () => ({
  SearchService: {
    search1: vi.fn(),
  },
  ContentResourceService: {
    getContentById: vi.fn(),
    createContent: vi.fn(),
    update2: vi.fn(),
    delete3: vi.fn(),
    getHistory: vi.fn(),
  },
  ChildContentService: {
    children: vi.fn(),
    childrenOfType: vi.fn(),
    commentsOfContent: vi.fn(),
  },
  ContentDescendantService: {
    descendants: vi.fn(),
    descendantsOfType: vi.fn(),
  },
  ContentLabelsService: {
    labels: vi.fn(),
    addLabels: vi.fn(),
    deleteLabelWithQueryParam: vi.fn(),
  },
  ContentPropertyService: {
    findAll: vi.fn(),
    findByKey: vi.fn(),
    create1: vi.fn(),
    update1: vi.fn(),
    delete2: vi.fn(),
  },
  ContentRestrictionsService: {
    byOperation: vi.fn(),
    forOperation: vi.fn(),
    updateRestrictions: vi.fn(),
  },
  ContentWatchersService: {
    index: vi.fn(),
  },
  UserWatchService: {
    isWatchingContent: vi.fn(),
    addContentWatcher: vi.fn(),
    removeContentWatcher: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
}));

describe('ConfluenceService.searchSpaces', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('builds CQL with escaped searchText and calls SearchService', async () => {
    (SearchService.search1 as Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('my space', 10, 0);

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '10',
      '0',
      'none',
      'type=space AND title ~ "my space"',
    );
  });

  it('escapes quotes in searchText in the CQL passed to the API', async () => {
    (SearchService.search1 as Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('say "hello"', 5);

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '5',
      undefined,
      'none',
      'type=space AND title ~ "say \\"hello\\""',
    );
  });

  it('escapes backslashes in searchText in the CQL passed to the API', async () => {
    (SearchService.search1 as Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('path\\to\\space', 5);

    expect(SearchService.search1).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      '5',
      undefined,
      'none',
      'type=space AND title ~ "path\\\\to\\\\space"',
    );
  });

  it('forwards API errors via handleApiOperation', async () => {
    const err = new Error('API error');
    (SearchService.search1 as Mock).mockRejectedValue(err);

    const result = await service.searchSpaces('test');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});


describe('ConfluenceService content lifecycle (delete + history)', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
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
    vi.clearAllMocks();
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
    vi.clearAllMocks();
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
    vi.clearAllMocks();
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
      { key: 'my-key', value: 'new-value', version: { number: 2 } },
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
    vi.clearAllMocks();
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
      restrictions,
    );
  });
});


describe('ConfluenceService content watchers', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
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
