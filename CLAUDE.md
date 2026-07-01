# Atlassian DC MCP Project Guidelines

## Build/Test/Lint Commands
```bash
# Build all packages (builds common first, then others)
pnpm build

# Build specific package
pnpm --filter @mrrefactoring/atlassian-dc-mcp-jira build

# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @mrrefactoring/atlassian-dc-mcp-jira test

# Run specific test (using Jest)
pnpm --filter @mrrefactoring/atlassian-dc-mcp-jira exec jest -t 'test name'

# Development mode
pnpm dev:jira
pnpm dev:confluence
pnpm dev:bitbucket

# Debugging
pnpm debug
pnpm debug:verbose
```

## Releasing
This monorepo uses [Changesets](https://github.com/changesets/changesets) (not lerna) for versioning and publishing, with all 4 packages kept in lockstep via a `fixed` group in `.changeset/config.json`. Any PR that should trigger a release must include a changeset:
```bash
pnpm changeset
```
Pick the affected packages, bump type, and write a short summary; commit the generated `.changeset/*.md` file alongside the code change. Merging to `master` opens/updates a "Version Packages" PR (via `changesets/action` in CI); merging *that* PR runs the actual `pnpm publish` + MCP Registry publish.

## Code Style Guidelines
- **TypeScript**: Use strong typing, avoid `any`
- **Imports**: External dependencies first, then internal packages, then local imports
- **Classes**: Max 300 lines of code
- **Functions**: Max 35 lines of code
- **Error Handling**: Use `handleApiOperation` utility from common package
- **Naming**: PascalCase for classes/interfaces, camelCase for variables/functions
- **Composition**: Prefer small, composable functions and classes
- **Comments**: Avoid generic comments, only explain non-obvious solutions
- **APIs**: Use service classes with consistent error handling patterns
- **DRY**: Avoid duplication, extract common code into functions or classes