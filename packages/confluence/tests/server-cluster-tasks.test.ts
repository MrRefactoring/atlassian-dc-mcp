import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  ServerInformationService,
  ClusterInformationService,
  LongTaskService,
  BackupAndRestoreService,
  InstanceMetricsService,
} from '../src/confluence-client/index.js';
import { ConfluenceService } from '../src/confluence-service.js';

const SERVER_INFORMATION = ServerInformationService as unknown as Record<string, Mock>;
const CLUSTER_INFORMATION = ClusterInformationService as unknown as Record<string, Mock>;
const LONG_TASK = LongTaskService as unknown as Record<string, Mock>;
const BACKUP_AND_RESTORE = BackupAndRestoreService as unknown as Record<string, Mock>;
const INSTANCE_METRICS = InstanceMetricsService as unknown as Record<string, Mock>;

vi.mock('../src/confluence-client/index.js', () => ({
  ServerInformationService: {
    index2: vi.fn(),
  },
  ClusterInformationService: {
    getClusterNodeStatuses: vi.fn(),
  },
  LongTaskService: {
    getTask: vi.fn(),
    getTasks: vi.fn(),
  },
  BackupAndRestoreService: {
    createSiteBackupJob: vi.fn(),
    getJob: vi.fn(),
    findJobs: vi.fn(),
  },
  InstanceMetricsService: {
    index1: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
}));

describe('ConfluenceService.getServerInfo', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
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


describe('ConfluenceService.getClusterNodes', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets cluster node statuses with the given pagination', async () => {
    CLUSTER_INFORMATION.getClusterNodeStatuses.mockResolvedValue({ results: [] });

    await service.getClusterNodes(10, 0);

    expect(CLUSTER_INFORMATION.getClusterNodeStatuses).toHaveBeenCalledWith('10', '0');
  });

  it('gets cluster node statuses without pagination', async () => {
    CLUSTER_INFORMATION.getClusterNodeStatuses.mockResolvedValue({ results: [] });

    const result = await service.getClusterNodes();

    expect(CLUSTER_INFORMATION.getClusterNodeStatuses).toHaveBeenCalledWith(undefined, undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting cluster node statuses', async () => {
    CLUSTER_INFORMATION.getClusterNodeStatuses.mockRejectedValue(new Error('boom'));

    const result = await service.getClusterNodes();

    expect(result.success).toBe(false);
  });
});


describe('ConfluenceService long-running tasks', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets a single long-running task by ID', async () => {
    LONG_TASK.getTask.mockResolvedValue({ id: 'task-1', percentageComplete: 50 });

    const result = await service.getLongRunningTask('task-1', 'status');

    expect(LONG_TASK.getTask).toHaveBeenCalledWith('task-1', 'status');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a long-running task', async () => {
    LONG_TASK.getTask.mockRejectedValue(new Error('boom'));

    const result = await service.getLongRunningTask('task-1');

    expect(result.success).toBe(false);
  });

  it('gets all long-running tasks with pagination', async () => {
    LONG_TASK.getTasks.mockResolvedValue({ results: [] });

    await service.getLongRunningTasks('status', 10, 0);

    expect(LONG_TASK.getTasks).toHaveBeenCalledWith('status', '10', '0');
  });

  it('forwards API errors when getting long-running tasks', async () => {
    LONG_TASK.getTasks.mockRejectedValue(new Error('boom'));

    const result = await service.getLongRunningTasks();

    expect(result.success).toBe(false);
  });
});


describe('ConfluenceService backup/restore and instance metrics', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('triggers a site backup job', async () => {
    BACKUP_AND_RESTORE.createSiteBackupJob.mockResolvedValue({ id: 'job-1' });

    const result = await service.triggerSiteBackup({ attachments: true });

    expect(BACKUP_AND_RESTORE.createSiteBackupJob).toHaveBeenCalledWith({ attachments: true });
    expect(result.success).toBe(true);
  });

  it('triggers a site backup job with no settings', async () => {
    BACKUP_AND_RESTORE.createSiteBackupJob.mockResolvedValue({ id: 'job-1' });

    await service.triggerSiteBackup();

    expect(BACKUP_AND_RESTORE.createSiteBackupJob).toHaveBeenCalledWith(undefined);
  });

  it('forwards API errors when triggering a site backup', async () => {
    BACKUP_AND_RESTORE.createSiteBackupJob.mockRejectedValue(new Error('boom'));

    const result = await service.triggerSiteBackup();

    expect(result.success).toBe(false);
  });

  it('gets a backup/restore job by ID', async () => {
    BACKUP_AND_RESTORE.getJob.mockResolvedValue({ id: 'job-1', status: 'FINISHED' });

    const result = await service.getBackupRestoreJob('job-1');

    expect(BACKUP_AND_RESTORE.getJob).toHaveBeenCalledWith('job-1');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a backup/restore job', async () => {
    BACKUP_AND_RESTORE.getJob.mockRejectedValue(new Error('boom'));

    const result = await service.getBackupRestoreJob('job-1');

    expect(result.success).toBe(false);
  });

  it('finds backup/restore jobs with filters', async () => {
    BACKUP_AND_RESTORE.findJobs.mockResolvedValue([]);

    await service.findBackupRestoreJobs('jdoe', 'ENG', '2024-01-01T00:00:00.000Z', 'FINISHED', '2024-02-01T00:00:00.000Z', 'BACKUP', 10, 'SITE');

    expect(BACKUP_AND_RESTORE.findJobs).toHaveBeenCalledWith(
      'jdoe', 'ENG', '2024-01-01T00:00:00.000Z', 'FINISHED', '2024-02-01T00:00:00.000Z', 'BACKUP', '10', 'SITE'
    );
  });

  it('forwards API errors when finding backup/restore jobs', async () => {
    BACKUP_AND_RESTORE.findJobs.mockRejectedValue(new Error('boom'));

    const result = await service.findBackupRestoreJobs();

    expect(result.success).toBe(false);
  });

  it('gets instance metrics', async () => {
    INSTANCE_METRICS.index1.mockResolvedValue({ userCount: 10 });

    const result = await service.getInstanceMetrics();

    expect(INSTANCE_METRICS.index1).toHaveBeenCalledWith();
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting instance metrics', async () => {
    INSTANCE_METRICS.index1.mockRejectedValue(new Error('boom'));

    const result = await service.getInstanceMetrics();

    expect(result.success).toBe(false);
  });
});
