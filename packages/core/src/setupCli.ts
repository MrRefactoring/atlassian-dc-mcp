import { confirm as inquirerConfirm, input as inquirerInput, password as inquirerPassword } from '@inquirer/prompts';
import { buildDefaultRegistry, type ConfigRegistry } from './config/registry.js';
import type { ProductRuntimeConfig } from './config/runtimeConfig.js';
import type {
  ConfigKey,
  ProductDefinition,
  WritableSource,
} from './config/source.js';
import { HomeFileSource, getHomeFilePath } from './config/sources/homeFile.js';
import { MacosKeychainSource } from './config/sources/macosKeychain.js';
import { parseSetupArgs, printSetupHelp, SetupArgsError, type ParsedSetupArgs } from './setup/args.js';
import { SetupValueValidator } from './setup/valueValidator.js';

const FALLBACK_PAGE_SIZE = 25;
const MAX_VALIDATION_ATTEMPTS = 3;

type PromptDefaults = {
  host?: string;
  apiBasePath?: string;
  token?: string;
  username?: string;
  password?: string;
  defaultPageSize?: number;
};

type PromptResult = {
  host: string;
  apiBasePath: string;
  defaultPageSize: string;
  username: string;
  tokenToWrite: string | undefined;
  tokenForValidation: string | undefined;
  passwordToWrite: string | undefined;
  passwordForValidation: string | undefined;
};

type SecretPromptResult = { toWrite: string | undefined; forValidation: string | undefined };

export type CredentialValidationContext = {
  host: string;
  apiBasePath: string;
  token: string;
  username?: string;
  password?: string;
};

export type CredentialValidationResult =
  | { ok: true; detail?: string }
  | { ok: false; message: string };

export type ValidateCredentials = (
  context: CredentialValidationContext,
) => Promise<CredentialValidationResult>;

export type SetupPrompts = {
  input: (opts: { message: string; default?: string; validate?: (raw: string) => true | string }) => Promise<string>;
  password: (opts: { message: string; mask?: string; validate?: (raw: string) => true | string }) => Promise<string>;
  confirm: (opts: { message: string; default?: boolean }) => Promise<boolean>;
};

export type SetupDeps = {
  registry?: ConfigRegistry;
  log?: (message: string) => void;
  exit?: (code: number) => void;
  prompts?: SetupPrompts;
  validateCredentials?: ValidateCredentials;
  args?: ParsedSetupArgs;
};

const DEFAULT_PROMPTS: SetupPrompts = {
  input: (opts) => inquirerInput(opts as any),
  password: (opts) => inquirerPassword(opts as any),
  confirm: (opts) => inquirerConfirm(opts as any),
};

export async function runSetupCli(
  product: ProductDefinition,
  deps: Omit<SetupDeps, 'args'> = {},
): Promise<void> {
  const rawArgv = process.argv.slice(2);
  const argv = rawArgv[0] === 'setup' ? rawArgv.slice(1) : rawArgv;
  const exit = deps.exit ?? ((code: number) => { process.exit(code); });

  let args: ParsedSetupArgs;
  try {
    args = parseSetupArgs(argv);
  } catch (error) {
    if (error instanceof SetupArgsError) {
      process.stderr.write(`${error.message}\n\n`);
      printSetupHelp(product.id, (m) => process.stderr.write(`${m}\n`));
      exit(1);

      return;
    }
    throw error;
  }

  if (args.help) {
    printSetupHelp(product.id, (m) => process.stdout.write(`${m}\n`));
    exit(0);

    return;
  }

  await runSetup(product, { ...deps, args });
}

