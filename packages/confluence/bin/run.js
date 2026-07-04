#!/usr/bin/env node
const sub = process.argv[2];
if (sub === 'setup') {
  await import('../dist/setup.js');
} else {
  await import('../dist/index.js');
}
