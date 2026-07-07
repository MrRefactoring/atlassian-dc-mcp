import { describe, it, expect, vi } from 'vitest';
import { createComment as createPullRequestComment, finishReview } from '../src/bitbucketClient/api/pullRequests.js';
import { createComment as createCommitComment } from '../src/bitbucketClient/api/repositories.js';
import type { HttpClient } from 'datacenter-mcp-core';

/**
 * Regression guard for the api → pickBody layer. The service builds `anchor`/`parent`
 * on the comment, but the actual POST body is assembled by `pickBody(params, CommentSchema)`
 * inside the api function. If `CommentSchema` omits those keys, an inline comment silently
 * posts as an unanchored (general) comment and a reply as a top-level comment. The
 * service-level tests mock the client namespace and can't catch that — these exercise it.
 */
function recordingClient(): { client: HttpClient; sent: () => any } {
  const sendRequest = vi.fn(async (_options: any) => ({ id: 1 }));

  return {
    client: { sendRequest } as unknown as HttpClient,
    sent: () => sendRequest.mock.calls[0]![0],
  };
}

describe('createComment api body assembly', () => {
  it('keeps the anchor in the pull-request comment body', async () => {
    const { client, sent } = recordingClient();

    await createPullRequestComment(client, {
      projectKey: 'TEST',
      repositorySlug: 'repo',
      pullRequestId: '1',
      text: 'Inline comment',
      anchor: { path: 'src/index.ts', line: 10, lineType: 'ADDED', fileType: 'TO', diffType: 'EFFECTIVE' },
    } as any);

    expect(sent().body).toMatchObject({
      text: 'Inline comment',
      anchor: { path: 'src/index.ts', line: 10, lineType: 'ADDED' },
    });
  });

  it('keeps the parent reference in a reply body', async () => {
    const { client, sent } = recordingClient();

    await createPullRequestComment(client, {
      projectKey: 'TEST',
      repositorySlug: 'repo',
      pullRequestId: '1',
      text: 'Reply',
      parent: { id: 42 },
    } as any);

    expect(sent().body).toMatchObject({ text: 'Reply', parent: { id: 42 } });
  });

  it('keeps the anchor in the commit comment body', async () => {
    const { client, sent } = recordingClient();

    await createCommitComment(client, {
      projectKey: 'TEST',
      repositorySlug: 'repo',
      commitId: 'abc123',
      text: 'Commit inline',
      anchor: { path: 'src/index.ts', line: 5, lineType: 'CONTEXT', fileType: 'TO' },
    } as any);

    expect(sent().body).toMatchObject({
      text: 'Commit inline',
      anchor: { path: 'src/index.ts', line: 5 },
    });
  });
});

describe('finishReview api request', () => {
  it('PUTs the /review endpoint with participantStatus in the body (publishes pending comments)', async () => {
    const { client, sent } = recordingClient();

    await finishReview(client, {
      projectKey: 'TEST',
      repositorySlug: 'repo',
      pullRequestId: '1',
      participantStatus: 'NEEDS_WORK',
      commentText: 'Summary',
    } as any);

    const req = sent();
    expect(req.method).toBe('PUT');
    // Must be the review endpoint (publishes drafts), NOT /participants/{userSlug} (status only).
    expect(req.url).toBe('/api/latest/projects/TEST/repos/repo/pull-requests/1/review');
    expect(req.body).toMatchObject({ participantStatus: 'NEEDS_WORK', commentText: 'Summary' });
  });
});