export async function runSetup(product: ProductDefinition, deps: SetupDeps = {}): Promise<void> {
  const profile = deps.args?.profile;
  const registry = deps.registry ?? buildDefaultRegistry({ profile });
  const log = deps.log ?? ((message: string) => process.stdout.write(`${message}\n`));
  const exit = deps.exit ?? ((code: number) => { process.exit(code); });
  const prompts = deps.prompts ?? DEFAULT_PROMPTS;

  registry.initialize();

  log(`Atlassian DC MCP setup — ${product.id}${profile ? ` (profile: ${profile})` : ''}`);
  log('');

  const current = readCurrentConfig(registry, product);
  printCurrent(log, registry, product, current);

  const answers = deps.args?.nonInteractive
    ? await runNonInteractive(product, deps, current, log, exit, deps.args)
    : await collectAnswersWithValidation(product, deps, prompts, current, log, exit, deps.args);
  if (!answers) {
    return;
  }

  const homeFile = requireHomeFile(registry);
  writeNonSecretFields(registry, product, answers, homeFile, log);
  const tokenWriter = await writeSecret(registry, product, 'token', answers.tokenToWrite, homeFile, log, prompts);
  const passwordWriter = await writeSecret(registry, product, 'password', answers.passwordToWrite, homeFile, log, prompts);
  printSummary(log, product, answers, tokenWriter, passwordWriter, profile);
}

async function collectAnswersWithValidation(
  product: ProductDefinition,
  deps: SetupDeps,
  prompts: SetupPrompts,
  current: ProductRuntimeConfig,
  log: (message: string) => void,
  exit: (code: number) => void,
  args: ParsedSetupArgs | undefined,
): Promise<PromptResult | undefined> {
  let defaults: PromptDefaults = current;

  for (let attempt = 1; ; attempt++) {
    let answers: PromptResult;
    try {
      answers = await promptForValues(prompts, product, defaults, args);
    } catch (error) {
      if (isUserCancel(error)) {
        exit(130);

        return undefined;
      }
      throw error;
    }

    const answerErrors = validateAnswers(product, answers);
    if (answerErrors.length > 0) {
      for (const message of answerErrors) {
        log(`Validation failed: ${message}`);
      }
      const retry = await confirmRetry(prompts, 'Try again?');
      if (retry) {
        defaults = answersAsDefaults(answers);
        continue;
      }
      exit(1);

      return undefined;
    }

    if (!deps.validateCredentials || (!answers.tokenForValidation && !answers.passwordForValidation)) {
      return answers;
    }

    const result = await deps.validateCredentials({
      host: answers.host,
      apiBasePath: answers.apiBasePath,
      token: answers.tokenForValidation ?? '',
      username: answers.username || undefined,
      password: answers.passwordForValidation,
    });
    if (result.ok) {
      log(result.detail ? `Validation succeeded: ${result.detail}` : 'Validation succeeded.');

      return answers;
    }

    log(`Validation failed: ${result.message}`);
    const outcome = await offerRetryAfterFailure(prompts, attempt);
    if (outcome === 'retry') {
      defaults = answersAsDefaults(answers);
      continue;
    }
    if (outcome === 'save-anyway') {
      return answers;
    }
    exit(1);

    return undefined;
  }
}

async function runNonInteractive(
  product: ProductDefinition,
  deps: SetupDeps,
  current: ProductRuntimeConfig,
  log: (message: string) => void,
  exit: (code: number) => void,
  args: ParsedSetupArgs,
): Promise<PromptResult | undefined> {
  const { toWrite: tokenToWrite, forValidation: tokenForValidation } = resolveSecretNonInteractive(
    args.token,
    current.token,
  );
  const { toWrite: passwordToWrite, forValidation: passwordForValidation } = resolveSecretNonInteractive(
    args.password,
    current.password,
  );

  const answers: PromptResult = {
    host: args.host ?? current.host ?? '',
    apiBasePath: args.apiBasePath ?? current.apiBasePath ?? product.defaultApiBasePath ?? '',
    defaultPageSize: args.defaultPageSize ?? String(current.defaultPageSize ?? FALLBACK_PAGE_SIZE),
    username: args.username ?? current.username ?? '',
    tokenToWrite,
    tokenForValidation,
    passwordToWrite,
    passwordForValidation,
  };

  const formatErrors = validateAnswers(product, answers);
  if (formatErrors.length > 0) {
    for (const message of formatErrors) {
      log(`Validation failed: ${message}`);
    }
    exit(1);

    return undefined;
  }

  if (deps.validateCredentials && (answers.tokenForValidation || answers.passwordForValidation)) {
    const result = await deps.validateCredentials({
      host: answers.host,
      apiBasePath: answers.apiBasePath,
      token: answers.tokenForValidation ?? '',
      username: answers.username || undefined,
      password: answers.passwordForValidation,
    });
    if (!result.ok) {
      log(`Validation failed: ${result.message}`);
      exit(1);

      return undefined;
    }
    log(result.detail ? `Validation succeeded: ${result.detail}` : 'Validation succeeded.');
  }

  return answers;
}

