import type { InboxPRResponse, InboxPullRequest, SimplifiedInboxPR, SimplifiedInboxPRResponse } from './interface/index.js';

// Type guards
function isInboxPRResponse(obj: unknown): obj is InboxPRResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray((obj as InboxPRResponse).values) &&
    typeof (obj as InboxPRResponse).isLastPage === 'boolean'
  );
}

function isInboxPullRequest(obj: unknown): obj is InboxPullRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as InboxPullRequest).id === 'number' &&
    typeof (obj as InboxPullRequest).title === 'string' &&
    typeof (obj as InboxPullRequest).state === 'string'
  );
}

function simplifyInboxPR(pr: InboxPullRequest): SimplifiedInboxPR {
  const repo = pr.toRef?.repository ?? pr.fromRef?.repository;
  const link = pr.links?.self?.[0]?.href;

  return {
    id: pr.id,
    title: pr.title,
    ...(pr.description !== undefined && { description: pr.description }),
    state: pr.state,
    draft: pr.draft ?? false,
    createdDate: pr.createdDate,
    updatedDate: pr.updatedDate,
    ...(link && { link }),
    ...(pr.author?.user && {
      author: {
        name: pr.author.user.name,
        ...(pr.author.user.displayName && { displayName: pr.author.user.displayName }),
      },
    }),
    fromRef: pr.fromRef?.displayId ?? pr.fromRef?.id,
    toRef: pr.toRef?.displayId ?? pr.toRef?.id,
    repository: {
      slug: repo?.slug ?? 'unknown',
      projectKey: repo?.project?.key ?? 'unknown',
    },
    reviewers: (pr.reviewers ?? []).map(r => ({
      name: r.user.name,
      approved: r.approved,
      status: r.status,
    })),
    commentCount: pr.properties?.commentCount ?? 0,
    openTaskCount: pr.properties?.openTaskCount ?? 0,
  };
}

export function simplifyInboxPullRequests(response: unknown): SimplifiedInboxPRResponse | unknown {
  if (!isInboxPRResponse(response)) {
    return response;
  }

  const pullRequests: SimplifiedInboxPR[] = [];

  for (const pr of response.values) {
    if (isInboxPullRequest(pr)) {
      pullRequests.push(simplifyInboxPR(pr));
    }
  }

  if (pullRequests.length === 0 && response.values.length > 0) {
    return response;
  }

  const byRepository: Record<string, number> = {};
  for (const pr of pullRequests) {
    const repoKey = `${pr.repository.projectKey}/${pr.repository.slug}`;
    byRepository[repoKey] = (byRepository[repoKey] ?? 0) + 1;
  }

  return {
    pullRequests,
    summary: {
      totalCount: pullRequests.length,
      byRepository,
    },
    isLastPage: response.isLastPage,
    ...(response.nextPageStart !== undefined && { nextPageStart: response.nextPageStart }),
  };
}
