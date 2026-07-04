/**
 * Structured logging for the MCP servers.
 *
 * The stdio transport reserves stdout exclusively for JSON-RPC protocol
 * messages — anything else written there corrupts the protocol stream. Every
 * log line, at any level, on any transport, therefore goes to stderr only.
 * Output is one JSON object per line so it stays machine-parseable if a host
 * captures server stderr into its own log pipeline.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogFields {
  [key: string]: unknown;
}

export interface Logger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
}

export const LOG_LEVEL_ENV_VAR = 'ATLASSIAN_DC_MCP_LOG_LEVEL';

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function isLogLevel(value: string): value is LogLevel {
  return value === 'debug' || value === 'info' || value === 'warn' || value === 'error';
}

function resolveMinLevel(): LogLevel {
  const raw = process.env[LOG_LEVEL_ENV_VAR]?.trim().toLowerCase();

  return raw && isLogLevel(raw) ? raw : 'info';
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }

  return value;
}

function write(level: LogLevel, message: string, fields?: LogFields): void {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[resolveMinLevel()]) {
    return;
  }
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...Object.fromEntries(Object.entries(fields ?? {}).map(([key, value]) => [key, serializeValue(value)])),
  };
  process.stderr.write(`${JSON.stringify(entry)}\n`);
}

export const logger: Logger = {
  debug: (message, fields) => write('debug', message, fields),
  info: (message, fields) => write('info', message, fields),
  warn: (message, fields) => write('warn', message, fields),
  error: (message, fields) => write('error', message, fields),
};
