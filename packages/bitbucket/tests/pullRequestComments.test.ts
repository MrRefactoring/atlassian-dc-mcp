import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';
import { PullRequestsService } from '../src/bitbucketClient/index.js';

vi.mock('../src/bitbucketClient/index.js', () => ({
  PullRequestsService: {
    createComment2: vi.fn(),
    updateComment2: vi.fn(),
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
  const mockPullRequestId = '123';

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('postPullRequestComment', () => {
    it('should successfully post a general PR comment', async () => {
      const mockComment = {
        id: 12345,
        text: 'Test comment',
        author: { displayName: 'Test User' },
      };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Test comment',
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 12345,
        pending: false,
      });
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        { text: 'Test comment' },
      );
    });

    it('should successfully post a reply comment', async () => {
      const mockComment = {
        id: 12346,
        text: 'Reply comment',
        author: { displayName: 'Test User' },
      };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Reply comment',
        123, // parentId
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 12346,
        pending: false,
      });
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Reply comment',
          parent: { id: 123 },
        },
      );
    });

    it('should successfully post a file comment', async () => {
      const mockComment = {
        id: 12347,
        text: 'File comment',
        author: { displayName: 'Test User' },
      };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'File comment',
        undefined, // parentId
        'src/test.js', // filePath
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 12347,
        pending: false,
      });
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'File comment',
          anchor: {
            path: 'src/test.js',
            diffType: 'EFFECTIVE',
          },
        },
      );
    });

    it('should successfully post a line comment', async () => {
      const mockComment = {
        id: 12348,
        text: 'Line comment',
        author: { displayName: 'Test User' },
      };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Line comment',
        undefined, // parentId
        'src/test.js', // filePath
        undefined, // startLine
        undefined, // startLineType
        42, // line
        'ADDED', // lineType
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 12348,
        pending: false,
      });
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Line comment',
          anchor: {
            path: 'src/test.js',
            diffType: 'EFFECTIVE',
            line: 42,
            lineType: 'ADDED',
            fileType: 'TO',
          },
        },
      );
    });

    it('should successfully post a multiline comment', async () => {
      const mockComment = {
        id: 12349,
        text: 'Multiline comment',
        author: { displayName: 'Test User' },
        anchor: {
          path: 'src/test.js',
          diffType: 'EFFECTIVE',
          line: 15,
          lineType: 'ADDED',
          fileType: 'TO',
          multilineMarker: { startLine: 10, startLineType: 'ADDED' },
          multilineSpan: { dstSpanStart: 10, dstSpanEnd: 15 },
        },
      };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Multiline comment',
        undefined,      // parentId
        'src/test.js',  // filePath
        10,             // startLine
        undefined,      // startLineType (should default to lineType)
        15,             // line (end line)
        'ADDED',         // lineType
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 12349,
        pending: false,
        anchor: {
          path: 'src/test.js',
          line: 15,
          lineType: 'ADDED',
          startLine: 10,
          startLineType: 'ADDED',
        },
      });
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Multiline comment',
          anchor: {
            path: 'src/test.js',
            diffType: 'EFFECTIVE',
            line: 15,
            lineType: 'ADDED',
            fileType: 'TO',
            multilineMarker: { startLine: 10, startLineType: 'ADDED' },
            multilineSpan: { dstSpanStart: 10, dstSpanEnd: 15 },
          },
        },
      );
    });

    it('should post a multiline comment with explicit startLineType', async () => {
      const mockComment = {
        id: 12350,
        text: 'Mixed multiline comment',
        author: { displayName: 'Test User' },
        anchor: {
          path: 'src/test.js',
          diffType: 'EFFECTIVE',
          line: 8,
          lineType: 'ADDED',
          fileType: 'TO',
          multilineMarker: { startLine: 5, startLineType: 'CONTEXT' },
          multilineSpan: { dstSpanStart: 5, dstSpanEnd: 8 },
        },
      };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Mixed multiline comment',
        undefined,      // parentId
        'src/test.js',  // filePath
        5,              // startLine
        'CONTEXT',      // startLineType
        8,              // line (end line)
        'ADDED',         // lineType
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Mixed multiline comment',
          anchor: {
            path: 'src/test.js',
            diffType: 'EFFECTIVE',
            line: 8,
            lineType: 'ADDED',
            fileType: 'TO',
            multilineMarker: { startLine: 5, startLineType: 'CONTEXT' },
            multilineSpan: { dstSpanStart: 5, dstSpanEnd: 8 },
          },
        },
      );
    });

    it('should normalize a reversed multiline range (startLine > line)', async () => {
      (PullRequestsService.createComment2 as Mock).mockResolvedValue({ id: 1, anchor: { path: 'src/test.js' } });

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Reversed range',
        undefined,      // parentId
        'src/test.js',  // filePath
        15,             // startLine (greater than line)
        'ADDED',        // startLineType
        10,             // line (end line, smaller)
        'ADDED',         // lineType
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Reversed range',
          anchor: {
            path: 'src/test.js',
            diffType: 'EFFECTIVE',
            line: 15,
            lineType: 'ADDED',
            fileType: 'TO',
            multilineMarker: { startLine: 10, startLineType: 'ADDED' },
            multilineSpan: { dstSpanStart: 10, dstSpanEnd: 15 },
          },
        },
      );
    });

    it('should anchor a REMOVED multiline range to the source file', async () => {
      (PullRequestsService.createComment2 as Mock).mockResolvedValue({ id: 1, anchor: { path: 'src/test.js' } });

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Removed range',
        undefined,      // parentId
        'src/test.js',  // filePath
        2,              // startLine
        'REMOVED',      // startLineType
        5,              // line (end line)
        'REMOVED',       // lineType
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Removed range',
          anchor: {
            path: 'src/test.js',
            diffType: 'EFFECTIVE',
            line: 5,
            lineType: 'REMOVED',
            fileType: 'FROM',
            multilineMarker: { startLine: 2, startLineType: 'REMOVED' },
            multilineSpan: { srcSpanStart: 2, srcSpanEnd: 5 },
          },
        },
      );
    });

    it('should warn when a multi-line suggestion is anchored to a single line', async () => {
      (PullRequestsService.createComment2 as Mock).mockResolvedValue({
        id: 99,
        anchor: { path: 'src/test.js', line: 5, lineType: 'ADDED' },
      });

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        '```suggestion\nconst a = 1;\nconst b = 2;\n```',
        undefined,      // parentId
        'src/test.js',  // filePath
        undefined,      // startLine (single-line anchor — the bug shape)
        undefined,      // startLineType
        5,              // line
        'ADDED',         // lineType
      );

      expect(result.success).toBe(true);
      expect((result.data as any).warning).toMatch(/multi-line ```suggestion/);
      // single-line anchor: no multiline fields sent
      const sentAnchor = (PullRequestsService.createComment2 as Mock).mock.calls[0][3].anchor;
      expect(sentAnchor.multilineMarker).toBeUndefined();
      expect(sentAnchor.multilineSpan).toBeUndefined();
    });

    it('should not warn when a multi-line suggestion has a proper multiline range', async () => {
      (PullRequestsService.createComment2 as Mock).mockResolvedValue({
        id: 100,
        anchor: { path: 'src/test.js', line: 5, lineType: 'ADDED', multilineMarker: { startLine: 4, startLineType: 'ADDED' } },
      });

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        '```suggestion\nconst a = 1;\nconst b = 2;\n```',
        undefined,      // parentId
        'src/test.js',  // filePath
        4,              // startLine
        'ADDED',        // startLineType
        5,              // line
        'ADDED',         // lineType
      );

      expect(result.success).toBe(true);
      expect((result.data as any).warning).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      (PullRequestsService.createComment2 as Mock).mockRejectedValue(mockError);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Test comment',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('postPullRequestComment - severity flag', () => {
    it('should include severity: BLOCKER in the request body when severity is BLOCKER', async () => {
      const mockComment = { id: 200, text: 'Task comment', author: { displayName: 'Test User' } };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Task comment',
        undefined,  // parentId
        undefined,  // filePath
        undefined,  // startLine
        undefined,  // startLineType
        undefined,  // line
        undefined,  // lineType
        undefined,  // pending
        'BLOCKER',   // severity
      );

      expect(result.success).toBe(true);
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        { text: 'Task comment', severity: 'BLOCKER' },
      );
    });

    it('should NOT include severity in the request body when severity is omitted', async () => {
      const mockComment = { id: 201, text: 'Normal comment', author: { displayName: 'Test User' } };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Normal comment',
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        { text: 'Normal comment' }, // no severity field
      );
    });

    it('should support severity BLOCKER combined with a file/line anchor', async () => {
      const mockComment = { id: 202, text: 'Inline task', author: { displayName: 'Test User' } };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Inline task',
        undefined,      // parentId
        'src/index.ts', // filePath
        undefined,      // startLine
        undefined,      // startLineType
        10,             // line
        'ADDED',        // lineType
        undefined,      // pending
        'BLOCKER',       // severity
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Inline task',
          severity: 'BLOCKER',
          anchor: {
            path: 'src/index.ts',
            diffType: 'EFFECTIVE',
            line: 10,
            lineType: 'ADDED',
            fileType: 'TO',
          },
        },
      );
    });
  });

  describe('postPullRequestComment - pending flag', () => {
    it('should include state: PENDING in the request body when pending is true', async () => {
      const mockComment = { id: 99, text: 'Draft comment', author: { displayName: 'Test User' } };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Draft comment',
        undefined, // parentId
        undefined, // filePath
        undefined, // startLine
        undefined, // startLineType
        undefined, // line
        undefined, // lineType
        true,       // pending
      );

      expect(result.success).toBe(true);
      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        { text: 'Draft comment', state: 'PENDING' },
      );
    });

    it('should NOT include pending in the request body when pending is false or omitted', async () => {
      const mockComment = { id: 100, text: 'Normal comment', author: { displayName: 'Test User' } };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Normal comment',
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        { text: 'Normal comment' }, // no pending field
      );
    });

    it('should support state: PENDING combined with a file anchor', async () => {
      const mockComment = { id: 101, text: 'Pending file comment', author: { displayName: 'Test User' } };
      (PullRequestsService.createComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.postPullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        'Pending file comment',
        undefined,      // parentId
        'src/index.ts', // filePath
        undefined,      // startLine
        undefined,      // startLineType
        10,             // line
        'ADDED',        // lineType
        true,            // pending
      );

      expect(PullRequestsService.createComment2).toHaveBeenCalledWith(
        mockProjectKey,
        mockPullRequestId,
        mockRepositorySlug,
        {
          text: 'Pending file comment',
          state: 'PENDING',
          anchor: {
            path: 'src/index.ts',
            diffType: 'EFFECTIVE',
            line: 10,
            lineType: 'ADDED',
            fileType: 'TO',
          },
        },
      );
    });
  });

  describe('updatePullRequestComment', () => {
    it('should resolve a task by sending state RESOLVED with the version', async () => {
      const mockComment = { id: 500, version: 2, state: 'RESOLVED', text: 'Task body' };
      (PullRequestsService.updateComment2 as Mock).mockResolvedValue(mockComment);

      const result = await bitbucketService.updatePullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        '500',      // commentId
        1,          // version
        undefined,  // text
        'RESOLVED',  // state
      );

      expect(result.success).toBe(true);
      expect(PullRequestsService.updateComment2).toHaveBeenCalledWith(
        mockProjectKey,
        '500',
        mockPullRequestId,
        mockRepositorySlug,
        { version: 1, state: 'RESOLVED' },
      );
    });

    it('should edit the comment text without changing state or severity', async () => {
      const mockComment = { id: 501, version: 3, text: 'Edited text' };
      (PullRequestsService.updateComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.updatePullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        '501',
        2,
        'Edited text',
      );

      expect(PullRequestsService.updateComment2).toHaveBeenCalledWith(
        mockProjectKey,
        '501',
        mockPullRequestId,
        mockRepositorySlug,
        { version: 2, text: 'Edited text' },
      );
    });

    it('should support combining text, state, and severity in a single update', async () => {
      const mockComment = { id: 502, version: 4, text: 'New body', state: 'RESOLVED', severity: 'BLOCKER' };
      (PullRequestsService.updateComment2 as Mock).mockResolvedValue(mockComment);

      await bitbucketService.updatePullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        '502',
        3,
        'New body',
        'RESOLVED',
        'BLOCKER',
      );

      expect(PullRequestsService.updateComment2).toHaveBeenCalledWith(
        mockProjectKey,
        '502',
        mockPullRequestId,
        mockRepositorySlug,
        { version: 3, text: 'New body', state: 'RESOLVED', severity: 'BLOCKER' },
      );
    });

    it('should propagate API errors', async () => {
      (PullRequestsService.updateComment2 as Mock).mockRejectedValue(new Error('Conflict'));

      const result = await bitbucketService.updatePullRequestComment(
        mockProjectKey,
        mockRepositorySlug,
        mockPullRequestId,
        '503',
        1,
        undefined,
        'RESOLVED',
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Conflict');
    });
  });
});
