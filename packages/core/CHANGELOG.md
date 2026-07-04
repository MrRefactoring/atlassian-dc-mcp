# Change Log

## 0.2.0

### Minor Changes

- [`582a094`](https://github.com/MrRefactoring/atlassian-dc-mcp/commit/582a094960ba6d74453aabefa4ed44522ac07351) Thanks [@MrRefactoring](https://github.com/MrRefactoring)! - Allow the MCP servers to start and run without an API token, for Data Center instances that permit anonymous access. `*_API_TOKEN` is no longer required by config validation or the interactive `setup` CLI; when it's absent, requests are sent with no `Authorization` header instead of the previous placeholder-token workaround.
