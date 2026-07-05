export interface GetProjectUsersWithAnyPermission {
  projectKey: string;
  filter?: string;
  start?: number;
  limit?: number;
}
