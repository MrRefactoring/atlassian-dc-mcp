import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

const jira = vi.hoisted(() => {
  const group = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return { issues: group(), projects: group(), users: group(), workflows: group(), agile: group(), admin: group(), request: vi.fn() };
});
vi.mock('../src/jiraClient/index.js', () => ({ createJiraClient: () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('filters', () => {
    it('creates a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (jira.admin.createFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.createFilter('My open issues', 'assignee = currentUser() AND resolution = Unresolved');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(jira.admin.createFilter).toHaveBeenCalledWith({ requestBody: {
        name: 'My open issues',
        jql: 'assignee = currentUser() AND resolution = Unresolved',
        description: undefined,
        favourite: undefined,
      } });
    });

    it('gets a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (jira.admin.getFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.getFilter('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(jira.admin.getFilter).toHaveBeenCalledWith({ id: '10000' });
    });

    it('updates a filter', async () => {
      const mockFilter = { id: '10000', name: 'Renamed' };
      (jira.admin.editFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.updateFilter('10000', 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(jira.admin.editFilter).toHaveBeenCalledWith({ id: '10000', requestBody: {
        name: 'Renamed',
        jql: undefined,
        description: undefined,
        favourite: undefined,
      } });
    });

    it('deletes a filter', async () => {
      (jira.admin.deleteFilter as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteFilter('10000');

      expect(result.success).toBe(true);
      expect(jira.admin.deleteFilter).toHaveBeenCalledWith({ id: '10000' });
    });

    it('gets favourite filters', async () => {
      const mockFilters = [{ id: '10000', name: 'My open issues' }];
      (jira.admin.getFavouriteFilters as Mock).mockResolvedValue(mockFilters);

      const result = await jiraService.getFavouriteFilters();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilters);
    });

    it('handles errors', async () => {
      (jira.admin.createFilter as Mock).mockRejectedValue(new Error('Filter name was not provided'));

      const result = await jiraService.createFilter('', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Filter name was not provided');
    });
  });
  describe('dashboards', () => {
    it('gets a list of dashboards', async () => {
      const mockDashboards = { dashboards: [{ id: '10000', name: 'My Dashboard' }] };
      (jira.admin.list as Mock).mockResolvedValue(mockDashboards);

      const result = await jiraService.getDashboards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboards);
      expect(jira.admin.list).toHaveBeenCalledWith({});
    });

    it('gets a single dashboard', async () => {
      const mockDashboard = { id: '10000', name: 'My Dashboard' };
      (jira.admin.getDashboard as Mock).mockResolvedValue(mockDashboard);

      const result = await jiraService.getDashboard('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboard);
      expect(jira.admin.getDashboard).toHaveBeenCalledWith({ id: '10000' });
    });

    it('handles errors', async () => {
      (jira.admin.getDashboard as Mock).mockRejectedValue(new Error('No dashboard with the specified id'));

      const result = await jiraService.getDashboard('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No dashboard with the specified id');
    });
  });
  describe('getJqlAutocompleteData', () => {
    it('gets JQL reserved words and function names', async () => {
      const mockAutoComplete = {
        jqlReservedWords: ['AND', 'OR', 'NOT'],
        visibleFieldNames: ['assignee', 'status'],
        visibleFunctionNames: ['currentUser()', 'now()'],
      };
      (jira.admin.getAutoComplete as Mock).mockResolvedValue(mockAutoComplete);

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAutoComplete);
      expect(jira.admin.getAutoComplete).toHaveBeenCalledWith({});
    });

    it('handles errors', async () => {
      (jira.admin.getAutoComplete as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('getJqlFieldAutocomplete', () => {
    it('gets value suggestions for a JQL field', async () => {
      const mockSuggestions = { results: [{ value: 'In Progress', displayName: 'In Progress' }] };
      (jira.admin.getFieldAutoCompleteForQueryString as Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.getJqlFieldAutocomplete('status', 'In', 'in', undefined);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(jira.admin.getFieldAutoCompleteForQueryString).toHaveBeenCalledWith({ predicateName: 'in', fieldName: 'status', fieldValue: 'In' });
    });

    it('handles errors', async () => {
      (jira.admin.getFieldAutoCompleteForQueryString as Mock).mockRejectedValue(new Error('Bad request'));

      const result = await jiraService.getJqlFieldAutocomplete('status');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad request');
    });
  });

  describe('filter sharing', () => {
    it('lists filter share permissions', async () => {
      const mockPerms = [{ id: 10101, type: 'group' }];
      (jira.admin.getFilterSharePermissions as Mock).mockResolvedValue(mockPerms);

      const result = await jiraService.getFilterSharePermissions('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPerms);
      expect(jira.admin.getFilterSharePermissions).toHaveBeenCalledWith({ id: '10000' });
    });

    it('gets a single filter share permission', async () => {
      const mockPerm = { id: 10101, type: 'group' };
      (jira.admin.getFilterSharePermission as Mock).mockResolvedValue(mockPerm);

      const result = await jiraService.getFilterSharePermission('10000', '10101');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPerm);
      expect(jira.admin.getFilterSharePermission).toHaveBeenCalledWith({ id: '10000', permissionId: '10101' });
    });

    it('adds a group filter share permission', async () => {
      const mockPerms = [{ id: 10102, type: 'group' }];
      (jira.admin.addFilterSharePermission as Mock).mockResolvedValue(mockPerms);

      const result = await jiraService.addFilterSharePermission('10000', 'group', undefined, 'jira-administrators');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPerms);
      expect(jira.admin.addFilterSharePermission).toHaveBeenCalledWith({
        id: '10000',
        requestBody: { type: 'group', projectId: undefined, groupname: 'jira-administrators', projectRoleId: undefined },
      });
    });

    it('deletes a filter share permission', async () => {
      (jira.admin.deleteFilterSharePermission as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteFilterSharePermission('10000', '10101');

      expect(result.success).toBe(true);
      expect(jira.admin.deleteFilterSharePermission).toHaveBeenCalledWith({ id: '10000', permissionId: '10101' });
    });

    it('gets the default share scope', async () => {
      (jira.admin.getDefaultShareScope as Mock).mockResolvedValue({ scope: 'PRIVATE' });

      const result = await jiraService.getDefaultShareScope();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ scope: 'PRIVATE' });
      expect(jira.admin.getDefaultShareScope).toHaveBeenCalledWith({});
    });

    it('sets the default share scope', async () => {
      (jira.admin.setDefaultShareScope as Mock).mockResolvedValue({ scope: 'GLOBAL' });

      const result = await jiraService.setDefaultShareScope('GLOBAL');

      expect(result.success).toBe(true);
      expect(jira.admin.setDefaultShareScope).toHaveBeenCalledWith({ requestBody: { scope: 'GLOBAL' } });
    });
  });
});
