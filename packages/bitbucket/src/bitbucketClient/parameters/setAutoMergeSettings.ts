import type { AutoMergeSettingsRequest } from '../models/index.js';

export interface SetAutoMergeSettings {
  projectKey: string;
  repositorySlug: string;
  requestBody?: AutoMergeSettingsRequest;
}
