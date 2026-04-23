import fs from 'node:fs';
import dotenv from 'dotenv';

export type ParsedEnvironment = Record<string, string>;

type CacheEntry = {
  filePath: string;
  mtimeMs: number;
  values: ParsedEnvironment;
};

export class DotenvFileNotFoundError extends Error {
  readonly filePath: string;
  constructor(filePath: string) {
    super(`Dotenv file not found: ${filePath}`);
    this.name = 'DotenvFileNotFoundError';
    this.filePath = filePath;
  }
}

export class DotenvFileCache {
  private entry?: CacheEntry;

  get filePath(): string | undefined {
    return this.entry?.filePath;
  }

  load(filePath: string): ParsedEnvironment {
    let stats: fs.Stats;
    try {
      stats = fs.statSync(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        if (this.entry?.filePath === filePath) {
          this.entry = undefined;
        }
        throw new DotenvFileNotFoundError(filePath);
      }
      throw error;
    }

    if (this.entry && this.entry.filePath === filePath && this.entry.mtimeMs === stats.mtimeMs) {
      return this.entry.values;
    }

    const values = dotenv.parse(fs.readFileSync(filePath));
    this.entry = { filePath, mtimeMs: stats.mtimeMs, values };
    return values;
  }

  invalidate(): void {
    this.entry = undefined;
  }
}
