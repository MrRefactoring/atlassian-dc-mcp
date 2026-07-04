import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  UserService,
  GroupService,
  UserGroupService,
  AdminUserService,
  AdminGroupService,
  AdminUsersService,
} from '../src/confluenceClient/index.js';
import { ConfluenceService } from '../src/confluenceService.js';

const USER = UserService as unknown as Record<string, Mock>;
const GROUP = GroupService as unknown as Record<string, Mock>;
const USER_GROUP = UserGroupService as unknown as Record<string, Mock>;
const ADMIN_USER = AdminUserService as unknown as Record<string, Mock>;
const ADMIN_GROUP = AdminGroupService as unknown as Record<string, Mock>;
const ADMIN_USERS = AdminUsersService as unknown as Record<string, Mock>;

vi.mock('../src/confluenceClient/index.js', () => ({
  UserService: {
    getCurrent: vi.fn(),
    getAnonymous: vi.fn(),
    getUser: vi.fn(),
    getUsers: vi.fn(),
    getGroups1: vi.fn(),
    updateUser1: vi.fn(),
    changePassword1: vi.fn(),
  },
  GroupService: {
    getGroup: vi.fn(),
    getGroups: vi.fn(),
    getMembers: vi.fn(),
    getNestedGroupMembers: vi.fn(),
  },
  UserGroupService: {
    update5: vi.fn(),
    delete6: vi.fn(),
  },
  AdminUserService: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
    delete1: vi.fn(),
    disable: vi.fn(),
    enable: vi.fn(),
    changePassword: vi.fn(),
  },
  AdminGroupService: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  AdminUsersService: {
    getActiveUsers: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
}));

