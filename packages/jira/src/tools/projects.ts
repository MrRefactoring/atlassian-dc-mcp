import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerProjectTools(server: McpServer, service: JiraService) {
  server.tool(
    'jira_getProjects',
    `Get all projects visible to the current user in the ${jiraInstanceType}`,
    jiraToolSchemas.getProjects,
    async ({ includeArchived, expand, recent }) => {
      const result = await service.getProjects(includeArchived, expand, recent);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_searchProjects',
    `Search for projects by name or key using the picker-style search in the ${jiraInstanceType}`,
    jiraToolSchemas.searchProjects,
    async ({ query, maxResults, allowEmptyQuery }) => {
      const result = await service.searchProjects(query, maxResults, allowEmptyQuery);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProject',
    `Get details of a single project by id or key from the ${jiraInstanceType}`,
    jiraToolSchemas.getProject,
    async ({ projectIdOrKey, expand }) => {
      const result = await service.getProject(projectIdOrKey, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectComponents',
    `Get all components of a project from the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectComponents,
    async ({ projectIdOrKey }) => {
      const result = await service.getProjectComponents(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectVersions',
    `Get all versions of a project from the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectVersions,
    async ({ projectIdOrKey, expand }) => {
      const result = await service.getProjectVersions(projectIdOrKey, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createProject',
    `Create a new project in the ${jiraInstanceType}`,
    jiraToolSchemas.createProject,
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

  server.tool(
    'jira_updateProject',
    `Update an existing project in the ${jiraInstanceType}. Only non-null values sent are updated.`,
    jiraToolSchemas.updateProject,
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

  server.tool(
    'jira_deleteProject',
    `Delete a project from the ${jiraInstanceType}. WARNING: this is irreversible.`,
    jiraToolSchemas.deleteProject,
    async ({ projectIdOrKey }) => {
      const result = await service.deleteProject(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_archiveProject',
    `Archive a project in the ${jiraInstanceType}`,
    jiraToolSchemas.archiveProject,
    async ({ projectIdOrKey }) => {
      const result = await service.archiveProject(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_restoreProject',
    `Restore a previously archived project in the ${jiraInstanceType}`,
    jiraToolSchemas.restoreProject,
    async ({ projectIdOrKey }) => {
      const result = await service.restoreProject(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectPropertyKeys',
    `Get the keys of all entity properties stored on a project in the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectPropertyKeys,
    async ({ projectIdOrKey }) => {
      const result = await service.getProjectPropertyKeys(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectProperty',
    `Get a single entity property value from a project in the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectProperty,
    async ({ projectIdOrKey, propertyKey }) => {
      const result = await service.getProjectProperty(projectIdOrKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setProjectProperty',
    `Set an entity property (arbitrary JSON key/value metadata) on a project in the ${jiraInstanceType}`,
    jiraToolSchemas.setProjectProperty,
    async ({ projectIdOrKey, propertyKey, value }) => {
      const result = await service.setProjectProperty(projectIdOrKey, propertyKey, value);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteProjectProperty',
    `Delete an entity property from a project in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteProjectProperty,
    async ({ projectIdOrKey, propertyKey }) => {
      const result = await service.deleteProjectProperty(projectIdOrKey, propertyKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createComponent',
    `Create a component in a project in the ${jiraInstanceType}`,
    jiraToolSchemas.createComponent,
    async ({ projectKey, name, description, leadUserName }) => {
      const result = await service.createComponent(projectKey, name, description, leadUserName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getComponents',
    `Get a paginated list of components in the ${jiraInstanceType}, optionally filtered by project or name query`,
    jiraToolSchemas.getComponents,
    async ({ maxResults, query, projectIds }) => {
      const result = await service.getComponents(maxResults, query, projectIds);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getComponent',
    `Get a single component by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getComponent,
    async ({ componentId }) => {
      const result = await service.getComponent(componentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateComponent',
    `Update a component in the ${jiraInstanceType}`,
    jiraToolSchemas.updateComponent,
    async ({ componentId, name, description, leadUserName }) => {
      const result = await service.updateComponent(componentId, name, description, leadUserName);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteComponent',
    `Delete a component from the ${jiraInstanceType}. This is irreversible.`,
    jiraToolSchemas.deleteComponent,
    async ({ componentId, moveIssuesTo }) => {
      const result = await service.deleteComponent(componentId, moveIssuesTo);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getComponentRelatedIssues',
    `Get counts of issues related to a component in the ${jiraInstanceType}`,
    jiraToolSchemas.getComponentRelatedIssues,
    async ({ componentId }) => {
      const result = await service.getComponentRelatedIssues(componentId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createVersion',
    `Create a version in a project in the ${jiraInstanceType}`,
    jiraToolSchemas.createVersion,
    async ({ projectKey, name, description, releaseDate, startDate }) => {
      const result = await service.createVersion(projectKey, name, description, releaseDate, startDate);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getVersions',
    `Get a paginated list of versions in the ${jiraInstanceType}, optionally filtered by project or name query`,
    jiraToolSchemas.getVersions,
    async ({ projectIds, query, maxResults, startAt }) => {
      const result = await service.getVersions(projectIds, query, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getVersion',
    `Get a single version by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getVersion,
    async ({ versionId, expand }) => {
      const result = await service.getVersion(versionId, expand);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateVersion',
    `Update a version in the ${jiraInstanceType}`,
    jiraToolSchemas.updateVersion,
    async ({ versionId, name, description, released, archived, releaseDate }) => {
      const result = await service.updateVersion(versionId, name, description, released, archived, releaseDate);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteAndReplaceVersion',
    `Delete a version from the ${jiraInstanceType}, moving affected/fix-version issues to replacement versions. This is irreversible.`,
    jiraToolSchemas.deleteAndReplaceVersion,
    async ({ versionId, moveFixIssuesTo, moveAffectedIssuesTo }) => {
      const result = await service.deleteAndReplaceVersion(versionId, moveFixIssuesTo, moveAffectedIssuesTo);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_mergeVersion',
    `Merge a version into another version in the ${jiraInstanceType}, moving all its issues to the target version. This is irreversible.`,
    jiraToolSchemas.mergeVersion,
    async ({ versionId, moveIssuesToVersionId }) => {
      const result = await service.mergeVersion(versionId, moveIssuesToVersionId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_moveVersion',
    `Reposition a version within its project's version sequence in the ${jiraInstanceType}`,
    jiraToolSchemas.moveVersion,
    async ({ versionId, position, after }) => {
      const result = await service.moveVersion(versionId, position, after);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getVersionRelatedIssues',
    `Get counts of issues related to a version in the ${jiraInstanceType}`,
    jiraToolSchemas.getVersionRelatedIssues,
    async ({ versionId }) => {
      const result = await service.getVersionRelatedIssues(versionId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getVersionUnresolvedIssues',
    `Get the count of unresolved issues for a version in the ${jiraInstanceType}`,
    jiraToolSchemas.getVersionUnresolvedIssues,
    async ({ versionId }) => {
      const result = await service.getVersionUnresolvedIssues(versionId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectRoles',
    `Get the project roles defined for a project in the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectRoles,
    async ({ projectIdOrKey }) => {
      const result = await service.getProjectRoles(projectIdOrKey);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectRole',
    `Get details (including current actors) for a single project role in the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectRole,
    async ({ projectIdOrKey, roleId }) => {
      const result = await service.getProjectRole(projectIdOrKey, roleId);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_setProjectRoleActors',
    `Replace all actors (users/groups) of a project role in the ${jiraInstanceType}`,
    jiraToolSchemas.setProjectRoleActors,
    async ({ projectIdOrKey, roleId, categorisedActors }) => {
      const result = await service.setProjectRoleActors(projectIdOrKey, roleId, categorisedActors);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addProjectRoleActors',
    `Add users and/or groups as actors of a project role in the ${jiraInstanceType}, without affecting existing actors`,
    jiraToolSchemas.addProjectRoleActors,
    async ({ projectIdOrKey, roleId, users, groups }) => {
      const result = await service.addProjectRoleActors(projectIdOrKey, roleId, users, groups);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteProjectRoleActor',
    `Remove a single user or group actor from a project role in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteProjectRoleActor,
    async ({ projectIdOrKey, roleId, user, group }) => {
      const result = await service.deleteProjectRoleActor(projectIdOrKey, roleId, user, group);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectCategories',
    `Get all project categories in the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectCategories,
    async () => {
      const result = await service.getProjectCategories();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createProjectCategory',
    `Create a new project category in the ${jiraInstanceType}`,
    jiraToolSchemas.createProjectCategory,
    async ({ name, description }) => {
      const result = await service.createProjectCategory(name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getProjectCategory',
    `Get a single project category by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getProjectCategory,
    async ({ id }) => {
      const result = await service.getProjectCategory(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateProjectCategory',
    `Update a project category's name or description in the ${jiraInstanceType}`,
    jiraToolSchemas.updateProjectCategory,
    async ({ id, name, description }) => {
      const result = await service.updateProjectCategory(id, name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteProjectCategory',
    `Delete a project category in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteProjectCategory,
    async ({ id }) => {
      const result = await service.deleteProjectCategory(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getRoleDefinitions',
    `Get all global role definitions available in the ${jiraInstanceType}. This is the global role catalog, distinct from jira_getProjectRoles which returns roles for a specific project.`,
    jiraToolSchemas.getRoleDefinitions,
    async () => {
      const result = await service.getRoleDefinitions();

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_createRoleDefinition',
    `Create a new global role definition in the ${jiraInstanceType}. The created role has no default actors assigned.`,
    jiraToolSchemas.createRoleDefinition,
    async ({ name, description }) => {
      const result = await service.createRoleDefinition(name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getRoleDefinition',
    `Get a single global role definition by id from the ${jiraInstanceType}`,
    jiraToolSchemas.getRoleDefinition,
    async ({ id }) => {
      const result = await service.getRoleDefinition(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_updateRoleDefinition',
    `Fully update a global role definition's name and description in the ${jiraInstanceType}. Both fields must be given.`,
    jiraToolSchemas.updateRoleDefinition,
    async ({ id, name, description }) => {
      const result = await service.updateRoleDefinition(id, name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_partialUpdateRoleDefinition',
    `Partially update a global role definition's name or description in the ${jiraInstanceType}`,
    jiraToolSchemas.partialUpdateRoleDefinition,
    async ({ id, name, description }) => {
      const result = await service.partialUpdateRoleDefinition(id, name, description);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteRoleDefinition',
    `Delete a global role definition in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteRoleDefinition,
    async ({ id, swap }) => {
      const result = await service.deleteRoleDefinition(id, swap);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_getRoleDefinitionActors',
    `Get the default actors for a global role definition in the ${jiraInstanceType}`,
    jiraToolSchemas.getRoleDefinitionActors,
    async ({ id }) => {
      const result = await service.getRoleDefinitionActors(id);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_addRoleDefinitionActors',
    `Add default actors to a global role definition in the ${jiraInstanceType}`,
    jiraToolSchemas.addRoleDefinitionActors,
    async ({ id, users, groups }) => {
      const result = await service.addRoleDefinitionActors(id, users, groups);

      return formatToolResponse(result);
    },
  );

  server.tool(
    'jira_deleteRoleDefinitionActor',
    `Remove a default actor from a global role definition in the ${jiraInstanceType}`,
    jiraToolSchemas.deleteRoleDefinitionActor,
    async ({ id, user, group }) => {
      const result = await service.deleteRoleDefinitionActor(id, user, group);

      return formatToolResponse(result);
    },
  );
}
