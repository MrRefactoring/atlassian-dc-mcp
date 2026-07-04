import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { JiraService } from '../src/jiraService.js';
import {
  AvatarService,
  GroupService,
  GroupsService,
  GroupuserpickerService,
  MypermissionsService,
  MypreferencesService,
  PermissionsService,
  UniversalAvatarService,
  UserService,
} from '../src/jiraClient/index.js';

vi.mock('../src/jiraClient/index.js', () => ({
  UserService: {
    getUser1: vi.fn(),
    findUsers: vi.fn(),
    findAssignableUsers1: vi.fn(),
    createUser: vi.fn(),
    removeUser: vi.fn(),
    changeUserPassword: vi.fn(),
    validateUserAnonymization: vi.fn(),
    scheduleUserAnonymization: vi.fn(),
    getProgress1: vi.fn(),
  },
  GroupService: {
    createGroup: vi.fn(),
    removeGroup: vi.fn(),
    getUsersFromGroup: vi.fn(),
    addUserToGroup: vi.fn(),
    removeUserFromGroup: vi.fn(),
  },
  GroupsService: {
    findGroups: vi.fn(),
  },
  GroupuserpickerService: {
    findUsersAndGroups: vi.fn(),
  },
  AvatarService: {
    getAllSystemAvatars: vi.fn(),
  },
  UniversalAvatarService: {
    getAvatars: vi.fn(),
    storeTemporaryAvatarUsingMultiPart2: vi.fn(),
    createAvatarFromTemporary3: vi.fn(),
    deleteAvatar1: vi.fn(),
  },
  MypermissionsService: {
    getPermissions: vi.fn(),
  },
  PermissionsService: {
    getAllPermissions: vi.fn(),
  },
  MypreferencesService: {
    getPreference: vi.fn(),
    setPreference: vi.fn(),
    removePreference: vi.fn(),
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

  describe('users and groups', () => {
    it('gets a user by username', async () => {
      const mockUser = { name: 'john.doe', displayName: 'John Doe' };
      (UserService.getUser1 as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.getUser('john.doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(UserService.getUser1).toHaveBeenCalledWith(undefined, undefined, 'john.doe');
    });

    it('finds users by query', async () => {
      const mockUsers = [{ name: 'john.doe' }];
      (UserService.findUsers as Mock).mockResolvedValue(mockUsers);

      const result = await jiraService.findUsers('john');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUsers);
      expect(UserService.findUsers).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, 'john');
    });

    it('finds assignable users for a project', async () => {
      const mockUsers = [{ name: 'john.doe' }];
      (UserService.findAssignableUsers1 as Mock).mockResolvedValue(mockUsers);

      const result = await jiraService.findAssignableUsers('TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUsers);
      expect(UserService.findAssignableUsers1).toHaveBeenCalledWith(undefined, 50, 'TEST', undefined, undefined);
    });

    it('creates a group', async () => {
      const mockGroup = { name: 'developers' };
      (GroupService.createGroup as Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.createGroup('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockGroup);
      expect(GroupService.createGroup).toHaveBeenCalledWith({ name: 'developers' });
    });

    it('deletes a group', async () => {
      (GroupService.removeGroup as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteGroup('developers');

      expect(result.success).toBe(true);
      expect(GroupService.removeGroup).toHaveBeenCalledWith('developers', undefined);
    });

    it('gets group members', async () => {
      const mockMembers = { values: [{ name: 'john.doe' }] };
      (GroupService.getUsersFromGroup as Mock).mockResolvedValue(mockMembers);

      const result = await jiraService.getGroupUsers('developers');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMembers);
    });

    it('adds a user to a group', async () => {
      const mockGroup = { name: 'developers' };
      (GroupService.addUserToGroup as Mock).mockResolvedValue(mockGroup);

      const result = await jiraService.addUserToGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(GroupService.addUserToGroup).toHaveBeenCalledWith('developers', { name: 'john.doe' });
    });

    it('removes a user from a group', async () => {
      (GroupService.removeUserFromGroup as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUserFromGroup('developers', 'john.doe');

      expect(result.success).toBe(true);
      expect(GroupService.removeUserFromGroup).toHaveBeenCalledWith('developers', 'john.doe');
    });

    it('finds groups matching a query', async () => {
      const mockSuggestions = { groups: [{ name: 'developers', html: '<b>dev</b>elopers' }] };
      (GroupsService.findGroups as Mock).mockResolvedValue(mockSuggestions);

      const result = await jiraService.findGroups('dev', 10);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSuggestions);
      expect(GroupsService.findGroups).toHaveBeenCalledWith('10', 'dev', undefined, undefined);
    });

    it('finds users and groups matching a query', async () => {
      const mockMatches = { users: { users: [{ name: 'john.doe' }] }, groups: { groups: [{ name: 'developers' }] } };
      (GroupuserpickerService.findUsersAndGroups as Mock).mockResolvedValue(mockMatches);

      const result = await jiraService.findUsersAndGroups('jo');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockMatches);
      expect(GroupuserpickerService.findUsersAndGroups).toHaveBeenCalledWith(undefined, undefined, 'jo', undefined, undefined, undefined);
    });

    it('handles errors', async () => {
      (UserService.getUser1 as Mock).mockRejectedValue(new Error('The requested user is not found'));

      const result = await jiraService.getUser('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('The requested user is not found');
    });
  });
  describe('user admin', () => {
    it('creates a user', async () => {
      const mockUser = { name: 'jdoe', emailAddress: 'jdoe@example.com' };
      (UserService.createUser as Mock).mockResolvedValue(mockUser);

      const result = await jiraService.createUser('jdoe', 'jdoe@example.com', 'John Doe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockUser);
      expect(UserService.createUser).toHaveBeenCalledWith({
        name: 'jdoe',
        emailAddress: 'jdoe@example.com',
        displayName: 'John Doe',
        password: undefined,
        notification: undefined,
      });
    });

    it('removes a user', async () => {
      (UserService.removeUser as Mock).mockResolvedValue(undefined);

      const result = await jiraService.removeUser(undefined, 'jdoe');

      expect(result.success).toBe(true);
      expect(UserService.removeUser).toHaveBeenCalledWith(undefined, 'jdoe');
    });

    it('changes a user password', async () => {
      (UserService.changeUserPassword as Mock).mockResolvedValue(undefined);

      const result = await jiraService.changeUserPassword('new-pass', undefined, undefined, 'jdoe');

      expect(result.success).toBe(true);
      expect(UserService.changeUserPassword).toHaveBeenCalledWith(
        { password: 'new-pass', currentPassword: undefined },
        undefined,
        'jdoe',
      );
    });

    it('validates user anonymization', async () => {
      const mockValidation = { username: 'jdoe', errors: {} };
      (UserService.validateUserAnonymization as Mock).mockResolvedValue(mockValidation);

      const result = await jiraService.validateUserAnonymization('jdoe');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockValidation);
      expect(UserService.validateUserAnonymization).toHaveBeenCalledWith(undefined, 'jdoe');
    });

    it('schedules user anonymization', async () => {
      const mockSchedule = { status: 'IN_PROGRESS' };
      (UserService.scheduleUserAnonymization as Mock).mockResolvedValue(mockSchedule);

      const result = await jiraService.scheduleUserAnonymization('jdoe', 'admin');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSchedule);
      expect(UserService.scheduleUserAnonymization).toHaveBeenCalledWith({ userKey: 'jdoe', newOwnerKey: 'admin' });
    });

    it('gets user anonymization progress', async () => {
      const mockProgress = { status: 'IN_PROGRESS', currentProgress: 50 };
      (UserService.getProgress1 as Mock).mockResolvedValue(mockProgress);

      const result = await jiraService.getUserAnonymizationProgress(123);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockProgress);
      expect(UserService.getProgress1).toHaveBeenCalledWith(123);
    });

    it('handles errors', async () => {
      (UserService.createUser as Mock).mockRejectedValue(new Error('A user with that username already exists'));

      const result = await jiraService.createUser('jdoe', 'jdoe@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('A user with that username already exists');
    });
  });
  describe('avatars', () => {
    it('gets system avatars for a type', async () => {
      const mockAvatars = { system: [{ id: '1', owner: 'jira' }] };
      (AvatarService.getAllSystemAvatars as Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getSystemAvatars('project');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(AvatarService.getAllSystemAvatars).toHaveBeenCalledWith('project');
    });

    it('gets avatars for a type and owner', async () => {
      const mockAvatars = { system: [], custom: [{ id: '10001' }] };
      (UniversalAvatarService.getAvatars as Mock).mockResolvedValue(mockAvatars);

      const result = await jiraService.getAvatars('project', 'TEST');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatars);
      expect(UniversalAvatarService.getAvatars).toHaveBeenCalledWith('project', 'TEST');
    });

    it('uploads a temporary avatar', async () => {
      const mockCropping = { url: 'https://jira.example.com/temp/avatar.png', needsCropping: true };
      (UniversalAvatarService.storeTemporaryAvatarUsingMultiPart2 as Mock).mockResolvedValue(mockCropping);

      const result = await jiraService.uploadTemporaryAvatar('project', 'TEST', 'avatar.png', Buffer.from('img').toString('base64'));

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockCropping);
      const [calledType, calledOwner, calledFormData] = (UniversalAvatarService.storeTemporaryAvatarUsingMultiPart2 as Mock).mock.calls[0];
      expect(calledType).toBe('project');
      expect(calledOwner).toBe('TEST');
      expect((calledFormData as { file: File }).file).toBeInstanceOf(File);
      expect((calledFormData as { file: File }).file.name).toBe('avatar.png');
    });

    it('creates an avatar from a temporary avatar', async () => {
      const mockAvatar = { id: '10001', owner: 'TEST' };
      (UniversalAvatarService.createAvatarFromTemporary3 as Mock).mockResolvedValue(mockAvatar);

      const result = await jiraService.createAvatarFromTemporary('project', 'TEST', 0, 0, 48, true, 'https://jira.example.com/temp/avatar.png');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockAvatar);
      expect(UniversalAvatarService.createAvatarFromTemporary3).toHaveBeenCalledWith('project', 'TEST', {
        cropperOffsetX: 0,
        cropperOffsetY: 0,
        cropperWidth: 48,
        needsCropping: true,
        url: 'https://jira.example.com/temp/avatar.png',
      });
    });

    it('deletes an avatar', async () => {
      (UniversalAvatarService.deleteAvatar1 as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteAvatar(10001, 'project', 'TEST');

      expect(result.success).toBe(true);
      expect(UniversalAvatarService.deleteAvatar1).toHaveBeenCalledWith(10001, 'project', 'TEST');
    });

    it('handles errors', async () => {
      (AvatarService.getAllSystemAvatars as Mock).mockRejectedValue(new Error('Invalid avatar type'));

      const result = await jiraService.getSystemAvatars('not-a-type');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid avatar type');
    });
  });
  describe('getMyPermissions', () => {
    it('gets permissions for the logged in user with no context', async () => {
      const mockPermissions = { permissions: { ADMINISTER: { id: '0', key: 'ADMINISTER', name: 'Administer', havePermission: true } } };
      (MypermissionsService.getPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(MypermissionsService.getPermissions).toHaveBeenCalledWith(undefined, undefined, undefined, undefined);
    });

    it('gets permissions scoped to a project and issue', async () => {
      const mockPermissions = { permissions: {} };
      (MypermissionsService.getPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getMyPermissions('TEST', '10000', 'TEST-1', '10001');

      expect(result.success).toBe(true);
      expect(MypermissionsService.getPermissions).toHaveBeenCalledWith('10001', 'TEST', 'TEST-1', '10000');
    });

    it('handles errors', async () => {
      (MypermissionsService.getPermissions as Mock).mockRejectedValue(new Error('Not authenticated'));

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
      (PermissionsService.getAllPermissions as Mock).mockResolvedValue(mockPermissions);

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockPermissions);
      expect(PermissionsService.getAllPermissions).toHaveBeenCalledWith();
    });

    it('handles errors', async () => {
      (PermissionsService.getAllPermissions as Mock).mockRejectedValue(new Error('Not authenticated'));

      const result = await jiraService.getAllPermissions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });
  describe('my preferences', () => {
    it('gets a preference by key', async () => {
      (MypreferencesService.getPreference as Mock).mockResolvedValue('dark');

      const result = await jiraService.getMyPreference('theme');

      expect(result.success).toBe(true);
      expect(result.data).toBe('dark');
      expect(MypreferencesService.getPreference).toHaveBeenCalledWith('theme');
    });

    it('sets a preference by key', async () => {
      (MypreferencesService.setPreference as Mock).mockResolvedValue(undefined);

      const result = await jiraService.setMyPreference('theme', 'dark');

      expect(result.success).toBe(true);
      expect(MypreferencesService.setPreference).toHaveBeenCalledWith('theme', 'dark');
    });

    it('deletes a preference by key', async () => {
      (MypreferencesService.removePreference as Mock).mockResolvedValue(undefined);

      const result = await jiraService.deleteMyPreference('theme');

      expect(result.success).toBe(true);
      expect(MypreferencesService.removePreference).toHaveBeenCalledWith('theme');
    });

    it('handles errors', async () => {
      (MypreferencesService.getPreference as Mock).mockRejectedValue(new Error('Key not found.'));

      const result = await jiraService.getMyPreference('missing');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Key not found.');
    });
  });
});
