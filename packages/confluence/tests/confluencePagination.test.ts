import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  users: { getCurrent: vi.fn(), getGroups: vi.fn() },
  spaces: { spaces: vi.fn() },
  attachments: { getAttachments: vi.fn() },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

const GROUP = conf.users;
const SPACE = conf.spaces;
const ATTACHMENTS = conf.attachments;

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
