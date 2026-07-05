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

  describe('users and groups', () => {
    it('gets a user by username', async () => {
      const mockUser = { name: 'john.doe', displayName: 'John Doe' };
      (jira.users.getUserUser as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.getUser('john.doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(jira.users.getUserUser).toHaveBeenCalledWith({ username: 'john.doe' });
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
      (jira.users.createGroup as Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.createGroup('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGroup);
      expect(jira.users.createGroup).toHaveBeenCalledWith({ requestBody: { name: 'developers' } });
    });

    it('deletes a group', async () => {
      (jira.users.removeGroup as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteGroup('developers');

      expect(result.success).toBe(true);
      expect(jira.users.removeGroup).toHaveBeenCalledWith({ groupname: 'developers' });
    });

    it('gets group members', async () => {
      const mockMembers = { values: [{ name: 'john.doe' }] };
      (jira.users.getUsersFromGroup as Mock).mockResolvedValue(mockMembers);

      const result = await jiraService.getGroupUsers('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMembers);
    });

    it('adds a user to a group', async () => {
      const mockGroup = { name: 'developers' };
      (jira.users.addUserToGroup as Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.addUserToGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.users.addUserToGroup).toHaveBeenCalledWith({ groupname: 'developers', requestBody: { name: 'john.doe' } });
    });

    it('removes a user from a group', async () => {
      (jira.users.removeUserFromGroup as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUserFromGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(jira.users.removeUserFromGroup).toHaveBeenCalledWith({ groupname: 'developers', username: 'john.doe' });
    });

    it('finds groups matching a query', async () => {
      const mockSuggestions = { groups: [{ name: 'developers', html: '<b>dev</b>elopers' }] };
      (jira.users.findGroups as Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.findGroups('dev', 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(jira.users.findGroups).toHaveBeenCalledWith({ maxResults: '10', query: 'dev' });
    });

    it('finds users and groups matching a query', async () => {
      const mockMatches = { users: { users: [{ name: 'john.doe' }] }, groups: { groups: [{ name: 'developers' }] } };
      (jira.users.findUsersAndGroups as Mock).mockResolvedValue(mockMatches);

      const result = await jiraService.findUsersAndGroups('jo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMatches);
      expect(jira.users.findUsersAndGroups).toHaveBeenCalledWith({ query: 'jo' });
    });

    it('handles errors', async () => {
      (jira.users.getUserUser as Mock).mockRejectedValue(new Error('The requested user is not found'));

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
      expect(jira.users.createUser).toHaveBeenCalledWith({ requestBody: {
        name: 'jdoe',
        emailAddress: 'jdoe@example.com',
        displayName: 'John Doe',
        password: undefined,
        notification: undefined,
      } });
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
        { requestBody: { password: 'new-pass', currentPassword: undefined }, username: 'jdoe' },
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
      expect(jira.users.scheduleUserAnonymization).toHaveBeenCalledWith({ requestBody: { userKey: 'jdoe', newOwnerKey: 'admin' } });
    });

    it('gets user anonymization progress', async () => {
      const mockProgress = { status: 'IN_PROGRESS', currentProgress: 50 };
      (jira.users.getProgress as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getUserAnonymizationProgress(123);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(jira.users.getProgress).toHaveBeenCalledWith({ taskId: 123 });
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
      (jira.admin.getAllSystemAvatars as Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getSystemAvatars('project');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(jira.admin.getAllSystemAvatars).toHaveBeenCalledWith({ type: 'project' });
    });

    it('gets avatars for a type and owner', async () => {
      const mockAvatars = { system: [], custom: [{ id: '10001' }] };
      (jira.admin.getAvatars as Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getAvatars('project', 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(jira.admin.getAvatars).toHaveBeenCalledWith({ type: 'project', owningObjectId: 'TEST' });
    });

    it('uploads a temporary avatar', async () => {
      const mockCropping = { url: 'https://jira.example.com/temp/avatar.png', needsCropping: true };
      (jira.admin.storeTemporaryAvatarUsingMultiPart as Mock).mockResolvedValue(mockCropping);

      const result = await jiraService.uploadTemporaryAvatar('project', 'TEST', 'avatar.png', Buffer.from('img').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCropping);
      const [params] = (jira.admin.storeTemporaryAvatarUsingMultiPart as Mock).mock.calls[0] as [{ type: string; owningObjectId: string; formData: { file: File } }];
      expect(params.type).toBe('project');
      expect(params.owningObjectId).toBe('TEST');
      expect(params.formData.file).toBeInstanceOf(File);
      expect(params.formData.file.name).toBe('avatar.png');
    });

    it('creates an avatar from a temporary avatar', async () => {
      const mockAvatar = { id: '10001', owner: 'TEST' };
      (jira.admin.createAvatarFromTemporary as Mock).mockResolvedValue(mockAvatar);

      const result = await jiraService.createAvatarFromTemporary('project', 'TEST', 0, 0, 48, true, 'https://jira.example.com/temp/avatar.png');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatar);
      expect(jira.admin.createAvatarFromTemporary).toHaveBeenCalledWith({ type: 'project', owningObjectId: 'TEST', requestBody: {
        cropperOffsetX: 0,
        cropperOffsetY: 0,
        cropperWidth: 48,
        needsCropping: true,
        url: 'https://jira.example.com/temp/avatar.png',
      } });
    });

    it('deletes an avatar', async () => {
      (jira.admin.deleteAvatar as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAvatar(10001, 'project', 'TEST');

      expect(result.success).toBe(true);
      expect(jira.admin.deleteAvatar).toHaveBeenCalledWith({ id: 10001, type: 'project', owningObjectId: 'TEST' });
    });

    it('handles errors', async () => {
      (jira.admin.getAllSystemAvatars as Mock).mockRejectedValue(new Error('Invalid avatar type'));

      const result = await jiraService.getSystemAvatars('not-a-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid avatar type');
    });
  });
  describe('getMyPermissions', () => {
    it('gets permissions for the logged in user with no context', async () => {
      const mockPermissions = { permissions: { ADMINISTER: { id: '0', key: 'ADMINISTER', name: 'Administer', havePermission: true } } };
      (jira.users.getPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(jira.users.getPermissions).toHaveBeenCalledWith({});
    });

    it('gets permissions scoped to a project and issue', async () => {
      const mockPermissions = { permissions: {} };
      (jira.users.getPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions('TEST', '10000', 'TEST-1', '10001');

      expect(result.success).toBe(true);
      expect(jira.users.getPermissions).toHaveBeenCalledWith({ issueId: '10001', projectKey: 'TEST', issueKey: 'TEST-1', projectId: '10000' });
    });

    it('handles errors', async () => {
      (jira.users.getPermissions as Mock).mockRejectedValue(new Error('Not authenticated'));

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
      (jira.users.getAllPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(jira.users.getAllPermissions).toHaveBeenCalledWith({});
    });

    it('handles errors', async () => {
      (jira.users.getAllPermissions as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('my preferences', () => {
    it('gets a preference by key', async () => {
      (jira.users.getPreference as Mock).mockResolvedValue('dark');

      const result = await jiraService.getMyPreference('theme');

      expect(result.success).toBe(true);
      expect(result.data).toBe('dark');
      expect(jira.users.getPreference).toHaveBeenCalledWith({ key: 'theme' });
    });

    it('sets a preference by key', async () => {
      (jira.users.setPreference as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setMyPreference('theme', 'dark');

      expect(result.success).toBe(true);
      expect(jira.users.setPreference).toHaveBeenCalledWith({ key: 'theme', requestBody: 'dark' });
    });

    it('deletes a preference by key', async () => {
      (jira.users.removePreference as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteMyPreference('theme');

      expect(result.success).toBe(true);
      expect(jira.users.removePreference).toHaveBeenCalledWith({ key: 'theme' });
    });

    it('handles errors', async () => {
      (jira.users.getPreference as Mock).mockRejectedValue(new Error('Key not found.'));

      const result = await jiraService.getMyPreference('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Key not found.');
    });
  });
});
