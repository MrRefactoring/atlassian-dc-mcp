export interface StreamDiff {
  commitId: string;
  repositorySlug: string;
  path: string;
  projectKey: string;
  srcPath?: string;
  avatarSize?: string;
  filter?: string;
  avatarScheme?: string;
  contextLines?: string;
  autoSrcPath?: string;
  whitespace?: string;
  withComments?: string;
  since?: string;
}
