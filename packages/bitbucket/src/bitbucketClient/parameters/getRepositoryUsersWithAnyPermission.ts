export interface GetRepositoryUsersWithAnyPermission {
  projectKey: string;
  repositorySlug: string;
  filter?: string;
  start?: number;
  limit?: number;
}
