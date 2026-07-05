import type { Settings } from '../models/index.js';

export interface SetSettings {
  projectKey: string;
  hookKey: string;
  repositorySlug: string;
  requestBody?: Settings;
}
