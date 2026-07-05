import type { Project } from '../models/index.js';

export interface UpdateProject {
  projectKey: string;
  requestBody?: Project;
}
