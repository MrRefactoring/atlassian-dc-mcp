import type { PRChange } from './prChange.js';

export interface PRChangesResponse {
  fromHash: string;
  toHash: string;
  properties: {
    changeScope: string;
  };
  values: PRChange[];
  size: number;
  isLastPage: boolean;
  start: number;
  limit: number;
  nextPageStart: number | null;
}
