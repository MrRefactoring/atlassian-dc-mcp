import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: [
      { find: /^datacenter-mcp-core\/setup-cli$/, replacement: path.resolve(__dirname, '../core/src/setup-cli.ts') },
      { find: /^datacenter-mcp-core$/, replacement: path.resolve(__dirname, '../core/src/index.ts') },
    ],
  },
});
