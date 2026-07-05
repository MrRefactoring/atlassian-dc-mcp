export interface GetCommits {
  projectKey: string;
  repositorySlug: string;
  avatarScheme?: string;
  path?: string;
  withCounts?: string;
  followRenames?: string;
  until?: string;
  avatarSize?: string;
  since?: string;
  merges?: string;
  ignoreMissing?: string;
  start?: number;
  limit?: number;
}
