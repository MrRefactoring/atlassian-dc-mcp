import type { InboxPRRef } from './inboxPRRef.js';
import type { InboxPRReviewer } from './inboxPRReviewer.js';
import type { InboxPRUser } from './inboxPRUser.js';

export interface InboxPullRequest {
  id: number;
  title: string;
  description?: string;
  state: string;
  draft?: boolean;
  createdDate: number;
  updatedDate: number;
  author?: {
    user: InboxPRUser;
  };
  fromRef: InboxPRRef;
  toRef: InboxPRRef;
  reviewers?: InboxPRReviewer[];
  properties?: {
    commentCount?: number;
    openTaskCount?: number;
  };
  links?: {
    self?: { href: string }[];
  };
}