function resolveSecretNonInteractive(
  fromArgs: string | undefined,
  existing: string | undefined,
): SecretPromptResult {
  if (fromArgs) {
    return { toWrite: fromArgs, forValidation: fromArgs };
  }

  return { toWrite: undefined, forValidation: existing };
}

function answersAsDefaults(answers: PromptResult): PromptDefaults {
  const pageSize = Number.parseInt(answers.defaultPageSize, 10);

  return {
    host: answers.host,
    apiBasePath: answers.apiBasePath,
    token: answers.tokenForValidation,
    username: answers.username,
    password: answers.passwordForValidation,
    defaultPageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : undefined,
  };
}

async function confirmRetry(prompts: SetupPrompts, message: string): Promise<boolean> {
  return prompts.confirm({ message, default: true });
}

async function offerRetryAfterFailure(
  prompts: SetupPrompts,
  attempt: number,
): Promise<'retry' | 'save-anyway' | 'abort'> {
  if (attempt < MAX_VALIDATION_ATTEMPTS) {
    const retry = await confirmRetry(prompts, 'Try again with different values?');
    if (retry) {
      return 'retry';
    }
  }
  const saveAnyway = await prompts.confirm({
    message: 'Save configuration anyway?',
    default: false,
  });

  return saveAnyway ? 'save-anyway' : 'abort';
}

function readCurrentConfig(
  registry: ConfigRegistry,
  product: ProductDefinition,
): ProductRuntimeConfig {
  const pageSizeRaw = registry.resolve(product, 'defaultPageSize').value;
  const pageSize = parsePositiveInteger(pageSizeRaw) ?? FALLBACK_PAGE_SIZE;

  return {
    host: registry.resolve(product, 'host').value,
    apiBasePath: registry.resolve(product, 'apiBasePath').value,
    token: registry.resolve(product, 'token').value,
    username: registry.resolve(product, 'username').value,
    password: registry.resolve(product, 'password').value,
    defaultPageSize: pageSize,
  };
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);

  return parsed > 0 ? parsed : undefined;
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
  current: ProductRuntimeConfig,
): void {
  const keys: ConfigKey[] = ['host', 'apiBasePath', 'token', 'username', 'password', 'defaultPageSize'];
  for (const key of keys) {
    const primary = registry.locate(product, key)[0];
    const label = displayLabel(key);
    const displayValue =
      key === 'token' || key === 'password' ? maskSecret(current[key]) : readable(current[key]);
    const origin = primary ? `from ${primary.detail ?? primary.sourceId}` : 'not set';
    log(`Current ${label}: ${displayValue} (${origin})`);
  }
  log('');
}

