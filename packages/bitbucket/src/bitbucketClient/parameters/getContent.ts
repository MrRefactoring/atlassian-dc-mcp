export interface GetContent {
  path: string;
  projectKey: string;
  repositorySlug: string;
  noContent?: string;
  at?: string;
  size?: string;
  blame?: string;
  type?: string;
}
