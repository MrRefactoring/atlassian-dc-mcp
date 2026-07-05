import type { CredentialSource } from './credentialSource.js';

export interface HttpClientConfig {
  /** Fully resolved API base URL, e.g. `https://host/rest`. */
  baseUrl: string;
  /** Personal access token → `Authorization: Bearer`. */
  token?: CredentialSource;
  /** Basic-auth username (used with `password`) → `Authorization: Basic`; overrides `token`. */
  username?: CredentialSource;
  password?: CredentialSource;
  /** Extra headers merged into every request. */
  headers?: Record<string, string>;
  /** Skip Zod parsing of responses — escape hatch against schema drift. */
  skipParsing?: boolean;
}
