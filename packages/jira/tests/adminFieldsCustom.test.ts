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

  describe('custom fields admin', () => {
    it('gets custom fields with filters', async () => {
      const mockFields = { values: [{ id: 'customfield_10001', name: 'Story Points' }] };
      (jira.admin.getCustomFields as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getCustomFields(undefined, ['textfield'], 'Story', 25, undefined, undefined, undefined, undefined, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(jira.admin.getCustomFields).toHaveBeenCalledWith(
        { types: 'textfield', search: 'Story', maxResults: '25', startAt: '0' },
      );
    });

    it('deletes custom fields in bulk', async () => {
      (jira.admin.bulkDeleteCustomFields as Mock).mockResolvedValue({ deletedCustomFields: ['customfield_10001'] });

      const result = await jiraService.deleteCustomFields(['customfield_10001', 'customfield_10002']);

      expect(result.success).toBe(true);
      expect(jira.admin.bulkDeleteCustomFields).toHaveBeenCalledWith({ ids: 'customfield_10001,customfield_10002' });
    });

    it('gets custom field options', async () => {
      const mockOptions = { values: [{ id: '10001', value: 'Option A' }] };
      (jira.admin.getCustomFieldOptions as Mock).mockResolvedValue(mockOptions);

      const result = await jiraService.getCustomFieldOptions('customfield_10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOptions);
      expect(jira.admin.getCustomFieldOptions).toHaveBeenCalledWith(
        { customFieldId: 'customfield_10001' },
      );
    });

    it('gets a custom field option by id', async () => {
      const mockOption = { id: '10001', value: 'Option A' };
      (jira.admin.getCustomFieldOption as Mock).mockResolvedValue(mockOption);

      const result = await jiraService.getCustomFieldOption('10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOption);
      expect(jira.admin.getCustomFieldOption).toHaveBeenCalledWith({ id: '10001' });
    });

    it('creates a custom field', async () => {
      const mockField = { id: 'customfield_10099', name: 'Story Points' };
      (jira.workflows.createCustomField as Mock).mockResolvedValue(mockField);

      const result = await jiraService.createCustomField(
        'Story Points',
        'com.atlassian.jira.plugin.system.customfieldtypes:float',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockField);
      expect(jira.workflows.createCustomField).toHaveBeenCalledWith({ requestBody: {
        name: 'Story Points',
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
        description: undefined,
        searcherKey: undefined,
        issueTypeIds: undefined,
        projectIds: undefined,
      } });
    });

    it('handles errors', async () => {
      (jira.workflows.createCustomField as Mock).mockRejectedValue(new Error('Invalid custom field type'));

      const result = await jiraService.createCustomField('Bad Field', 'not-a-real-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid custom field type');
    });
  });
  describe('screens and default screen fields', () => {
    it('gets all screens with filters', async () => {
      const mockScreens = { values: [{ id: 1, name: 'Default Screen' }] };
      (jira.workflows.getAllScreens as Mock).mockResolvedValue(mockScreens);

      const result = await jiraService.getAllScreens('Default', 'names', 25, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScreens);
      expect(jira.workflows.getAllScreens).toHaveBeenCalledWith({ search: 'Default', expand: 'names', maxResults: '25', startAt: '0' });
    });

    it('adds a field to the default screen', async () => {
      (jira.workflows.addFieldToDefaultScreen as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addFieldToDefaultScreen('customfield_10001');

      expect(result.success).toBe(true);
      expect(jira.workflows.addFieldToDefaultScreen).toHaveBeenCalledWith({ fieldId: 'customfield_10001' });
    });

    it('gets available fields for a screen', async () => {
      const mockFields = [{ id: 'customfield_10002', name: 'Epic Link' }];
      (jira.workflows.getFieldsToAdd as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getScreenAvailableFields(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(jira.workflows.getFieldsToAdd).toHaveBeenCalledWith({ screenId: 1 });
    });

    it('handles errors', async () => {
      (jira.workflows.getAllScreens as Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getAllScreens();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });
  describe('screen tabs', () => {
    it('gets all tabs for a screen', async () => {
      const mockTabs = [{ id: 10, name: 'Field Tab' }];
      (jira.workflows.getAllTabs as Mock).mockResolvedValue(mockTabs);

      const result = await jiraService.getScreenTabs(1, 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTabs);
      expect(jira.workflows.getAllTabs).toHaveBeenCalledWith({ screenId: 1, projectKey: 'TEST' });
    });

    it('adds a tab to a screen', async () => {
      const mockTab = { id: 11, name: 'New Tab' };
      (jira.workflows.addTab as Mock).mockResolvedValue(mockTab);

      const result = await jiraService.addScreenTab(1, 'New Tab');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTab);
      expect(jira.workflows.addTab).toHaveBeenCalledWith({ screenId: 1, requestBody: { name: 'New Tab' } });
    });

    it('renames a tab on a screen', async () => {
      const mockTab = { id: 10, name: 'Renamed Tab' };
      (jira.workflows.renameTab as Mock).mockResolvedValue(mockTab);

      const result = await jiraService.renameScreenTab(1, 10, 'Renamed Tab');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTab);
      expect(jira.workflows.renameTab).toHaveBeenCalledWith({ tabId: 10, screenId: 1, requestBody: { name: 'Renamed Tab' } });
    });

    it('deletes a tab from a screen', async () => {
      (jira.workflows.deleteTab as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteScreenTab(1, 10);

      expect(result.success).toBe(true);
      expect(jira.workflows.deleteTab).toHaveBeenCalledWith({ tabId: 10, screenId: 1 });
    });

    it('moves a tab on a screen', async () => {
      (jira.workflows.moveTab as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveScreenTab(1, 10, 2);

      expect(result.success).toBe(true);
      expect(jira.workflows.moveTab).toHaveBeenCalledWith({ tabId: 10, screenId: 1, pos: 2 });
    });

    it('handles errors', async () => {
      (jira.workflows.deleteTab as Mock).mockRejectedValue(
        new Error('Tab can not be deleted, there has to be at least one tab left'),
      );

      const result = await jiraService.deleteScreenTab(1, 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Tab can not be deleted, there has to be at least one tab left');
    });
  });
  describe('screen tab fields', () => {
    it('gets all fields for a tab', async () => {
      const mockFields = [{ id: 'summary', name: 'Summary' }];
      (jira.workflows.getAllFields as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getScreenTabFields(1, 10, 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(jira.workflows.getAllFields).toHaveBeenCalledWith({ tabId: 10, screenId: 1, projectKey: 'TEST' });
    });

    it('adds a field to a tab', async () => {
      const mockField = { id: 'customfield_10001', name: 'Story Points' };
      (jira.workflows.addField as Mock).mockResolvedValue(mockField);

      const result = await jiraService.addFieldToScreenTab(1, 10, 'customfield_10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockField);
      expect(jira.workflows.addField).toHaveBeenCalledWith({ tabId: 10, screenId: 1, requestBody: { fieldId: 'customfield_10001' } });
    });

    it('removes a field from a tab', async () => {
      (jira.workflows.removeField as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeFieldFromScreenTab(1, 10, 'customfield_10001');

      expect(result.success).toBe(true);
      expect(jira.workflows.removeField).toHaveBeenCalledWith({ tabId: 10, screenId: 1, id: 'customfield_10001' });
    });

    it('moves a field on a tab', async () => {
      (jira.workflows.moveField as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveScreenTabField(1, 10, 'customfield_10001', undefined, 'Last');

      expect(result.success).toBe(true);
      expect(jira.workflows.moveField).toHaveBeenCalledWith({ tabId: 10, screenId: 1, id: 'customfield_10001', requestBody: {
        after: undefined,
        position: 'Last',
      } });
    });

    it('updates a field\'s show-when-empty indicator', async () => {
      (jira.workflows.updateShowWhenEmptyIndicator as Mock).mockResolvedValue(undefined);

      const result = await jiraService.updateScreenTabFieldShowWhenEmpty(1, 10, 'customfield_10001', true);

      expect(result.success).toBe(true);
      expect(jira.workflows.updateShowWhenEmptyIndicator).toHaveBeenCalledWith({ tabId: 10, screenId: 1, newValue: true, id: 'customfield_10001' });
    });

    it('handles errors', async () => {
      (jira.workflows.addField as Mock).mockRejectedValue(new Error('Field does not exist'));

      const result = await jiraService.addFieldToScreenTab(1, 10, 'not-a-field');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Field does not exist');
    });
  });
});
