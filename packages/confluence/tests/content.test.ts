import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  content: {
    search1: vi.fn(),
    getContentById: vi.fn(),
    createContent: vi.fn(),
    update2: vi.fn(),
    delete3: vi.fn(),
    getHistory: vi.fn(),
    children: vi.fn(),
    childrenOfType: vi.fn(),
    commentsOfContent: vi.fn(),
    descendants: vi.fn(),
    descendantsOfType: vi.fn(),
    labels: vi.fn(),
    addLabels: vi.fn(),
    deleteLabelWithQueryParam: vi.fn(),
    findAll: vi.fn(),
    findByKey: vi.fn(),
    create1: vi.fn(),
    update1: vi.fn(),
    delete2: vi.fn(),
    byOperation: vi.fn(),
    forOperation: vi.fn(),
    updateRestrictions: vi.fn(),
    index: vi.fn(),
    isWatchingContent: vi.fn(),
    addContentWatcher: vi.fn(),
    removeContentWatcher: vi.fn(),
  },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService.searchSpaces', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('builds CQL with escaped searchText and calls the content search', async () => {
    (conf.content.search1 as Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('my space', 10, 0);

    expect(conf.content.search1).toHaveBeenCalledWith({
      expand: undefined,
      limit: '10',
      start: '0',
      excerpt: 'none',
      cql: 'type=space AND title ~ "my space"',
    });
  });

  it('escapes quotes in searchText in the CQL passed to the API', async () => {
    (conf.content.search1 as Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('say "hello"', 5);

    expect(conf.content.search1).toHaveBeenCalledWith({
      expand: undefined,
      limit: '5',
      start: undefined,
      excerpt: 'none',
      cql: 'type=space AND title ~ "say \\"hello\\""',
    });
  });

  it('escapes backslashes in searchText in the CQL passed to the API', async () => {
    (conf.content.search1 as Mock).mockResolvedValue({ results: [] });

    await service.searchSpaces('path\\to\\space', 5);

    expect(conf.content.search1).toHaveBeenCalledWith({
      expand: undefined,
      limit: '5',
      start: undefined,
      excerpt: 'none',
      cql: 'type=space AND title ~ "path\\\\to\\\\space"',
    });
  });

  it('forwards API errors via handleApiOperation', async () => {
    const err = new Error('API error');
    (conf.content.search1 as Mock).mockRejectedValue(err);

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
    conf.content.delete3.mockResolvedValue(undefined);

    const result = await service.deleteContent('123');

    expect(conf.content.delete3).toHaveBeenCalledWith({ id: '123', status: undefined });
    expect(result.success).toBe(true);
  });

  it('forwards the status selector when purging trashed content', async () => {
    conf.content.delete3.mockResolvedValue(undefined);

    await service.deleteContent('123', 'trashed');

    expect(conf.content.delete3).toHaveBeenCalledWith({ id: '123', status: 'trashed' });
  });

  it('gets content history with an expand list', async () => {
    conf.content.getHistory.mockResolvedValue({ latest: true });

    const result = await service.getContentHistory('123', 'contributors');

    expect(conf.content.getHistory).toHaveBeenCalledWith({ id: '123', expand: 'contributors' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ latest: true });
  });

  it('forwards API errors via handleApiOperation', async () => {
    conf.content.delete3.mockRejectedValue(new Error('boom'));

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
    conf.content.children.mockResolvedValue({ results: [] });

    await service.getContentChildren('123', 'page');

    expect(conf.content.children).toHaveBeenCalledWith({ id: '123', expand: 'page', limit: '25', start: undefined });
  });

  it('passes an explicit limit and start as strings for children', async () => {
    conf.content.children.mockResolvedValue({ results: [] });

    await service.getContentChildren('123', undefined, 10, 5);

    expect(conf.content.children).toHaveBeenCalledWith({ id: '123', expand: undefined, limit: '10', start: '5' });
  });

  it('gets children filtered by type', async () => {
    conf.content.childrenOfType.mockResolvedValue({ results: [] });

    await service.getContentChildrenByType('123', 'comment', 'body.view', 3, 0);

    expect(conf.content.childrenOfType).toHaveBeenCalledWith({ id: '123', type: 'comment', expand: 'body.view', limit: '3', start: '0' });
  });

  it('gets comments forwarding depth and location', async () => {
    conf.content.commentsOfContent.mockResolvedValue({ results: [] });

    await service.getContentComments('123', 'body.view', 'all', 7, 2, 'inline');

    expect(conf.content.commentsOfContent).toHaveBeenCalledWith({ id: '123', expand: 'body.view', depth: 'all', limit: '7', start: '2', location: 'inline' });
  });

  it('gets descendants (no pagination params)', async () => {
    conf.content.descendants.mockResolvedValue({ results: [] });

    await service.getContentDescendants('123', 'comment');

    expect(conf.content.descendants).toHaveBeenCalledWith({ id: '123', expand: 'comment' });
  });

  it('gets descendants filtered by type with pagination', async () => {
    conf.content.descendantsOfType.mockResolvedValue({ results: [] });

    await service.getContentDescendantsByType('123', 'comment', undefined, 50, 10);

    expect(conf.content.descendantsOfType).toHaveBeenCalledWith({ id: '123', type: 'comment', expand: undefined, limit: '50', start: '10' });
  });
});


