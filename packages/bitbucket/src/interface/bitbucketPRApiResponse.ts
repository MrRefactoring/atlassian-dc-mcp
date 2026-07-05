export interface BitbucketPRApiResponse {
  size?: number;
  limit?: number;
  isLastPage?: boolean;
  values?: unknown[]; // Will be validated with type guards in the implementation
  start?: number;
  nextPageStart?: number;
}
