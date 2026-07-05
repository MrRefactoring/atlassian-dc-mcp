export interface DeleteAnnotations {
  projectKey: string;
  commitId: string;
  repositorySlug: string;
  key: string;
  externalId?: string;
}
