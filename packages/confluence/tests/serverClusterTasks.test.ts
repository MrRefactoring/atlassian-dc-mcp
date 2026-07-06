import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  admin: {
    index2: vi.fn(),
    getClusterNodeStatuses: vi.fn(),
    getTask: vi.fn(),
    getTasks: vi.fn(),
    createSiteBackupJob: vi.fn(),
    getJob: vi.fn(),
    findJobs: vi.fn(),
    index1: vi.fn(),
  },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService.getServerInfo', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets server information', async () => {
    conf.admin.index2.mockResolvedValue({ version: '8.5.0', buildNumber: 8500 });

    const result = await service.getServerInfo();

    expect(conf.admin.index2).toHaveBeenCalledWith(undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting server information', async () => {
    conf.admin.index2.mockRejectedValue(new Error('boom'));

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
    conf.admin.getClusterNodeStatuses.mockResolvedValue({ results: [] });

    await service.getClusterNodes(10, 0);

    expect(conf.admin.getClusterNodeStatuses).toHaveBeenCalledWith({ limit: '10', start: '0' });
  });

  it('gets cluster node statuses without pagination', async () => {
    conf.admin.getClusterNodeStatuses.mockResolvedValue({ results: [] });

    const result = await service.getClusterNodes();

    expect(conf.admin.getClusterNodeStatuses).toHaveBeenCalledWith({ limit: undefined, start: undefined });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting cluster node statuses', async () => {
    conf.admin.getClusterNodeStatuses.mockRejectedValue(new Error('boom'));

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
    conf.admin.getTask.mockResolvedValue({ id: 'task-1', percentageComplete: 50 });

    const result = await service.getLongRunningTask('task-1', 'status');

    expect(conf.admin.getTask).toHaveBeenCalledWith({ id: 'task-1', expand: 'status' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a long-running task', async () => {
    conf.admin.getTask.mockRejectedValue(new Error('boom'));

    const result = await service.getLongRunningTask('task-1');

    expect(result.success).toBe(false);
  });

  it('gets all long-running tasks with pagination', async () => {
    conf.admin.getTasks.mockResolvedValue({ results: [] });

    await service.getLongRunningTasks('status', 10, 0);

    expect(conf.admin.getTasks).toHaveBeenCalledWith({ expand: 'status', limit: '10', start: '0' });
  });

  it('forwards API errors when getting long-running tasks', async () => {
    conf.admin.getTasks.mockRejectedValue(new Error('boom'));

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
    conf.admin.createSiteBackupJob.mockResolvedValue({ id: 'job-1' });

    const result = await service.triggerSiteBackup({ attachments: true });

    expect(conf.admin.createSiteBackupJob).toHaveBeenCalledWith({ requestBody: { attachments: true } });
    expect(result.success).toBe(true);
  });

  it('triggers a site backup job with no settings', async () => {
    conf.admin.createSiteBackupJob.mockResolvedValue({ id: 'job-1' });

    await service.triggerSiteBackup();

    expect(conf.admin.createSiteBackupJob).toHaveBeenCalledWith({ requestBody: undefined });
  });

  it('forwards API errors when triggering a site backup', async () => {
    conf.admin.createSiteBackupJob.mockRejectedValue(new Error('boom'));

    const result = await service.triggerSiteBackup();

    expect(result.success).toBe(false);
  });

  it('gets a backup/restore job by ID', async () => {
    conf.admin.getJob.mockResolvedValue({ id: 'job-1', status: 'FINISHED' });

    const result = await service.getBackupRestoreJob('job-1');

    expect(conf.admin.getJob).toHaveBeenCalledWith({ jobId: 'job-1' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a backup/restore job', async () => {
    conf.admin.getJob.mockRejectedValue(new Error('boom'));

    const result = await service.getBackupRestoreJob('job-1');

    expect(result.success).toBe(false);
  });

  it('finds backup/restore jobs with filters', async () => {
    conf.admin.findJobs.mockResolvedValue([]);

    await service.findBackupRestoreJobs('jdoe', 'ENG', '2024-01-01T00:00:00.000Z', 'FINISHED', '2024-02-01T00:00:00.000Z', 'BACKUP', 10, 'SITE');

    expect(conf.admin.findJobs).toHaveBeenCalledWith({
      owner: 'jdoe',
      spaceKey: 'ENG',
      fromDate: '2024-01-01T00:00:00.000Z',
      jobStates: 'FINISHED',
      toDate: '2024-02-01T00:00:00.000Z',
      jobOperation: 'BACKUP',
      limit: '10',
      jobScope: 'SITE',
    });
  });

  it('forwards API errors when finding backup/restore jobs', async () => {
    conf.admin.findJobs.mockRejectedValue(new Error('boom'));

    const result = await service.findBackupRestoreJobs();

    expect(result.success).toBe(false);
  });

  it('gets instance metrics', async () => {
    conf.admin.index1.mockResolvedValue({ userCount: 10 });

    const result = await service.getInstanceMetrics();

    expect(conf.admin.index1).toHaveBeenCalledWith(undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting instance metrics', async () => {
    conf.admin.index1.mockRejectedValue(new Error('boom'));

    const result = await service.getInstanceMetrics();

    expect(result.success).toBe(false);
  });
});
