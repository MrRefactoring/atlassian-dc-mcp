import { afterEach, describe, expect, it, vi } from 'vitest';
import { capResponseText, DEFAULT_MAX_RESPONSE_CHARS, formatToolResponse, MAX_RESPONSE_CHARS_ENV_VAR } from '../src/server.js';

describe('capResponseText', () => {
  it('returns short text unchanged', () => {
    expect(capResponseText('hello', 100)).toBe('hello');
  });

  it('returns text exactly at the limit unchanged', () => {
    const text = 'x'.repeat(50);

    expect(capResponseText(text, 50)).toBe(text);
  });

  it('truncates oversized text and appends a marker', () => {
    const text = 'x'.repeat(200);
    const result = capResponseText(text, 50);

    expect(result.startsWith('x'.repeat(50))).toBe(true);
    expect(result).toContain('response truncated');
    expect(result).toContain('50 of 200 characters');
    expect(result).toContain(MAX_RESPONSE_CHARS_ENV_VAR);
  });
});

describe('formatToolResponse with the response cap', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('caps oversized serialized results using the default limit', () => {
    const big = { blob: 'y'.repeat(DEFAULT_MAX_RESPONSE_CHARS + 100) };
    const { content } = formatToolResponse(big);

    expect(content[0].text).toContain('response truncated');
    expect(content[0].text.length).toBeLessThan(DEFAULT_MAX_RESPONSE_CHARS + 400);
  });

  it('leaves normal results untouched', () => {
    const { content } = formatToolResponse({ ok: true, values: [1, 2, 3] });

    expect(content[0].text).toBe('{"ok":true,"values":[1,2,3]}');
  });

  it('disables the cap when the env var is 0', () => {
    vi.stubEnv(MAX_RESPONSE_CHARS_ENV_VAR, '0');
    const big = { blob: 'z'.repeat(DEFAULT_MAX_RESPONSE_CHARS + 100) };
    const { content } = formatToolResponse(big);

    expect(content[0].text).not.toContain('response truncated');
  });

  it('honors a custom cap from the env var', () => {
    vi.stubEnv(MAX_RESPONSE_CHARS_ENV_VAR, '20');
    const { content } = formatToolResponse({ blob: 'a'.repeat(500) });

    expect(content[0].text).toContain('response truncated');
    expect(content[0].text).toContain('20 of');
  });
});
