# Change Log

This is a pnpm workspace monorepo publishing four packages (`datacenter-mcp-core`, `jira-datacenter-mcp`, `confluence-datacenter-mcp`, `bitbucket-datacenter-mcp`) released together under a single [Changesets](https://github.com/changesets/changesets) fixed version group — all four always share the same version number. This file summarizes each release; every package also carries its own `CHANGELOG.md` under `packages/*/CHANGELOG.md` with the same entries scoped to that package.

## 0.2.0

### Minor Changes

- [`582a094`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/582a094960ba6d74453aabefa4ed44522ac07351) Allow the MCP servers to start and run without an API token, for Data Center instances that permit anonymous access. `*_API_TOKEN` is no longer required by config validation or the interactive `setup` CLI; when it's absent, requests are sent with no `Authorization` header instead of the previous placeholder-token workaround.
