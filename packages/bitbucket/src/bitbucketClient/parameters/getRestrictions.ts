export interface GetRestrictions {
  projectKey: string;
  repositorySlug: string;
  matcherType?: 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
  matcherId?: string;
  type?: 'read-only' | 'no-deletes' | 'fast-forward-only' | 'pull-request-only' | 'no-creates';
  start?: number;
  limit?: number;
}
