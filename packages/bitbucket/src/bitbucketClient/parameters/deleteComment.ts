export interface DeleteComment {
  projectKey: string;
  commentId: string;
  pullRequestId: string;
  repositorySlug: string;
  version?: string;
}
