---
'jira-datacenter-mcp': minor
---

Add `jira_update_application_role`, the one write that was missing from the application role surface.

Until now the application roles could only be read (`jira_get_application_roles`, `jira_get_application_role`), so granting a group access to Jira Software through the tools was impossible.

Like Bitbucket's update endpoints, `PUT /applicationrole/{key}` replaces the role with the body it receives. Probing a live Jira DC 10.3 instance confirmed it: a body of `{key, selectedByDefault}` empties `groups` and `defaultGroups`, which revokes the application from every user holding it — `userCount` dropped from 1 to 0. The tool therefore reads the role and sends it back with only the fields you passed overridden, and an unknown role key fails on that read instead of writing anything.

`numberOfSeats` is deliberately not exposed: the server accepts it and silently keeps the licensed value.
