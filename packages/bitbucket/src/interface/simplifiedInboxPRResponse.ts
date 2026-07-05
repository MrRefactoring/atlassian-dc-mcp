import type { SimplifiedInboxPR } from './simplifiedInboxPR.js';

export interface SimplifiedInboxPRResponse {
  pullRequests: SimplifiedInboxPR[];
  summary: {
    totalCount: number;
    byRepository: Record<string, number>;
  };
  isLastPage: boolean;
  nextPageStart?: number;
}
