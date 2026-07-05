#!/usr/bin/env node
const sub = process.argv[2];
if (sub === 'setup') {
  await import('./setup.js');
} else {
  await import('./server.js');
}
