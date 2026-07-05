export interface StreamCommits {
  projectKey: string;
  repositorySlug: string;
  fromRepo?: string;
  from?: string;
  to?: string;
  start?: number;
  limit?: number;
}
