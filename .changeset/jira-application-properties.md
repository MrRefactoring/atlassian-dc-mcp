---
"jira-datacenter-mcp": minor
---

Add Jira application properties tools: jira_getApplicationProperty, jira_getAdvancedSettings, and jira_setApplicationProperty for reading and updating global application properties / advanced settings. The set operation calls the endpoint directly since the generated client's `setPropertyViaRestfulTable` omits the request body the REST API requires.
