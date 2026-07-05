import type { SimplifiedActivity } from './simplifiedActivity.js';
import type { SimplifiedUser } from './simplifiedUser.js';

export interface SimplifiedPRResponse {
  isLastPage: boolean;
  activities: SimplifiedActivity[];
  summary: {
    totalActivities: number;
    prAuthor?: SimplifiedUser;
    commentCount: number;
    unresolvedCount: number;
  };
}
