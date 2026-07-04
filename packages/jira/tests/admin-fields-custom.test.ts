import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jira-service.js';
import {
  CustomFieldOptionService,
  CustomFieldsService,
  FieldService,
  ScreensService,
} from '../src/jira-client/index.js';

vi.mock('../src/jira-client/index.js', () => ({
  CustomFieldsService: {
    getCustomFields: vi.fn(),
    bulkDeleteCustomFields: vi.fn(),
    getCustomFieldOptions: vi.fn(),
  },
  CustomFieldOptionService: {
    getCustomFieldOption: vi.fn(),
  },
  FieldService: {
    createCustomField: vi.fn(),
  },
  ScreensService: {
    getAllScreens: vi.fn(),
    addFieldToDefaultScreen: vi.fn(),
    getFieldsToAdd: vi.fn(),
    getAllTabs: vi.fn(),
    addTab: vi.fn(),
    renameTab: vi.fn(),
    deleteTab: vi.fn(),
    moveTab: vi.fn(),
    getAllFields: vi.fn(),
    addField: vi.fn(),
    removeField: vi.fn(),
    moveField: vi.fn(),
    updateShowWhenEmptyIndicator: vi.fn(),
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

  describe('custom fields admin', () => {
    it('gets custom fields with filters', async () => {
      const mockFields = { values: [{ id: 'customfield_10001', name: 'Story Points' }] };
      (CustomFieldsService.getCustomFields as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getCustomFields(undefined, ['textfield'], 'Story', 25, undefined, undefined, undefined, undefined, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(CustomFieldsService.getCustomFields).toHaveBeenCalledWith(
        undefined, 'textfield', 'Story', '25', undefined, undefined, undefined, undefined, '0'
      );
    });

    it('deletes custom fields in bulk', async () => {
      (CustomFieldsService.bulkDeleteCustomFields as Mock).mockResolvedValue({ deletedCustomFields: ['customfield_10001'] });

      const result = await jiraService.deleteCustomFields(['customfield_10001', 'customfield_10002']);

      expect(result.success).toBe(true);
      expect(CustomFieldsService.bulkDeleteCustomFields).toHaveBeenCalledWith('customfield_10001,customfield_10002');
    });

    it('gets custom field options', async () => {
      const mockOptions = { values: [{ id: '10001', value: 'Option A' }] };
      (CustomFieldsService.getCustomFieldOptions as Mock).mockResolvedValue(mockOptions);

      const result = await jiraService.getCustomFieldOptions('customfield_10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOptions);
      expect(CustomFieldsService.getCustomFieldOptions).toHaveBeenCalledWith(
        'customfield_10001', undefined, undefined, undefined, undefined, undefined, undefined, undefined
      );
    });

    it('gets a custom field option by id', async () => {
      const mockOption = { id: '10001', value: 'Option A' };
      (CustomFieldOptionService.getCustomFieldOption as Mock).mockResolvedValue(mockOption);

      const result = await jiraService.getCustomFieldOption('10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockOption);
      expect(CustomFieldOptionService.getCustomFieldOption).toHaveBeenCalledWith('10001');
    });

    it('creates a custom field', async () => {
      const mockField = { id: 'customfield_10099', name: 'Story Points' };
      (FieldService.createCustomField as Mock).mockResolvedValue(mockField);

      const result = await jiraService.createCustomField(
        'Story Points',
        'com.atlassian.jira.plugin.system.customfieldtypes:float'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockField);
      expect(FieldService.createCustomField).toHaveBeenCalledWith({
        name: 'Story Points',
        type: 'com.atlassian.jira.plugin.system.customfieldtypes:float',
        description: undefined,
        searcherKey: undefined,
        issueTypeIds: undefined,
        projectIds: undefined,
      });
    });

    it('handles errors', async () => {
      (FieldService.createCustomField as Mock).mockRejectedValue(new Error('Invalid custom field type'));

      const result = await jiraService.createCustomField('Bad Field', 'not-a-real-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid custom field type');
    });
  });
  describe('screens and default screen fields', () => {
    it('gets all screens with filters', async () => {
      const mockScreens = { values: [{ id: 1, name: 'Default Screen' }] };
      (ScreensService.getAllScreens as Mock).mockResolvedValue(mockScreens);

      const result = await jiraService.getAllScreens('Default', 'names', 25, 0);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockScreens);
      expect(ScreensService.getAllScreens).toHaveBeenCalledWith('Default', 'names', '25', '0');
    });

    it('adds a field to the default screen', async () => {
      (ScreensService.addFieldToDefaultScreen as Mock).mockResolvedValue(undefined);

      const result = await jiraService.addFieldToDefaultScreen('customfield_10001');

      expect(result.success).toBe(true);
      expect(ScreensService.addFieldToDefaultScreen).toHaveBeenCalledWith('customfield_10001');
    });

    it('gets available fields for a screen', async () => {
      const mockFields = [{ id: 'customfield_10002', name: 'Epic Link' }];
      (ScreensService.getFieldsToAdd as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getScreenAvailableFields(1);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(ScreensService.getFieldsToAdd).toHaveBeenCalledWith(1);
    });

    it('handles errors', async () => {
      (ScreensService.getAllScreens as Mock).mockRejectedValue(new Error('Not authorized'));

      const result = await jiraService.getAllScreens();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authorized');
    });
  });
  describe('screen tabs', () => {
    it('gets all tabs for a screen', async () => {
      const mockTabs = [{ id: 10, name: 'Field Tab' }];
      (ScreensService.getAllTabs as Mock).mockResolvedValue(mockTabs);

      const result = await jiraService.getScreenTabs(1, 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTabs);
      expect(ScreensService.getAllTabs).toHaveBeenCalledWith(1, 'TEST');
    });

    it('adds a tab to a screen', async () => {
      const mockTab = { id: 11, name: 'New Tab' };
      (ScreensService.addTab as Mock).mockResolvedValue(mockTab);

      const result = await jiraService.addScreenTab(1, 'New Tab');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTab);
      expect(ScreensService.addTab).toHaveBeenCalledWith(1, { name: 'New Tab' });
    });

    it('renames a tab on a screen', async () => {
      const mockTab = { id: 10, name: 'Renamed Tab' };
      (ScreensService.renameTab as Mock).mockResolvedValue(mockTab);

      const result = await jiraService.renameScreenTab(1, 10, 'Renamed Tab');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTab);
      expect(ScreensService.renameTab).toHaveBeenCalledWith(10, 1, { name: 'Renamed Tab' });
    });

    it('deletes a tab from a screen', async () => {
      (ScreensService.deleteTab as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteScreenTab(1, 10);

      expect(result.success).toBe(true);
      expect(ScreensService.deleteTab).toHaveBeenCalledWith(10, 1);
    });

    it('moves a tab on a screen', async () => {
      (ScreensService.moveTab as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveScreenTab(1, 10, 2);

      expect(result.success).toBe(true);
      expect(ScreensService.moveTab).toHaveBeenCalledWith(10, 1, 2);
    });

    it('handles errors', async () => {
      (ScreensService.deleteTab as Mock).mockRejectedValue(
        new Error('Tab can not be deleted, there has to be at least one tab left')
      );

      const result = await jiraService.deleteScreenTab(1, 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Tab can not be deleted, there has to be at least one tab left');
    });
  });
  describe('screen tab fields', () => {
    it('gets all fields for a tab', async () => {
      const mockFields = [{ id: 'summary', name: 'Summary' }];
      (ScreensService.getAllFields as Mock).mockResolvedValue(mockFields);

      const result = await jiraService.getScreenTabFields(1, 10, 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockFields);
      expect(ScreensService.getAllFields).toHaveBeenCalledWith(10, 1, 'TEST');
    });

    it('adds a field to a tab', async () => {
      const mockField = { id: 'customfield_10001', name: 'Story Points' };
      (ScreensService.addField as Mock).mockResolvedValue(mockField);

      const result = await jiraService.addFieldToScreenTab(1, 10, 'customfield_10001');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockField);
      expect(ScreensService.addField).toHaveBeenCalledWith(10, 1, { fieldId: 'customfield_10001' });
    });

    it('removes a field from a tab', async () => {
      (ScreensService.removeField as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeFieldFromScreenTab(1, 10, 'customfield_10001');

      expect(result.success).toBe(true);
      expect(ScreensService.removeField).toHaveBeenCalledWith(10, 1, 'customfield_10001');
    });

    it('moves a field on a tab', async () => {
      (ScreensService.moveField as Mock).mockResolvedValue(undefined);

      const result = await jiraService.moveScreenTabField(1, 10, 'customfield_10001', undefined, 'Last');

      expect(result.success).toBe(true);
      expect(ScreensService.moveField).toHaveBeenCalledWith(10, 1, 'customfield_10001', {
        after: undefined,
        position: 'Last',
      });
    });

    it("updates a field's show-when-empty indicator", async () => {
      (ScreensService.updateShowWhenEmptyIndicator as Mock).mockResolvedValue(undefined);

      const result = await jiraService.updateScreenTabFieldShowWhenEmpty(1, 10, 'customfield_10001', true);

      expect(result.success).toBe(true);
      expect(ScreensService.updateShowWhenEmptyIndicator).toHaveBeenCalledWith(10, 1, true, 'customfield_10001');
    });

    it('handles errors', async () => {
      (ScreensService.addField as Mock).mockRejectedValue(new Error('Field does not exist'));

      const result = await jiraService.addFieldToScreenTab(1, 10, 'not-a-field');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Field does not exist');
    });
  });
});