async function promptForValues(
  prompts: SetupPrompts,
  product: ProductDefinition,
  defaults: PromptDefaults,
  args: ParsedSetupArgs | undefined,
): Promise<PromptResult> {
  const host = args?.host ?? await prompts.input({
    message: 'Host (e.g. jira.example.com):',
    default: defaults.host ?? '',
    validate: SetupValueValidator.host,
  });
  const apiBasePath = args?.apiBasePath ?? await prompts.input({
    message: 'API base path:',
    default: defaults.apiBasePath ?? product.defaultApiBasePath ?? '',
    validate: SetupValueValidator.apiBasePath,
  });
  const defaultPageSize = args?.defaultPageSize ?? await prompts.input({
    message: 'Default page size:',
    default: String(defaults.defaultPageSize ?? FALLBACK_PAGE_SIZE),
    validate: SetupValueValidator.pageSize,
  });
  const username = args?.username ?? await prompts.input({
    message: 'Username for Basic auth (leave blank if using a token):',
    default: defaults.username ?? '',
    validate: SetupValueValidator.token,
  });
  const token = await promptForSecret(prompts, {
    message: 'API token (leave blank for anonymous access):',
    keepExistingMessage: 'Keep existing token?',
  }, defaults.token, args?.token);
  const password = await promptForSecret(prompts, {
    message: 'Password for Basic auth (leave blank if using a token):',
    keepExistingMessage: 'Keep existing password?',
  }, defaults.password, args?.password);

  return {
    host: host.trim(),
    apiBasePath: apiBasePath.trim(),
    defaultPageSize: defaultPageSize.trim(),
    username: username.trim(),
    tokenToWrite: token.toWrite,
    tokenForValidation: token.forValidation,
    passwordToWrite: password.toWrite,
    passwordForValidation: password.forValidation,
  };
}

async function promptForSecret(
  prompts: SetupPrompts,
  opts: { message: string; keepExistingMessage: string },
  existing: string | undefined,
  fromArgs: string | undefined,
): Promise<SecretPromptResult> {
  if (fromArgs) {
    return { toWrite: fromArgs, forValidation: fromArgs };
  }
  const entered = await prompts.password({
    message: opts.message,
    mask: '*',
    validate: SetupValueValidator.token,
  });
  const trimmed = entered.trim();
  if (trimmed.length > 0) {
    return { toWrite: trimmed, forValidation: trimmed };
  }
  if (!existing) {
    return { toWrite: undefined, forValidation: undefined };
  }
  const keepExisting = await prompts.confirm({ message: opts.keepExistingMessage, default: true });

  return {
    toWrite: undefined,
    forValidation: keepExisting ? existing : undefined,
  };
}

function validateAnswers(product: ProductDefinition, answers: PromptResult): string[] {
  const errors: string[] = [];
  for (const [label, value, validator] of [
    ['host', answers.host, SetupValueValidator.host],
    ['API base path', answers.apiBasePath, SetupValueValidator.apiBasePath],
  ] as const) {
    const result = validator(value);
    if (result !== true) {
      errors.push(`${label}: ${result}`);
    }
  }

  const pageSize = SetupValueValidator.pageSize(answers.defaultPageSize);
  if (pageSize !== true) {
    errors.push(`default page size: ${pageSize}`);
  }

  if (answers.username) {
    const usernameResult = SetupValueValidator.token(answers.username);
    if (usernameResult !== true) {
      errors.push(`username: ${usernameResult}`);
    }
  }

  if (answers.tokenForValidation) {
    const tokenResult = SetupValueValidator.token(answers.tokenForValidation);
    if (tokenResult !== true) {
      errors.push(`API token: ${tokenResult}`);
    }
  }

  if (answers.passwordForValidation) {
    const passwordResult = SetupValueValidator.token(answers.passwordForValidation);
    if (passwordResult !== true) {
      errors.push(`password: ${passwordResult}`);
    }
  }

  const hasHost = answers.host.length > 0;
  const hasFullApiBasePath = /^https?:\/\//i.test(answers.apiBasePath);
  if (!hasHost && !hasFullApiBasePath) {
    errors.push(`Enter ${product.envVars.host}, or enter a full URL for ${product.envVars.apiBasePath}.`);
  }

  return errors;
}

