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

  describe('users and groups', () => {
    it('gets a user by username', async () => {
      const mockUser = { name: 'john.doe', displayName: 'John Doe' };
      (jira.users.getUser as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.getUser('john.doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(jira.users.getUser).toHaveBeenCalledWith({ username: 'john.doe' });
    });

    it('finds users by query', async () => {
      const mockUsers = [{ name: 'john.doe' }];
      (jira.users.findUsers as Mock).mockResolvedValue(mockUsers);

      const result = await jiraService.findUsers('john');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUsers);
      expect(jira.users.findUsers).toHaveBeenCalledWith({ username: 'john' });
    });

    it('finds assignable users for a project', async () => {
      const mockUsers = [{ name: 'john.doe' }];
      (jira.users.findAssignableUsers as Mock).mockResolvedValue(mockUsers);

      const result = await jiraService.findAssignableUsers('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUsers);
      expect(jira.users.findAssignableUsers).toHaveBeenCalledWith({ maxResults: 50, project: 'TEST' });
    });

    it('creates a group', async () => {
      const mockGroup = { name: 'developers' };
      (jira.groups.createGroup as Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.createGroup('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGroup);
      expect(jira.groups.createGroup).toHaveBeenCalledWith({ name: 'developers' });
    });

    it('deletes a group', async () => {
      (jira.groups.removeGroup as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteGroup('developers');

      expect(result.success).toBe(true);
      expect(jira.groups.removeGroup).toHaveBeenCalledWith({ groupname: 'developers' });
    });

    it('gets group members', async () => {
      const mockMembers = { values: [{ name: 'john.doe' }] };
      (jira.groups.getUsersFromGroup as Mock).mockResolvedValue(mockMembers);

      const result = await jiraService.getGroupUsers('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMembers);
    });

    it('adds a user to a group', async () => {
      const mockGroup = { name: 'developers' };
      (jira.groups.addUserToGroup as Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.addUserToGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.groups.addUserToGroup).toHaveBeenCalledWith({ groupname: 'developers', name: 'john.doe' });
    });

    it('removes a user from a group', async () => {
      (jira.groups.removeUserFromGroup as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUserFromGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.groups.removeUserFromGroup).toHaveBeenCalledWith({ groupname: 'developers', username: 'john.doe' });
    });

    it('finds groups matching a query', async () => {
      const mockSuggestions = { groups: [{ name: 'developers', html: '<b>dev</b>elopers' }] };
      (jira.groups.findGroups as Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.findGroups('dev', 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(jira.groups.findGroups).toHaveBeenCalledWith({ maxResults: '10', query: 'dev' });
    });

    it('finds users and groups matching a query', async () => {
      const mockMatches = { users: { users: [{ name: 'john.doe' }] }, groups: { groups: [{ name: 'developers' }] } };
      (jira.groupAndUserPicker.findUsersAndGroups as Mock).mockResolvedValue(mockMatches);

      const result = await jiraService.findUsersAndGroups('jo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMatches);
      expect(jira.groupAndUserPicker.findUsersAndGroups).toHaveBeenCalledWith({ query: 'jo' });
    });

    it('handles errors', async () => {
      (jira.users.getUser as Mock).mockRejectedValue(new Error('The requested user is not found'));

      const result = await jiraService.getUser('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested user is not found');
    });
  });
  describe('user admin', () => {
    it('creates a user', async () => {
      const mockUser = { name: 'jdoe', emailAddress: 'jdoe@example.com' };
      (jira.users.createUser as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.createUser('jdoe', 'jdoe@example.com', 'John Doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(jira.users.createUser).toHaveBeenCalledWith({ name: 'jdoe',
        emailAddress: 'jdoe@example.com',
        displayName: 'John Doe',
        password: undefined,
        notification: undefined });
    });

    it('removes a user', async () => {
      (jira.users.removeUser as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUser(undefined, 'jdoe');

      expect(result.success).toBe(true);
      expect(jira.users.removeUser).toHaveBeenCalledWith({ username: 'jdoe' });
    });

    it('changes a user password', async () => {
      (jira.users.changeUserPassword as Mock).mockResolvedValue(undefined);

      const result = await jiraService.changeUserPassword('new-pass', undefined, undefined, 'jdoe');

      expect(result.success).toBe(true);
      expect(jira.users.changeUserPassword).toHaveBeenCalledWith(
        { password: 'new-pass', currentPassword: undefined, username: 'jdoe' },
      );
    });

    it('validates user anonymization', async () => {
      const mockValidation = { username: 'jdoe', errors: {} };
      (jira.users.validateUserAnonymization as Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateUserAnonymization('jdoe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockValidation);
      expect(jira.users.validateUserAnonymization).toHaveBeenCalledWith({ userKey: 'jdoe' });
    });

    it('schedules user anonymization', async () => {
      const mockSchedule = { status: 'IN_PROGRESS' };
      (jira.users.scheduleUserAnonymization as Mock).mockResolvedValue(mockSchedule);

      const result = await jiraService.scheduleUserAnonymization('jdoe', 'admin');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchedule);
      expect(jira.users.scheduleUserAnonymization).toHaveBeenCalledWith({ userKey: 'jdoe', newOwnerKey: 'admin' });
    });

    it('gets user anonymization progress', async () => {
      const mockProgress = { status: 'IN_PROGRESS', currentProgress: 50 };
      (jira.users.getUserAnonymizationProgress as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getUserAnonymizationProgress(123);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(jira.users.getUserAnonymizationProgress).toHaveBeenCalledWith({ taskId: 123 });
    });

    it('handles errors', async () => {
      (jira.users.createUser as Mock).mockRejectedValue(new Error('A user with that username already exists'));

      const result = await jiraService.createUser('jdoe', 'jdoe@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('A user with that username already exists');
    });
  });
  describe('avatars', () => {
    it('gets system avatars for a type', async () => {
      const mockAvatars = { system: [{ id: '1', owner: 'jira' }] };
      (jira.avatars.getAllSystemAvatars as Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getSystemAvatars('project');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(jira.avatars.getAllSystemAvatars).toHaveBeenCalledWith({ type: 'project' });
    });

    it('gets avatars for a type and owner', async () => {
      const mockAvatars = { system: [], custom: [{ id: '10001' }] };
      (jira.avatars.getAvatars as Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getAvatars('project', 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(jira.avatars.getAvatars).toHaveBeenCalledWith({ type: 'project', owningObjectId: 'TEST' });
    });

    it('uploads a temporary avatar', async () => {
      const mockCropping = { url: 'https://jira.example.com/temp/avatar.png', needsCropping: true };
      (jira.avatars.storeTemporaryAvatarUsingMultiPart as Mock).mockResolvedValue(mockCropping);

      const result = await jiraService.uploadTemporaryAvatar('project', 'TEST', 'avatar.png', Buffer.from('img').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCropping);
      const [params] = (jira.avatars.storeTemporaryAvatarUsingMultiPart as Mock).mock.calls[0] as [{ type: string; owningObjectId: string; avatar: { filename: string; content: File } }];
      expect(params.type).toBe('project');
      expect(params.owningObjectId).toBe('TEST');
      expect(params.avatar.filename).toBe('avatar.png');
      expect(params.avatar.content).toBeInstanceOf(File);
    });

    it('creates an avatar from a temporary avatar', async () => {
      const mockAvatar = { id: '10001', owner: 'TEST' };
      (jira.avatars.createAvatarFromTemporary as Mock).mockResolvedValue(mockAvatar);

      const result = await jiraService.createAvatarFromTemporary('project', 'TEST', 0, 0, 48, true, 'https://jira.example.com/temp/avatar.png');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatar);
      expect(jira.avatars.createAvatarFromTemporary).toHaveBeenCalledWith({ type: 'project', owningObjectId: 'TEST', cropperOffsetX: 0,
        cropperOffsetY: 0,
        cropperWidth: 48,
        needsCropping: true,
        url: 'https://jira.example.com/temp/avatar.png' });
    });

    it('deletes an avatar', async () => {
      (jira.avatars.deleteAvatar as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAvatar(10001, 'project', 'TEST');

      expect(result.success).toBe(true);
      expect(jira.avatars.deleteAvatar).toHaveBeenCalledWith({ id: 10001, type: 'project', owningObjectId: 'TEST' });
    });

    it('handles errors', async () => {
      (jira.avatars.getAllSystemAvatars as Mock).mockRejectedValue(new Error('Invalid avatar type'));

      const result = await jiraService.getSystemAvatars('not-a-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid avatar type');
    });
  });
  describe('getMyPermissions', () => {
    it('gets permissions for the logged in user with no context', async () => {
      const mockPermissions = { permissions: { ADMINISTER: { id: '0', key: 'ADMINISTER', name: 'Administer', havePermission: true } } };
      (jira.permissions.getPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(jira.permissions.getPermissions).toHaveBeenCalledWith({});
    });

    it('gets permissions scoped to a project and issue', async () => {
      const mockPermissions = { permissions: {} };
      (jira.permissions.getPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions('TEST', '10000', 'TEST-1', '10001');

      expect(result.success).toBe(true);
      expect(jira.permissions.getPermissions).toHaveBeenCalledWith({ issueId: '10001', projectKey: 'TEST', issueKey: 'TEST-1', projectId: '10000' });
    });

    it('handles errors', async () => {
      (jira.permissions.getPermissions as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getMyPermissions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('getAllPermissions', () => {
    it('gets the full permission catalog', async () => {
      const mockPermissions = {
        permissions: {
          ADMINISTER: { id: '0', key: 'ADMINISTER', name: 'Administer Jira', type: 'GLOBAL' },
          BROWSE: { id: '10', key: 'BROWSE', name: 'Browse Projects', type: 'PROJECT' },
        },
      };
      (jira.permissions.getAllPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(jira.permissions.getAllPermissions).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (jira.permissions.getAllPermissions as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('my preferences', () => {
    it('gets a preference by key', async () => {
      (jira.myPreferences.getPreference as Mock).mockResolvedValue('dark');

      const result = await jiraService.getMyPreference('theme');

      expect(result.success).toBe(true);
      expect(result.data).toBe('dark');
      expect(jira.myPreferences.getPreference).toHaveBeenCalledWith({ key: 'theme' });
    });

    it('sets a preference by key', async () => {
      (jira.myPreferences.setPreference as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setMyPreference('theme', 'dark');

      expect(result.success).toBe(true);
      expect(jira.myPreferences.setPreference).toHaveBeenCalledWith({ key: 'theme', body: 'dark' });
    });

    it('deletes a preference by key', async () => {
      (jira.myPreferences.removePreference as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteMyPreference('theme');

      expect(result.success).toBe(true);
      expect(jira.myPreferences.removePreference).toHaveBeenCalledWith({ key: 'theme' });
    });

    it('handles errors', async () => {
      (jira.myPreferences.getPreference as Mock).mockRejectedValue(new Error('Key not found.'));

      const result = await jiraService.getMyPreference('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Key not found.');
    });
  });

  describe('issue-navigator columns', () => {
    it('gets the current user columns', async () => {
      const mockColumns = [{ label: 'Key', value: 'issuekey' }];
      (jira.users.defaultColumns as Mock).mockResolvedValue(mockColumns);

      const result = await jiraService.getMyColumns();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockColumns);
      expect(jira.users.defaultColumns).toHaveBeenCalledWith({ username: undefined });
    });

    it('sets user columns for a named user', async () => {
      (jira.users.setColumnsUrlEncoded as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setMyColumns(['issuekey', 'summary'], 'bob');

      expect(result.success).toBe(true);
      expect(jira.users.setColumnsUrlEncoded).toHaveBeenCalledWith({ username: 'bob', columns: ['issuekey', 'summary'] });
    });

    it('resets user columns', async () => {
      (jira.users.resetUserColumns as Mock).mockResolvedValue(undefined);

      const result = await jiraService.resetMyColumns();

      expect(result.success).toBe(true);
      expect(jira.users.resetUserColumns).toHaveBeenCalledWith({ username: undefined });
    });

    it('gets the system default columns', async () => {
      const mockColumns = [{ label: 'Key', value: 'issuekey' }];
      (jira.jiraSettings.getIssueNavigatorDefaultColumns as Mock).mockResolvedValue(mockColumns);

      const result = await jiraService.getDefaultColumns();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockColumns);
      expect(jira.jiraSettings.getIssueNavigatorDefaultColumns).toHaveBeenCalledWith();
    });

    it('sets the system default columns', async () => {
      (jira.jiraSettings.setIssueNavigatorDefaultColumnsForm as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setDefaultColumns(['issuekey', 'status']);

      expect(result.success).toBe(true);
      expect(jira.jiraSettings.setIssueNavigatorDefaultColumnsForm).toHaveBeenCalledWith({ columns: ['issuekey', 'status'] });
    });
  });
});
