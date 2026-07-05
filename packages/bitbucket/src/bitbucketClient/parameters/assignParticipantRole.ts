import type { PullRequestAssignParticipantRoleRequest } from '../models/index.js';

export interface AssignParticipantRole {
  projectKey: string;
  pullRequestId: string;
  repositorySlug: string;
  requestBody: PullRequestAssignParticipantRoleRequest;
}
