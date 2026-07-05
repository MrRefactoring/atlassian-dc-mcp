import type { AutoDeclineSettingsRequest } from '../models/index.js';

export interface SetAutoDeclineSettings {
  projectKey: string;
  repositorySlug: string;
  requestBody?: AutoDeclineSettingsRequest;
}
