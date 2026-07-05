export interface FindWebhooks {
  projectKey: string;
  repositorySlug: string;
  event?: string;
  statistics?: boolean;
}
