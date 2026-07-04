import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';
import {
  DashboardService,
  FilterService,
  JqlService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/index.js', () => ({
  FilterService: {
    createFilter: vi.fn(),
    getFilter: vi.fn(),
    editFilter: vi.fn(),
    deleteFilter: vi.fn(),
    getFavouriteFilters: vi.fn(),
  },
  DashboardService: {
    list: vi.fn(),
    getDashboard: vi.fn(),
  },
  JqlService: {
    getAutoComplete: vi.fn(),
    getFieldAutoCompleteForQueryString: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
}));

describe('JiraService', () => {
  let jiraService: JiraService;

  beforeEach(() => {
    jiraService = new JiraService('test-host', 'test-token', undefined, () => 25);
    vi.clearAllMocks();
  });

  describe('filters', () => {
    it('creates a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (FilterService.createFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.createFilter('My open issues', 'assignee = currentUser() AND resolution = Unresolved');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(FilterService.createFilter).toHaveBeenCalledWith(undefined, {
        name: 'My open issues',
        jql: 'assignee = currentUser() AND resolution = Unresolved',
        description: undefined,
        favourite: undefined,
      });
    });

    it('gets a filter', async () => {
      const mockFilter = { id: '10000', name: 'My open issues' };
      (FilterService.getFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.getFilter('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(FilterService.getFilter).toHaveBeenCalledWith('10000', undefined);
    });

    it('updates a filter', async () => {
      const mockFilter = { id: '10000', name: 'Renamed' };
      (FilterService.editFilter as Mock).mockResolvedValue(mockFilter);

      const result = await jiraService.updateFilter('10000', 'Renamed');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilter);
      expect(FilterService.editFilter).toHaveBeenCalledWith('10000', undefined, {
        name: 'Renamed',
        jql: undefined,
        description: undefined,
        favourite: undefined,
      });
    });

    it('deletes a filter', async () => {
      (FilterService.deleteFilter as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteFilter('10000');

      expect(result.success).toBe(true);
      expect(FilterService.deleteFilter).toHaveBeenCalledWith('10000');
    });

    it('gets favourite filters', async () => {
      const mockFilters = [{ id: '10000', name: 'My open issues' }];
      (FilterService.getFavouriteFilters as Mock).mockResolvedValue(mockFilters);

      const result = await jiraService.getFavouriteFilters();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFilters);
    });

    it('handles errors', async () => {
      (FilterService.createFilter as Mock).mockRejectedValue(new Error('Filter name was not provided'));

      const result = await jiraService.createFilter('', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Filter name was not provided');
    });
  });
  describe('dashboards', () => {
    it('gets a list of dashboards', async () => {
      const mockDashboards = { dashboards: [{ id: '10000', name: 'My Dashboard' }] };
      (DashboardService.list as Mock).mockResolvedValue(mockDashboards);

      const result = await jiraService.getDashboards();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboards);
      expect(DashboardService.list).toHaveBeenCalledWith(undefined, undefined, undefined);
    });

    it('gets a single dashboard', async () => {
      const mockDashboard = { id: '10000', name: 'My Dashboard' };
      (DashboardService.getDashboard as Mock).mockResolvedValue(mockDashboard);

      const result = await jiraService.getDashboard('10000');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockDashboard);
      expect(DashboardService.getDashboard).toHaveBeenCalledWith('10000');
    });

    it('handles errors', async () => {
      (DashboardService.getDashboard as Mock).mockRejectedValue(new Error('No dashboard with the specified id'));

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
      (JqlService.getAutoComplete as Mock).mockResolvedValue(mockAutoComplete);

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAutoComplete);
      expect(JqlService.getAutoComplete).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (JqlService.getAutoComplete as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getJqlAutocompleteData();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('getJqlFieldAutocomplete', () => {
    it('gets value suggestions for a JQL field', async () => {
      const mockSuggestions = { results: [{ value: 'In Progress', displayName: 'In Progress' }] };
      (JqlService.getFieldAutoCompleteForQueryString as Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.getJqlFieldAutocomplete('status', 'In', 'in', undefined);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(JqlService.getFieldAutoCompleteForQueryString).toHaveBeenCalledWith(undefined, 'in', 'status', 'In');
    });

    it('handles errors', async () => {
      (JqlService.getFieldAutoCompleteForQueryString as Mock).mockRejectedValue(new Error('Bad request'));

      const result = await jiraService.getJqlFieldAutocomplete('status');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad request');
    });
  });
});
