export interface GetCommit {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  path?: string;
}
