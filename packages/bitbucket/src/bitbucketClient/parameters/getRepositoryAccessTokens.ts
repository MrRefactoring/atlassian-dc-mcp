export interface GetRepositoryAccessTokens {
  projectKey: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
