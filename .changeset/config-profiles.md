---
"jira-datacenter-mcp": minor
"confluence-datacenter-mcp": minor
"bitbucket-datacenter-mcp": minor
---

Add a first-class named-profile concept for managing more than one instance of the same product. `setup --profile <name>` reads/writes a distinct home file (`<product>.<profile>.env`) and Keychain account (`<product>-<profile>-token`/`-password`) instead of the default unsuffixed ones; set `ATLASSIAN_DC_MCP_PROFILE=<name>` when launching the server to read that profile back. `process.env` and `ATLASSIAN_DC_MCP_CONFIG_FILE` are unaffected and still take priority, as before.
