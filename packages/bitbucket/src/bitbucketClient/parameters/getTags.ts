export interface GetTags {
  projectKey: string;
  repositorySlug: string;
  orderBy?: string;
  filterText?: string;
  start?: number;
  limit?: number;
}
