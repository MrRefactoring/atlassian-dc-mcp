import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';

// jira.js groups its Data Center surface into sixty-one modules, so the stand-in conjures a module the first time one
// is asked for and a mock the first time a method on it is. `createJiraClient` hands back a provider, which is what
// lets the service re-read its credentials per call.
const jira = vi.hoisted(() => {
  const module_ = () => new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, { get: (t, p: string) => (t[p] ??= vi.fn()) });

  return new Proxy({} as Record<string, unknown>, {
    get: (t, p: string) => (t[p] ??= p === 'request' ? vi.fn() : module_()),
  }) as Record<string, ReturnType<typeof module_>> & { request: ReturnType<typeof vi.fn> };
});
vi.mock('../src/jiraClient.js', () => ({ createJiraClient: () => () => jira }));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('filters', () => {
    it('creates a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (jira.filters.createFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.createFilter('My open issues', 'assignee = currentUser() AND resolution = Unresolved');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(jira.filters.createFilter).toHaveBeenCalledWith({ name: 'My open issues',
        jql: 'assignee = currentUser() AND resolution = Unresolved',
        description: undefined,
        favourite: undefined });
    });

    it('gets a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (jira.filters.getFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.getFilter('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(jira.filters.getFilter).toHaveBeenCalledWith({ id: '10000' });
    });

    it('updates a filter', async () => {
      const mockFilter = { id: '10000', name: 'Renamed' };
      (jira.filters.editFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.updateFilter('10000', 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(jira.filters.editFilter).toHaveBeenCalledWith({ id: '10000', body: {
        name: 'Renamed',
        jql: undefined,
        description: undefined,
        favourite: undefined,
      } });
    });

    it('deletes a filter', async () => {
      (jira.filters.deleteFilter as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteFilter('10000');

      expect(result.success).toBe(true);
      expect(jira.filters.deleteFilter).toHaveBeenCalledWith({ id: '10000' });
    });

    it('gets favourite filters', async () => {
      const mockFilters = [{ id: '10000', name: 'My open issues' }];
      (jira.filters.getFavouriteFilters as Mock).mockResolvedValue(mockFilters);

      const result = await jiraService.getFavouriteFilters();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilters);
    });

    it('handles errors', async () => {
      (jira.filters.createFilter as Mock).mockRejectedValue(new Error('Filter name was not provided'));

      const result = await jiraService.createFilter('', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Filter name was not provided');
    });
  });
  describe('dashboards', () => {
    it('gets a list of dashboards', async () => {
      const mockDashboards = { dashboards: [{ id: '10000', name: 'My Dashboard' }] };
      (jira.dashboards.list as Mock).mockResolvedValue(mockDashboards);

      const result = await jiraService.getDashboards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboards);
      expect(jira.dashboards.list).toHaveBeenCalledWith({});
    });

    it('gets a single dashboard', async () => {
      const mockDashboard = { id: '10000', name: 'My Dashboard' };
      (jira.dashboards.getDashboard as Mock).mockResolvedValue(mockDashboard);

      const result = await jiraService.getDashboard('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboard);
      expect(jira.dashboards.getDashboard).toHaveBeenCalledWith({ id: '10000' });
    });

    it('handles errors', async () => {
      (jira.dashboards.getDashboard as Mock).mockRejectedValue(new Error('No dashboard with the specified id'));

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
      (jira.jql.getAutoComplete as Mock).mockResolvedValue(mockAutoComplete);

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAutoComplete);
      expect(jira.jql.getAutoComplete).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (jira.jql.getAutoComplete as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('getJqlFieldAutocomplete', () => {
    it('gets value suggestions for a JQL field', async () => {
      const mockSuggestions = { results: [{ value: 'In Progress', displayName: 'In Progress' }] };
      (jira.jql.getFieldAutoCompleteForQueryString as Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.getJqlFieldAutocomplete('status', 'In', 'in', undefined);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(jira.jql.getFieldAutoCompleteForQueryString).toHaveBeenCalledWith({ predicateName: 'in', fieldName: 'status', fieldValue: 'In' });
    });

    it('handles errors', async () => {
      (jira.jql.getFieldAutoCompleteForQueryString as Mock).mockRejectedValue(new Error('Bad request'));

      const result = await jiraService.getJqlFieldAutocomplete('status');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad request');
    });
  });

  describe('filter sharing', () => {
    it('lists filter share permissions', async () => {
      const mockPerms = [{ id: 10101, type: 'group' }];
      (jira.filters.getSharePermissions as Mock).mockResolvedValue(mockPerms);

      const result = await jiraService.getFilterSharePermissions('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPerms);
      expect(jira.filters.getSharePermissions).toHaveBeenCalledWith({ id: '10000' });
    });

    it('gets a single filter share permission', async () => {
      const mockPerm = { id: 10101, type: 'group' };
      (jira.filters.getSharePermission as Mock).mockResolvedValue(mockPerm);

      const result = await jiraService.getFilterSharePermission('10000', '10101');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPerm);
      expect(jira.filters.getSharePermission).toHaveBeenCalledWith({ id: '10000', permissionId: '10101' });
    });

    it('adds a group filter share permission', async () => {
      const mockPerms = [{ id: 10102, type: 'group' }];
      (jira.filters.addSharePermission as Mock).mockResolvedValue(mockPerms);

      const result = await jiraService.addFilterSharePermission('10000', 'group', undefined, 'jira-administrators');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPerms);
      expect(jira.filters.addSharePermission).toHaveBeenCalledWith({
        id: '10000',
        type: 'group', projectId: undefined, groupname: 'jira-administrators', projectRoleId: undefined });
    });

    it('deletes a filter share permission', async () => {
      (jira.filters.deleteSharePermission as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteFilterSharePermission('10000', '10101');

      expect(result.success).toBe(true);
      expect(jira.filters.deleteSharePermission).toHaveBeenCalledWith({ id: '10000', permissionId: '10101' });
    });

    it('gets the default share scope', async () => {
      (jira.filters.getDefaultShareScope as Mock).mockResolvedValue({ scope: 'PRIVATE' });

      const result = await jiraService.getDefaultShareScope();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ scope: 'PRIVATE' });
      expect(jira.filters.getDefaultShareScope).toHaveBeenCalledWith();
    });

    it('sets the default share scope', async () => {
      (jira.filters.setDefaultShareScope as Mock).mockResolvedValue({ scope: 'GLOBAL' });

      const result = await jiraService.setDefaultShareScope('GLOBAL');

      expect(result.success).toBe(true);
      expect(jira.filters.setDefaultShareScope).toHaveBeenCalledWith({ scope: 'GLOBAL' });
    });
  });
});
