import { describe, expect, it, vi } from 'vitest';
import { OpenAPI } from '../src/confluence-client/index.js';
import { ConfluenceService, escapeSearchTextForCql } from '../src/confluence-service.js';

vi.mock('../src/confluence-client/index.js', () => ({
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
}));

describe('constructor Basic auth wiring', () => {
  it('resolves username and password onto OpenAPI for Basic auth', async () => {
    new ConfluenceService('confluence.example.com', '', undefined, () => 25, 'jdoe', 'hunter2');
    expect(await (OpenAPI.USERNAME as () => Promise<string>)()).toBe('jdoe');
    expect(await (OpenAPI.PASSWORD as () => Promise<string>)()).toBe('hunter2');
  });

  it('resolves username/password from getter functions, same as token', async () => {
    new ConfluenceService('confluence.example.com', '', undefined, () => 25, () => 'jdoe', () => 'hunter2');
    expect(await (OpenAPI.USERNAME as () => Promise<string>)()).toBe('jdoe');
    expect(await (OpenAPI.PASSWORD as () => Promise<string>)()).toBe('hunter2');
  });

  it('resolves username/password to an empty string when omitted', async () => {
    new ConfluenceService('confluence.example.com', 'test-token');
    expect(await (OpenAPI.USERNAME as () => Promise<string>)()).toBe('');
    expect(await (OpenAPI.PASSWORD as () => Promise<string>)()).toBe('');
  });
});


describe('escapeSearchTextForCql', () => {
  it('returns plain text unchanged', () => {
    expect(escapeSearchTextForCql('hello')).toBe('hello');
    expect(escapeSearchTextForCql('space name')).toBe('space name');
  });

  it('escapes double quotes', () => {
    expect(escapeSearchTextForCql('say "hello"')).toBe('say \\"hello\\"');
  });

  it('escapes backslashes first so they cannot escape the following quote', () => {
    expect(escapeSearchTextForCql('\\')).toBe('\\\\');
    expect(escapeSearchTextForCql('path\\to\\space')).toBe('path\\\\to\\\\space');
  });

  it('escapes backslash then quote correctly (order matters)', () => {
    expect(escapeSearchTextForCql('\\"')).toBe('\\\\\\"');
  });

  it('escapes quote then backslash correctly', () => {
    expect(escapeSearchTextForCql('"\\')).toBe('\\"\\\\');
  });

  it('prevents CQL injection via quoted phrase breakout', () => {
    const malicious = '" OR type=page AND text ~ "secret';
    const escaped = escapeSearchTextForCql(malicious);
    expect(escaped).toContain('\\"');
    expect(escaped).not.toBe(malicious);
  });

  it('double-escaping is not idempotent (call once only)', () => {
    const input = 'foo"bar\\baz';
    const once = escapeSearchTextForCql(input);
    const twice = escapeSearchTextForCql(once);
    expect(twice).not.toBe(once);
    expect(twice).toContain('\\\\');
  });

  it('handles empty string', () => {
    expect(escapeSearchTextForCql('')).toBe('');
  });
});
