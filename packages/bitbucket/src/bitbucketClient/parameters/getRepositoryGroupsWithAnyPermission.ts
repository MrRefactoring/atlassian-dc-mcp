export interface GetRepositoryGroupsWithAnyPermission {
  projectKey: string;
  repositorySlug: string;
  filter?: string;
  start?: number;
  limit?: number;
}
