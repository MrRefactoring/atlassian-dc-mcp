import { parseArgs } from 'node:util';

export type ParsedSetupArgs = {
  host?: string;
  apiBasePath?: string;
  token?: string;
  username?: string;
  password?: string;
  defaultPageSize?: string;
  profile?: string;
  nonInteractive: boolean;
  help: boolean;
};

export class SetupArgsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SetupArgsError';
  }
}

export function parseSetupArgs(argv: readonly string[]): ParsedSetupArgs {
  let values;
  try {
    ({ values } = parseArgs({
      args: [...argv],
      options: {
        host: { type: 'string', short: 'H' },
        'api-base-path': { type: 'string', short: 'b' },
        token: { type: 'string', short: 't' },
        username: { type: 'string', short: 'u' },
        password: { type: 'string', short: 'p' },
        'default-page-size': { type: 'string', short: 's' },
        profile: { type: 'string', short: 'P' },
        'non-interactive': { type: 'boolean', short: 'n', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    throw new SetupArgsError((error as Error).message);
  }

  return {
    host: trimToUndefined(values.host),
    apiBasePath: trimToUndefined(values['api-base-path']),
    token: trimToUndefined(values.token),
    username: trimToUndefined(values.username),
    password: trimToUndefined(values.password),
    defaultPageSize: trimToUndefined(values['default-page-size']),
    profile: trimToUndefined(values.profile),
    nonInteractive: values['non-interactive'] === true,
    help: values.help === true,
  };
}

function trimToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export function printSetupHelp(productId: string, log: (message: string) => void): void {
  const lines = [
    `Usage: ${productId}-datacenter-mcp setup [options]`,
    '',
    'Options:',
    '  -H, --host <value>          Host (e.g. jira.example.com)',
    '  -b, --api-base-path <value> API base path or full URL',
    '  -t, --token <value>         API token (optional — omit for anonymous access)',
    '  -u, --username <value>      Username for Basic auth (optional — use instead of, or alongside, a token)',
    '  -p, --password <value>      Password for Basic auth (optional — paired with --username)',
    '  -s, --default-page-size <n> Default page size (positive integer)',
    '  -P, --profile <name>        Named profile to read/write (separate home file and Keychain entry, e.g. "work")',
    '  -n, --non-interactive       Skip prompts; fail if a required value is missing',
    '  -h, --help                  Show this help and exit',
    '',
    'In interactive mode (default), any value not passed as a flag is collected via prompts.',
    'In --non-interactive mode, missing values fall back to existing configuration',
    `(process env, ~/.atlassian-dc-mcp/${productId}.env, or macOS Keychain), and the run`,
    'fails if a host (or full-URL --api-base-path) cannot be resolved.',
    'An existing token is reused when --token is omitted; omit it entirely for anonymous access.',
    'An existing password is reused when --password is omitted, following the same rule as --token.',
    'Without --profile, the default (unsuffixed) home file and Keychain entry are used; set',
    `ATLASSIAN_DC_MCP_PROFILE=<name> when running the server so it reads back the same profile.`,
  ];
  for (const line of lines) {
    log(line);
  }
}
