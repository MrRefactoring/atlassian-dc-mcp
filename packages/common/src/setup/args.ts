import { parseArgs } from 'node:util';

export type ParsedSetupArgs = {
  host?: string;
  apiBasePath?: string;
  token?: string;
  defaultPageSize?: string;
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
        'default-page-size': { type: 'string', short: 's' },
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
    defaultPageSize: trimToUndefined(values['default-page-size']),
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
    `Usage: @atlassian-dc-mcp/${productId} setup [options]`,
    '',
    'Options:',
    '  -H, --host <value>          Host (e.g. jira.example.com)',
    '  -b, --api-base-path <value> API base path or full URL',
    '  -t, --token <value>         API token',
    '  -s, --default-page-size <n> Default page size (positive integer)',
    '  -n, --non-interactive       Skip prompts; fail if a required value is missing',
    '  -h, --help                  Show this help and exit',
    '',
    'In interactive mode (default), any value not passed as a flag is collected via prompts.',
    'In --non-interactive mode, missing values fall back to existing configuration',
    `(process env, ~/.atlassian-dc-mcp/${productId}.env, or macOS Keychain), and the run`,
    'fails if a host (or full-URL --api-base-path) and token cannot be resolved.',
    'An existing token is reused when --token is omitted.',
  ];
  for (const line of lines) {
    log(line);
  }
}
