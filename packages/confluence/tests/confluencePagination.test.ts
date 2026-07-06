import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  AttachmentsService,
  GroupService,
  SpaceService,
} from '../src/confluenceClient/index.js';
import { ConfluenceService } from '../src/confluenceService.js';

const GROUP = GroupService as unknown as Record<string, Mock>;
const SPACE = SpaceService as unknown as Record<string, Mock>;
const ATTACHMENTS = AttachmentsService as unknown as Record<string, Mock>;

vi.mock('../src/confluenceClient/index.js', () => ({
  OpenAPI: {},
  UserService: { getCurrent: vi.fn() },
  GroupService: { getGroups: vi.fn() },
  SpaceService: { spaces: vi.fn() },
  AttachmentsService: { getAttachments: vi.fn() },
}));

describe('ConfluenceService opt-in fetchAll pagination', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ConfluenceService('test-host', 'test-token', undefined, () => 2);
  });

  describe('getGroups', () => {
    it('follows _links.next across pages and returns a flat array', async () => {
      GROUP.getGroups
        .mockResolvedValueOnce({ results: [{ name: 'a' }, { name: 'b' }], _links: { next: '/next' } })
        .mockResolvedValueOnce({ results: [{ name: 'c' }], _links: {} });

      const result = await service.getGroups(undefined, undefined, undefined, true);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ name: 'a' }, { name: 'b' }, { name: 'c' }]);
      expect(GROUP.getGroups).toHaveBeenCalledTimes(2);
    });

    it('stops when a page has no _links.next', async () => {
      GROUP.getGroups.mockResolvedValueOnce({ results: [{ name: 'only' }], _links: {} });

      const result = await service.getGroups(undefined, undefined, undefined, true);

      expect(result.data).toEqual([{ name: 'only' }]);
      expect(GROUP.getGroups).toHaveBeenCalledTimes(1);
    });

    it('without fetchAll returns the single raw page', async () => {
      const page = { results: [{ name: 'a' }], _links: { next: '/next' } };
      GROUP.getGroups.mockResolvedValue(page);

      const result = await service.getGroups();

      expect(result.data).toBe(page);
      expect(GROUP.getGroups).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSpaces', () => {
    it('follows pagination when fetchAll is set', async () => {
      SPACE.spaces
        .mockResolvedValueOnce({ results: [{ key: 'A' }], _links: { next: '/next' } })
        .mockResolvedValueOnce({ results: [{ key: 'B' }], _links: {} });

      const result = await service.getSpaces(
        undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true,
      );

      expect(result.data).toEqual([{ key: 'A' }, { key: 'B' }]);
      expect(SPACE.spaces).toHaveBeenCalledTimes(2);
    });

    it('without fetchAll returns the single raw page', async () => {
      const page = { results: [{ key: 'A' }], _links: {} };
      SPACE.spaces.mockResolvedValue(page);

      const result = await service.getSpaces();

      expect(result.data).toBe(page);
      expect(SPACE.spaces).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAttachments', () => {
    it('follows pagination when fetchAll is set', async () => {
      ATTACHMENTS.getAttachments
        .mockResolvedValueOnce({ results: [{ id: '1' }], _links: { next: '/next' } })
        .mockResolvedValueOnce({ results: [{ id: '2' }], _links: {} });

      const result = await service.getAttachments(
        '123', undefined, undefined, undefined, undefined, undefined, true,
      );

      expect(result.data).toEqual([{ id: '1' }, { id: '2' }]);
      expect(ATTACHMENTS.getAttachments).toHaveBeenCalledTimes(2);
    });

    it('without fetchAll returns the single raw page', async () => {
      const page = { results: [{ id: '1' }], _links: {} };
      ATTACHMENTS.getAttachments.mockResolvedValue(page);

      const result = await service.getAttachments('123');

      expect(result.data).toBe(page);
      expect(ATTACHMENTS.getAttachments).toHaveBeenCalledTimes(1);
    });
  });
});
