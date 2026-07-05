export interface GetBranches {
  projectKey: string;
  repositorySlug: string;
  boostMatches?: boolean;
  context?: string;
  orderBy?: 'ALPHABETICAL' | 'MODIFICATION';
  details?: boolean;
  filterText?: string;
  base?: string;
  start?: number;
  limit?: number;
}
