export interface ListParticipants {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  start?: number;
  limit?: number;
}
