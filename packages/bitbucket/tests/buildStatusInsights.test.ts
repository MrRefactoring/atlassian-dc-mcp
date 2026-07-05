import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  builds: {
    setACodeInsightsReport: vi.fn(),
    getACodeInsightsReport: vi.fn(),
    deleteACodeInsightsReport: vi.fn(),
    addAnnotations: vi.fn(),
    getAnnotations: vi.fn(),
    deleteAnnotations: vi.fn(),
    add: vi.fn(),
    get: vi.fn(),
    getBuildStatusStats: vi.fn(),
    getPageOfRequiredBuildsMergeChecks: vi.fn(),
    createRequiredBuildsMergeCheck: vi.fn(),
    updateRequiredBuildsMergeCheck: vi.fn(),
    deleteRequiredBuildsMergeCheck: vi.fn(),
  },
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
}));

describe('BitbucketService', () => {
  let bitbucketService: BitbucketService;
  const mockProjectKey = 'TEST';
  const mockRepositorySlug = 'test-repo';

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('Code Insights', () => {
    const commitId = 'abc123';
    const key = 'mycompany.eslint';

    it('setInsightReport should PUT the report', async () => {
      const mockReport = { key, title: 'ESLint' };
      (bb.builds.setACodeInsightsReport as Mock).mockResolvedValue(mockReport);
      const report = { title: 'ESLint', result: 'PASS' };

      const result = await bitbucketService.setInsightReport(mockProjectKey, mockRepositorySlug, commitId, key, report);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockReport);
      expect(bb.builds.setACodeInsightsReport).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId,
        repositorySlug: mockRepositorySlug,
        key,
        ...(report),
      });
    });

    it('getInsightReport should GET the report', async () => {
      (bb.builds.getACodeInsightsReport as Mock).mockResolvedValue({ key });
      const result = await bitbucketService.getInsightReport(mockProjectKey, mockRepositorySlug, commitId, key);
      expect(result.success).toBe(true);
      expect(bb.builds.getACodeInsightsReport).toHaveBeenCalledWith({
        projectKey: mockProjectKey, commitId, repositorySlug: mockRepositorySlug, key,
      });
    });

    it('deleteInsightReport should DELETE and ack', async () => {
      (bb.builds.deleteACodeInsightsReport as Mock).mockResolvedValue(undefined);
      const result = await bitbucketService.deleteInsightReport(mockProjectKey, mockRepositorySlug, commitId, key);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, key });
    });

    it('addInsightAnnotations should POST {annotations} and ack with count', async () => {
      (bb.builds.addAnnotations as Mock).mockResolvedValue(undefined);
      const annotations = [
        { externalId: 'a1', path: 'app.js', line: 3, message: 'x', severity: 'HIGH' },
        { externalId: 'a2', path: 'app.js', line: 9, message: 'y', severity: 'LOW' },
      ];
      const result = await bitbucketService.addInsightAnnotations(mockProjectKey, mockRepositorySlug, commitId, key, annotations);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ added: 2, key });
      expect(bb.builds.addAnnotations).toHaveBeenCalledWith({
        projectKey: mockProjectKey, commitId, repositorySlug: mockRepositorySlug, key, annotations,
      });
    });

    it('getInsightAnnotations should GET annotations', async () => {
      (bb.builds.getAnnotations as Mock).mockResolvedValue({ annotations: [] });
      const result = await bitbucketService.getInsightAnnotations(mockProjectKey, mockRepositorySlug, commitId, key);
      expect(result.success).toBe(true);
      expect(bb.builds.getAnnotations).toHaveBeenCalledWith({
        projectKey: mockProjectKey, commitId, repositorySlug: mockRepositorySlug, key,
      });
    });

    it('deleteInsightAnnotations should pass externalId and ack', async () => {
      (bb.builds.deleteAnnotations as Mock).mockResolvedValue(undefined);
      const result = await bitbucketService.deleteInsightAnnotations(mockProjectKey, mockRepositorySlug, commitId, key, 'a1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, key, externalId: 'a1' });
      expect(bb.builds.deleteAnnotations).toHaveBeenCalledWith({
        projectKey: mockProjectKey, commitId, repositorySlug: mockRepositorySlug, key, externalId: 'a1',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.builds.getACodeInsightsReport as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getInsightReport(mockProjectKey, mockRepositorySlug, commitId, key);
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('listBuildStatuses', () => {
    it('should list build statuses for a commit', async () => {
      const mockStatuses = { values: [{ key: 'build-1', state: 'SUCCESSFUL' }], isLastPage: true };
      (bb.builds.getBuildStatusStats as Mock).mockResolvedValue(mockStatuses);

      const result = await bitbucketService.listBuildStatuses('abc123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatuses);
      expect(bb.builds.getBuildStatusStats).toHaveBeenCalledWith({
        commitId: 'abc123', orderBy: undefined, start: undefined, limit: 25,
      });
    });

    it('should pass orderBy and pagination through', async () => {
      (bb.builds.getBuildStatusStats as Mock).mockResolvedValue({ values: [] });
      await bitbucketService.listBuildStatuses('abc123', 'newest', 5, 50);
      expect(bb.builds.getBuildStatusStats).toHaveBeenCalledWith({
        commitId: 'abc123', orderBy: 'newest', start: 5, limit: 50,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.builds.getBuildStatusStats as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.listBuildStatuses('abc123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('addBuildStatus', () => {
    it('should add a build status with minimal fields', async () => {
      (bb.builds.add as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.addBuildStatus(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'SUCCESSFUL',
        'build-1',
        'http://ci/build/1',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ added: true, commitId: 'abc123', key: 'build-1' });
      expect(bb.builds.add).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        state: 'SUCCESSFUL', key: 'build-1', url: 'http://ci/build/1',
      });
    });

    it('should include optional name and description', async () => {
      (bb.builds.add as Mock).mockResolvedValue(undefined);
      await bitbucketService.addBuildStatus(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'FAILED',
        'build-2',
        'http://ci/build/2',
        'Unit tests',
        'Failed on step 3',
      );
      expect(bb.builds.add).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        state: 'FAILED', key: 'build-2', url: 'http://ci/build/2', name: 'Unit tests', description: 'Failed on step 3',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.builds.add as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.addBuildStatus(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'SUCCESSFUL',
        'build-1',
        'http://ci/build/1',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getBuildStatus', () => {
    it('should get a single build status by key', async () => {
      const mockStatus = { key: 'build-1', state: 'SUCCESSFUL' };
      (bb.builds.get as Mock).mockResolvedValue(mockStatus);

      const result = await bitbucketService.getBuildStatus(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'build-1',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockStatus);
      expect(bb.builds.get).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        key: 'build-1',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.builds.get as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getBuildStatus(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'build-1',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('required builds merge checks', () => {
    it('should get merge checks with the default page size', async () => {
      const mockData = { values: [{ id: 1 }], isLastPage: true };
      (bb.builds.getPageOfRequiredBuildsMergeChecks as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getRequiredBuildsMergeChecks('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.builds.getPageOfRequiredBuildsMergeChecks).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', start: undefined, limit: 25,
      });
    });

    it('should create a merge check with a built body', async () => {
      const mockData = { id: 1 };
      (bb.builds.createRequiredBuildsMergeCheck as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createRequiredBuildsMergeCheck(
        'test', 'Test-Repo', ['build-foo'], 'BRANCH', 'refs/heads/master', 'master', 'BRANCH', 'refs/heads/dev', 'dev',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.builds.createRequiredBuildsMergeCheck).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', buildParentKeys: ['build-foo'], refMatcher: { id: 'refs/heads/master', displayId: 'master', type: { id: 'BRANCH' } }, exemptRefMatcher: { id: 'refs/heads/dev', displayId: 'dev', type: { id: 'BRANCH' } },
      });
    });

    it('should omit the exempt matcher when not fully provided', async () => {
      (bb.builds.createRequiredBuildsMergeCheck as Mock).mockResolvedValue({});

      await bitbucketService.createRequiredBuildsMergeCheck('TEST', 'test-repo', ['build-foo'], 'ANY_REF', 'ANY_REF');

      expect(bb.builds.createRequiredBuildsMergeCheck).toHaveBeenCalledWith({
        projectKey: 'TEST', repositorySlug: 'test-repo', buildParentKeys: ['build-foo'], refMatcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
      });
    });

    it('should handle errors when creating a merge check', async () => {
      (bb.builds.createRequiredBuildsMergeCheck as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createRequiredBuildsMergeCheck('TEST', 'test-repo', ['build-foo'], 'ANY_REF', 'ANY_REF');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should update a merge check coercing the id to a number', async () => {
      const mockData = { id: 1 };
      (bb.builds.updateRequiredBuildsMergeCheck as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.updateRequiredBuildsMergeCheck(
        'test', 'Test-Repo', '1', ['build-foo', 'build-bar'], 'BRANCH', 'refs/heads/master', 'master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.builds.updateRequiredBuildsMergeCheck).toHaveBeenCalledWith({
        projectKey: 'TEST', id: 1, repositorySlug: 'test-repo', buildParentKeys: ['build-foo', 'build-bar'], refMatcher: { id: 'refs/heads/master', displayId: 'master', type: { id: 'BRANCH' } },
      });
    });

    it('should delete a merge check coercing the id and return an ack', async () => {
      (bb.builds.deleteRequiredBuildsMergeCheck as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteRequiredBuildsMergeCheck('test', 'Test-Repo', '1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, id: '1' });
      expect(bb.builds.deleteRequiredBuildsMergeCheck).toHaveBeenCalledWith({
        projectKey: 'TEST', id: 1, repositorySlug: 'test-repo',
      });
    });

    it('should preserve the error field when delete fails', async () => {
      (bb.builds.deleteRequiredBuildsMergeCheck as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteRequiredBuildsMergeCheck('TEST', 'test-repo', '1');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
