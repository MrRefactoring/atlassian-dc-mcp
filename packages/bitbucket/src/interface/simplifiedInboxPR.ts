export interface SimplifiedInboxPR {
  id: number;
  title: string;
  description?: string;
  state: string;
  draft: boolean;
  createdDate: number;
  updatedDate: number;
  link?: string;
  author?: {
    name: string;
    displayName?: string;
  };
  fromRef: string;
  toRef: string;
  repository: {
    slug: string;
    projectKey: string;
  };
  reviewers: {
    name: string;
    approved: boolean;
    status: string;
  }[];
  commentCount: number;
  openTaskCount: number;
}
