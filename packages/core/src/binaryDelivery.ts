import { mkdir, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, resolve, sep } from 'node:path';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ApiErrorResponse } from './apiErrorHandler.js';
import { formatToolResponse } from './server.js';

export const MAX_INLINE_BYTES_ENV_VAR = 'ATLASSIAN_DC_MCP_MAX_INLINE_BYTES';

/**
 * Default ceiling on a raster image returned inline in a tool response. An `image` block is
 * decoded as a picture by the host rather than read as text, so a megapixel-scale file costs
 * roughly what any other image in the conversation costs.
 *
 * Files above the cap must be written to disk via the tool's `outputPath`, which keeps the
 * response to a few hundred characters regardless of file size. Set
 * ATLASSIAN_DC_MCP_MAX_INLINE_BYTES to raise/lower it, or to 0 to disable inline delivery.
 */
export const DEFAULT_MAX_INLINE_BYTES = 1_048_576;

/**
 * Default ceiling on everything that is not a raster image. A `resource` blob carries base64
 * that a host has no way to interpret as anything but text: bytes inflate by 4/3, so 256 KiB
 * already costs ~350k characters of context. The lower default keeps an accidental
 * `outputPath`-less download of an archive or a video from swallowing the context window,
 * while the image path stays generous. Overriding ATLASSIAN_DC_MCP_MAX_INLINE_BYTES replaces
 * both ceilings with the given value.
 */
export const DEFAULT_MAX_INLINE_RESOURCE_BYTES = 262_144;

/** A downloaded binary payload not yet delivered anywhere. */
export interface BinaryAsset {
  /** Stable identifier for the asset, used as the MCP resource URI (e.g. `confluence://attachment/123/diagram.png`). */
  uri: string;
  filename: string;
  mimeType: string;
  size: number;
  bytes: Uint8Array;
}

/** The same payload after being written to the local filesystem. */
export interface SavedBinaryAsset {
  uri: string;
  filename: string;
  mimeType: string;
  size: number;
  /** Absolute path the bytes were written to. */
  savedTo: string;
}

const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  zip: 'application/zip',
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  csv: 'text/csv',
  xml: 'application/xml',
  html: 'text/html',
  mp4: 'video/mp4',
  woff2: 'font/woff2',
};

/**
 * Best-effort media type from a file name, for endpoints that return bytes without usable
 * metadata (e.g. Bitbucket's raw file endpoint). Falls back to `application/octet-stream`.
 */
export function guessMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  return (extension && MIME_TYPES_BY_EXTENSION[extension]) || 'application/octet-stream';
}

// SVG is markup, not a raster image hosts can decode from an `image` block, so it goes through
// the resource blob path with every other non-image type.
function isRasterImage(mimeType: string): boolean {
  return mimeType.startsWith('image/') && mimeType !== 'image/svg+xml';
}

function resolveMaxInlineBytes(mimeType: string): number {
  const fallback = isRasterImage(mimeType) ? DEFAULT_MAX_INLINE_BYTES : DEFAULT_MAX_INLINE_RESOURCE_BYTES;
  const raw = process.env[MAX_INLINE_BYTES_ENV_VAR];
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);

  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

export function isSavedBinaryAsset(asset: BinaryAsset | SavedBinaryAsset): asset is SavedBinaryAsset {
  return 'savedTo' in asset;
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Write an asset to `outputPath`. When `outputPath` is an existing directory or ends with a
 * path separator the asset's own file name is appended — its `basename` only, so a server-side
 * name containing path segments cannot escape the target directory.
 */
export async function saveBinaryAsset(asset: BinaryAsset, outputPath: string): Promise<SavedBinaryAsset> {
  if (!isAbsolute(outputPath)) {
    throw new Error(`outputPath must be an absolute path, got '${outputPath}'`);
  }

  const normalized = resolve(outputPath);
  const treatAsDirectory = outputPath.endsWith(sep) || outputPath.endsWith('/') || await isDirectory(normalized);
  const savedTo = treatAsDirectory ? resolve(normalized, basename(asset.filename)) : normalized;

  await mkdir(dirname(savedTo), { recursive: true });
  await writeFile(savedTo, asset.bytes);

  const { bytes: _bytes, ...meta } = asset;

  return { ...meta, savedTo };
}

/**
 * Deliver a downloaded asset: to disk when the caller passed an `outputPath`, otherwise
 * unchanged so the tool layer can return the bytes inline. Call this inside
 * `handleApiOperation` so a failed write surfaces as a normal `{ success: false }` envelope.
 */
export async function deliverBinaryAsset(
  asset: BinaryAsset,
  outputPath?: string,
): Promise<BinaryAsset | SavedBinaryAsset> {
  return outputPath ? saveBinaryAsset(asset, outputPath) : asset;
}

/**
 * Format a binary-asset service result as an MCP tool response.
 *
 * A saved asset (or a failure) is plain JSON text. An unsaved asset is delivered as two
 * content blocks: the usual JSON envelope of its metadata, plus the bytes themselves as an
 * `image` block (for `image/*`) or a base64 `resource` blob. Splitting them matters — the
 * bytes never pass through `formatToolResponse`, whose 100k-character cap would silently
 * truncate base64 into an unusable payload.
 */
export function formatAssetToolResponse(
  result: ApiErrorResponse<BinaryAsset | SavedBinaryAsset>,
): CallToolResult {
  const asset = result.data;

  if (!result.success || !asset || isSavedBinaryAsset(asset)) {
    return formatToolResponse(result);
  }

  const maxInlineBytes = resolveMaxInlineBytes(asset.mimeType);
  if (asset.size > maxInlineBytes) {
    return formatToolResponse({
      success: false,
      error: `${asset.filename} is ${asset.size} bytes, above the ${maxInlineBytes}-byte inline limit for ${asset.mimeType}. Pass an absolute outputPath to write it to disk instead, or raise ${MAX_INLINE_BYTES_ENV_VAR}.`,
    });
  }

  const { bytes, ...meta } = asset;
  const data = Buffer.from(bytes).toString('base64');

  return {
    content: [
      ...formatToolResponse({ success: true, data: meta }).content,
      isRasterImage(asset.mimeType)
        ? { type: 'image' as const, data, mimeType: asset.mimeType }
        : {
          type: 'resource' as const,
          resource: { uri: asset.uri, mimeType: asset.mimeType, blob: data },
        },
    ],
  };
}
