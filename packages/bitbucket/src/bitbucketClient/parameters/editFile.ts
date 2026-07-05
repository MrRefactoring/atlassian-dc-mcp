import type { MultipartFormData } from '../models/index.js';

export interface EditFile {
  path: string;
  projectKey: string;
  repositorySlug: string;
  formData?: MultipartFormData;
}
