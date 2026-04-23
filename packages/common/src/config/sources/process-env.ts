import type { ConfigKey, ProductDefinition, ReadableSource, SourceId } from '../source.js';
import { getNonEmptyValue } from '../source.js';

export class ProcessEnvSource implements ReadableSource {
  readonly id: SourceId = 'process-env';
  readonly priority = 100;

  read(product: ProductDefinition, key: ConfigKey): string | undefined {
    return getNonEmptyValue(process.env[product.envVars[key]]);
  }

  describe(): string {
    return 'process env';
  }
}
