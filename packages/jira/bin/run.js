#!/usr/bin/env node
const sub = process.argv[2];
if (sub === 'setup') {
  await import('../build/setup.js');
} else {
  await import('../build/index.js');
}
