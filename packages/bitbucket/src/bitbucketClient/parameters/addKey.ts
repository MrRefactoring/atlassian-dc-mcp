import type { GpgKey } from '../models/index.js';

export interface AddKey {
  user?: string;
  requestBody?: GpgKey;
}
