export interface SetPermissionForGroup {
  projectKey: string;
  name: Array<string>;
  permission: 'REPO_READ' | 'REPO_WRITE' | 'REPO_ADMIN';
  repositorySlug: string;
}
