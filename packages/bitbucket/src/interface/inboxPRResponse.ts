import type { InboxPullRequest } from './inboxPullRequest.js';

export interface InboxPRResponse {
  values: InboxPullRequest[];
  size: number;
  isLastPage: boolean;
  start: number;
  limit: number;
  nextPageStart?: number;
}
