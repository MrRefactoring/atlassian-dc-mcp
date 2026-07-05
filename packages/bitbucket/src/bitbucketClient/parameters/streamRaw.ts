export interface StreamRaw {
  path: string;
  projectKey: string;
  repositorySlug: string;
  at?: string;
  markup?: string;
  htmlEscape?: string;
  includeHeadingId?: string;
  hardwrap?: string;
}
