import type { ApplicationUser, ReviewerGroup } from '../models/index.js';

export interface UpdatePullRequestCondition {
  projectKey: string;
  id: string;
  repositorySlug: string;
  requestBody?: {
    requiredApprovals?: number;
    reviewerGroups?: Array<ReviewerGroup>;
    reviewers?: Array<ApplicationUser>;
    sourceMatcher?: {
      displayId?: string;
      id?: string;
      type?: {
        id?: 'ANY_REF' | 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
        name?: string;
      };
    };
    targetMatcher?: {
      displayId?: string;
      id?: string;
      type?: {
        id?: 'ANY_REF' | 'BRANCH' | 'PATTERN' | 'MODEL_CATEGORY' | 'MODEL_BRANCH';
        name?: string;
      };
    };
  };
}
