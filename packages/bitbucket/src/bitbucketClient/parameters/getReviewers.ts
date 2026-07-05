export interface GetReviewers {
  projectKey: string;
  repositorySlug: string;
  targetRepoId?: string;
  sourceRepoId?: string;
  sourceRefId?: string;
  targetRefId?: string;
}
