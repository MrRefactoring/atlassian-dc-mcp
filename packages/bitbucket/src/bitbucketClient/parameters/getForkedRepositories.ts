export interface GetForkedRepositories {
  projectKey: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
