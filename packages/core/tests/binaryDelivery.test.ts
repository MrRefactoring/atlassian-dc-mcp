import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_MAX_INLINE_BYTES,
  DEFAULT_MAX_INLINE_RESOURCE_BYTES,
  deliverBinaryAsset,
  formatAssetToolResponse,
  guessMimeType,
  MAX_INLINE_BYTES_ENV_VAR,
  saveBinaryAsset,
  type BinaryAsset,
} from '../src/binaryDelivery.js';

const asset = (overrides: Partial<BinaryAsset> = {}): BinaryAsset => ({
  uri: 'confluence://attachment/123/diagram.png',
  filename: 'diagram.png',
  mimeType: 'image/png',
  size: 4,
  bytes: new Uint8Array([1, 2, 3, 4]),
  ...overrides,
});

const textAt = (content: CallToolResult['content'], index: number): string => {
  const block = content[index];

  if (block.type !== 'text') {
    throw new Error(`expected a text block at index ${index}, got '${block.type}'`);
  }

  return block.text;
};

describe('guessMimeType', () => {
  it('maps known extensions', () => {
    expect(guessMimeType('a.png')).toBe('image/png');
    expect(guessMimeType('a.JPEG')).toBe('image/jpeg');
    expect(guessMimeType('report.pdf')).toBe('application/pdf');
  });

  it('falls back to octet-stream for unknown or missing extensions', () => {
    expect(guessMimeType('archive.7z')).toBe('application/octet-stream');
    expect(guessMimeType('LICENSE')).toBe('application/octet-stream');
  });
});

describe('saveBinaryAsset', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'binary-delivery-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('writes to an explicit file path', async () => {
    const target = join(dir, 'out', 'renamed.png');
    const saved = await saveBinaryAsset(asset(), target);

    expect(saved.savedTo).toBe(target);
    expect(saved).not.toHaveProperty('bytes');
    expect(new Uint8Array(await readFile(target))).toEqual(new Uint8Array([1, 2, 3, 4]));
  });

  it('appends the asset filename when the target is an existing directory', async () => {
    const saved = await saveBinaryAsset(asset(), dir);

    expect(saved.savedTo).toBe(join(dir, 'diagram.png'));
  });

  it('appends the asset filename when the target ends with a separator', async () => {
    const saved = await saveBinaryAsset(asset(), join(dir, 'nested') + sep);

    expect(saved.savedTo).toBe(join(dir, 'nested', 'diagram.png'));
  });

  it('strips path segments from the asset filename so it cannot escape the directory', async () => {
    const saved = await saveBinaryAsset(asset({ filename: '../../evil.png' }), dir);

    expect(saved.savedTo).toBe(join(dir, 'evil.png'));
  });

  it('rejects a relative outputPath', async () => {
    await expect(saveBinaryAsset(asset(), 'relative/out.png')).rejects.toThrow('absolute path');
  });
});

