import { ConfluenceService, escapeSearchTextForCql } from '../confluence-service.js';
import {
  ChildContentService,
  ContentDescendantService,
  ContentLabelsService,
  ContentPropertyService,
  ContentResourceService,
  ContentRestrictionsService,
  SearchService,
} from '../confluence-client/index.js';

const CONTENT_RESOURCE = ContentResourceService as unknown as Record<string, jest.Mock>;
const CHILD_CONTENT = ChildContentService as unknown as Record<string, jest.Mock>;
const CONTENT_DESCENDANT = ContentDescendantService as unknown as Record<string, jest.Mock>;
const CONTENT_LABELS = ContentLabelsService as unknown as Record<string, jest.Mock>;
const CONTENT_PROPERTY = ContentPropertyService as unknown as Record<string, jest.Mock>;
const CONTENT_RESTRICTIONS = ContentRestrictionsService as unknown as Record<string, jest.Mock>;

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
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

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
