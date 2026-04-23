import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { ConfigKey, ProductDefinition, SourceId, WritableSource } from '../source.js';
import { getNonEmptyValue } from '../source.js';
import {
  DotenvFileCache,
  DotenvFileNotFoundError,
  type ParsedEnvironment,
} from './dotenv-file-cache.js';

const HOME_DIR_NAME = '.atlassian-dc-mcp';

function getHomeFilePath(product: ProductDefinition | string): string {
  const id = typeof product === 'string' ? product : product.id;
  return path.join(os.homedir(), HOME_DIR_NAME, `${id}.env`);
}

function needsQuoting(value: string): boolean {
  return /[\s#'"]/.test(value);
}

function serializeValue(value: string): string {
  if (!needsQuoting(value)) {
    return value;
  }
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function serialize(values: ParsedEnvironment): string {
  const lines: string[] = [];
  for (const [key, raw] of Object.entries(values)) {
    lines.push(`${key}=${serializeValue(raw)}`);
  }
  return lines.length > 0 ? `${lines.join('\n')}\n` : '';
}

export class HomeFileSource implements WritableSource {
  readonly id: SourceId = 'home-file';
  readonly priority = 60;

  private cache = new DotenvFileCache();

  isAvailable(): boolean {
    return true;
  }

  read(product: ProductDefinition, key: ConfigKey): string | undefined {
    const values = this.loadFile(product);
    return getNonEmptyValue(values[product.envVars[key]]);
  }

  describe(): string {
    return `home-file (~/${HOME_DIR_NAME}/<product>.env)`;
  }

  describeForProduct(product: ProductDefinition): string {
    return `home-file (${getHomeFilePath(product)})`;
  }

  write(product: ProductDefinition, key: ConfigKey, value: string): void {
    const envVar = product.envVars[key];
    const existing = this.readFileIgnoringErrors(product);
    existing[envVar] = value;
    this.persist(product, existing);
  }

  clear(product: ProductDefinition, key: ConfigKey): void {
    const envVar = product.envVars[key];
    const existing = this.readFileIgnoringErrors(product);
    if (!(envVar in existing)) {
      return;
    }
    delete existing[envVar];
    this.persist(product, existing);
  }

  private loadFile(product: ProductDefinition): ParsedEnvironment {
    const filePath = getHomeFilePath(product);
    try {
      return this.cache.load(filePath);
    } catch (error) {
      if (error instanceof DotenvFileNotFoundError) {
        return {};
      }
      throw error;
    }
  }

  private readFileIgnoringErrors(product: ProductDefinition): ParsedEnvironment {
    try {
      return { ...this.loadFile(product) };
    } catch {
      return {};
    }
  }

  private persist(product: ProductDefinition, values: ParsedEnvironment): void {
    const filePath = getHomeFilePath(product);
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });

    const tmpPath = `${filePath}.tmp-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
    try {
      fs.writeFileSync(tmpPath, serialize(values), { mode: 0o600 });
      fs.renameSync(tmpPath, filePath);
    } catch (error) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {
        // best-effort cleanup
      }
      throw error;
    }

    this.cache.invalidate();
  }
}

export { getHomeFilePath, HOME_DIR_NAME };