describe('deliverBinaryAsset', () => {
  it('returns the asset untouched without an outputPath', async () => {
    const input = asset();

    expect(await deliverBinaryAsset(input)).toBe(input);
  });

  it('writes to disk when an outputPath is given', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'binary-delivery-'));

    try {
      const result = await deliverBinaryAsset(asset(), join(dir, 'x.png'));

      expect(result).toHaveProperty('savedTo', join(dir, 'x.png'));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe('formatAssetToolResponse', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns a plain JSON envelope for a failure', () => {
    const { content } = formatAssetToolResponse({ success: false, error: 'boom' });

    expect(content).toHaveLength(1);
    expect(content[0]).toMatchObject({ type: 'text' });
    expect(textAt(content, 0)).toContain('boom');
  });

  it('returns a plain JSON envelope for a saved asset', () => {
    const { content } = formatAssetToolResponse({
      success: true,
      data: { uri: 'u', filename: 'a.pdf', mimeType: 'application/pdf', size: 9, savedTo: '/tmp/a.pdf' },
    });

    expect(content).toHaveLength(1);
    expect(textAt(content, 0)).toContain('/tmp/a.pdf');
  });

  it('delivers a raster image as metadata plus an image block', () => {
    const { content } = formatAssetToolResponse({ success: true, data: asset() });

    expect(content).toHaveLength(2);
    expect(textAt(content, 0)).toBe('{"success":true,"data":{"uri":"confluence://attachment/123/diagram.png","filename":"diagram.png","mimeType":"image/png","size":4}}');
    expect(content[1]).toEqual({ type: 'image', data: 'AQIDBA==', mimeType: 'image/png' });
  });

  it('delivers a non-image as a base64 resource blob', () => {
    const pdf = asset({ uri: 'jira://attachment/5', filename: 'a.pdf', mimeType: 'application/pdf' });
    const { content } = formatAssetToolResponse({ success: true, data: pdf });

    expect(content[1]).toEqual({
      type: 'resource',
      resource: { uri: 'jira://attachment/5', mimeType: 'application/pdf', blob: 'AQIDBA==' },
    });
  });

  it('delivers SVG as a resource blob rather than an image block', () => {
    const svg = asset({ filename: 'a.svg', mimeType: 'image/svg+xml' });
    const { content } = formatAssetToolResponse({ success: true, data: svg });

    expect(content[1]).toMatchObject({ type: 'resource' });
  });

  it('refuses to inline an asset above the limit instead of truncating it', () => {
    const big = asset({ size: DEFAULT_MAX_INLINE_BYTES + 1, bytes: new Uint8Array(1) });
    const { content } = formatAssetToolResponse({ success: true, data: big });

    expect(content).toHaveLength(1);
    expect(textAt(content, 0)).toContain('inline limit');
    expect(textAt(content, 0)).toContain('outputPath');
    expect(textAt(content, 0)).toContain(MAX_INLINE_BYTES_ENV_VAR);
  });

  it('holds non-images to a lower default than raster images', () => {
    const size = DEFAULT_MAX_INLINE_RESOURCE_BYTES + 1;

    expect(DEFAULT_MAX_INLINE_RESOURCE_BYTES).toBeLessThan(DEFAULT_MAX_INLINE_BYTES);

    const zip = asset({ filename: 'a.zip', mimeType: 'application/zip', size, bytes: new Uint8Array(1) });
    const refused = formatAssetToolResponse({ success: true, data: zip });

    expect(refused.content).toHaveLength(1);
    expect(textAt(refused.content, 0)).toContain(`${DEFAULT_MAX_INLINE_RESOURCE_BYTES}-byte inline limit`);
    expect(textAt(refused.content, 0)).toContain('application/zip');

    const png = asset({ size, bytes: new Uint8Array(1) });
    const delivered = formatAssetToolResponse({ success: true, data: png });

    expect(delivered.content).toHaveLength(2);
    expect(delivered.content[1]).toMatchObject({ type: 'image' });
  });

  it('holds SVG to the non-image limit, since it travels as a resource blob', () => {
    const svg = asset({
      filename: 'a.svg',
      mimeType: 'image/svg+xml',
      size: DEFAULT_MAX_INLINE_RESOURCE_BYTES + 1,
      bytes: new Uint8Array(1),
    });
    const { content } = formatAssetToolResponse({ success: true, data: svg });

    expect(content).toHaveLength(1);
    expect(textAt(content, 0)).toContain(`${DEFAULT_MAX_INLINE_RESOURCE_BYTES}-byte inline limit`);
  });

  it('honors a custom inline limit from the env var', () => {
    vi.stubEnv(MAX_INLINE_BYTES_ENV_VAR, '2');
    const { content } = formatAssetToolResponse({ success: true, data: asset() });

    expect(content).toHaveLength(1);
    expect(textAt(content, 0)).toContain('inline limit');
  });

  it('applies an explicit env var override to images and non-images alike', () => {
    vi.stubEnv(MAX_INLINE_BYTES_ENV_VAR, String(DEFAULT_MAX_INLINE_RESOURCE_BYTES + 2));
    const size = DEFAULT_MAX_INLINE_RESOURCE_BYTES + 1;

    const zip = asset({ filename: 'a.zip', mimeType: 'application/zip', size, bytes: new Uint8Array(1) });
    const png = asset({ size, bytes: new Uint8Array(1) });

    expect(formatAssetToolResponse({ success: true, data: zip }).content).toHaveLength(2);
    expect(formatAssetToolResponse({ success: true, data: png }).content).toHaveLength(2);
  });

  it('disables inline delivery entirely when the env var is 0', () => {
    vi.stubEnv(MAX_INLINE_BYTES_ENV_VAR, '0');
    const { content } = formatAssetToolResponse({ success: true, data: asset() });

    expect(content).toHaveLength(1);
    expect(textAt(content, 0)).toContain('inline limit');
  });
});
