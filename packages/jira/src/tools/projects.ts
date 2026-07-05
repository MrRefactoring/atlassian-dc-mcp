import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerProjectTools(server: McpServer, service: JiraService) {
  server.registerTool(
    'jira_get_projects',
    {
      description: `Get all projects visible to the current user in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjects,
    },
    async ({ includeArchived, expand, recent }) => {
      const result = await service.getProjects(includeArchived, expand, recent);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_search_projects',
    {
      description: `Search for projects by name or key using the picker-style search in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.searchProjects,
    },
    async ({ query, maxResults, allowEmptyQuery }) => {
      const result = await service.searchProjects(query, maxResults, allowEmptyQuery);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project',
    {
      description: `Get details of a single project by id or key from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProject,
    },
    async ({ projectIdOrKey, expand }) => {
      const result = await service.getProject(projectIdOrKey, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_components',
    {
      description: `Get all components of a project from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectComponents,
    },
    async ({ projectIdOrKey }) => {
      const result = await service.getProjectComponents(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_versions',
    {
      description: `Get all versions of a project from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectVersions,
    },
    async ({ projectIdOrKey, expand }) => {
      const result = await service.getProjectVersions(projectIdOrKey, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_create_project',
    {
      description: `Create a new project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createProject,
    },
    async ({ key, name, projectTypeKey, projectTemplateKey, description, lead, url, assigneeType, avatarId, issueSecurityScheme, permissionScheme, notificationScheme, categoryId, workflowSchemeId }) => {
      const result = await service.createProject({
        key,
        name,
        projectTypeKey,
        projectTemplateKey,
        description,
        lead,
        url,
        assigneeType,
        avatarId,
        issueSecurityScheme,
        permissionScheme,
        notificationScheme,
        categoryId,
        workflowSchemeId,
      });

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_project',
    {
      description: `Update an existing project in the ${jiraInstanceType}. Only non-null values sent are updated.`,
      inputSchema: jiraToolSchemas.updateProject,
    },
    async ({ projectIdOrKey, name, key, description, lead, url, assigneeType, avatarId, issueSecurityScheme, permissionScheme, notificationScheme, categoryId, projectTypeKey, expand }) => {
      const result = await service.updateProject(projectIdOrKey, {
        name,
        key,
        description,
        lead,
        url,
        assigneeType,
        avatarId,
        issueSecurityScheme,
        permissionScheme,
        notificationScheme,
        categoryId,
        projectTypeKey,
      }, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_project',
    {
      description: `Delete a project from the ${jiraInstanceType}. WARNING: this is irreversible.`,
      inputSchema: jiraToolSchemas.deleteProject,
    },
    async ({ projectIdOrKey }) => {
      const result = await service.deleteProject(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_archive_project',
    {
      description: `Archive a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.archiveProject,
    },
    async ({ projectIdOrKey }) => {
      const result = await service.archiveProject(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_restore_project',
    {
      description: `Restore a previously archived project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.restoreProject,
    },
    async ({ projectIdOrKey }) => {
      const result = await service.restoreProject(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_property_keys',
    {
      description: `Get the keys of all entity properties stored on a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectPropertyKeys,
    },
    async ({ projectIdOrKey }) => {
      const result = await service.getProjectPropertyKeys(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_property',
    {
      description: `Get a single entity property value from a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectProperty,
    },
    async ({ projectIdOrKey, propertyKey }) => {
      const result = await service.getProjectProperty(projectIdOrKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_set_project_property',
    {
      description: `Set an entity property (arbitrary JSON key/value metadata) on a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setProjectProperty,
    },
    async ({ projectIdOrKey, propertyKey, value }) => {
      const result = await service.setProjectProperty(projectIdOrKey, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_project_property',
    {
      description: `Delete an entity property from a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteProjectProperty,
    },
    async ({ projectIdOrKey, propertyKey }) => {
      const result = await service.deleteProjectProperty(projectIdOrKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_create_component',
    {
      description: `Create a component in a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createComponent,
    },
    async ({ projectKey, name, description, leadUserName }) => {
      const result = await service.createComponent(projectKey, name, description, leadUserName);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_components',
    {
      description: `Get a paginated list of components in the ${jiraInstanceType}, optionally filtered by project or name query`,
      inputSchema: jiraToolSchemas.getComponents,
    },
    async ({ maxResults, query, projectIds }) => {
      const result = await service.getComponents(maxResults, query, projectIds);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_component',
    {
      description: `Get a single component by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getComponent,
    },
    async ({ componentId }) => {
      const result = await service.getComponent(componentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_component',
    {
      description: `Update a component in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateComponent,
    },
    async ({ componentId, name, description, leadUserName }) => {
      const result = await service.updateComponent(componentId, name, description, leadUserName);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_component',
    {
      description: `Delete a component from the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteComponent,
    },
    async ({ componentId, moveIssuesTo }) => {
      const result = await service.deleteComponent(componentId, moveIssuesTo);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_component_related_issues',
    {
      description: `Get counts of issues related to a component in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getComponentRelatedIssues,
    },
    async ({ componentId }) => {
      const result = await service.getComponentRelatedIssues(componentId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_create_version',
    {
      description: `Create a version in a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createVersion,
    },
    async ({ projectKey, name, description, releaseDate, startDate }) => {
      const result = await service.createVersion(projectKey, name, description, releaseDate, startDate);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_versions',
    {
      description: `Get a paginated list of versions in the ${jiraInstanceType}, optionally filtered by project or name query`,
      inputSchema: jiraToolSchemas.getVersions,
    },
    async ({ projectIds, query, maxResults, startAt }) => {
      const result = await service.getVersions(projectIds, query, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_version',
    {
      description: `Get a single version by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getVersion,
    },
    async ({ versionId, expand }) => {
      const result = await service.getVersion(versionId, expand);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_version',
    {
      description: `Update a version in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateVersion,
    },
    async ({ versionId, name, description, released, archived, releaseDate }) => {
      const result = await service.updateVersion(versionId, name, description, released, archived, releaseDate);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_and_replace_version',
    {
      description: `Delete a version from the ${jiraInstanceType}, moving affected/fix-version issues to replacement versions. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteAndReplaceVersion,
    },
    async ({ versionId, moveFixIssuesTo, moveAffectedIssuesTo }) => {
      const result = await service.deleteAndReplaceVersion(versionId, moveFixIssuesTo, moveAffectedIssuesTo);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_merge_version',
    {
      description: `Merge a version into another version in the ${jiraInstanceType}, moving all its issues to the target version. This is irreversible.`,
      inputSchema: jiraToolSchemas.mergeVersion,
    },
    async ({ versionId, moveIssuesToVersionId }) => {
      const result = await service.mergeVersion(versionId, moveIssuesToVersionId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_move_version',
    {
      description: `Reposition a version within its project's version sequence in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.moveVersion,
    },
    async ({ versionId, position, after }) => {
      const result = await service.moveVersion(versionId, position, after);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_version_related_issues',
    {
      description: `Get counts of issues related to a version in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getVersionRelatedIssues,
    },
    async ({ versionId }) => {
      const result = await service.getVersionRelatedIssues(versionId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_version_unresolved_issues',
    {
      description: `Get the count of unresolved issues for a version in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getVersionUnresolvedIssues,
    },
    async ({ versionId }) => {
      const result = await service.getVersionUnresolvedIssues(versionId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_roles',
    {
      description: `Get the project roles defined for a project in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectRoles,
    },
    async ({ projectIdOrKey }) => {
      const result = await service.getProjectRoles(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_role',
    {
      description: `Get details (including current actors) for a single project role in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectRole,
    },
    async ({ projectIdOrKey, roleId }) => {
      const result = await service.getProjectRole(projectIdOrKey, roleId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_set_project_role_actors',
    {
      description: `Replace all actors (users/groups) of a project role in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setProjectRoleActors,
    },
    async ({ projectIdOrKey, roleId, categorisedActors }) => {
      const result = await service.setProjectRoleActors(projectIdOrKey, roleId, categorisedActors);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_add_project_role_actors',
    {
      description: `Add users and/or groups as actors of a project role in the ${jiraInstanceType}, without affecting existing actors`,
      inputSchema: jiraToolSchemas.addProjectRoleActors,
    },
    async ({ projectIdOrKey, roleId, users, groups }) => {
      const result = await service.addProjectRoleActors(projectIdOrKey, roleId, users, groups);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_project_role_actor',
    {
      description: `Remove a single user or group actor from a project role in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteProjectRoleActor,
    },
    async ({ projectIdOrKey, roleId, user, group }) => {
      const result = await service.deleteProjectRoleActor(projectIdOrKey, roleId, user, group);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_categories',
    {
      description: `Get all project categories in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectCategories,
    },
    async () => {
      const result = await service.getProjectCategories();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_create_project_category',
    {
      description: `Create a new project category in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createProjectCategory,
    },
    async ({ name, description }) => {
      const result = await service.createProjectCategory(name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_project_category',
    {
      description: `Get a single project category by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getProjectCategory,
    },
    async ({ id }) => {
      const result = await service.getProjectCategory(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_project_category',
    {
      description: `Update a project category's name or description in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateProjectCategory,
    },
    async ({ id, name, description }) => {
      const result = await service.updateProjectCategory(id, name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_project_category',
    {
      description: `Delete a project category in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteProjectCategory,
    },
    async ({ id }) => {
      const result = await service.deleteProjectCategory(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_role_definitions',
    {
      description: `Get all global role definitions available in the ${jiraInstanceType}. This is the global role catalog, distinct from jira_get_project_roles which returns roles for a specific project.`,
      inputSchema: jiraToolSchemas.getRoleDefinitions,
    },
    async () => {
      const result = await service.getRoleDefinitions();

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_create_role_definition',
    {
      description: `Create a new global role definition in the ${jiraInstanceType}. The created role has no default actors assigned.`,
      inputSchema: jiraToolSchemas.createRoleDefinition,
    },
    async ({ name, description }) => {
      const result = await service.createRoleDefinition(name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_role_definition',
    {
      description: `Get a single global role definition by id from the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getRoleDefinition,
    },
    async ({ id }) => {
      const result = await service.getRoleDefinition(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_role_definition',
    {
      description: `Fully update a global role definition's name and description in the ${jiraInstanceType}. Both fields must be given.`,
      inputSchema: jiraToolSchemas.updateRoleDefinition,
    },
    async ({ id, name, description }) => {
      const result = await service.updateRoleDefinition(id, name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_partial_update_role_definition',
    {
      description: `Partially update a global role definition's name or description in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.partialUpdateRoleDefinition,
    },
    async ({ id, name, description }) => {
      const result = await service.partialUpdateRoleDefinition(id, name, description);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_role_definition',
    {
      description: `Delete a global role definition in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteRoleDefinition,
    },
    async ({ id, swap }) => {
      const result = await service.deleteRoleDefinition(id, swap);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_role_definition_actors',
    {
      description: `Get the default actors for a global role definition in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getRoleDefinitionActors,
    },
    async ({ id }) => {
      const result = await service.getRoleDefinitionActors(id);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_add_role_definition_actors',
    {
      description: `Add default actors to a global role definition in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addRoleDefinitionActors,
    },
    async ({ id, users, groups }) => {
      const result = await service.addRoleDefinitionActors(id, users, groups);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_role_definition_actor',
    {
      description: `Remove a default actor from a global role definition in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteRoleDefinitionActor,
    },
    async ({ id, user, group }) => {
      const result = await service.deleteRoleDefinitionActor(id, user, group);

      return formatToolResponse(result);
    },
  );
}
