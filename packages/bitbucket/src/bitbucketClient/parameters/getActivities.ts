export interface GetActivities {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  fromType?: string;
  fromId?: string;
  start?: number;
  limit?: number;
}
