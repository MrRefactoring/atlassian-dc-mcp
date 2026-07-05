import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  repositories: {
    createBranch: vi.fn(),
    deleteBranch: vi.fn(),
    getBranches: vi.fn(),
    streamRaw: vi.fn(),
    editFile: vi.fn(),
    getContent: vi.fn(),
    getDefaultBranch: vi.fn(),
    createRestrictions: vi.fn(),
    deleteRestriction: vi.fn(),
    getRestriction: vi.fn(),
    getRestrictions: vi.fn(),
  },
  request: vi.fn(),
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

  describe('createBranch', () => {
    it('should successfully create a branch', async () => {
      const mockBranch = { id: 'refs/heads/feature/login', displayId: 'feature/login' };
      (bb.repositories.createBranch as Mock).mockResolvedValue(mockBranch);

      const result = await bitbucketService.createBranch(
        mockProjectKey,
        mockRepositorySlug,
        'feature/login',
        'refs/heads/master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBranch);
      expect(bb.repositories.createBranch).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        name: 'feature/login', startPoint: 'refs/heads/master',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.createBranch as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.createBranch(
        mockProjectKey,
        mockRepositorySlug,
        'feature/login',
        'refs/heads/master',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('deleteBranch', () => {
    it('should successfully delete a branch', async () => {
      (bb.repositories.deleteBranch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranch(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature/login',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, name: 'refs/heads/feature/login' });
      expect(bb.repositories.deleteBranch).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        name: 'refs/heads/feature/login',
      });
    });

    it('should pass dryRun through and report not-deleted', async () => {
      (bb.repositories.deleteBranch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranch(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature/login',
        true,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: false, name: 'refs/heads/feature/login' });
      expect(bb.repositories.deleteBranch).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        name: 'refs/heads/feature/login', dryRun: true,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.deleteBranch as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.deleteBranch(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature/login',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getBranches', () => {
    it('should successfully get branches with default parameters', async () => {
      const mockBranchesData = {
        values: [
          { id: 'refs/heads/main', displayId: 'main', isDefault: true },
          { id: 'refs/heads/feature', displayId: 'feature', isDefault: false },
        ],
        size: 2,
        isLastPage: true,
      };
      (bb.repositories.getBranches as Mock).mockResolvedValue(mockBranchesData);

      const result = await bitbucketService.getBranches(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBranchesData);
      expect(bb.repositories.getBranches).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        boostMatches: undefined,
        context: undefined,
        orderBy: undefined,
        details: undefined,
        filterText: undefined,
        base: undefined,
        start: undefined,
        limit: 25,
      });
    });

    it('should pass filterText, orderBy and pagination through', async () => {
      const mockBranchesData = { values: [], size: 0, isLastPage: true };
      (bb.repositories.getBranches as Mock).mockResolvedValue(mockBranchesData);

      await bitbucketService.getBranches(
        mockProjectKey,
        mockRepositorySlug,
        'feat',
        'MODIFICATION',
        10,
        50,
      );

      expect(bb.repositories.getBranches).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        boostMatches: undefined,
        context: undefined,
        orderBy: 'MODIFICATION',
        details: undefined,
        filterText: 'feat',
        base: undefined,
        start: 10,
        limit: 50,
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.repositories.getBranches as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getBranches(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getFileContent', () => {
    it('should successfully get raw file content', async () => {
      const mockContent = 'const x = 1;\nconst y = 2;\n';
      (bb.repositories.streamRaw as Mock).mockResolvedValue(mockContent);

      const result = await bitbucketService.getFileContent(
        mockProjectKey,
        mockRepositorySlug,
        'src/index.ts',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockContent);
      expect(bb.repositories.streamRaw).toHaveBeenCalledWith({
        path: 'src/index.ts',
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        at: undefined,
      });
    });

    it('should pass the at ref through', async () => {
      const mockContent = 'file content';
      (bb.repositories.streamRaw as Mock).mockResolvedValue(mockContent);

      await bitbucketService.getFileContent(
        mockProjectKey,
        mockRepositorySlug,
        'README.md',
        'refs/heads/main',
      );

      expect(bb.repositories.streamRaw).toHaveBeenCalledWith({
        path: 'README.md',
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        at: 'refs/heads/main',
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('The repository does not exist.');
      (bb.repositories.streamRaw as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getFileContent(
        mockProjectKey,
        mockRepositorySlug,
        'missing.txt',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('The repository does not exist.');
    });
  });

  describe('editFile', () => {
    it('should create a new file (no sourceCommitId)', async () => {
      const mockCommit = { id: 'newsha', message: 'add file' };
      (bb.repositories.editFile as Mock).mockResolvedValue(mockCommit);

      const result = await bitbucketService.editFile(
        mockProjectKey,
        mockRepositorySlug,
        'docs/new.md',
        '# Hello',
        'add file',
        'master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCommit);
      expect(bb.repositories.editFile).toHaveBeenCalledWith({
        path: 'docs/new.md',
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        content: '# Hello', message: 'add file', branch: 'master',
      });
    });

    it('should pass sourceCommitId and sourceBranch when editing', async () => {
      (bb.repositories.editFile as Mock).mockResolvedValue({ id: 'sha2' });
      await bitbucketService.editFile(
        mockProjectKey,
        mockRepositorySlug,
        'README.md',
        'updated',
        'edit readme',
        'feature/x',
        'oldsha',
        'master',
      );
      expect(bb.repositories.editFile).toHaveBeenCalledWith({
        path: 'README.md',
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        content: 'updated', message: 'edit readme', branch: 'feature/x', sourceCommitId: 'oldsha', sourceBranch: 'master',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.editFile as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.editFile(
        mockProjectKey,
        mockRepositorySlug,
        'README.md',
        'x',
        'msg',
        'master',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('browseRepository', () => {
    it('should browse the repository root by default', async () => {
      const mockBrowse = { children: { values: [{ path: { toString: 'src' }, type: 'DIRECTORY' }] } };
      (bb.repositories.getContent as Mock).mockResolvedValue(mockBrowse);

      const result = await bitbucketService.browseRepository(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBrowse);
      expect(bb.repositories.getContent).toHaveBeenCalledWith({
        path: '',
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        noContent: undefined,
        at: undefined,
        size: undefined,
        blame: undefined,
        type: undefined,
      });
    });

    it('should map path, at, type and blame to the generated client', async () => {
      const mockBrowse = { type: 'FILE' };
      (bb.repositories.getContent as Mock).mockResolvedValue(mockBrowse);

      await bitbucketService.browseRepository(
        mockProjectKey,
        mockRepositorySlug,
        'src/index.ts',
        'refs/heads/main',
        true,
        true,
      );

      expect(bb.repositories.getContent).toHaveBeenCalledWith({
        path: 'src/index.ts',
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        noContent: undefined,
        at: 'refs/heads/main',
        size: undefined,
        blame: 'true',
        type: 'true',
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.repositories.getContent as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.browseRepository(
        mockProjectKey,
        mockRepositorySlug,
        'src',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getDefaultBranch', () => {
    it('should successfully get the default branch', async () => {
      const mockBranch = { id: 'refs/heads/main', displayId: 'main', isDefault: true };
      (bb.repositories.getDefaultBranch as Mock).mockResolvedValue(mockBranch);

      const result = await bitbucketService.getDefaultBranch(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBranch);
      expect(bb.repositories.getDefaultBranch).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (bb.repositories.getDefaultBranch as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.getDefaultBranch(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('branch model configuration', () => {
    it('should get the branch model configuration', async () => {
      const mockData = {
        development: { refId: 'refs/heads/master', useDefault: true },
        production: null,
        types: [{ id: 'FEATURE', displayName: 'Feature', prefix: 'feature/' }],
      };
      (bb.request as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getBranchModel('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/branch-utils/1.0/projects/TEST/repos/test-repo/branchmodel/configuration',
      });
    });

    it('should handle errors when getting the branch model configuration', async () => {
      (bb.request as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getBranchModel('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set the branch model configuration with development only', async () => {
      const mockData = { development: { refId: 'refs/heads/develop', useDefault: false } };
      (bb.request as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.setBranchModel(
        'test', 'Test-Repo', { refId: 'refs/heads/develop' },
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/branch-utils/1.0/projects/TEST/repos/test-repo/branchmodel/configuration',
        body: { development: { refId: 'refs/heads/develop' } },
        mediaType: 'application/json',
      });
    });

    it('should set the branch model configuration with production and types', async () => {
      (bb.request as Mock).mockResolvedValue({});

      await bitbucketService.setBranchModel(
        'TEST',
        'test-repo',
        { refId: 'refs/heads/develop', useDefault: false },
        { refId: 'refs/heads/master', useDefault: false },
        [{ id: 'FEATURE', prefix: 'feature/', enabled: true }],
      );

      expect(bb.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          body: {
            development: { refId: 'refs/heads/develop', useDefault: false },
            production: { refId: 'refs/heads/master', useDefault: false },
            types: [{ id: 'FEATURE', prefix: 'feature/', enabled: true }],
          },
        }),
      );
    });

    it('should handle errors when setting the branch model configuration', async () => {
      (bb.request as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setBranchModel('TEST', 'test-repo', { refId: 'refs/heads/develop' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete the branch model configuration and return an ack', async () => {
      (bb.request as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranchModel('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ reset: true, projectKey: 'TEST', repositorySlug: 'test-repo' });
      expect(bb.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/branch-utils/1.0/projects/TEST/repos/test-repo/branchmodel/configuration',
      });
    });

    it('should preserve the error field when deleting the branch model configuration fails', async () => {
      (bb.request as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteBranchModel('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('branch restrictions', () => {
    it('should get branch restrictions with filters and default limit', async () => {
      const mockData = { values: [{ id: 1 }], isLastPage: true };
      (bb.repositories.getRestrictions as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getBranchRestrictions('test', 'Test-Repo', 'BRANCH', 'refs/heads/master', 'no-deletes');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getRestrictions).toHaveBeenCalledWith({
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        matcherType: 'BRANCH',
        matcherId: 'refs/heads/master',
        type: 'no-deletes',
        start: undefined,
        limit: 25,
      });
    });

    it('should create a branch restriction wrapped in a bulk array', async () => {
      const mockData = { id: 1, type: 'no-deletes' };
      (bb.repositories.createRestrictions as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createBranchRestriction(
        'test', 'Test-Repo', 'no-deletes', 'BRANCH', 'refs/heads/master', 'master', ['admin'], ['devs'], [7],
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.createRestrictions).toHaveBeenCalledWith({
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        restrictions: [{
          type: 'no-deletes',
          matcher: { id: 'refs/heads/master', displayId: 'master', type: { id: 'BRANCH' } },
          userSlugs: ['admin'],
          groupNames: ['devs'],
          accessKeyIds: [7],
        }],
      });
    });

    it('should omit exemption fields when not provided', async () => {
      (bb.repositories.createRestrictions as Mock).mockResolvedValue({});

      await bitbucketService.createBranchRestriction('TEST', 'test-repo', 'read-only', 'ANY_REF', 'ANY_REF');

      expect(bb.repositories.createRestrictions).toHaveBeenCalledWith({
        projectKey: 'TEST',
        repositorySlug: 'test-repo',
        restrictions: [{
          type: 'read-only',
          matcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
        }],
      });
    });

    it('should handle errors when creating a restriction', async () => {
      (bb.repositories.createRestrictions as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createBranchRestriction('TEST', 'test-repo', 'read-only', 'ANY_REF', 'ANY_REF');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get a single restriction by id', async () => {
      const mockData = { id: 5 };
      (bb.repositories.getRestriction as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getBranchRestriction('test', 'Test-Repo', '5');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(bb.repositories.getRestriction).toHaveBeenCalledWith({ projectKey: 'TEST', id: '5', repositorySlug: 'test-repo' });
    });

    it('should delete a restriction and return an ack', async () => {
      (bb.repositories.deleteRestriction as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranchRestriction('test', 'Test-Repo', '5');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, id: '5' });
      expect(bb.repositories.deleteRestriction).toHaveBeenCalledWith({ projectKey: 'TEST', id: '5', repositorySlug: 'test-repo' });
    });

    it('should preserve the error field when delete fails', async () => {
      (bb.repositories.deleteRestriction as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteBranchRestriction('TEST', 'test-repo', '5');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
