import type { InboxPRUser } from './inboxPRUser.js';

export interface InboxPRReviewer {
  user: InboxPRUser;
  approved: boolean;
  status: string;
}
