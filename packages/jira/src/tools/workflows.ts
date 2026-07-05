import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { formatToolResponse } from 'datacenter-mcp-core';
import { jiraInstanceType } from '../constants.js';
import { jiraToolSchemas } from '../jiraService.js';
import type { JiraService } from '../jiraService.js';

export function registerWorkflowTools(server: McpServer, service: JiraService) {
  server.registerTool(
    'jira_get_workflows',
    {
      description: `Get all workflows (or a workflow by name) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorkflows,
    },
    async ({ workflowName }) => {
      const result = await service.getWorkflows(workflowName);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_workflow_scheme',
    {
      description: `Get a workflow scheme by id in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorkflowScheme,
    },
    async ({ schemeId, returnDraftIfExists }) => {
      const result = await service.getWorkflowScheme(schemeId, returnDraftIfExists);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_workflow_scheme_default',
    {
      description: `Get the default workflow of a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorkflowSchemeDefault,
    },
    async ({ schemeId, returnDraftIfExists }) => {
      const result = await service.getWorkflowSchemeDefault(schemeId, returnDraftIfExists);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_workflow_scheme_issue_type_mapping',
    {
      description: `Get the workflow mapping for a specific issue type in a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorkflowSchemeIssueTypeMapping,
    },
    async ({ schemeId, issueType, returnDraftIfExists }) => {
      const result = await service.getWorkflowSchemeIssueTypeMapping(schemeId, issueType, returnDraftIfExists);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_workflow_scheme_workflow_mapping',
    {
      description: `Get the issue type mappings for a workflow (or all workflows) in a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getWorkflowSchemeWorkflowMapping,
    },
    async ({ schemeId, workflowName, returnDraftIfExists }) => {
      const result = await service.getWorkflowSchemeWorkflowMapping(schemeId, workflowName, returnDraftIfExists);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_create_workflow_scheme',
    {
      description: `Create a new workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.createWorkflowScheme,
    },
    async ({ name, description, defaultWorkflow, issueTypeMappings }) => {
      const result = await service.createWorkflowScheme(name, description, defaultWorkflow, issueTypeMappings);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_workflow_scheme',
    {
      description: `Update a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateWorkflowScheme,
    },
    async ({ schemeId, name, description, defaultWorkflow, issueTypeMappings, updateDraftIfNeeded }) => {
      const result = await service.updateWorkflowScheme(schemeId, name, description, defaultWorkflow, issueTypeMappings, updateDraftIfNeeded);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_workflow_scheme',
    {
      description: `Delete a workflow scheme in the ${jiraInstanceType}. This is irreversible.`,
      inputSchema: jiraToolSchemas.deleteWorkflowScheme,
    },
    async ({ schemeId }) => {
      const result = await service.deleteWorkflowScheme(schemeId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_set_workflow_scheme_issue_type_mapping',
    {
      description: `Set the workflow mapping for a specific issue type in a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setWorkflowSchemeIssueTypeMapping,
    },
    async ({ schemeId, issueType, workflow, updateDraftIfNeeded }) => {
      const result = await service.setWorkflowSchemeIssueTypeMapping(schemeId, issueType, workflow, updateDraftIfNeeded);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_workflow_scheme_issue_type_mapping',
    {
      description: `Remove an issue type's workflow mapping from a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteWorkflowSchemeIssueTypeMapping,
    },
    async ({ schemeId, issueType, updateDraftIfNeeded }) => {
      const result = await service.deleteWorkflowSchemeIssueTypeMapping(schemeId, issueType, updateDraftIfNeeded);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_set_workflow_scheme_workflow_mapping',
    {
      description: `Set (add or replace) a workflow's issue type mapping in a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.setWorkflowSchemeWorkflowMapping,
    },
    async ({ schemeId, workflow, issueTypes, defaultMapping, workflowName, updateDraftIfNeeded }) => {
      const result = await service.setWorkflowSchemeWorkflowMapping(schemeId, workflow, issueTypes, defaultMapping, updateDraftIfNeeded, workflowName);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_workflow_scheme_workflow_mapping',
    {
      description: `Remove a workflow's mapping from a workflow scheme in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.deleteWorkflowSchemeWorkflowMapping,
    },
    async ({ schemeId, workflowName, updateDraftIfNeeded }) => {
      const result = await service.deleteWorkflowSchemeWorkflowMapping(schemeId, workflowName, updateDraftIfNeeded);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_all_screens',
    {
      description: `Get a paginated, searchable list of field screens in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getAllScreens,
    },
    async ({ search, expand, maxResults, startAt }) => {
      const result = await service.getAllScreens(search, expand, maxResults, startAt);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_add_field_to_default_screen',
    {
      description: `Add a field or custom field to the default screen's default tab in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addFieldToDefaultScreen,
    },
    async ({ fieldId }) => {
      const result = await service.addFieldToDefaultScreen(fieldId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_screen_available_fields',
    {
      description: `Get fields available to add to a screen (ones not already present on any tab) in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getScreenAvailableFields,
    },
    async ({ screenId }) => {
      const result = await service.getScreenAvailableFields(screenId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_screen_tabs',
    {
      description: `Get all tabs for a screen in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getScreenTabs,
    },
    async ({ screenId, projectKey }) => {
      const result = await service.getScreenTabs(screenId, projectKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_add_screen_tab',
    {
      description: `Add a new tab to a screen in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addScreenTab,
    },
    async ({ screenId, name }) => {
      const result = await service.addScreenTab(screenId, name);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_rename_screen_tab',
    {
      description: `Rename a tab on a screen in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.renameScreenTab,
    },
    async ({ screenId, tabId, name }) => {
      const result = await service.renameScreenTab(screenId, tabId, name);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_delete_screen_tab',
    {
      description: `Delete a tab from a screen in the ${jiraInstanceType}. The screen must have at least one tab remaining.`,
      inputSchema: jiraToolSchemas.deleteScreenTab,
    },
    async ({ screenId, tabId }) => {
      const result = await service.deleteScreenTab(screenId, tabId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_move_screen_tab',
    {
      description: `Move a tab to a new position on a screen in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.moveScreenTab,
    },
    async ({ screenId, tabId, pos }) => {
      const result = await service.moveScreenTab(screenId, tabId, pos);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_get_screen_tab_fields',
    {
      description: `Get all fields on a screen tab in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.getScreenTabFields,
    },
    async ({ screenId, tabId, projectKey }) => {
      const result = await service.getScreenTabFields(screenId, tabId, projectKey);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_add_field_to_screen_tab',
    {
      description: `Add a field to a screen tab in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.addFieldToScreenTab,
    },
    async ({ screenId, tabId, fieldId }) => {
      const result = await service.addFieldToScreenTab(screenId, tabId, fieldId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_remove_field_from_screen_tab',
    {
      description: `Remove a field from a screen tab in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.removeFieldFromScreenTab,
    },
    async ({ screenId, tabId, fieldId }) => {
      const result = await service.removeFieldFromScreenTab(screenId, tabId, fieldId);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_move_screen_tab_field',
    {
      description: `Move a field's position on a screen tab in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.moveScreenTabField,
    },
    async ({ screenId, tabId, fieldId, after, position }) => {
      const result = await service.moveScreenTabField(screenId, tabId, fieldId, after, position);

      return formatToolResponse(result);
    },
  );

  server.registerTool(
    'jira_update_screen_tab_field_show_when_empty',
    {
      description: `Update whether a field on a screen tab shows a 'no value' indicator when empty in the ${jiraInstanceType}`,
      inputSchema: jiraToolSchemas.updateScreenTabFieldShowWhenEmpty,
    },
    async ({ screenId, tabId, fieldId, showWhenEmpty }) => {
      const result = await service.updateScreenTabFieldShowWhenEmpty(screenId, tabId, fieldId, showWhenEmpty);

      return formatToolResponse(result);
    },
  );
}
