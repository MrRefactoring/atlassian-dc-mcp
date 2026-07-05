export interface GetPage {
  projectKey: string;
  repositorySlug: string;
  withAttributes?: string;
  at?: string;
  withProperties?: string;
  draft?: string;
  filterText?: string;
  state?: string;
  order?: string;
  direction?: string;
  start?: number;
  limit?: number;
}
