import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const jira = vi.hoisted(() => {
  const group = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return { issues: group(), projects: group(), users: group(), workflows: group(), agile: group(), admin: group(), request: vi.fn() };
});
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient: () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('server info and license', () => {
    it('gets server info', async () => {
      const mockInfo = { version: '9.4.0', buildNumber: 940000, deploymentType: 'Server' };
      (jira.admin.getServerInfo as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.getServerInfo();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(jira.admin.getServerInfo).toHaveBeenCalledWith({});
    });

    it('handles errors getting server info', async () => {
      (jira.admin.getServerInfo as Mock).mockRejectedValue(new Error('Unavailable'));

      const result = await jiraService.getServerInfo();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unavailable');
    });

    it('validates a license string', async () => {
      const mockResult = { errors: {}, licenseString: 'AAAB...' };
      (jira.admin.validate as Mock).mockResolvedValue(mockResult);

      const result = await jiraService.validateLicense('AAAB...');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(jira.admin.validate).toHaveBeenCalledWith({ requestBody: 'AAAB...' });
    });

    it('handles errors validating a license string', async () => {
      (jira.admin.validate as Mock).mockRejectedValue(new Error('Invalid license'));

      const result = await jiraService.validateLicense('bad-license');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid license');
    });
  });
  describe('application properties', () => {
    it('gets an application property', async () => {
      const mockProperty = { key: 'jira.clone.prefix', value: 'CLONE -' };
      (jira.admin.getProperty as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.getApplicationProperty('ADMIN', 'jira.clone.prefix', 'jira.lf.*');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(jira.admin.getProperty).toHaveBeenCalledWith({ permissionLevel: 'ADMIN', key: 'jira.clone.prefix', keyFilter: 'jira.lf.*' });
    });

    it('gets advanced settings', async () => {
      const mockSettings = [{ key: 'jira.clone.prefix', value: 'CLONE -' }];
      (jira.admin.getAdvancedSettings as Mock).mockResolvedValue(mockSettings);

      const result = await jiraService.getAdvancedSettings();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSettings);
      expect(jira.admin.getAdvancedSettings).toHaveBeenCalledWith({});
    });

    it('sets an application property via the raw PUT request', async () => {
      const mockProperty = { key: 'jira.clone.prefix', value: 'COPY -' };
      (jira.request as Mock).mockResolvedValue(mockProperty);

      const result = await jiraService.setApplicationProperty('jira.clone.prefix', 'COPY -');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProperty);
      expect(jira.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/2/application-properties/jira.clone.prefix',
        body: { id: 'jira.clone.prefix', value: 'COPY -' },
      });
    });

    it('handles errors', async () => {
      (jira.admin.getProperty as Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getApplicationProperty('ADMIN', 'jira.clone.prefix');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });
  describe('cluster', () => {
    it('gets all cluster nodes', async () => {
      const mockNodes = [{ nodeId: 'node1', state: 'ACTIVE' }];
      (jira.admin.getAllNodes as Mock).mockResolvedValue(mockNodes);

      const result = await jiraService.getClusterNodes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockNodes);
      expect(jira.admin.getAllNodes).toHaveBeenCalledWith({});
    });

    it('deletes a cluster node', async () => {
      (jira.admin.deleteNode as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteClusterNode('node1');

      expect(result.success).toBe(true);
      expect(jira.admin.deleteNode).toHaveBeenCalledWith({ nodeId: 'node1' });
    });

    it('sets a cluster node offline', async () => {
      (jira.admin.changeNodeStateToOffline as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setClusterNodeOffline('node1');

      expect(result.success).toBe(true);
      expect(jira.admin.changeNodeStateToOffline).toHaveBeenCalledWith({ nodeId: 'node1' });
    });

    it('requests a cluster node index snapshot', async () => {
      (jira.admin.requestCurrentIndexFromNode as Mock).mockResolvedValue(undefined);

      const result = await jiraService.requestClusterNodeIndexSnapshot('node1');

      expect(result.success).toBe(true);
      expect(jira.admin.requestCurrentIndexFromNode).toHaveBeenCalledWith({ nodeId: 'node1' });
    });

    it('approves a cluster upgrade', async () => {
      (jira.admin.approveUpgrade as Mock).mockResolvedValue(undefined);

      const result = await jiraService.approveClusterUpgrade();

      expect(result.success).toBe(true);
      expect(jira.admin.approveUpgrade).toHaveBeenCalledWith({});
    });

    it('cancels a cluster upgrade', async () => {
      (jira.admin.cancelUpgrade as Mock).mockResolvedValue(undefined);

      const result = await jiraService.cancelClusterUpgrade();

      expect(result.success).toBe(true);
      expect(jira.admin.cancelUpgrade).toHaveBeenCalledWith({});
    });

    it('retries a cluster upgrade', async () => {
      (jira.admin.acknowledgeErrors as Mock).mockResolvedValue(undefined);

      const result = await jiraService.retryClusterUpgrade();

      expect(result.success).toBe(true);
      expect(jira.admin.acknowledgeErrors).toHaveBeenCalledWith({});
    });

    it('starts a cluster upgrade', async () => {
      (jira.admin.setReadyToUpgrade as Mock).mockResolvedValue(undefined);

      const result = await jiraService.startClusterUpgrade();

      expect(result.success).toBe(true);
      expect(jira.admin.setReadyToUpgrade).toHaveBeenCalledWith({});
    });

    it('gets cluster upgrade state', async () => {
      const mockState = { state: 'STABLE' };
      (jira.admin.getState as Mock).mockResolvedValue(mockState);

      const result = await jiraService.getClusterUpgradeState();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockState);
      expect(jira.admin.getState).toHaveBeenCalledWith({});
    });

    it('handles errors', async () => {
      (jira.admin.getAllNodes as Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getClusterNodes();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });
  describe('index and index snapshots', () => {
    it('gets the index summary', async () => {
      const mockSummary = { nodeId: 'node1', issueIndex: { indexReadable: true } };
      (jira.admin.getIndexSummary as Mock).mockResolvedValue(mockSummary);

      const result = await jiraService.getIndexSummary();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSummary);
      expect(jira.admin.getIndexSummary).toHaveBeenCalledWith({});
    });

    it('lists index snapshots', async () => {
      const mockSnapshots = { snapshots: ['/var/jira/snapshot1'] };
      (jira.admin.listIndexSnapshot as Mock).mockResolvedValue(mockSnapshots);

      const result = await jiraService.listIndexSnapshots();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSnapshots);
      expect(jira.admin.listIndexSnapshot).toHaveBeenCalledWith({});
    });

    it('creates an index snapshot', async () => {
      const mockSnapshot = { filePath: '/var/jira/snapshot2' };
      (jira.admin.createIndexSnapshot as Mock).mockResolvedValue(mockSnapshot);

      const result = await jiraService.createIndexSnapshot();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSnapshot);
      expect(jira.admin.createIndexSnapshot).toHaveBeenCalledWith({});
    });

    it('gets index snapshot creation status', async () => {
      const mockStatus = { running: false };
      (jira.admin.isIndexSnapshotRunning as Mock).mockResolvedValue(mockStatus);

      const result = await jiraService.getIndexSnapshotStatus();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatus);
      expect(jira.admin.isIndexSnapshotRunning).toHaveBeenCalledWith({});
    });

    it('handles errors', async () => {
      (jira.admin.getIndexSummary as Mock).mockRejectedValue(new Error('Forbidden'));

      const result = await jiraService.getIndexSummary();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Forbidden');
    });
  });
  describe('reindex', () => {
    it('gets reindex info', async () => {
      const mockInfo = { currentProgress: 100, submittedTime: 123 };
      (jira.admin.getReindexInfo as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.getReindexInfo(42);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(jira.admin.getReindexInfo).toHaveBeenCalledWith({ taskId: 42 });
    });

    it('starts a reindex with defaults', async () => {
      const mockInfo = { currentProgress: 0 };
      (jira.admin.reindex as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.startReindex();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(jira.admin.reindex).toHaveBeenCalledWith({ indexChangeHistory: false, indexWorklogs: false, indexComments: false });
    });

    it('starts a reindex with explicit options', async () => {
      (jira.admin.reindex as Mock).mockResolvedValue({});

      await jiraService.startReindex(true, 'FOREGROUND', true, true);

      expect(jira.admin.reindex).toHaveBeenCalledWith({ indexChangeHistory: true, type: 'FOREGROUND', indexWorklogs: true, indexComments: true });
    });

    it('reindexes individual issues', async () => {
      const mockInfo = { currentProgress: 100 };
      (jira.admin.reindexIssues as Mock).mockResolvedValue(mockInfo);

      const result = await jiraService.reindexIssues(['TEST-1', 'TEST-2']);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockInfo);
      expect(jira.admin.reindexIssues).toHaveBeenCalledWith({ issueId: ['TEST-1', 'TEST-2'], indexChangeHistory: false, indexWorklogs: false, indexComments: false });
    });

    it('gets reindex progress', async () => {
      const mockProgress = { currentProgress: 50 };
      (jira.admin.getReindexProgress as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getReindexProgress(42);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(jira.admin.getReindexProgress).toHaveBeenCalledWith({ taskId: 42 });
    });

    it('processes pending reindex requests', async () => {
      const mockIds = [1, 2, 3];
      (jira.admin.processRequests as Mock).mockResolvedValue(mockIds);

      const result = await jiraService.processReindexRequests();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockIds);
      expect(jira.admin.processRequests).toHaveBeenCalledWith({});
    });

    it('gets progress of multiple reindex requests', async () => {
      const mockProgress = [{ id: 1 }, { id: 2 }];
      (jira.admin.getProgressBulk as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getReindexRequestsProgress([1, 2]);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(jira.admin.getProgressBulk).toHaveBeenCalledWith({ requestId: [1, 2] });
    });

    it('gets progress of a single reindex request', async () => {
      const mockProgress = { id: 1, currentProgress: 100 };
      (jira.admin.getProgress as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getReindexRequestProgress(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(jira.admin.getProgress).toHaveBeenCalledWith({ requestId: 1 });
    });

    it('handles errors', async () => {
      (jira.admin.getReindexInfo as Mock).mockRejectedValue(new Error('No re-indexing task found'));

      const result = await jiraService.getReindexInfo();

      expect(result.success).toBe(false);
      expect(result.error).toBe('No re-indexing task found');
    });
  });
  describe('email templates', () => {
    describe('downloadEmailTemplates', () => {
      it('downloads and base64-encodes the email templates zip', async () => {
        (jira.request as Mock).mockResolvedValue(new Uint8Array(Buffer.from('zip-bytes')));

        const result = await jiraService.downloadEmailTemplates();

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ contentBase64: Buffer.from('zip-bytes').toString('base64') });
        expect(jira.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/2/email-templates',
          responseType: 'arraybuffer',
        });
      });

      it('fails when the download request errors', async () => {
        (jira.request as Mock).mockRejectedValue(new Error('Failed to download email templates'));

        const result = await jiraService.downloadEmailTemplates();

        expect(result.success).toBe(false);
        expect(result.error).toBe('Failed to download email templates');
      });
    });

    it('uploads email templates as a zip file', async () => {
      const mockResult = { success: true };
      (jira.admin.uploadEmailTemplates as Mock).mockResolvedValue(mockResult);

      const result = await jiraService.uploadEmailTemplates('emlsaXA=');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockResult);
      expect(jira.admin.uploadEmailTemplates).toHaveBeenCalledWith({ requestBody: expect.any(File) });
    });

    it('applies previously uploaded email templates', async () => {
      (jira.admin.applyEmailTemplates as Mock).mockResolvedValue(undefined);

      const result = await jiraService.applyEmailTemplates();

      expect(result.success).toBe(true);
      expect(jira.admin.applyEmailTemplates).toHaveBeenCalledWith({});
    });

    it('resets email templates to default', async () => {
      (jira.admin.revertEmailTemplatesToDefault as Mock).mockResolvedValue(undefined);

      const result = await jiraService.resetEmailTemplatesToDefault();

      expect(result.success).toBe(true);
      expect(jira.admin.revertEmailTemplatesToDefault).toHaveBeenCalledWith({});
    });

    it('gets email template types', async () => {
      const mockTypes = [{ id: 'IssueCreated', name: 'Issue Created' }];
      (jira.admin.getEmailTypes as Mock).mockResolvedValue(mockTypes);

      const result = await jiraService.getEmailTemplateTypes();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTypes);
      expect(jira.admin.getEmailTypes).toHaveBeenCalledWith({});
    });

    it('handles errors', async () => {
      (jira.admin.getEmailTypes as Mock).mockRejectedValue(new Error('User is not a system admin'));

      const result = await jiraService.getEmailTemplateTypes();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not a system admin');
    });
  });
  describe('session and websudo', () => {
    it('gets the current session', async () => {
      const mockUser = { self: 'https://test-host/rest/api/2/user?username=jdoe', name: 'jdoe' };
      (jira.admin.currentUser as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.getCurrentSession();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(jira.admin.currentUser).toHaveBeenCalledWith({});
    });

    it('creates a new session', async () => {
      const mockAuth = { session: { name: 'JSESSIONID', value: 'abc123' } };
      (jira.admin.login as Mock).mockResolvedValue(mockAuth);

      const result = await jiraService.createSession('jdoe', 'hunter2');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAuth);
      expect(jira.admin.login).toHaveBeenCalledWith({ requestBody: { username: 'jdoe', password: 'hunter2' } });
    });

    it('deletes the current session', async () => {
      (jira.admin.logout as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteSession();

      expect(result.success).toBe(true);
      expect(jira.admin.logout).toHaveBeenCalledWith({});
    });

    it('releases the current WebSudo session', async () => {
      (jira.admin.release as Mock).mockResolvedValue(undefined);

      const result = await jiraService.releaseWebSudo();

      expect(result.success).toBe(true);
      expect(jira.admin.release).toHaveBeenCalledWith({});
    });

    it('handles errors', async () => {
      (jira.admin.login as Mock).mockRejectedValue(new Error('Invalid credentials'));

      const result = await jiraService.createSession('jdoe', 'wrong-password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });
});
