import fs from 'node:fs';
import path from 'node:path';

describe('bitbucket setup shim', () => {
  it('calls runSetup with BITBUCKET_PRODUCT', () => {
    const setupSource = fs.readFileSync(path.join(process.cwd(), 'src', 'setup.ts'), 'utf8');
    expect(setupSource).toMatch(/runSetup\(\s*BITBUCKET_PRODUCT\s*\)/);
    expect(setupSource).toMatch(/from\s+['"]@atlassian-dc-mcp\/common['"]/);
    expect(setupSource).toMatch(/import\s+\{\s*BITBUCKET_PRODUCT\s*\}\s+from\s+['"]\.\/config\.js['"]/);
  });
});