describe('ConfluenceService users and groups', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets the current user', async () => {
    USER.getCurrent.mockResolvedValue({ username: 'me' });

    const result = await service.getCurrentUser('status');

    expect(USER.getCurrent).toHaveBeenCalledWith('status');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ username: 'me' });
  });

  it('forwards API errors when getting the current user', async () => {
    USER.getCurrent.mockRejectedValue(new Error('boom'));

    const result = await service.getCurrentUser();

    expect(result.success).toBe(false);
  });

  it('gets the anonymous user representation', async () => {
    USER.getAnonymous.mockResolvedValue({ username: 'anonymous' });

    const result = await service.getAnonymousUser();

    expect(USER.getAnonymous).toHaveBeenCalledWith(undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the anonymous user', async () => {
    USER.getAnonymous.mockRejectedValue(new Error('boom'));

    const result = await service.getAnonymousUser();

    expect(result.success).toBe(false);
  });

  it('gets a user by key or username', async () => {
    USER.getUser.mockResolvedValue({ username: 'jdoe' });

    const result = await service.getUser('key-1', undefined, 'status');

    expect(USER.getUser).toHaveBeenCalledWith('status', 'key-1', undefined);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a user', async () => {
    USER.getUser.mockRejectedValue(new Error('boom'));

    const result = await service.getUser('key-1');

    expect(result.success).toBe(false);
  });

  it('lists registered users with the default page-size limit', async () => {
    USER.getUsers.mockResolvedValue({ results: [] });

    await service.getUsers();

    expect(USER.getUsers).toHaveBeenCalledWith(undefined, '25', undefined);
  });

  it('forwards API errors when listing users', async () => {
    USER.getUsers.mockRejectedValue(new Error('boom'));

    const result = await service.getUsers();

    expect(result.success).toBe(false);
  });

  it('gets the groups a user is a member of', async () => {
    USER.getGroups1.mockResolvedValue({ results: [] });

    await service.getUserGroups(undefined, 'jdoe', 10, 0, 'status');

    expect(USER.getGroups1).toHaveBeenCalledWith('status', '10', '0', undefined, 'jdoe');
  });

  it('forwards API errors when getting user groups', async () => {
    USER.getGroups1.mockRejectedValue(new Error('boom'));

    const result = await service.getUserGroups(undefined, 'jdoe');

    expect(result.success).toBe(false);
  });

  it('updates the current user', async () => {
    USER.updateUser1.mockResolvedValue(undefined);

    const result = await service.updateCurrentUser('Jane Doe', 'jane@example.com', 'oldpw');

    expect(USER.updateUser1).toHaveBeenCalledWith({ fullName: 'Jane Doe', email: 'jane@example.com', currentPassword: 'oldpw' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating the current user', async () => {
    USER.updateUser1.mockRejectedValue(new Error('boom'));

    const result = await service.updateCurrentUser('Jane Doe');

    expect(result.success).toBe(false);
  });

  it('changes the current user password', async () => {
    USER.changePassword1.mockResolvedValue(undefined);

    const result = await service.changeCurrentUserPassword('newpw', 'oldpw');

    expect(USER.changePassword1).toHaveBeenCalledWith({ newPassword: 'newpw', oldPassword: 'oldpw' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when changing the current user password', async () => {
    USER.changePassword1.mockRejectedValue(new Error('boom'));

    const result = await service.changeCurrentUserPassword('newpw');

    expect(result.success).toBe(false);
  });

  it('gets a group by name', async () => {
    GROUP.getGroup.mockResolvedValue({ name: 'developers' });

    const result = await service.getGroup('developers', 'status');

    expect(GROUP.getGroup).toHaveBeenCalledWith('developers', 'status');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a group', async () => {
    GROUP.getGroup.mockRejectedValue(new Error('boom'));

    const result = await service.getGroup('developers');

    expect(result.success).toBe(false);
  });

  it('lists groups with the default page-size limit', async () => {
    GROUP.getGroups.mockResolvedValue({ results: [] });

    await service.getGroups();

    expect(GROUP.getGroups).toHaveBeenCalledWith(undefined, 25, undefined);
  });

  it('forwards API errors when listing groups', async () => {
    GROUP.getGroups.mockRejectedValue(new Error('boom'));

    const result = await service.getGroups();

    expect(result.success).toBe(false);
  });

  it('gets the members of a group', async () => {
    GROUP.getMembers.mockResolvedValue({ results: [] });

    await service.getGroupMembers('developers', 10, 0, 'status');

    expect(GROUP.getMembers).toHaveBeenCalledWith('developers', 'status', 10, 0);
  });

  it('forwards API errors when getting group members', async () => {
    GROUP.getMembers.mockRejectedValue(new Error('boom'));

    const result = await service.getGroupMembers('developers');

    expect(result.success).toBe(false);
  });

  it('gets the nested group members of a group', async () => {
    GROUP.getNestedGroupMembers.mockResolvedValue({ results: [] });

    await service.getNestedGroupMembers('developers', 10, 0, 'status');

    expect(GROUP.getNestedGroupMembers).toHaveBeenCalledWith('developers', 'status', 10, 0);
  });

  it('forwards API errors when getting nested group members', async () => {
    GROUP.getNestedGroupMembers.mockRejectedValue(new Error('boom'));

    const result = await service.getNestedGroupMembers('developers');

    expect(result.success).toBe(false);
  });

  it('adds a user to a group', async () => {
    USER_GROUP.update5.mockResolvedValue(undefined);

    const result = await service.addUserToGroup('jdoe', 'developers');

    expect(USER_GROUP.update5).toHaveBeenCalledWith('developers', 'jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when adding a user to a group', async () => {
    USER_GROUP.update5.mockRejectedValue(new Error('boom'));

    const result = await service.addUserToGroup('jdoe', 'developers');

    expect(result.success).toBe(false);
  });

  it('removes a user from a group', async () => {
    USER_GROUP.delete6.mockResolvedValue(undefined);

    const result = await service.removeUserFromGroup('jdoe', 'developers');

    expect(USER_GROUP.delete6).toHaveBeenCalledWith('developers', 'jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when removing a user from a group', async () => {
    USER_GROUP.delete6.mockRejectedValue(new Error('boom'));

    const result = await service.removeUserFromGroup('jdoe', 'developers');

    expect(result.success).toBe(false);
  });

  it('creates a user as an admin', async () => {
    ADMIN_USER.createUser.mockResolvedValue({ key: 'new-key' });

    const result = await service.adminCreateUser('jdoe', 'Jane Doe', 'jane@example.com', 'secret');

    expect(ADMIN_USER.createUser).toHaveBeenCalledWith({
      userName: 'jdoe',
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret',
      notifyViaEmail: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a user as an admin', async () => {
    ADMIN_USER.createUser.mockRejectedValue(new Error('boom'));

    const result = await service.adminCreateUser('jdoe', 'Jane Doe', 'jane@example.com');

    expect(result.success).toBe(false);
  });

  it('updates a user as an admin', async () => {
    ADMIN_USER.updateUser.mockResolvedValue(undefined);

    const result = await service.adminUpdateUser('jdoe', 'Jane Doe', 'jane@example.com');

    expect(ADMIN_USER.updateUser).toHaveBeenCalledWith('jdoe', { fullName: 'Jane Doe', email: 'jane@example.com' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating a user as an admin', async () => {
    ADMIN_USER.updateUser.mockRejectedValue(new Error('boom'));

    const result = await service.adminUpdateUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('deletes a user as an admin', async () => {
    ADMIN_USER.delete1.mockResolvedValue({ status: 'ACCEPTED' });

    const result = await service.adminDeleteUser('jdoe');

    expect(ADMIN_USER.delete1).toHaveBeenCalledWith('jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a user as an admin', async () => {
    ADMIN_USER.delete1.mockRejectedValue(new Error('boom'));

    const result = await service.adminDeleteUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('disables a user as an admin', async () => {
    ADMIN_USER.disable.mockResolvedValue(undefined);

    const result = await service.adminDisableUser('jdoe');

    expect(ADMIN_USER.disable).toHaveBeenCalledWith('jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when disabling a user as an admin', async () => {
    ADMIN_USER.disable.mockRejectedValue(new Error('boom'));

    const result = await service.adminDisableUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('enables a user as an admin', async () => {
    ADMIN_USER.enable.mockResolvedValue(undefined);

    const result = await service.adminEnableUser('jdoe');

    expect(ADMIN_USER.enable).toHaveBeenCalledWith('jdoe');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when enabling a user as an admin', async () => {
    ADMIN_USER.enable.mockRejectedValue(new Error('boom'));

    const result = await service.adminEnableUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('changes a user password as an admin', async () => {
    ADMIN_USER.changePassword.mockResolvedValue(undefined);

    const result = await service.adminChangeUserPassword('jdoe', 'newpw');

    expect(ADMIN_USER.changePassword).toHaveBeenCalledWith('jdoe', { password: 'newpw' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when changing a user password as an admin', async () => {
    ADMIN_USER.changePassword.mockRejectedValue(new Error('boom'));

    const result = await service.adminChangeUserPassword('jdoe', 'newpw');

    expect(result.success).toBe(false);
  });

  it('creates a group as an admin', async () => {
    ADMIN_GROUP.create.mockResolvedValue({ name: 'developers' });

    const result = await service.adminCreateGroup('developers');

    expect(ADMIN_GROUP.create).toHaveBeenCalledWith({ name: 'developers' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a group as an admin', async () => {
    ADMIN_GROUP.create.mockRejectedValue(new Error('boom'));

    const result = await service.adminCreateGroup('developers');

    expect(result.success).toBe(false);
  });

  it('deletes a group as an admin', async () => {
    ADMIN_GROUP.delete.mockResolvedValue(undefined);

    const result = await service.adminDeleteGroup('developers');

    expect(ADMIN_GROUP.delete).toHaveBeenCalledWith('developers');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a group as an admin', async () => {
    ADMIN_GROUP.delete.mockRejectedValue(new Error('boom'));

    const result = await service.adminDeleteGroup('developers');

    expect(result.success).toBe(false);
  });

  it('lists active users with the default page-size limit', async () => {
    ADMIN_USERS.getActiveUsers.mockResolvedValue({ results: [] });

    await service.adminGetActiveUsers();

    expect(ADMIN_USERS.getActiveUsers).toHaveBeenCalledWith(undefined, '25', undefined);
  });

  it('forwards API errors when listing active users', async () => {
    ADMIN_USERS.getActiveUsers.mockRejectedValue(new Error('boom'));

    const result = await service.adminGetActiveUsers();

    expect(result.success).toBe(false);
  });
});
