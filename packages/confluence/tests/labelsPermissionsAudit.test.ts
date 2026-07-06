import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  content: {
    recent: vi.fn(),
    related: vi.fn(),
    deleteContentHistory: vi.fn(),
  },
  spaces: {
    index3: vi.fn(),
    popular1: vi.fn(),
    recent1: vi.fn(),
    related1: vi.fn(),
    index4: vi.fn(),
  },
  admin: {
    getAccessModeStatus: vi.fn(),
    getAuditRecords: vi.fn(),
    getAllGlobalPermissions: vi.fn(),
  },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService labels/permissions/audit', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Default page size resolves from config; force a deterministic value.
    service = new ConfluenceService('test-host', 'test-token', undefined, () => 25);
  });

  describe('instance-wide labels', () => {
    it('getRecentlyUsedLabels passes limit/start as strings, defaulting limit to page size', async () => {
      conf.content.recent.mockResolvedValue({ results: [] });

      const result = await service.getRecentlyUsedLabels();

      expect(conf.content.recent).toHaveBeenCalledWith({ limit: '25', start: undefined });
      expect(result.success).toBe(true);
    });

    it('getRelatedLabels forwards labelName and (start, limit) order', async () => {
      conf.content.related.mockResolvedValue({ results: [] });

      await service.getRelatedLabels('bug', 10, 5);

      expect(conf.content.related).toHaveBeenCalledWith({ labelName: 'bug', start: '5', limit: '10' });
    });
  });

  describe('space labels', () => {
    it('getSpaceLabels forwards spaceKey and pagination', async () => {
      conf.spaces.index3.mockResolvedValue({ results: [] });

      await service.getSpaceLabels('DS', 5, 10);

      expect(conf.spaces.index3).toHaveBeenCalledWith({ spaceKey: 'DS', limit: '5', start: '10' });
    });

    it('getSpacePopularLabels forwards spaceKey', async () => {
      conf.spaces.popular1.mockResolvedValue({ results: [] });

      await service.getSpacePopularLabels('DS');

      expect(conf.spaces.popular1).toHaveBeenCalledWith({ spaceKey: 'DS', limit: '25', start: undefined });
    });

    it('getSpaceRecentLabels forwards spaceKey', async () => {
      conf.spaces.recent1.mockResolvedValue({ results: [] });

      await service.getSpaceRecentLabels('DS');

      expect(conf.spaces.recent1).toHaveBeenCalledWith({ spaceKey: 'DS', limit: '25', start: undefined });
    });

    it('getSpaceRelatedLabels forwards spaceKey and labelName', async () => {
      conf.spaces.related1.mockResolvedValue({ results: [] });

      await service.getSpaceRelatedLabels('DS', 'bug', 5);

      expect(conf.spaces.related1).toHaveBeenCalledWith({ spaceKey: 'DS', labelName: 'bug', limit: '5', start: undefined });
    });
  });

  describe('space watchers', () => {
    it('getSpaceWatchers passes numeric limit/start (not stringified)', async () => {
      conf.spaces.index4.mockResolvedValue({ results: [] });

      await service.getSpaceWatchers('DS', 5, 10);

      expect(conf.spaces.index4).toHaveBeenCalledWith({ spaceKey: 'DS', limit: 5, start: 10 });
    });

    it('getSpaceWatchers defaults limit to page size', async () => {
      conf.spaces.index4.mockResolvedValue({ results: [] });

      await service.getSpaceWatchers('DS');

      expect(conf.spaces.index4).toHaveBeenCalledWith({ spaceKey: 'DS', limit: 25, start: undefined });
    });
  });

  describe('admin reads', () => {
    it('getAccessModeStatus returns the access mode', async () => {
      conf.admin.getAccessModeStatus.mockResolvedValue('READ_WRITE');

      const result = await service.getAccessModeStatus();

      expect(conf.admin.getAccessModeStatus).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ success: true, data: 'READ_WRITE' });
    });

    it('getAuditRecords returns audit entities', async () => {
      conf.admin.getAuditRecords.mockResolvedValue({ entities: [] });

      const result = await service.getAuditRecords();

      expect(conf.admin.getAuditRecords).toHaveBeenCalledWith(undefined);
      expect(result.success).toBe(true);
    });

    it('getGlobalPermissions returns the permission list', async () => {
      conf.admin.getAllGlobalPermissions.mockResolvedValue([{ operation: {} }]);

      const result = await service.getGlobalPermissions();

      expect(conf.admin.getAllGlobalPermissions).toHaveBeenCalledWith(undefined);
      expect(result.success).toBe(true);
    });
  });

  describe('content version deletion', () => {
    it('deleteContentVersion stringifies the version number', async () => {
      conf.content.deleteContentHistory.mockResolvedValue(undefined);

      await service.deleteContentVersion('123', 4);

      expect(conf.content.deleteContentHistory).toHaveBeenCalledWith({ id: '123', versionNumber: '4' });
    });

    it('deleteContentVersion surfaces a graceful error shape', async () => {
      conf.content.deleteContentHistory.mockRejectedValue({ status: 400, statusText: 'Bad Request', body: {} });

      const result = await service.deleteContentVersion('123', 999);

      expect(result.success).toBe(false);
    });
  });
});
