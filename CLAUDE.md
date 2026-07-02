# Atlassian DC MCP Project Guidelines

## Build/Test/Lint Commands
```bash
# Build all packages (builds common first, then others)
pnpm build

# Build specific package
pnpm --filter jira-datacenter-mcp build

# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter jira-datacenter-mcp test

# Run specific test (using Jest)
pnpm --filter jira-datacenter-mcp exec jest -t 'test name'

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
Pick the affected packages, bump type, and write a short summary; commit the generated `.changeset/*.md` file alongside the code change. Merging to `master` opens/updates a "Version Packages" PR (via `changesets/action` in CI, `.github/workflows/npm-publish.yml`) that only bumps versions and CHANGELOG.md files — it does not publish.

To actually release, after merging the Version Packages PR, tag the resulting commit on `master` with the new shared version and push the tag:
```bash
git tag v0.2.0
git push origin v0.2.0
```
Pushing a `vX.Y.Z` tag triggers `.github/workflows/release.yml`: it creates a draft GitHub release from the matching `# [X.Y.Z]` sections of each package's `CHANGELOG.md`, builds/tests, runs `pnpm run release` (npm publish with provenance) and the MCP Registry publish, then flips the release from draft to published.

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