import { describe, it, expect, vi } from 'vitest';
import { add, addAnnotations, createRequiredBuildsMergeCheck, updateRequiredBuildsMergeCheck } from '../src/bitbucketClient/api/builds.js';
import type { HttpClient } from 'datacenter-mcp-core';

function recordingClient(): { client: HttpClient; sent: () => any } {
  const sendRequest = vi.fn(async (_options: any) => ({ id: 1 }));

  return {
    client: { sendRequest } as unknown as HttpClient,
    sent: () => sendRequest.mock.calls[0]![0],
  };
}

describe('builds api content type', () => {
  it('sends a build status as JSON', async () => {
    const { client, sent } = recordingClient();

    await add(client, { projectKey: 'TEST', repositorySlug: 'repo', commitId: 'abc', state: 'SUCCESSFUL', key: 'build', url: 'https://example.invalid' } as any);

    expect(sent().contentType).toBe('application/json');
  });

  it('sends insight annotations as JSON', async () => {
    const { client, sent } = recordingClient();

    await addAnnotations(client, { projectKey: 'TEST', repositorySlug: 'repo', commitId: 'abc', key: 'report', annotations: [] } as any);

    expect(sent().contentType).toBe('application/json');
  });

  it('sends a new required builds merge check as JSON', async () => {
    const { client, sent } = recordingClient();

    await createRequiredBuildsMergeCheck(client, { projectKey: 'TEST', repositorySlug: 'repo', buildParentKeys: ['build'], refMatcher: { id: 'ANY_REF_MATCHER_ID', type: { id: 'ANY_REF' } } } as any);

    expect(sent().contentType).toBe('application/json');
  });

  it('sends an updated required builds merge check as JSON', async () => {
    const { client, sent } = recordingClient();

    await updateRequiredBuildsMergeCheck(client, { projectKey: 'TEST', repositorySlug: 'repo', id: 1, buildParentKeys: ['build'], refMatcher: { id: 'ANY_REF_MATCHER_ID', type: { id: 'ANY_REF' } } } as any);

    expect(sent().contentType).toBe('application/json');
  });
});
