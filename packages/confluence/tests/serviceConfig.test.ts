import { describe, expect, it, vi } from 'vitest';
import { ConfluenceService, escapeSearchTextForCql } from '../src/confluenceService.js';

const createConfluenceClientMock = vi.hoisted(() =>
  vi.fn((_config: { username?: unknown; password?: unknown }) => ({})),
);

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: createConfluenceClientMock,
}));

describe('constructor Basic auth wiring', () => {
  it('resolves username and password onto the client config for Basic auth', () => {
    new ConfluenceService('confluence.example.com', '', undefined, () => 25, 'jdoe', 'hunter2');
    const config = createConfluenceClientMock.mock.calls.at(-1)?.[0];
    expect(config?.username).toBe('jdoe');
    expect(config?.password).toBe('hunter2');
  });

  it('resolves username/password from getter functions, same as token', () => {
    new ConfluenceService('confluence.example.com', '', undefined, () => 25, () => 'jdoe', () => 'hunter2');
    const config = createConfluenceClientMock.mock.calls.at(-1)?.[0];
    expect((config?.username as () => string)()).toBe('jdoe');
    expect((config?.password as () => string)()).toBe('hunter2');
  });

  it('leaves username/password undefined when omitted', () => {
    new ConfluenceService('confluence.example.com', 'test-token');
    const config = createConfluenceClientMock.mock.calls.at(-1)?.[0];
    expect(config?.username).toBeUndefined();
    expect(config?.password).toBeUndefined();
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
