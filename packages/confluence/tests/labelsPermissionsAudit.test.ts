import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  AccessModeService,
  ContentVersionService,
  DefaultService,
  GlobalPermissionsService,
  LabelService,
  SpaceLabelService,
  SpaceWatchersService,
} from '../src/confluenceClient/index.js';
import { ConfluenceService } from '../src/confluenceService.js';

const LABEL = LabelService as unknown as Record<string, Mock>;
const SPACE_LABEL = SpaceLabelService as unknown as Record<string, Mock>;
const SPACE_WATCHERS = SpaceWatchersService as unknown as Record<string, Mock>;
const ACCESS_MODE = AccessModeService as unknown as Record<string, Mock>;
const DEFAULT = DefaultService as unknown as Record<string, Mock>;
const GLOBAL_PERMS = GlobalPermissionsService as unknown as Record<string, Mock>;
const CONTENT_VERSION = ContentVersionService as unknown as Record<string, Mock>;

vi.mock('../src/confluenceClient/index.js', () => ({
  OpenAPI: {},
  UserService: { getCurrent: vi.fn() },
  LabelService: {
    recent: vi.fn(),
    related: vi.fn(),
  },
  SpaceLabelService: {
    index3: vi.fn(),
    popular1: vi.fn(),
    recent1: vi.fn(),
    related1: vi.fn(),
  },
  SpaceWatchersService: {
    index4: vi.fn(),
  },
  AccessModeService: {
    getAccessModeStatus: vi.fn(),
  },
  DefaultService: {
    getAuditRecords: vi.fn(),
  },
  GlobalPermissionsService: {
    getAllGlobalPermissions: vi.fn(),
  },
  ContentVersionService: {
    deleteContentHistory: vi.fn(),
  },
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
      LABEL.recent.mockResolvedValue({ results: [] });

      const result = await service.getRecentlyUsedLabels();

      expect(LABEL.recent).toHaveBeenCalledWith('25', undefined);
      expect(result.success).toBe(true);
    });

    it('getRelatedLabels forwards labelName and (start, limit) order', async () => {
      LABEL.related.mockResolvedValue({ results: [] });

      await service.getRelatedLabels('bug', 10, 5);

      expect(LABEL.related).toHaveBeenCalledWith('bug', '5', '10');
    });
  });

  describe('space labels', () => {
    it('getSpaceLabels forwards spaceKey and pagination', async () => {
      SPACE_LABEL.index3.mockResolvedValue({ results: [] });

      await service.getSpaceLabels('DS', 5, 10);

      expect(SPACE_LABEL.index3).toHaveBeenCalledWith('DS', '5', '10');
    });

    it('getSpacePopularLabels forwards spaceKey', async () => {
      SPACE_LABEL.popular1.mockResolvedValue({ results: [] });

      await service.getSpacePopularLabels('DS');

      expect(SPACE_LABEL.popular1).toHaveBeenCalledWith('DS', '25', undefined);
    });

    it('getSpaceRecentLabels forwards spaceKey', async () => {
      SPACE_LABEL.recent1.mockResolvedValue({ results: [] });

      await service.getSpaceRecentLabels('DS');

      expect(SPACE_LABEL.recent1).toHaveBeenCalledWith('DS', '25', undefined);
    });

    it('getSpaceRelatedLabels forwards spaceKey and labelName', async () => {
      SPACE_LABEL.related1.mockResolvedValue({ results: [] });

      await service.getSpaceRelatedLabels('DS', 'bug', 5);

      expect(SPACE_LABEL.related1).toHaveBeenCalledWith('DS', 'bug', '5', undefined);
    });
  });

  describe('space watchers', () => {
    it('getSpaceWatchers passes numeric limit/start (not stringified)', async () => {
      SPACE_WATCHERS.index4.mockResolvedValue({ results: [] });

      await service.getSpaceWatchers('DS', 5, 10);

      expect(SPACE_WATCHERS.index4).toHaveBeenCalledWith('DS', 5, 10);
    });

    it('getSpaceWatchers defaults limit to page size', async () => {
      SPACE_WATCHERS.index4.mockResolvedValue({ results: [] });

      await service.getSpaceWatchers('DS');

      expect(SPACE_WATCHERS.index4).toHaveBeenCalledWith('DS', 25, undefined);
    });
  });

  describe('admin reads', () => {
    it('getAccessModeStatus returns the access mode', async () => {
      ACCESS_MODE.getAccessModeStatus.mockResolvedValue('READ_WRITE');

      const result = await service.getAccessModeStatus();

      expect(ACCESS_MODE.getAccessModeStatus).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: 'READ_WRITE' });
    });

    it('getAuditRecords returns audit entities', async () => {
      DEFAULT.getAuditRecords.mockResolvedValue({ entities: [] });

      const result = await service.getAuditRecords();

      expect(DEFAULT.getAuditRecords).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('getGlobalPermissions returns the permission list', async () => {
      GLOBAL_PERMS.getAllGlobalPermissions.mockResolvedValue([{ operation: {} }]);

      const result = await service.getGlobalPermissions();

      expect(GLOBAL_PERMS.getAllGlobalPermissions).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe('content version deletion', () => {
    it('deleteContentVersion stringifies the version number', async () => {
      CONTENT_VERSION.deleteContentHistory.mockResolvedValue(undefined);

      await service.deleteContentVersion('123', 4);

      expect(CONTENT_VERSION.deleteContentHistory).toHaveBeenCalledWith('123', '4');
    });

    it('deleteContentVersion surfaces a graceful error shape', async () => {
      CONTENT_VERSION.deleteContentHistory.mockRejectedValue({ status: 400, statusText: 'Bad Request', body: {} });

      const result = await service.deleteContentVersion('123', 999);

      expect(result.success).toBe(false);
    });
  });
});
