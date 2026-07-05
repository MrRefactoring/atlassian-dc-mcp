export interface InboxPRRef {
  id: string;
  displayId: string;
  latestCommit?: string;
  repository?: {
    slug: string;
    project?: {
      key: string;
    };
  };
}
