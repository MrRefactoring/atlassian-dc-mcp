import { confirm as inquirerConfirm, input as inquirerInput, password as inquirerPassword } from '@inquirer/prompts';
import { buildDefaultRegistry, type ConfigRegistry } from './config/registry.js';
import { getProductRuntimeConfig } from './config/runtime-config.js';
import type {
  ConfigKey,
  ProductDefinition,
  WritableSource,
} from './config/source.js';
import { HomeFileSource, getHomeFilePath } from './config/sources/home-file.js';
import { MacosKeychainSource } from './config/sources/macos-keychain.js';

const FALLBACK_PAGE_SIZE = 25;

type PromptResult = {
  host: string;
  apiBasePath: string;
  defaultPageSize: string;
  token: string | undefined;
};

export type SetupPrompts = {
  input: (opts: { message: string; default?: string; validate?: (raw: string) => true | string }) => Promise<string>;
  password: (opts: { message: string; mask?: string }) => Promise<string>;
  confirm: (opts: { message: string; default?: boolean }) => Promise<boolean>;
};

export type SetupDeps = {
  registry?: ConfigRegistry;
  log?: (message: string) => void;
  exit?: (code: number) => void;
  prompts?: SetupPrompts;
};

const DEFAULT_PROMPTS: SetupPrompts = {
  input: (opts) => inquirerInput(opts as any),
  password: (opts) => inquirerPassword(opts as any),
  confirm: (opts) => inquirerConfirm(opts as any),
};

export async function runSetup(product: ProductDefinition, deps: SetupDeps = {}): Promise<void> {
  const registry = deps.registry ?? buildDefaultRegistry();
  const log = deps.log ?? ((message: string) => process.stdout.write(`${message}\n`));
  const exit = deps.exit ?? ((code: number) => { process.exit(code); });
  const prompts = deps.prompts ?? DEFAULT_PROMPTS;

  registry.initialize();

  log(`Atlassian DC MCP setup — ${product.id}`);
  log('');

  const current = getProductRuntimeConfig(product);
  printCurrent(log, registry, product, current);

  let answers: PromptResult;
  try {
    answers = await promptForValues(prompts, product, current);
  } catch (error) {
    if (isUserCancel(error)) {
      exit(130);
      return;
    }
    throw error;
  }

  const homeFile = requireHomeFile(registry);
  writeNonSecretFields(registry, product, answers, homeFile, log);
  const tokenWriter = await writeToken(registry, product, answers.token, homeFile, log, prompts);
  printSummary(log, product, answers, tokenWriter);
}

function requireHomeFile(registry: ConfigRegistry): HomeFileSource {
  const homeFile = registry.getWritableSource(
    (s): s is HomeFileSource => s instanceof HomeFileSource,
  );
  if (!homeFile) {
    throw new Error('No writable source available for non-secret fields');
  }
  return homeFile;
}

function printCurrent(
  log: (message: string) => void,
  registry: ConfigRegistry,
  product: ProductDefinition,
  current: ReturnType<typeof getProductRuntimeConfig>,
): void {
  const keys: ConfigKey[] = ['host', 'apiBasePath', 'token', 'defaultPageSize'];
  for (const key of keys) {
    const primary = registry.locate(product, key)[0];
    const label = displayLabel(key);
    const displayValue = key === 'token' ? maskToken(current.token) : readable(current[key]);
    const origin = primary ? `from ${primary.detail ?? primary.sourceId}` : 'not set';
    log(`Current ${label}: ${displayValue} (${origin})`);
  }
  log('');
}

async function promptForValues(
  prompts: SetupPrompts,
  product: ProductDefinition,
  current: ReturnType<typeof getProductRuntimeConfig>,
): Promise<PromptResult> {
  const host = await prompts.input({
    message: 'Host (e.g. jira.example.com):',
    default: current.host ?? '',
  });
  const apiBasePath = await prompts.input({
    message: 'API base path:',
    default: current.apiBasePath ?? product.defaultApiBasePath ?? '',
  });
  const defaultPageSize = await prompts.input({
    message: 'Default page size:',
    default: String(current.defaultPageSize ?? FALLBACK_PAGE_SIZE),
    validate: (raw) =>
      /^\d+$/.test(raw.trim()) && Number.parseInt(raw.trim(), 10) > 0
        ? true
        : 'Enter a positive integer',
  });
  const token = await promptForToken(prompts, current.token);
  return { host: host.trim(), apiBasePath: apiBasePath.trim(), defaultPageSize: defaultPageSize.trim(), token };
}

async function promptForToken(
  prompts: SetupPrompts,
  existing: string | undefined,
): Promise<string | undefined> {
  const entered = await prompts.password({ message: 'API token:', mask: '*' });
  const trimmed = entered.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  if (!existing) {
    return undefined;
  }
  await prompts.confirm({ message: 'Keep existing token?', default: true });
  return undefined;
}

