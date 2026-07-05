import type { SendRequestOptions } from './sendRequestOptions.js';

export interface HttpClient {
  sendRequest<T>(options: SendRequestOptions<T>): Promise<T>;
}
