import type { RequiredBuildConditionSetRequest } from '../models/index.js';

export interface CreateRequiredBuildsMergeCheck {
  projectKey: string;
  repositorySlug: string;
  requestBody?: RequiredBuildConditionSetRequest;
}
