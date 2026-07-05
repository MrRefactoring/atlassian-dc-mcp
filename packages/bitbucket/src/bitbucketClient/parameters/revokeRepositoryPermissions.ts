export interface RevokeRepositoryPermissions {
  projectKey: string;
  repositorySlug: string;
  user?: string;
  group?: string;
}
