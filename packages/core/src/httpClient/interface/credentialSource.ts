/** A credential: a literal string, or a thunk read lazily on each request, or absent. */
export type CredentialSource = string | (() => string | undefined) | undefined;
