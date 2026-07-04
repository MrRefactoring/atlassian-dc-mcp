import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// After `changeset version` bumps each package.json, copy that version into the
// matching server.json (the MCP Registry manifest) so the two never drift.
const packages = ['jira', 'confluence', 'bitbucket'] as const;

interface ServerJson {
  version: string;
  packages?: { version: string }[];
}

console.log('Syncing versions from package.json into server.json...');

for (const pkg of packages) {
  const packageJsonPath = join('packages', pkg, 'package.json');
  const serverJsonPath = join('packages', pkg, 'server.json');

  const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version: string };
  const serverJson = JSON.parse(readFileSync(serverJsonPath, 'utf8')) as ServerJson;

  console.log(`${pkg}: ${serverJson.version} -> ${version}`);

  serverJson.version = version;
  if (serverJson.packages?.[0]) {
    serverJson.packages[0].version = version;
  }

  writeFileSync(serverJsonPath, `${JSON.stringify(serverJson, null, 2)}\n`);
}

console.log('All versions synced.');
