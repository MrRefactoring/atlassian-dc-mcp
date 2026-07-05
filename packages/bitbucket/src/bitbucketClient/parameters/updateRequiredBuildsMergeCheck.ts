import type { RequiredBuildConditionSetRequest } from '../models/index.js';

export interface UpdateRequiredBuildsMergeCheck {
  projectKey: string;
  id: number;
  repositorySlug: string;
  requestBody?: RequiredBuildConditionSetRequest;
}
