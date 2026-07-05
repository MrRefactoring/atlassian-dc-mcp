export interface GetComments {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  path?: string;
  since?: string;
  start?: number;
  limit?: number;
}
