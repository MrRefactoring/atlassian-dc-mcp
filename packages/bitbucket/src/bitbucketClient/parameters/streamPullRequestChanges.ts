export interface StreamPullRequestChanges {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  sinceId?: string;
  changeScope?: string;
  untilId?: string;
  withComments?: string;
  start?: number;
  limit?: number;
}
