import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';
import { RepositoryService } from '../src/bitbucketClient/index.js';

vi.mock('../src/bitbucketClient/index.js', () => ({
  RepositoryService: {
    getTags: vi.fn(),
    getTag: vi.fn(),
    createTagForRepository: vi.fn(),
    getCommit: vi.fn(),
    streamDiff: vi.fn(),
    streamChanges: vi.fn(),
    streamCommits: vi.fn(),
    getComments: vi.fn(),
    createComment: vi.fn(),
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

  describe('getTags', () => {
    it('should get tags with default parameters', async () => {
      const mockTags = { values: [{ id: 'refs/tags/v1', displayId: 'v1' }], isLastPage: true };
      (RepositoryService.getTags as Mock).mockResolvedValue(mockTags);

      const result = await bitbucketService.getTags(mockProjectKey, mockRepositorySlug);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTags);
      expect(RepositoryService.getTags).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // orderBy
        undefined, // filterText
        undefined, // start
        25,
      );
    });

    it('should pass filterText, orderBy and pagination through', async () => {
      (RepositoryService.getTags as Mock).mockResolvedValue({ values: [] });
      await bitbucketService.getTags(mockProjectKey, mockRepositorySlug, 'rel', 'MODIFICATION', 5, 50);
      expect(RepositoryService.getTags).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        'MODIFICATION',
        'rel',
        5,
        50,
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.getTags as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getTags(mockProjectKey, mockRepositorySlug);
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getTag', () => {
    it('should get a single tag by name', async () => {
      const mockTag = { id: 'refs/tags/v1', displayId: 'v1' };
      (RepositoryService.getTag as Mock).mockResolvedValue(mockTag);

      const result = await bitbucketService.getTag(mockProjectKey, mockRepositorySlug, 'v1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTag);
      expect(RepositoryService.getTag).toHaveBeenCalledWith(
        mockProjectKey,
        'v1',
        mockRepositorySlug,
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.getTag as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getTag(mockProjectKey, mockRepositorySlug, 'v1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('createTag', () => {
    it('should create a lightweight tag', async () => {
      const mockTag = { id: 'refs/tags/v2', displayId: 'v2' };
      (RepositoryService.createTagForRepository as Mock).mockResolvedValue(mockTag);

      const result = await bitbucketService.createTag(
        mockProjectKey,
        mockRepositorySlug,
        'v2',
        'refs/heads/master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTag);
      expect(RepositoryService.createTagForRepository).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        { name: 'v2', startPoint: 'refs/heads/master' },
      );
    });

    it('should include message for an annotated tag', async () => {
      (RepositoryService.createTagForRepository as Mock).mockResolvedValue({});
      await bitbucketService.createTag(
        mockProjectKey,
        mockRepositorySlug,
        'v2',
        'abc123',
        'Release 2',
      );
      expect(RepositoryService.createTagForRepository).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        { name: 'v2', startPoint: 'abc123', message: 'Release 2' },
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.createTagForRepository as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.createTag(
        mockProjectKey,
        mockRepositorySlug,
        'v2',
        'refs/heads/master',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getCommit', () => {
    it('should successfully get a single commit', async () => {
      const mockCommit = { id: 'abc123', message: 'Initial commit', author: { name: 'dev' } };
      (RepositoryService.getCommit as Mock).mockResolvedValue(mockCommit);

      const result = await bitbucketService.getCommit(mockProjectKey, mockRepositorySlug, 'abc123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCommit);
      expect(RepositoryService.getCommit).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        undefined,
      );
    });

    it('should pass the path through', async () => {
      (RepositoryService.getCommit as Mock).mockResolvedValue({});
      await bitbucketService.getCommit(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js');
      expect(RepositoryService.getCommit).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        'src/app.js',
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.getCommit as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getCommit(mockProjectKey, mockRepositorySlug, 'abc123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getCommitDiff', () => {
    it('should get a whole-commit diff by default (empty path)', async () => {
      const mockDiff = { diffs: [] };
      (RepositoryService.streamDiff as Mock).mockResolvedValue(mockDiff);

      const result = await bitbucketService.getCommitDiff(mockProjectKey, mockRepositorySlug, 'abc123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDiff);
      expect(RepositoryService.streamDiff).toHaveBeenCalledWith(
        'abc123',
        mockRepositorySlug,
        '',
        mockProjectKey,
        undefined, // srcPath
        undefined, // avatarSize
        undefined, // filter
        undefined, // avatarScheme
        undefined, // contextLines
        undefined, // autoSrcPath
        undefined, // whitespace
        undefined, // withComments
        undefined,  // since
      );
    });

    it('should pass path, contextLines, whitespace and srcPath through', async () => {
      (RepositoryService.streamDiff as Mock).mockResolvedValue({});
      await bitbucketService.getCommitDiff(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'src/app.js',
        '5',
        'ignore-all',
        'src/old.js',
      );
      expect(RepositoryService.streamDiff).toHaveBeenCalledWith(
        'abc123',
        mockRepositorySlug,
        'src/app.js',
        mockProjectKey,
        'src/old.js',
        undefined,
        undefined,
        undefined,
        '5',
        undefined,
        'ignore-all',
        undefined,
        undefined,
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.streamDiff as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getCommitDiff(mockProjectKey, mockRepositorySlug, 'abc123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('compareRefs', () => {
    it('should compare commits by default', async () => {
      const mockCompare = { values: [{ id: 'c1' }], isLastPage: true };
      (RepositoryService.streamCommits as Mock).mockResolvedValue(mockCompare);

      const result = await bitbucketService.compareRefs(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature',
        'refs/heads/master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCompare);
      expect(RepositoryService.streamCommits).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        undefined, // fromRepo
        'refs/heads/feature',
        'refs/heads/master',
        undefined, // start
        25,
      );
      expect(RepositoryService.streamChanges).not.toHaveBeenCalled();
    });

    it('should compare changes when compareType is changes', async () => {
      const mockCompare = { values: [], isLastPage: true };
      (RepositoryService.streamChanges as Mock).mockResolvedValue(mockCompare);

      await bitbucketService.compareRefs(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature',
        'refs/heads/master',
        'OTHER/repo',
        'changes',
        10,
        50,
      );

      expect(RepositoryService.streamChanges).toHaveBeenCalledWith(
        mockProjectKey,
        mockRepositorySlug,
        'OTHER/repo',
        'refs/heads/feature',
        'refs/heads/master',
        10,
        50,
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.streamCommits as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.compareRefs(
        mockProjectKey,
        mockRepositorySlug,
        'a',
        'b',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getCommitComments', () => {
    it('should get commit comments for a path', async () => {
      const mockComments = { values: [{ id: 1, text: 'looks good' }], isLastPage: true };
      (RepositoryService.getComments as Mock).mockResolvedValue(mockComments);

      const result = await bitbucketService.getCommitComments(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComments);
      expect(RepositoryService.getComments).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        'src/app.js',
        undefined, // since
        undefined, // start
        25,
      );
    });

    it('should pass since and pagination through', async () => {
      (RepositoryService.getComments as Mock).mockResolvedValue({ values: [] });
      await bitbucketService.getCommitComments(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js', 'def456', 5, 50);
      expect(RepositoryService.getComments).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        'src/app.js',
        'def456',
        5,
        50,
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.getComments as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getCommitComments(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('addCommitComment', () => {
    it('should add a general commit comment', async () => {
      const mockComment = { id: 99, text: 'nice' };
      (RepositoryService.createComment as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.addCommitComment(mockProjectKey, mockRepositorySlug, 'abc123', 'nice');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComment);
      expect(RepositoryService.createComment).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        undefined,
        { text: 'nice' },
      );
    });

    it('should anchor the comment to a file and line', async () => {
      (RepositoryService.createComment as Mock).mockResolvedValue({ id: 100 });
      await bitbucketService.addCommitComment(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'fix this',
        'src/app.js',
        12,
        'ADDED',
      );
      expect(RepositoryService.createComment).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        undefined,
        { text: 'fix this', anchor: { path: 'src/app.js', line: 12, lineType: 'ADDED', fileType: 'TO' } },
      );
    });

    it('should default lineType to CONTEXT when a line is given without one', async () => {
      (RepositoryService.createComment as Mock).mockResolvedValue({ id: 101 });
      await bitbucketService.addCommitComment(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'note',
        'src/app.js',
        3,
      );
      expect(RepositoryService.createComment).toHaveBeenCalledWith(
        mockProjectKey,
        'abc123',
        mockRepositorySlug,
        undefined,
        { text: 'note', anchor: { path: 'src/app.js', line: 3, lineType: 'CONTEXT', fileType: 'TO' } },
      );
    });

    it('should handle API errors gracefully', async () => {
      (RepositoryService.createComment as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.addCommitComment(mockProjectKey, mockRepositorySlug, 'abc123', 'x');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });
});
