import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { logger, LOG_LEVEL_ENV_VAR } from '../src/logger.js';

describe('logger', () => {
  let writeSpy: MockInstance;
  const originalLevel = process.env[LOG_LEVEL_ENV_VAR];

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
    if (originalLevel === undefined) {
      delete process.env[LOG_LEVEL_ENV_VAR];
    } else {
      process.env[LOG_LEVEL_ENV_VAR] = originalLevel;
    }
  });

  function lastEntry(): Record<string, unknown> {
    const raw = writeSpy.mock.calls[writeSpy.mock.calls.length - 1][0] as string;
    return JSON.parse(raw);
  }

  it('writes to stderr, never stdout', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logger.info('hello');
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(stdoutSpy).not.toHaveBeenCalled();
    stdoutSpy.mockRestore();
  });

  it('emits one JSON object per line with timestamp, level, and message', () => {
    logger.info('server started');
    const entry = lastEntry();
    expect(entry.level).toBe('info');
    expect(entry.message).toBe('server started');
    expect(typeof entry.timestamp).toBe('string');
    expect(new Date(entry.timestamp as string).toString()).not.toBe('Invalid Date');
    expect((writeSpy.mock.calls[0][0] as string).endsWith('\n')).toBe(true);
  });

  it('merges extra fields into the JSON entry', () => {
    logger.warn('retrying', { attempt: 2, maxRetries: 3 });
    const entry = lastEntry();
    expect(entry.attempt).toBe(2);
    expect(entry.maxRetries).toBe(3);
  });

  it('serializes Error fields into name/message/stack instead of {}', () => {
    logger.error('boom', { error: new Error('disk full') });
    const entry = lastEntry();
    expect(entry.error).toEqual(
      expect.objectContaining({ name: 'Error', message: 'disk full', stack: expect.any(String) }),
    );
  });

  it('defaults to info level: suppresses debug, allows info/warn/error', () => {
    delete process.env[LOG_LEVEL_ENV_VAR];
    logger.debug('should be suppressed');
    expect(writeSpy).not.toHaveBeenCalled();

    logger.info('should be shown');
    expect(writeSpy).toHaveBeenCalledTimes(1);
  });

  it('respects ATLASSIAN_DC_MCP_LOG_LEVEL=debug to show debug lines', () => {
    process.env[LOG_LEVEL_ENV_VAR] = 'debug';
    logger.debug('now visible');
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(lastEntry().level).toBe('debug');
  });

  it('respects ATLASSIAN_DC_MCP_LOG_LEVEL=error to suppress info/warn', () => {
    process.env[LOG_LEVEL_ENV_VAR] = 'error';
    logger.info('suppressed');
    logger.warn('also suppressed');
    expect(writeSpy).not.toHaveBeenCalled();

    logger.error('shown');
    expect(writeSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to info level for an unrecognized value', () => {
    process.env[LOG_LEVEL_ENV_VAR] = 'verbose';
    logger.debug('suppressed');
    expect(writeSpy).not.toHaveBeenCalled();

    logger.info('shown');
    expect(writeSpy).toHaveBeenCalledTimes(1);
  });
});
