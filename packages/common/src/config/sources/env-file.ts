import path from 'node:path';
import type { ConfigKey, ProductDefinition, ReadableSource, SourceId } from '../source.js';
import { getNonEmptyValue } from '../source.js';
import {
  DotenvFileCache,
  DotenvFileNotFoundError,
  type ParsedEnvironment,
} from './dotenv-file-cache.js';

export const ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR = 'ATLASSIAN_DC_MCP_CONFIG_FILE';

export class EnvFileSource implements ReadableSource {
  readonly id: SourceId = 'env-file';
  readonly priority = 80;

  private cwd: string = process.cwd();
  private cache = new DotenvFileCache();

  initialize(options?: { cwd?: string }): void {
    this.cwd = options?.cwd ?? process.cwd();
    this.loadFile();
  }

  read(product: ProductDefinition, key: ConfigKey): string | undefined {
    const values = this.loadFile();
    return getNonEmptyValue(values[product.envVars[key]]);
  }

  describe(): string {
    return this.cache.filePath ? `env-file (${this.cache.filePath})` : 'env-file';
  }

  private getExplicitFilePath(): string | undefined {
    const filePath = getNonEmptyValue(process.env[ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR]);
    if (!filePath) {
      return undefined;
    }
    if (!path.isAbsolute(filePath)) {
      throw new Error(`${ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR} must be an absolute path: ${filePath}`);
    }
    return filePath;
  }

  private loadFile(): ParsedEnvironment {
    const explicitFilePath = this.getExplicitFilePath();
    const filePath = explicitFilePath ?? path.join(this.cwd, '.env');
    try {
      return this.cache.load(filePath);
    } catch (error) {
      if (error instanceof DotenvFileNotFoundError) {
        if (explicitFilePath) {
          throw new Error(
            `${ATLASSIAN_DC_MCP_CONFIG_FILE_ENV_VAR} points to a missing file: ${error.filePath}`,
          );
        }
        return {};
      }
      throw error;
    }
  }
}