describe('ConfluenceService content labels', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets labels with prefix filter and default limit', async () => {
    conf.content.labels.mockResolvedValue({ results: [] });

    await service.getContentLabels('123', 'global');

    expect(conf.content.labels).toHaveBeenCalledWith({ id: '123', prefix: 'global', limit: '25', start: undefined });
  });

  it('adds labels forwarding the list as the request body', async () => {
    conf.content.addLabels.mockResolvedValue({ results: [] });
    const labels = [{ name: 'docs' }, { prefix: 'global', name: 'api' }];

    await service.addContentLabels('123', labels);

    expect(conf.content.addLabels).toHaveBeenCalledWith({ id: '123', requestBody: labels });
  });

  it('deletes a label using the query-param variant', async () => {
    conf.content.deleteLabelWithQueryParam.mockResolvedValue(undefined);

    const result = await service.deleteContentLabel('123', 'docs');

    expect(conf.content.deleteLabelWithQueryParam).toHaveBeenCalledWith({ id: '123', name: 'docs' });
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
    conf.content.findAll.mockResolvedValue({ results: [] });

    await service.getContentProperties('123', 'version');

    expect(conf.content.findAll).toHaveBeenCalledWith({ id: '123', expand: 'version', limit: '25', start: undefined });
  });

  it('gets a single property by key', async () => {
    conf.content.findByKey.mockResolvedValue({ key: 'k' });

    await service.getContentProperty('123', 'my-key', 'content');

    expect(conf.content.findByKey).toHaveBeenCalledWith({ id: '123', key: 'my-key', expand: 'content' });
  });

  it('creates a property wrapping key and value into the body', async () => {
    conf.content.create1.mockResolvedValue({ key: 'k' });

    await service.createContentProperty('123', 'my-key', { enabled: true });

    expect(conf.content.create1).toHaveBeenCalledWith({ id: '123', requestBody: { key: 'my-key', value: { enabled: true } } });
  });

  it('updates a property with the new version number', async () => {
    conf.content.update1.mockResolvedValue({ key: 'k' });

    await service.updateContentProperty('123', 'my-key', 'new-value', 2);

    expect(conf.content.update1).toHaveBeenCalledWith({
      id: '123',
      key: 'my-key',
      requestBody: { key: 'my-key', value: 'new-value', version: { number: 2 } },
    });
  });

  it('deletes a property by key', async () => {
    conf.content.delete2.mockResolvedValue(undefined);

    const result = await service.deleteContentProperty('123', 'my-key');

    expect(conf.content.delete2).toHaveBeenCalledWith({ id: '123', key: 'my-key' });
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
    conf.content.byOperation.mockResolvedValue({ read: {} });

    await service.getContentRestrictions('123', 'restrictions.user');

    expect(conf.content.byOperation).toHaveBeenCalledWith({ id: '123', expand: 'restrictions.user' });
  });

  it('gets restrictions for a single operation with pagination', async () => {
    conf.content.forOperation.mockResolvedValue({ results: [] });

    await service.getContentRestrictionsByOperation('read', '123', 'restrictions.group', 10, 0);

    expect(conf.content.forOperation).toHaveBeenCalledWith({ operationKey: 'read', id: '123', expand: 'restrictions.group', limit: '10', start: '0' });
  });

  it('forwards the restrictions array as the request body when updating', async () => {
    conf.content.updateRestrictions.mockResolvedValue({ results: [] });
    const restrictions = [
      { operation: 'update', restrictions: { user: [{ type: 'known', username: 'admin' }] } },
    ];

    await service.updateContentRestrictions('123', restrictions, 'restrictions.user');

    expect(conf.content.updateRestrictions).toHaveBeenCalledWith({
      id: '123',
      expand: 'restrictions.user',
      limit: undefined,
      start: undefined,
      requestBody: restrictions,
    });
  });
});


describe('ConfluenceService content watchers', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('lists watchers with the default page-size limit', async () => {
    conf.content.index.mockResolvedValue({ results: [] });

    await service.getContentWatchers('123');

    expect(conf.content.index).toHaveBeenCalledWith({ contentId: '123', limit: '25', start: undefined });
  });

  it('checks the current user watch state when no user is given', async () => {
    conf.content.isWatchingContent.mockResolvedValue({ watching: true });

    await service.isWatchingContent('123');

    expect(conf.content.isWatchingContent).toHaveBeenCalledWith({ contentId: '123', key: undefined, username: undefined });
  });

  it('adds a watcher for a named user', async () => {
    conf.content.addContentWatcher.mockResolvedValue({ watching: true });

    await service.addContentWatcher('123', undefined, 'jblogs');

    expect(conf.content.addContentWatcher).toHaveBeenCalledWith({ contentId: '123', key: undefined, username: 'jblogs' });
  });

  it('removes a watcher by user key', async () => {
    conf.content.removeContentWatcher.mockResolvedValue(undefined);

    const result = await service.removeContentWatcher('123', 'user-key');

    expect(conf.content.removeContentWatcher).toHaveBeenCalledWith({ contentId: '123', key: 'user-key', username: undefined });
    expect(result.success).toBe(true);
  });
});
