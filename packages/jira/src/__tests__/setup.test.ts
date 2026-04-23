import fs from 'node:fs';
import path from 'node:path';

describe('jira setup shim', () => {
  it('calls runSetup with JIRA_PRODUCT', () => {
    const setupSource = fs.readFileSync(path.join(process.cwd(), 'src', 'setup.ts'), 'utf8');
    expect(setupSource).toMatch(/runSetup\(\s*JIRA_PRODUCT\s*\)/);
    expect(setupSource).toMatch(/from\s+['"]@atlassian-dc-mcp\/common['"]/);
    expect(setupSource).toMatch(/import\s+\{\s*JIRA_PRODUCT\s*\}\s+from\s+['"]\.\/config\.js['"]/);
  });
});
