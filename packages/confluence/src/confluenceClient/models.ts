/**
 * Hand-written Confluence client model types.
 *
 * The Confluence REST responses are large and only loosely typed by the upstream
 * OpenAPI spec (most generated models were empty objects), so the client returns
 * `any` from its api functions and validates nothing — matching the behaviour of the
 * previous generated client. Only the couple of request-body types the service
 * references are kept here.
 */

/** An opaque Confluence content payload (page, blog post, comment, attachment, ...). */
export type Content = Record<string, unknown>;

/** Multipart form fields accepted when uploading an attachment. */
export interface MockAttachmentRequest {
  /** The multipart/form-data parameter holding the attachment; must be named "file". */
  file?: unknown;
  /** Optional comment(s) matching the uploaded file(s). */
  comment?: string;
  /** When true, no notification email is generated for the attachment. */
  minorEdit?: boolean;
  /** When true, no notification email or activity-stream entry is generated. */
  hidden?: boolean;
}
