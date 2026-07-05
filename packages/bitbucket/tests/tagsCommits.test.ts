import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  repositories: {
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

  describe('getTags', () => {
    it('should get tags with default parameters', async () => {
      const mockTags = { values: [{ id: 'refs/tags/v1', displayId: 'v1' }], isLastPage: true };
      (bb.repositories.getTags as Mock).mockResolvedValue(mockTags);

      const result = await bitbucketService.getTags(mockProjectKey, mockRepositorySlug);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTags);
      expect(bb.repositories.getTags).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        orderBy: undefined,
        filterText: undefined,
        start: undefined,
        limit: 25,
      });
    });

    it('should pass filterText, orderBy and pagination through', async () => {
      (bb.repositories.getTags as Mock).mockResolvedValue({ values: [] });
      await bitbucketService.getTags(mockProjectKey, mockRepositorySlug, 'rel', 'MODIFICATION', 5, 50);
      expect(bb.repositories.getTags).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        orderBy: 'MODIFICATION',
        filterText: 'rel',
        start: 5,
        limit: 50,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.getTags as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getTags(mockProjectKey, mockRepositorySlug);
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getTag', () => {
    it('should get a single tag by name', async () => {
      const mockTag = { id: 'refs/tags/v1', displayId: 'v1' };
      (bb.repositories.getTag as Mock).mockResolvedValue(mockTag);

      const result = await bitbucketService.getTag(mockProjectKey, mockRepositorySlug, 'v1');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTag);
      expect(bb.repositories.getTag).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        name: 'v1',
        repositorySlug: mockRepositorySlug,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.getTag as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getTag(mockProjectKey, mockRepositorySlug, 'v1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('createTag', () => {
    it('should create a lightweight tag', async () => {
      const mockTag = { id: 'refs/tags/v2', displayId: 'v2' };
      (bb.repositories.createTagForRepository as Mock).mockResolvedValue(mockTag);

      const result = await bitbucketService.createTag(
        mockProjectKey,
        mockRepositorySlug,
        'v2',
        'refs/heads/master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTag);
      expect(bb.repositories.createTagForRepository).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        name: 'v2', startPoint: 'refs/heads/master',
      });
    });

    it('should include message for an annotated tag', async () => {
      (bb.repositories.createTagForRepository as Mock).mockResolvedValue({});
      await bitbucketService.createTag(
        mockProjectKey,
        mockRepositorySlug,
        'v2',
        'abc123',
        'Release 2',
      );
      expect(bb.repositories.createTagForRepository).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        name: 'v2', startPoint: 'abc123', message: 'Release 2',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.createTagForRepository as Mock).mockRejectedValue(new Error('API Error'));
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
      (bb.repositories.getCommit as Mock).mockResolvedValue(mockCommit);

      const result = await bitbucketService.getCommit(mockProjectKey, mockRepositorySlug, 'abc123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCommit);
      expect(bb.repositories.getCommit).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        path: undefined,
      });
    });

    it('should pass the path through', async () => {
      (bb.repositories.getCommit as Mock).mockResolvedValue({});
      await bitbucketService.getCommit(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js');
      expect(bb.repositories.getCommit).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        path: 'src/app.js',
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.getCommit as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getCommit(mockProjectKey, mockRepositorySlug, 'abc123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getCommitDiff', () => {
    it('should get a whole-commit diff by default (empty path)', async () => {
      const mockDiff = { diffs: [] };
      (bb.repositories.streamDiff as Mock).mockResolvedValue(mockDiff);

      const result = await bitbucketService.getCommitDiff(mockProjectKey, mockRepositorySlug, 'abc123');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDiff);
      expect(bb.repositories.streamDiff).toHaveBeenCalledWith({
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        path: '',
        projectKey: mockProjectKey,
        srcPath: undefined,
        avatarSize: undefined,
        filter: undefined,
        avatarScheme: undefined,
        contextLines: undefined,
        autoSrcPath: undefined,
        whitespace: undefined,
        withComments: undefined,
        since: undefined,
      });
    });

    it('should pass path, contextLines, whitespace and srcPath through', async () => {
      (bb.repositories.streamDiff as Mock).mockResolvedValue({});
      await bitbucketService.getCommitDiff(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'src/app.js',
        '5',
        'ignore-all',
        'src/old.js',
      );
      expect(bb.repositories.streamDiff).toHaveBeenCalledWith({
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        path: 'src/app.js',
        projectKey: mockProjectKey,
        srcPath: 'src/old.js',
        avatarSize: undefined,
        filter: undefined,
        avatarScheme: undefined,
        contextLines: '5',
        autoSrcPath: undefined,
        whitespace: 'ignore-all',
        withComments: undefined,
        since: undefined,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.streamDiff as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getCommitDiff(mockProjectKey, mockRepositorySlug, 'abc123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('compareRefs', () => {
    it('should compare commits by default', async () => {
      const mockCompare = { values: [{ id: 'c1' }], isLastPage: true };
      (bb.repositories.streamCommits as Mock).mockResolvedValue(mockCompare);

      const result = await bitbucketService.compareRefs(
        mockProjectKey,
        mockRepositorySlug,
        'refs/heads/feature',
        'refs/heads/master',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCompare);
      expect(bb.repositories.streamCommits).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        fromRepo: undefined,
        from: 'refs/heads/feature',
        to: 'refs/heads/master',
        start: undefined,
        limit: 25,
      });
      expect(bb.repositories.streamChanges).not.toHaveBeenCalled();
    });

    it('should compare changes when compareType is changes', async () => {
      const mockCompare = { values: [], isLastPage: true };
      (bb.repositories.streamChanges as Mock).mockResolvedValue(mockCompare);

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

      expect(bb.repositories.streamChanges).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        repositorySlug: mockRepositorySlug,
        fromRepo: 'OTHER/repo',
        from: 'refs/heads/feature',
        to: 'refs/heads/master',
        start: 10,
        limit: 50,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.streamCommits as Mock).mockRejectedValue(new Error('API Error'));
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
      (bb.repositories.getComments as Mock).mockResolvedValue(mockComments);

      const result = await bitbucketService.getCommitComments(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComments);
      expect(bb.repositories.getComments).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        path: 'src/app.js',
        since: undefined,
        start: undefined,
        limit: 25,
      });
    });

    it('should pass since and pagination through', async () => {
      (bb.repositories.getComments as Mock).mockResolvedValue({ values: [] });
      await bitbucketService.getCommitComments(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js', 'def456', 5, 50);
      expect(bb.repositories.getComments).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        path: 'src/app.js',
        since: 'def456',
        start: 5,
        limit: 50,
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.getComments as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.getCommitComments(mockProjectKey, mockRepositorySlug, 'abc123', 'src/app.js');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('addCommitComment', () => {
    it('should add a general commit comment', async () => {
      const mockComment = { id: 99, text: 'nice' };
      (bb.repositories.createComment as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.addCommitComment(mockProjectKey, mockRepositorySlug, 'abc123', 'nice');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComment);
      expect(bb.repositories.createComment).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        since: undefined,
        text: 'nice',
      });
    });

    it('should anchor the comment to a file and line', async () => {
      (bb.repositories.createComment as Mock).mockResolvedValue({ id: 100 });
      await bitbucketService.addCommitComment(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'fix this',
        'src/app.js',
        12,
        'ADDED',
      );
      expect(bb.repositories.createComment).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        since: undefined,
        text: 'fix this', anchor: { path: 'src/app.js', line: 12, lineType: 'ADDED', fileType: 'TO' },
      });
    });

    it('should default lineType to CONTEXT when a line is given without one', async () => {
      (bb.repositories.createComment as Mock).mockResolvedValue({ id: 101 });
      await bitbucketService.addCommitComment(
        mockProjectKey,
        mockRepositorySlug,
        'abc123',
        'note',
        'src/app.js',
        3,
      );
      expect(bb.repositories.createComment).toHaveBeenCalledWith({
        projectKey: mockProjectKey,
        commitId: 'abc123',
        repositorySlug: mockRepositorySlug,
        since: undefined,
        text: 'note', anchor: { path: 'src/app.js', line: 3, lineType: 'CONTEXT', fileType: 'TO' },
      });
    });

    it('should handle API errors gracefully', async () => {
      (bb.repositories.createComment as Mock).mockRejectedValue(new Error('API Error'));
      const result = await bitbucketService.addCommitComment(mockProjectKey, mockRepositorySlug, 'abc123', 'x');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });
});
