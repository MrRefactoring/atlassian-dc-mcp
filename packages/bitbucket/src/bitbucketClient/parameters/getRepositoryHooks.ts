export interface GetRepositoryHooks {
  projectKey: string;
  repositorySlug: string;
  type?: 'PRE_RECEIVE' | 'POST_RECEIVE';
  start?: number;
  limit?: number;
}
