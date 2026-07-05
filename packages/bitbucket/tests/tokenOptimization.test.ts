import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock, MockInstance } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initializeRuntimeConfig } from 'datacenter-mcp-core';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  pullRequests: {
    getActivities: vi.fn(),
    streamChanges: vi.fn(),
    createComment: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
}));

function createUser(name: string, displayName: string) {
  return {
    name,
    emailAddress: `${name}@example.com`,
    active: true,
    displayName,
    id: 1,
    slug: name,
    type: 'NORMAL',
    links: {
      self: [{ href: `https://bitbucket.example.com/users/${name}` }],
    },
  };
}

function createComment(overrides: Record<string, unknown> = {}) {
  return {
    properties: { repositoryId: 1 },
    id: 101,
    version: 1,
    text: 'Looks good',
    author: createUser('reviewer', 'Reviewer'),
    createdDate: 20,
    updatedDate: 21,
    comments: [],
    anchor: {
      fromHash: 'abc',
      toHash: 'def',
      line: 10,
      lineType: 'ADDED',
      fileType: 'TO',
      path: 'src/app.ts',
      diffType: 'EFFECTIVE',
      orphaned: false,
    },
    threadResolved: false,
    severity: 'NORMAL',
    state: 'OPEN',
    permittedOperations: {
      editable: true,
      transitionable: true,
      deletable: true,
    },
    ...overrides,
  };
}