function writeNonSecretFields(
  registry: ConfigRegistry,
  product: ProductDefinition,
  answers: PromptResult,
  homeFile: HomeFileSource,
  log: (message: string) => void,
): void {
  for (const key of ['host', 'apiBasePath', 'username', 'defaultPageSize'] as const) {
    warnIfShadowed(registry, product, key, homeFile, log);
    const value = answers[key];
    if (value.length > 0) {
      homeFile.write(product, key, value);
    }
  }
}

async function writeSecret(
  registry: ConfigRegistry,
  product: ProductDefinition,
  key: 'token' | 'password',
  value: string | undefined,
  homeFile: HomeFileSource,
  log: (message: string) => void,
  prompts: SetupPrompts,
): Promise<WritableSource | undefined> {
  if (!value) {
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

  warnIfShadowed(registry, product, key, candidates[0], log);

  for (const writer of candidates) {
    const written = await tryWrite(writer, product, key, value, log, prompts);
    if (written) {
      if (writer instanceof MacosKeychainSource) {
        homeFile.clear(product, key);
      }

      return writer;
    }
  }
  throw new Error(`No writable source succeeded for ${key}`);
}

async function tryWrite(
  writer: WritableSource,
  product: ProductDefinition,
  key: 'token' | 'password',
  value: string,
  log: (message: string) => void,
  prompts: SetupPrompts,
): Promise<boolean> {
  try {
    writer.write(product, key, value);

    return true;
  } catch (error) {
    const stderr = (error as { stderr?: string | Buffer }).stderr?.toString() ?? '';
    log(`Failed to write ${key} to ${writer.describe()}: ${(error as Error).message}`);
    if (stderr) {
      log(stderr.trim());
    }
    if (writer instanceof MacosKeychainSource) {
      const fallback = await prompts.confirm({
        message: 'Fall back to plaintext home file with mode 0600?',
        default: false,
      });
      if (fallback) {
        return false;
      }
      throw new Error(
        `${key} was not saved because keychain write failed and plaintext fallback was declined`,
        { cause: error },
      );
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
  passwordWriter: WritableSource | undefined,
  profile: string | undefined,
): void {
  log('');
  log('Saved configuration:');
  log(`  host: ${answers.host || '(unchanged)'}`);
  log(`  apiBasePath: ${answers.apiBasePath || '(unchanged)'}`);
  log(`  username: ${answers.username || '(unchanged)'}`);
  log(`  defaultPageSize: ${answers.defaultPageSize || '(unchanged)'}`);
  if (tokenWriter) {
    log(`  token: ${maskSecret(answers.tokenToWrite)} (stored in ${describeWriter(tokenWriter, product, 'token', profile)})`);
  } else {
    log('  token: (unchanged)');
  }
  if (passwordWriter) {
    log(`  password: ${maskSecret(answers.passwordToWrite)} (stored in ${describeWriter(passwordWriter, product, 'password', profile)})`);
  } else {
    log('  password: (unchanged)');
  }
  log(`Home file: ${getHomeFilePath(product, profile)}`);
}

function describeWriter(
  writer: WritableSource,
  product: ProductDefinition,
  key: 'token' | 'password',
  profile: string | undefined,
): string {
  if (writer instanceof MacosKeychainSource) {
    const account = profile ? `${product.id}-${profile}-${key}` : `${product.id}-${key}`;

    return `macOS Keychain (service atlassian-dc-mcp, account ${account})`;
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
    case 'username':
      return 'username';
    case 'password':
      return 'password';
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

function maskSecret(secret: string | undefined): string {
  if (!secret) {
    return '(not set)';
  }
  const last4 = secret.slice(-4);

  return `••••${last4}`;
}

function isUserCancel(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const err = error as { name?: string; message?: string };

  return err.name === 'ExitPromptError' || /force closed/i.test(err.message ?? '');
}
