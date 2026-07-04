import { afterEach, beforeEach, describe, expect, it, vi, type Mock, type MockInstance } from 'vitest';
import { request as __request } from '../src/jira-client/core/request.js';
import { JiraService } from '../src/jira-service.js';
import {
  ApplicationPropertiesService,
  ClusterService,
  EmailTemplatesService,
  IndexService,
  IndexSnapshotService,
  LicenseValidatorService,
  OpenAPI,
  ReindexService,
  ServerInfoService,
  SessionService,
  WebsudoService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/core/request.js', () => ({
  request: vi.fn(),
  resolve: vi.fn(async (_options: unknown, resolver: unknown) =>
    typeof resolver === 'function' ? (resolver as () => unknown)() : resolver,
  ),
}));

vi.mock('../src/jira-client/index.js', () => ({
  ServerInfoService: {
    getServerInfo: vi.fn(),
  },
  LicenseValidatorService: {
    validate: vi.fn(),
  },
  ApplicationPropertiesService: {
    getProperty: vi.fn(),
    getAdvancedSettings: vi.fn(),
  },
  ClusterService: {
    getAllNodes: vi.fn(),
    deleteNode: vi.fn(),
    changeNodeStateToOffline: vi.fn(),
    requestCurrentIndexFromNode: vi.fn(),
    approveUpgrade: vi.fn(),
    cancelUpgrade: vi.fn(),
    acknowledgeErrors: vi.fn(),
    setReadyToUpgrade: vi.fn(),
    getState: vi.fn(),
  },
  IndexService: {
    getIndexSummary: vi.fn(),
  },
  IndexSnapshotService: {
    listIndexSnapshot: vi.fn(),
    createIndexSnapshot: vi.fn(),
    isIndexSnapshotRunning: vi.fn(),
  },
  ReindexService: {
    getReindexInfo: vi.fn(),
    reindex: vi.fn(),
    reindexIssues: vi.fn(),
    getReindexProgress: vi.fn(),
    processRequests: vi.fn(),
    getProgressBulk: vi.fn(),
    getProgress: vi.fn(),
  },
  EmailTemplatesService: {
    uploadEmailTemplates: vi.fn(),
    applyEmailTemplates: vi.fn(),
    revertEmailTemplatesToDefault: vi.fn(),
    getEmailTypes: vi.fn(),
  },
  SessionService: {
    currentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
  WebsudoService: {
    release: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('server info and license', () => {
    it('gets server info', async () => {
      const mockInfo = { version: '9.4.0', buildNumber: 940000, deploymentType: 'Server' };
      (ServerInfoService.getServerInfo as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.getServerInfo();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(ServerInfoService.getServerInfo).toHaveBeenCalledWith();
    });

    it('handles errors getting server info', async () => {
      (ServerInfoService.getServerInfo as Mock).mockRejectedValue(new Error('Unavailable'));

      const result = await jiraService.getServerInfo();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unavailable');
    });

    it('validates a license string', async () => {
      const mockResult = { errors: {}, licenseString: 'AAAB...' };
      (LicenseValidatorService.validate as Mock).mockResolvedValue(mockResult);

      const result = await jiraService.validateLicense('AAAB...');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(LicenseValidatorService.validate).toHaveBeenCalledWith('AAAB...');
    });

    it('handles errors validating a license string', async () => {
      (LicenseValidatorService.validate as Mock).mockRejectedValue(new Error('Invalid license'));

      const result = await jiraService.validateLicense('bad-license');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid license');
    });
  });
  describe('application properties', () => {
    it('gets an application property', async () => {
      const mockProperty = { key: 'jira.clone.prefix', value: 'CLONE -' };
      (ApplicationPropertiesService.getProperty as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getApplicationProperty('ADMIN', 'jira.clone.prefix', 'jira.lf.*');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(ApplicationPropertiesService.getProperty).toHaveBeenCalledWith('ADMIN', 'jira.clone.prefix', 'jira.lf.*');
    });

    it('gets advanced settings', async () => {
      const mockSettings = [{ key: 'jira.clone.prefix', value: 'CLONE -' }];
      (ApplicationPropertiesService.getAdvancedSettings as Mock).mockResolvedValue(mockSettings);

      const result = await jiraService.getAdvancedSettings();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSettings);
      expect(ApplicationPropertiesService.getAdvancedSettings).toHaveBeenCalledWith();
    });

    it('sets an application property via the raw PUT request', async () => {
      const mockProperty = { key: 'jira.clone.prefix', value: 'COPY -' };
      (__request as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.setApplicationProperty('jira.clone.prefix', 'COPY -');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(__request).toHaveBeenCalledWith(OpenAPI, {
        method: 'PUT',
        url: '/api/2/application-properties/{id}',
        path: { id: 'jira.clone.prefix' },
        body: { id: 'jira.clone.prefix', value: 'COPY -' },
        mediaType: 'application/json',
      });
    });

    it('handles errors', async () => {
      (ApplicationPropertiesService.getProperty as Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getApplicationProperty('ADMIN', 'jira.clone.prefix');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });
  describe('cluster', () => {
    it('gets all cluster nodes', async () => {
      const mockNodes = [{ nodeId: 'node1', state: 'ACTIVE' }];
      (ClusterService.getAllNodes as Mock).mockResolvedValue(mockNodes);

      const result = await jiraService.getClusterNodes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockNodes);
      expect(ClusterService.getAllNodes).toHaveBeenCalledWith();
    });

    it('deletes a cluster node', async () => {
      (ClusterService.deleteNode as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteClusterNode('node1');

      expect(result.success).toBe(true);
      expect(ClusterService.deleteNode).toHaveBeenCalledWith('node1');
    });

    it('sets a cluster node offline', async () => {
      (ClusterService.changeNodeStateToOffline as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setClusterNodeOffline('node1');

      expect(result.success).toBe(true);
      expect(ClusterService.changeNodeStateToOffline).toHaveBeenCalledWith('node1');
    });

    it('requests a cluster node index snapshot', async () => {
      (ClusterService.requestCurrentIndexFromNode as Mock).mockResolvedValue(undefined);

      const result = await jiraService.requestClusterNodeIndexSnapshot('node1');

      expect(result.success).toBe(true);
      expect(ClusterService.requestCurrentIndexFromNode).toHaveBeenCalledWith('node1');
    });

    it('approves a cluster upgrade', async () => {
      (ClusterService.approveUpgrade as Mock).mockResolvedValue(undefined);

      const result = await jiraService.approveClusterUpgrade();

      expect(result.success).toBe(true);
      expect(ClusterService.approveUpgrade).toHaveBeenCalledWith();
    });

    it('cancels a cluster upgrade', async () => {
      (ClusterService.cancelUpgrade as Mock).mockResolvedValue(undefined);

      const result = await jiraService.cancelClusterUpgrade();

      expect(result.success).toBe(true);
      expect(ClusterService.cancelUpgrade).toHaveBeenCalledWith();
    });

    it('retries a cluster upgrade', async () => {
      (ClusterService.acknowledgeErrors as Mock).mockResolvedValue(undefined);

      const result = await jiraService.retryClusterUpgrade();

      expect(result.success).toBe(true);
      expect(ClusterService.acknowledgeErrors).toHaveBeenCalledWith();
    });

    it('starts a cluster upgrade', async () => {
      (ClusterService.setReadyToUpgrade as Mock).mockResolvedValue(undefined);

      const result = await jiraService.startClusterUpgrade();

      expect(result.success).toBe(true);
      expect(ClusterService.setReadyToUpgrade).toHaveBeenCalledWith();
    });

    it('gets cluster upgrade state', async () => {
      const mockState = { state: 'STABLE' };
      (ClusterService.getState as Mock).mockResolvedValue(mockState);

      const result = await jiraService.getClusterUpgradeState();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockState);
      expect(ClusterService.getState).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (ClusterService.getAllNodes as Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getClusterNodes();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });
  describe('index and index snapshots', () => {
    it('gets the index summary', async () => {
      const mockSummary = { nodeId: 'node1', issueIndex: { indexReadable: true } };
      (IndexService.getIndexSummary as Mock).mockResolvedValue(mockSummary);

      const result = await jiraService.getIndexSummary();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSummary);
      expect(IndexService.getIndexSummary).toHaveBeenCalledWith();
    });

    it('lists index snapshots', async () => {
      const mockSnapshots = { snapshots: ['/var/jira/snapshot1'] };
      (IndexSnapshotService.listIndexSnapshot as Mock).mockResolvedValue(mockSnapshots);

      const result = await jiraService.listIndexSnapshots();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSnapshots);
      expect(IndexSnapshotService.listIndexSnapshot).toHaveBeenCalledWith();
    });

    it('creates an index snapshot', async () => {
      const mockSnapshot = { filePath: '/var/jira/snapshot2' };
      (IndexSnapshotService.createIndexSnapshot as Mock).mockResolvedValue(mockSnapshot);

      const result = await jiraService.createIndexSnapshot();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSnapshot);
      expect(IndexSnapshotService.createIndexSnapshot).toHaveBeenCalledWith();
    });

    it('gets index snapshot creation status', async () => {
      const mockStatus = { running: false };
      (IndexSnapshotService.isIndexSnapshotRunning as Mock).mockResolvedValue(mockStatus);

      const result = await jiraService.getIndexSnapshotStatus();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatus);
      expect(IndexSnapshotService.isIndexSnapshotRunning).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (IndexService.getIndexSummary as Mock).mockRejectedValue(new Error('Forbidden'));

      const result = await jiraService.getIndexSummary();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden');
    });
  });
  describe('reindex', () => {
    it('gets reindex info', async () => {
      const mockInfo = { currentProgress: 100, submittedTime: 123 };
      (ReindexService.getReindexInfo as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.getReindexInfo(42);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(ReindexService.getReindexInfo).toHaveBeenCalledWith(42);
    });

    it('starts a reindex with defaults', async () => {
      const mockInfo = { currentProgress: 0 };
      (ReindexService.reindex as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.startReindex();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(ReindexService.reindex).toHaveBeenCalledWith(false, undefined, false, false);
    });

    it('starts a reindex with explicit options', async () => {
      (ReindexService.reindex as Mock).mockResolvedValue({});

      await jiraService.startReindex(true, 'FOREGROUND', true, true);

      expect(ReindexService.reindex).toHaveBeenCalledWith(true, 'FOREGROUND', true, true);
    });

    it('reindexes individual issues', async () => {
      const mockInfo = { currentProgress: 100 };
      (ReindexService.reindexIssues as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.reindexIssues(['TEST-1', 'TEST-2']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(ReindexService.reindexIssues).toHaveBeenCalledWith(['TEST-1', 'TEST-2'], false, false, false);
    });

    it('gets reindex progress', async () => {
      const mockProgress = { currentProgress: 50 };
      (ReindexService.getReindexProgress as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getReindexProgress(42);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(ReindexService.getReindexProgress).toHaveBeenCalledWith(42);
    });

    it('processes pending reindex requests', async () => {
      const mockIds = [1, 2, 3];
      (ReindexService.processRequests as Mock).mockResolvedValue(mockIds);

      const result = await jiraService.processReindexRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIds);
      expect(ReindexService.processRequests).toHaveBeenCalledWith();
    });

    it('gets progress of multiple reindex requests', async () => {
      const mockProgress = [{ id: 1 }, { id: 2 }];
      (ReindexService.getProgressBulk as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getReindexRequestsProgress([1, 2]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(ReindexService.getProgressBulk).toHaveBeenCalledWith([1, 2]);
    });

    it('gets progress of a single reindex request', async () => {
      const mockProgress = { id: 1, currentProgress: 100 };
      (ReindexService.getProgress as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getReindexRequestProgress(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(ReindexService.getProgress).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (ReindexService.getReindexInfo as Mock).mockRejectedValue(new Error('No re-indexing task found'));

      const result = await jiraService.getReindexInfo();

      expect(result.success).toBe(false);
      expect(result.error).toBe('No re-indexing task found');
    });
  });
  describe('email templates', () => {
    describe('downloadEmailTemplates', () => {
      let fetchSpy: MockInstance<typeof fetch>;

      beforeEach(() => {
        fetchSpy = vi.spyOn(global, 'fetch');
      });

      afterEach(() => {
        fetchSpy.mockRestore();
      });

      it('downloads and base64-encodes the email templates zip', async () => {
        fetchSpy.mockResolvedValue({
          ok: true,
          arrayBuffer: async () => Buffer.from('zip-bytes'),
        } as unknown as Response);

        const result = await jiraService.downloadEmailTemplates();

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ contentBase64: Buffer.from('zip-bytes').toString('base64') });
        expect(fetchSpy).toHaveBeenCalledWith('https://test-host/rest/api/2/email-templates', expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }));
      });

      it('fails when the download request is not ok', async () => {
        fetchSpy.mockResolvedValue({ ok: false, status: 403, statusText: 'Forbidden' } as unknown as Response);

        const result = await jiraService.downloadEmailTemplates();

        expect(result.success).toBe(false);
        expect(result.error).toBe('Failed to download email templates: 403 Forbidden');
      });
    });

    it('uploads email templates as a zip file', async () => {
      const mockResult = { success: true };
      (EmailTemplatesService.uploadEmailTemplates as Mock).mockResolvedValue(mockResult);

      const result = await jiraService.uploadEmailTemplates('emlsaXA=');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(EmailTemplatesService.uploadEmailTemplates).toHaveBeenCalledWith(expect.any(File));
    });

    it('applies previously uploaded email templates', async () => {
      (EmailTemplatesService.applyEmailTemplates as Mock).mockResolvedValue(undefined);

      const result = await jiraService.applyEmailTemplates();

      expect(result.success).toBe(true);
      expect(EmailTemplatesService.applyEmailTemplates).toHaveBeenCalledWith();
    });

    it('resets email templates to default', async () => {
      (EmailTemplatesService.revertEmailTemplatesToDefault as Mock).mockResolvedValue(undefined);

      const result = await jiraService.resetEmailTemplatesToDefault();

      expect(result.success).toBe(true);
      expect(EmailTemplatesService.revertEmailTemplatesToDefault).toHaveBeenCalledWith();
    });

    it('gets email template types', async () => {
      const mockTypes = [{ id: 'IssueCreated', name: 'Issue Created' }];
      (EmailTemplatesService.getEmailTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getEmailTemplateTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
      expect(EmailTemplatesService.getEmailTypes).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (EmailTemplatesService.getEmailTypes as Mock).mockRejectedValue(new Error('User is not a system admin'));

      const result = await jiraService.getEmailTemplateTypes();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not a system admin');
    });
  });
  describe('session and websudo', () => {
    it('gets the current session', async () => {
      const mockUser = { self: 'https://test-host/rest/api/2/user?username=jdoe', name: 'jdoe' };
      (SessionService.currentUser as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.getCurrentSession();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(SessionService.currentUser).toHaveBeenCalledWith();
    });

    it('creates a new session', async () => {
      const mockAuth = { session: { name: 'JSESSIONID', value: 'abc123' } };
      (SessionService.login as Mock).mockResolvedValue(mockAuth);

      const result = await jiraService.createSession('jdoe', 'hunter2');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAuth);
      expect(SessionService.login).toHaveBeenCalledWith({ username: 'jdoe', password: 'hunter2' });
    });

    it('deletes the current session', async () => {
      (SessionService.logout as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteSession();

      expect(result.success).toBe(true);
      expect(SessionService.logout).toHaveBeenCalledWith();
    });

    it('releases the current WebSudo session', async () => {
      (WebsudoService.release as Mock).mockResolvedValue(undefined);

      const result = await jiraService.releaseWebSudo();

      expect(result.success).toBe(true);
      expect(WebsudoService.release).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (SessionService.login as Mock).mockRejectedValue(new Error('Invalid credentials'));

      const result = await jiraService.createSession('jdoe', 'wrong-password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });
});