describe('BitbucketService token optimization paths', () => {
  let service: BitbucketService;
  let tempHome: string;
  let homedirSpy: MockInstance;
  const originalPlatform = process.platform;

  beforeEach(() => {
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'bitbucket-token-opt-home-'));
    homedirSpy = vi.spyOn(os, 'homedir').mockReturnValue(tempHome);
    Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
    initializeRuntimeConfig();
    service = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  afterEach(() => {
    homedirSpy.mockRestore();
    Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    fs.rmSync(tempHome, { recursive: true, force: true });
  });

  describe('getPullRequestCommentsAndActions', () => {
    const mockActivityResponse = {
      isLastPage: false,
      values: [
        {
          id: 1,
          createdDate: 10,
          user: createUser('author', 'Author'),
          action: 'OPENED',
        },
        {
          id: 2,
          createdDate: 20,
          user: createUser('reviewer', 'Reviewer'),
          action: 'COMMENTED',
          comment: createComment(),
        },
      ],
    };

    it('returns compact output by default', async () => {
      (bb.pullRequests.getActivities as Mock).mockResolvedValue(mockActivityResponse);

      const result = await service.getPullRequestCommentsAndActions('TEST', 'repo', '123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        isLastPage: false,
        activities: [
          {
            id: 1,
            createdDate: 10,
            user: { name: 'author', displayName: 'Author' },
            action: 'OPENED',
          },
          {
            id: 2,
            createdDate: 20,
            user: { name: 'reviewer', displayName: 'Reviewer' },
            action: 'COMMENTED',
            comment: {
              id: 101,
              text: 'Looks good',
              author: { name: 'reviewer', displayName: 'Reviewer' },
              createdDate: 20,
              anchor: {
                line: 10,
                path: 'src/app.ts',
                fileType: 'TO',
              },
              comments: [],
              threadResolved: false,
              state: 'OPEN',
            },
          },
        ],
        summary: {
          totalActivities: 2,
          prAuthor: { name: 'author', displayName: 'Author' },
          commentCount: 1,
          unresolvedCount: 1,
        },
      });
      expect(bb.pullRequests.getActivities).toHaveBeenCalledWith({ projectKey: 'TEST', pullRequestId: '123', repositorySlug: 'repo', fromType: undefined, fromId: undefined, start: undefined, limit: 25 });
    });

    it('skips resolved threads by default and includes them on request', async () => {
      const resolvedActivityResponse = {
        isLastPage: true,
        values: [
          {
            id: 1,
            createdDate: 10,
            user: createUser('author', 'Author'),
            action: 'OPENED',
          },
          {
            id: 2,
            createdDate: 20,
            user: createUser('reviewer', 'Reviewer'),
            action: 'COMMENTED',
            comment: createComment({
              id: 202,
              text: 'Resolved comment',
              threadResolved: true,
              comments: [createComment({ id: 203, text: 'Resolved reply', anchor: undefined, threadResolved: true })],
            }),
          },
        ],
      };

      (bb.pullRequests.getActivities as Mock).mockResolvedValue(resolvedActivityResponse);

      const defaultResult = await service.getPullRequestCommentsAndActions('TEST', 'repo', '123');
      const includeResolvedResult = await service.getPullRequestCommentsAndActions('TEST', 'repo', '123', undefined, undefined, 'compact', true);

      expect(defaultResult.success).toBe(true);
      expect(defaultResult.data).toEqual({
        isLastPage: true,
        activities: [
          {
            id: 1,
            createdDate: 10,
            user: { name: 'author', displayName: 'Author' },
            action: 'OPENED',
          },
        ],
        summary: {
          totalActivities: 1,
          prAuthor: { name: 'author', displayName: 'Author' },
          commentCount: 0,
          unresolvedCount: 0,
        },
      });
      expect(includeResolvedResult.success).toBe(true);
      expect(includeResolvedResult.data).toEqual({
        isLastPage: true,
        activities: [
          {
            id: 1,
            createdDate: 10,
            user: { name: 'author', displayName: 'Author' },
            action: 'OPENED',
          },
          {
            id: 2,
            createdDate: 20,
            user: { name: 'reviewer', displayName: 'Reviewer' },
            action: 'COMMENTED',
            comment: {
              id: 202,
              text: 'Resolved comment',
              author: { name: 'reviewer', displayName: 'Reviewer' },
              createdDate: 20,
              anchor: {
                line: 10,
                path: 'src/app.ts',
                fileType: 'TO',
              },
              comments: [
                {
                  id: 203,
                  text: 'Resolved reply',
                  author: { name: 'reviewer', displayName: 'Reviewer' },
                  createdDate: 20,
                  comments: [],
                  threadResolved: true,
                  state: 'OPEN',
                },
              ],
              threadResolved: true,
              state: 'OPEN',
            },
          },
        ],
        summary: {
          totalActivities: 2,
          prAuthor: { name: 'author', displayName: 'Author' },
          commentCount: 1,
          unresolvedCount: 0,
        },
      });
    });

    it('returns summary output when requested', async () => {
      (bb.pullRequests.getActivities as Mock).mockResolvedValue(mockActivityResponse);

      const result = await service.getPullRequestCommentsAndActions('TEST', 'repo', '123', 5, 10, 'summary');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        isLastPage: false,
        summary: {
          totalActivities: 2,
          prAuthor: { name: 'author', displayName: 'Author' },
          commentCount: 1,
          unresolvedCount: 1,
        },
        items: ['Reviewer on src/app.ts:10: Looks good'],
      });
      expect(bb.pullRequests.getActivities).toHaveBeenCalledWith({ projectKey: 'TEST', pullRequestId: '123', repositorySlug: 'repo', fromType: undefined, fromId: undefined, start: 5, limit: 10 });
    });

    it('returns the raw payload when output is full', async () => {
      (bb.pullRequests.getActivities as Mock).mockResolvedValue(mockActivityResponse);

      const result = await service.getPullRequestCommentsAndActions('TEST', 'repo', '123', undefined, undefined, 'full');

      expect(result.success).toBe(true);
      expect(result.data).toStrictEqual(mockActivityResponse);
    });
  });

  describe('getPullRequestChanges', () => {
    const mockChangesResponse = {
      fromHash: 'abc',
      toHash: 'def',
      properties: { changeScope: 'ALL' },
      values: [
        {
          contentId: 'content-1',
          fromContentId: 'from-content-1',
          path: {
            components: ['src', 'app.ts'],
            parent: 'src',
            name: 'app.ts',
            extension: 'ts',
            toString: 'src/app.ts',
          },
          type: 'MODIFY',
          properties: {
            gitChangeType: 'MODIFY',
            activeComments: 2,
          },
        },
      ],
      size: 1,
      isLastPage: true,
      start: 0,
      limit: 25,
      nextPageStart: null,
    };

    it('returns compact output by default', async () => {
      (bb.pullRequests.streamChanges as Mock).mockResolvedValue(mockChangesResponse);

      const result = await service.getPullRequestChanges('TEST', 'repo', '123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        fromHash: 'abc',
        toHash: 'def',
        changeScope: 'ALL',
        changes: [
          {
            contentId: 'content-1',
            path: {
              name: 'app.ts',
              path: 'src/app.ts',
              extension: 'ts',
            },
            type: 'MODIFY',
            gitChangeType: 'MODIFY',
            comments: 2,
          },
        ],
        summary: {
          totalChanges: 1,
          additions: 0,
          deletions: 0,
          modifications: 1,
          moves: 0,
          filesWithComments: 1,
        },
        isLastPage: true,
      });
    });

    it('returns summary output when requested', async () => {
      (bb.pullRequests.streamChanges as Mock).mockResolvedValue(mockChangesResponse);

      const result = await service.getPullRequestChanges('TEST', 'repo', '123', undefined, undefined, undefined, undefined, undefined, undefined, 'summary');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        fromHash: 'abc',
        toHash: 'def',
        changeScope: 'ALL',
        isLastPage: true,
        summary: {
          totalChanges: 1,
          additions: 0,
          deletions: 0,
          modifications: 1,
          moves: 0,
          filesWithComments: 1,
        },
        items: ['Modified: src/app.ts [2 comments]'],
      });
    });

    it('returns the raw payload when output is full', async () => {
      (bb.pullRequests.streamChanges as Mock).mockResolvedValue(mockChangesResponse);

      const result = await service.getPullRequestChanges('TEST', 'repo', '123', undefined, undefined, undefined, undefined, undefined, undefined, 'full');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockChangesResponse);
    });
  });

  describe('full mutation output', () => {
    it('returns the raw comment response when requested', async () => {
      const mockComment = {
        id: 222,
        text: 'Raw comment',
        state: 'OPEN',
      };
      (bb.pullRequests.createComment as Mock).mockResolvedValue(mockComment);

      const result = await service.postPullRequestComment('TEST', 'repo', '123', 'Raw comment', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'full');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockComment);
    });

    it('returns the raw PR create response when requested', async () => {
      const mockPullRequest = {
        id: 10,
        version: 1,
        title: 'Raw create',
        state: 'OPEN',
      };
      (bb.pullRequests.create as Mock).mockResolvedValue(mockPullRequest);

      const result = await service.createPullRequest('TEST', 'repo', 'Raw create', undefined, 'refs/heads/feature', 'refs/heads/main', undefined, undefined, 'full');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequest);
    });

    it('returns the raw PR update response when requested', async () => {
      const mockPullRequest = {
        id: 11,
        version: 2,
        title: 'Raw update',
        state: 'OPEN',
      };
      (bb.pullRequests.update as Mock).mockResolvedValue(mockPullRequest);

      const result = await service.updatePullRequest('TEST', 'repo', '123', 1, 'Raw update', undefined, undefined, undefined, 'full');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPullRequest);
    });
  });
});