function writeNonSecretFields(
  registry: ConfigRegistry,
  product: ProductDefinition,
  answers: PromptResult,
  homeFile: HomeFileSource,
  log: (message: string) => void,
): void {
  for (const key of ['host', 'apiBasePath', 'defaultPageSize'] as const) {
    warnIfShadowed(registry, product, key, homeFile, log);
    const value = answers[key];
    if (value.length > 0) {
      homeFile.write(product, key, value);
    }
  }
}

async function writeToken(
  registry: ConfigRegistry,
  product: ProductDefinition,
  token: string | undefined,
  homeFile: HomeFileSource,
  log: (message: string) => void,
  prompts: SetupPrompts,
): Promise<WritableSource | undefined> {
  if (!token) {
    return undefined;
  }

  const keychain = registry.getWritableSource(
    (s): s is MacosKeychainSource => s instanceof MacosKeychainSource,
  );
  const candidates: WritableSource[] = [];
  if (keychain?.isAvailable()) {
    candidates.push(keychain);
  }
  candidates.push(homeFile);

  warnIfShadowed(registry, product, 'token', candidates[0], log);

  for (const writer of candidates) {
    const written = await tryWrite(writer, product, token, log, prompts);
    if (written) {
      if (writer instanceof MacosKeychainSource) {
        homeFile.clear(product, 'token');
      }
      return writer;
    }
  }
  throw new Error('No writable source succeeded for token');
}

async function tryWrite(
  writer: WritableSource,
  product: ProductDefinition,
  token: string,
  log: (message: string) => void,
  prompts: SetupPrompts,
): Promise<boolean> {
  try {
    writer.write(product, 'token', token);
    return true;
  } catch (error) {
    const stderr = (error as { stderr?: string | Buffer }).stderr?.toString() ?? '';
    log(`Failed to write token to ${writer.describe()}: ${(error as Error).message}`);
    if (stderr) {
      log(stderr.trim());
    }
    if (writer instanceof MacosKeychainSource) {
      const fallback = await prompts.confirm({
        message: 'Fall back to plaintext home file with mode 0600?',
        default: false,
      });
      return !fallback;
    }
    return false;
  }
}

function warnIfShadowed(
  registry: ConfigRegistry,
  product: ProductDefinition,
  key: ConfigKey,
  target: WritableSource,
  log: (message: string) => void,
): void {
  const shadowing = registry
    .locate(product, key)
    .filter((loc) => priorityOf(registry, loc.sourceId) > target.priority);
  if (shadowing.length === 0) {
    return;
  }
  const envVar = product.envVars[key];
  for (const loc of shadowing) {
    if (loc.sourceId === 'process-env') {
      log(`Warning: process.env[${envVar}] is set — runtime will prefer it over the value you're saving to ${target.describe()}. Unset it to use the new value.`);
    } else {
      log(`Warning: ${loc.detail ?? loc.sourceId} provides ${envVar} — runtime will prefer it over the value you're saving to ${target.describe()}.`);
    }
  }
}

function priorityOf(registry: ConfigRegistry, sourceId: string): number {
  const match = registry.sources.find((s) => s.id === sourceId);
  return match?.priority ?? 0;
}

function printSummary(
  log: (message: string) => void,
  product: ProductDefinition,
  answers: PromptResult,
  tokenWriter: WritableSource | undefined,
): void {
  log('');
  log('Saved configuration:');
  log(`  host: ${answers.host || '(unchanged)'}`);
  log(`  apiBasePath: ${answers.apiBasePath || '(unchanged)'}`);
  log(`  defaultPageSize: ${answers.defaultPageSize || '(unchanged)'}`);
  if (tokenWriter) {
    log(`  token: ${maskToken(answers.token)} (stored in ${describeWriter(tokenWriter, product)})`);
  } else {
    log('  token: (unchanged)');
  }
  log(`Home file: ${getHomeFilePath(product)}`);
}

function describeWriter(writer: WritableSource, product: ProductDefinition): string {
  if (writer instanceof MacosKeychainSource) {
    return `macOS Keychain (service atlassian-dc-mcp, account ${product.id}-token)`;
  }
  if (writer instanceof HomeFileSource) {
    return writer.describeForProduct(product);
  }
  return writer.describe();
}

function displayLabel(key: ConfigKey): string {
  switch (key) {
    case 'host':
      return 'host';
    case 'apiBasePath':
      return 'API base path';
    case 'token':
      return 'token';
    case 'defaultPageSize':
      return 'page size';
  }
}

function readable(value: string | number | undefined): string {
  if (value === undefined || value === '') {
    return '(not set)';
  }
  return String(value);
}

function maskToken(token: string | undefined): string {
  if (!token) {
    return '(not set)';
  }
  const last4 = token.slice(-4);
  return `••••${last4}`;
}

function isUserCancel(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const err = error as { name?: string; message?: string };
  return err.name === 'ExitPromptError' || /force closed/i.test(err.message ?? '');
}
