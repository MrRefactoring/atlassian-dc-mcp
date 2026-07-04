import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';
import { RepositoryService } from '../src/bitbucket-client/index.js';
import { request } from '../src/bitbucket-client/core/request.js';

vi.mock('../src/bitbucket-client/core/request.js', () => ({
  request: vi.fn(),
}));

const mockRequest = vi.mocked(request);

vi.mock('../src/bitbucket-client/index.js', () => ({
  RepositoryService: {
    createBranch: vi.fn(),
    deleteBranch: vi.fn(),
    getBranches: vi.fn(),
    streamRaw: vi.fn(),
    editFile: vi.fn(),
    getContent1: vi.fn(),
    getDefaultBranch1: vi.fn(),
    createRestrictions1: vi.fn(),
    deleteRestriction1: vi.fn(),
    getRestriction1: vi.fn(),
    getRestrictions1: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
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
      (RepositoryService.createBranch as Mock).mockResolvedValue(mockBranch);

      const result = await bitbucketService.createBranch(
        mockProjectKey,
        mockRepositorySlug,
        'feature/login',
        'refs/heads/master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBranch);
      expect(RepositoryService.createBranch).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        { name: 'feature/login', startPoint: 'refs/heads/master' },
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.createBranch as Mock).mockRejectedValue(new Error('API Error'));
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
      (RepositoryService.deleteBranch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranch(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature/login',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, name: 'refs/heads/feature/login' });
      expect(RepositoryService.deleteBranch).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        { name: 'refs/heads/feature/login' },
      );
    });

    it('should pass dryRun through and report not-deleted', async () => {
      (RepositoryService.deleteBranch as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranch(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature/login',
        true,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: false, name: 'refs/heads/feature/login' });
      expect(RepositoryService.deleteBranch).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        { name: 'refs/heads/feature/login', dryRun: true },
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.deleteBranch as Mock).mockRejectedValue(new Error('API Error'));
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
      (RepositoryService.getBranches as Mock).mockResolvedValue(mockBranchesData);

      const result = await bitbucketService.getBranches(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBranchesData);
      expect(RepositoryService.getBranches).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // boostMatches
        undefined, // context
        undefined, // orderBy
        undefined, // details
        undefined, // filterText
        undefined, // base
        undefined, // start
        25,
      );
    });

    it('should pass filterText, orderBy and pagination through', async () => {
      const mockBranchesData = { values: [], size: 0, isLastPage: true };
      (RepositoryService.getBranches as Mock).mockResolvedValue(mockBranchesData);

      await bitbucketService.getBranches(
        mockProjectKey,
        mockRepositorySlug,
        'feat',
        'MODIFICATION',
        10,
        50,
      );

      expect(RepositoryService.getBranches).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        undefined,
        'MODIFICATION',
        undefined,
        'feat',
        undefined,
        10,
        50,
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (RepositoryService.getBranches as Mock).mockRejectedValue(mockError);

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
      (RepositoryService.streamRaw as Mock).mockResolvedValue(mockContent);

      const result = await bitbucketService.getFileContent(
        mockProjectKey,
        mockRepositorySlug,
        'src/index.ts',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockContent);
      expect(RepositoryService.streamRaw).toHaveBeenCalledWith(
        'src/index.ts',
        mockProjectKey,
        mockRepositorySlug,
        undefined,
      );
    });

    it('should pass the at ref through', async () => {
      const mockContent = 'file content';
      (RepositoryService.streamRaw as Mock).mockResolvedValue(mockContent);

      await bitbucketService.getFileContent(
        mockProjectKey,
        mockRepositorySlug,
        'README.md',
        'refs/heads/main',
      );

      expect(RepositoryService.streamRaw).toHaveBeenCalledWith(
        'README.md',
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/main',
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('The repository does not exist.');
      (RepositoryService.streamRaw as Mock).mockRejectedValue(mockError);

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
      (RepositoryService.editFile as Mock).mockResolvedValue(mockCommit);

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
      expect(RepositoryService.editFile).toHaveBeenCalledWith(
        'docs/new.md',
        mockProjectKey,
        mockRepositorySlug,
        { content: '# Hello', message: 'add file', branch: 'master' },
      );
    });

    it('should pass sourceCommitId and sourceBranch when editing', async () => {
      (RepositoryService.editFile as Mock).mockResolvedValue({ id: 'sha2' });
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
      expect(RepositoryService.editFile).toHaveBeenCalledWith(
        'README.md',
        mockProjectKey,
        mockRepositorySlug,
        { content: 'updated', message: 'edit readme', branch: 'feature/x', sourceCommitId: 'oldsha', sourceBranch: 'master' },
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.editFile as Mock).mockRejectedValue(new Error('API Error'));
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
      (RepositoryService.getContent1 as Mock).mockResolvedValue(mockBrowse);

      const result = await bitbucketService.browseRepository(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBrowse);
      expect(RepositoryService.getContent1).toHaveBeenCalledWith(
        '',
        mockProjectKey,
        mockRepositorySlug,
        undefined, // noContent
        undefined, // at
        undefined, // size
        undefined, // blame
        undefined,  // type
      );
    });

    it('should map path, at, type and blame to the generated client', async () => {
      const mockBrowse = { type: 'FILE' };
      (RepositoryService.getContent1 as Mock).mockResolvedValue(mockBrowse);

      await bitbucketService.browseRepository(
        mockProjectKey,
        mockRepositorySlug,
        'src/index.ts',
        'refs/heads/main',
        true,
        true,
      );

      expect(RepositoryService.getContent1).toHaveBeenCalledWith(
        'src/index.ts',
        mockProjectKey,
        mockRepositorySlug,
        undefined,
        'refs/heads/main',
        undefined,
        'true', // blame
        'true',  // type
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (RepositoryService.getContent1 as Mock).mockRejectedValue(mockError);

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
      (RepositoryService.getDefaultBranch1 as Mock).mockResolvedValue(mockBranch);

      const result = await bitbucketService.getDefaultBranch(
        mockProjectKey,
        mockRepositorySlug,
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockBranch);
      expect(RepositoryService.getDefaultBranch1).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (RepositoryService.getDefaultBranch1 as Mock).mockRejectedValue(mockError);

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
      mockRequest.mockResolvedValue(mockData);

      const result = await bitbucketService.getBranchModel('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'GET',
          url: '/branch-utils/1.0/projects/{projectKey}/repos/{repositorySlug}/branchmodel/configuration',
          path: { projectKey: 'TEST', repositorySlug: 'test-repo' },
          errors: {
            401: 'The currently authenticated user has insufficient permissions to view the branch model configuration.',
            404: 'The specified repository does not exist.',
          },
        },
      );
    });

    it('should handle errors when getting the branch model configuration', async () => {
      mockRequest.mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getBranchModel('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should set the branch model configuration with development only', async () => {
      const mockData = { development: { refId: 'refs/heads/develop', useDefault: false } };
      mockRequest.mockResolvedValue(mockData);

      const result = await bitbucketService.setBranchModel(
        'test', 'Test-Repo', { refId: 'refs/heads/develop' },
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'PUT',
          url: '/branch-utils/1.0/projects/{projectKey}/repos/{repositorySlug}/branchmodel/configuration',
          path: { projectKey: 'TEST', repositorySlug: 'test-repo' },
          body: { development: { refId: 'refs/heads/develop' } },
          mediaType: 'application/json',
          errors: {
            400: 'The branch model configuration was invalid.',
            401: 'The currently authenticated user has insufficient permissions to configure the branch model.',
            404: 'The specified repository does not exist.',
          },
        },
      );
    });

    it('should set the branch model configuration with production and types', async () => {
      mockRequest.mockResolvedValue({});

      await bitbucketService.setBranchModel(
        'TEST',
        'test-repo',
        { refId: 'refs/heads/develop', useDefault: false },
        { refId: 'refs/heads/master', useDefault: false },
        [{ id: 'FEATURE', prefix: 'feature/', enabled: true }],
      );

      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
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
      mockRequest.mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.setBranchModel('TEST', 'test-repo', { refId: 'refs/heads/develop' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should delete the branch model configuration and return an ack', async () => {
      mockRequest.mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranchModel('test', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ reset: true, projectKey: 'TEST', repositorySlug: 'test-repo' });
      expect(mockRequest).toHaveBeenCalledWith(
        expect.any(Object),
        {
          method: 'DELETE',
          url: '/branch-utils/1.0/projects/{projectKey}/repos/{repositorySlug}/branchmodel/configuration',
          path: { projectKey: 'TEST', repositorySlug: 'test-repo' },
          errors: {
            401: 'The currently authenticated user has insufficient permissions to reset the branch model configuration.',
            404: 'The specified repository does not exist.',
          },
        },
      );
    });

    it('should preserve the error field when deleting the branch model configuration fails', async () => {
      mockRequest.mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteBranchModel('TEST', 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('branch restrictions', () => {
    it('should get branch restrictions with filters and default limit', async () => {
      const mockData = { values: [{ id: 1 }], isLastPage: true };
      (RepositoryService.getRestrictions1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getBranchRestrictions('test', 'Test-Repo', 'BRANCH', 'refs/heads/master', 'no-deletes');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getRestrictions1).toHaveBeenCalledWith(
        'TEST', 'test-repo', 'BRANCH', 'refs/heads/master', 'no-deletes', undefined, 25,
      );
    });

    it('should create a branch restriction wrapped in a bulk array', async () => {
      const mockData = { id: 1, type: 'no-deletes' };
      (RepositoryService.createRestrictions1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.createBranchRestriction(
        'test', 'Test-Repo', 'no-deletes', 'BRANCH', 'refs/heads/master', 'master', ['admin'], ['devs'], [7],
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.createRestrictions1).toHaveBeenCalledWith('TEST', 'test-repo', [{
        type: 'no-deletes',
        matcher: { id: 'refs/heads/master', displayId: 'master', type: { id: 'BRANCH' } },
        userSlugs: ['admin'],
        groupNames: ['devs'],
        accessKeyIds: [7],
      }]);
    });

    it('should omit exemption fields when not provided', async () => {
      (RepositoryService.createRestrictions1 as Mock).mockResolvedValue({});

      await bitbucketService.createBranchRestriction('TEST', 'test-repo', 'read-only', 'ANY_REF', 'ANY_REF');

      expect(RepositoryService.createRestrictions1).toHaveBeenCalledWith('TEST', 'test-repo', [{
        type: 'read-only',
        matcher: { id: 'ANY_REF', displayId: 'ANY_REF', type: { id: 'ANY_REF' } },
      }]);
    });

    it('should handle errors when creating a restriction', async () => {
      (RepositoryService.createRestrictions1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createBranchRestriction('TEST', 'test-repo', 'read-only', 'ANY_REF', 'ANY_REF');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should get a single restriction by id', async () => {
      const mockData = { id: 5 };
      (RepositoryService.getRestriction1 as Mock).mockResolvedValue(mockData);

      const result = await bitbucketService.getBranchRestriction('test', 'Test-Repo', '5');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockData);
      expect(RepositoryService.getRestriction1).toHaveBeenCalledWith('TEST', '5', 'test-repo');
    });

    it('should delete a restriction and return an ack', async () => {
      (RepositoryService.deleteRestriction1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteBranchRestriction('test', 'Test-Repo', '5');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, id: '5' });
      expect(RepositoryService.deleteRestriction1).toHaveBeenCalledWith('TEST', '5', 'test-repo');
    });

    it('should preserve the error field when delete fails', async () => {
      (RepositoryService.deleteRestriction1 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteBranchRestriction('TEST', 'test-repo', '5');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
