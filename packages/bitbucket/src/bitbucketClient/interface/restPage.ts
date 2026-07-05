/** Static type of a `restPage` envelope. */
export interface RestPage<T> {
  size?: number;
  limit?: number;
  isLastPage?: boolean;
  start?: number;
  nextPageStart?: number;
  values?: T[];
  [key: string]: unknown;
}
