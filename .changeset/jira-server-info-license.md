---
"jira-datacenter-mcp": minor
---

Add jira_getServerInfo (server version, build number, deployment type) and jira_validateLicense (validate a license string against the current installation). The generated client has no endpoint for reading the currently installed license; validateLicense is the only license-related surface it exposes.
