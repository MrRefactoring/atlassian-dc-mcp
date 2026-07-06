import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  users: {
    getCurrent: vi.fn(),
    getAnonymous: vi.fn(),
    getUser: vi.fn(),
    getUsers: vi.fn(),
    getGroups1: vi.fn(),
    updateUser1: vi.fn(),
    changePassword1: vi.fn(),
    getGroup: vi.fn(),
    getGroups: vi.fn(),
    getMembers: vi.fn(),
    getNestedGroupMembers: vi.fn(),
    update5: vi.fn(),
    delete6: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    delete1: vi.fn(),
    disable: vi.fn(),
    enable: vi.fn(),
    changePassword: vi.fn(),
    create: vi.fn(),
    deleteGroup: vi.fn(),
    getActiveUsers: vi.fn(),
  },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService users and groups', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets the current user', async () => {
    conf.users.getCurrent.mockResolvedValue({ username: 'me' });

    const result = await service.getCurrentUser('status');

    expect(conf.users.getCurrent).toHaveBeenCalledWith({ expand: 'status' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ username: 'me' });
  });

  it('forwards API errors when getting the current user', async () => {
    conf.users.getCurrent.mockRejectedValue(new Error('boom'));

    const result = await service.getCurrentUser();

    expect(result.success).toBe(false);
  });

  it('gets the anonymous user representation', async () => {
    conf.users.getAnonymous.mockResolvedValue({ username: 'anonymous' });

    const result = await service.getAnonymousUser();

    expect(conf.users.getAnonymous).toHaveBeenCalledWith({ expand: undefined });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the anonymous user', async () => {
    conf.users.getAnonymous.mockRejectedValue(new Error('boom'));

    const result = await service.getAnonymousUser();

    expect(result.success).toBe(false);
  });

  it('gets a user by key or username', async () => {
    conf.users.getUser.mockResolvedValue({ username: 'jdoe' });

    const result = await service.getUser('key-1', undefined, 'status');

    expect(conf.users.getUser).toHaveBeenCalledWith({ expand: 'status', key: 'key-1', username: undefined });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a user', async () => {
    conf.users.getUser.mockRejectedValue(new Error('boom'));

    const result = await service.getUser('key-1');

    expect(result.success).toBe(false);
  });

  it('lists registered users with the default page-size limit', async () => {
    conf.users.getUsers.mockResolvedValue({ results: [] });

    await service.getUsers();

    expect(conf.users.getUsers).toHaveBeenCalledWith({ expand: undefined, limit: '25', start: undefined });
  });

  it('forwards API errors when listing users', async () => {
    conf.users.getUsers.mockRejectedValue(new Error('boom'));

    const result = await service.getUsers();

    expect(result.success).toBe(false);
  });

  it('gets the groups a user is a member of', async () => {
    conf.users.getGroups1.mockResolvedValue({ results: [] });

    await service.getUserGroups(undefined, 'jdoe', 10, 0, 'status');

    expect(conf.users.getGroups1).toHaveBeenCalledWith({ expand: 'status', limit: '10', start: '0', key: undefined, username: 'jdoe' });
  });

  it('forwards API errors when getting user groups', async () => {
    conf.users.getGroups1.mockRejectedValue(new Error('boom'));

    const result = await service.getUserGroups(undefined, 'jdoe');

    expect(result.success).toBe(false);
  });

  it('updates the current user', async () => {
    conf.users.updateUser1.mockResolvedValue(undefined);

    const result = await service.updateCurrentUser('Jane Doe', 'jane@example.com', 'oldpw');

    expect(conf.users.updateUser1).toHaveBeenCalledWith({ requestBody: { fullName: 'Jane Doe', email: 'jane@example.com', currentPassword: 'oldpw' } });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating the current user', async () => {
    conf.users.updateUser1.mockRejectedValue(new Error('boom'));

    const result = await service.updateCurrentUser('Jane Doe');

    expect(result.success).toBe(false);
  });

  it('changes the current user password', async () => {
    conf.users.changePassword1.mockResolvedValue(undefined);

    const result = await service.changeCurrentUserPassword('newpw', 'oldpw');

    expect(conf.users.changePassword1).toHaveBeenCalledWith({ requestBody: { newPassword: 'newpw', oldPassword: 'oldpw' } });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when changing the current user password', async () => {
    conf.users.changePassword1.mockRejectedValue(new Error('boom'));

    const result = await service.changeCurrentUserPassword('newpw');

    expect(result.success).toBe(false);
  });

  it('gets a group by name', async () => {
    conf.users.getGroup.mockResolvedValue({ name: 'developers' });

    const result = await service.getGroup('developers', 'status');

    expect(conf.users.getGroup).toHaveBeenCalledWith({ groupName: 'developers', expand: 'status' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a group', async () => {
    conf.users.getGroup.mockRejectedValue(new Error('boom'));

    const result = await service.getGroup('developers');

    expect(result.success).toBe(false);
  });

  it('lists groups with the default page-size limit', async () => {
    conf.users.getGroups.mockResolvedValue({ results: [] });

    await service.getGroups();

    expect(conf.users.getGroups).toHaveBeenCalledWith({ expand: undefined, limit: 25, start: undefined });
  });

  it('forwards API errors when listing groups', async () => {
    conf.users.getGroups.mockRejectedValue(new Error('boom'));

    const result = await service.getGroups();

    expect(result.success).toBe(false);
  });

  it('gets the members of a group', async () => {
    conf.users.getMembers.mockResolvedValue({ results: [] });

    await service.getGroupMembers('developers', 10, 0, 'status');

    expect(conf.users.getMembers).toHaveBeenCalledWith({ groupName: 'developers', expand: 'status', limit: 10, start: 0 });
  });

  it('forwards API errors when getting group members', async () => {
    conf.users.getMembers.mockRejectedValue(new Error('boom'));

    const result = await service.getGroupMembers('developers');

    expect(result.success).toBe(false);
  });

  it('gets the nested group members of a group', async () => {
    conf.users.getNestedGroupMembers.mockResolvedValue({ results: [] });

    await service.getNestedGroupMembers('developers', 10, 0, 'status');

    expect(conf.users.getNestedGroupMembers).toHaveBeenCalledWith({ groupName: 'developers', expand: 'status', limit: 10, start: 0 });
  });

  it('forwards API errors when getting nested group members', async () => {
    conf.users.getNestedGroupMembers.mockRejectedValue(new Error('boom'));

    const result = await service.getNestedGroupMembers('developers');

    expect(result.success).toBe(false);
  });

  it('adds a user to a group', async () => {
    conf.users.update5.mockResolvedValue(undefined);

    const result = await service.addUserToGroup('jdoe', 'developers');

    expect(conf.users.update5).toHaveBeenCalledWith({ groupName: 'developers', username: 'jdoe' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when adding a user to a group', async () => {
    conf.users.update5.mockRejectedValue(new Error('boom'));

    const result = await service.addUserToGroup('jdoe', 'developers');

    expect(result.success).toBe(false);
  });

  it('removes a user from a group', async () => {
    conf.users.delete6.mockResolvedValue(undefined);

    const result = await service.removeUserFromGroup('jdoe', 'developers');

    expect(conf.users.delete6).toHaveBeenCalledWith({ groupName: 'developers', username: 'jdoe' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when removing a user from a group', async () => {
    conf.users.delete6.mockRejectedValue(new Error('boom'));

    const result = await service.removeUserFromGroup('jdoe', 'developers');

    expect(result.success).toBe(false);
  });

  it('creates a user as an admin', async () => {
    conf.users.createUser.mockResolvedValue({ key: 'new-key' });

    const result = await service.adminCreateUser('jdoe', 'Jane Doe', 'jane@example.com', 'secret');

    expect(conf.users.createUser).toHaveBeenCalledWith({
      requestBody: {
        userName: 'jdoe',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secret',
        notifyViaEmail: undefined,
      },
    });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a user as an admin', async () => {
    conf.users.createUser.mockRejectedValue(new Error('boom'));

    const result = await service.adminCreateUser('jdoe', 'Jane Doe', 'jane@example.com');

    expect(result.success).toBe(false);
  });

  it('updates a user as an admin', async () => {
    conf.users.updateUser.mockResolvedValue(undefined);

    const result = await service.adminUpdateUser('jdoe', 'Jane Doe', 'jane@example.com');

    expect(conf.users.updateUser).toHaveBeenCalledWith({ username: 'jdoe', requestBody: { fullName: 'Jane Doe', email: 'jane@example.com' } });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating a user as an admin', async () => {
    conf.users.updateUser.mockRejectedValue(new Error('boom'));

    const result = await service.adminUpdateUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('deletes a user as an admin', async () => {
    conf.users.delete1.mockResolvedValue({ status: 'ACCEPTED' });

    const result = await service.adminDeleteUser('jdoe');

    expect(conf.users.delete1).toHaveBeenCalledWith({ username: 'jdoe' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a user as an admin', async () => {
    conf.users.delete1.mockRejectedValue(new Error('boom'));

    const result = await service.adminDeleteUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('disables a user as an admin', async () => {
    conf.users.disable.mockResolvedValue(undefined);

    const result = await service.adminDisableUser('jdoe');

    expect(conf.users.disable).toHaveBeenCalledWith({ username: 'jdoe' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when disabling a user as an admin', async () => {
    conf.users.disable.mockRejectedValue(new Error('boom'));

    const result = await service.adminDisableUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('enables a user as an admin', async () => {
    conf.users.enable.mockResolvedValue(undefined);

    const result = await service.adminEnableUser('jdoe');

    expect(conf.users.enable).toHaveBeenCalledWith({ username: 'jdoe' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when enabling a user as an admin', async () => {
    conf.users.enable.mockRejectedValue(new Error('boom'));

    const result = await service.adminEnableUser('jdoe');

    expect(result.success).toBe(false);
  });

  it('changes a user password as an admin', async () => {
    conf.users.changePassword.mockResolvedValue(undefined);

    const result = await service.adminChangeUserPassword('jdoe', 'newpw');

    expect(conf.users.changePassword).toHaveBeenCalledWith({ username: 'jdoe', requestBody: { password: 'newpw' } });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when changing a user password as an admin', async () => {
    conf.users.changePassword.mockRejectedValue(new Error('boom'));

    const result = await service.adminChangeUserPassword('jdoe', 'newpw');

    expect(result.success).toBe(false);
  });

  it('creates a group as an admin', async () => {
    conf.users.create.mockResolvedValue({ name: 'developers' });

    const result = await service.adminCreateGroup('developers');

    expect(conf.users.create).toHaveBeenCalledWith({ requestBody: { name: 'developers' } });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a group as an admin', async () => {
    conf.users.create.mockRejectedValue(new Error('boom'));

    const result = await service.adminCreateGroup('developers');

    expect(result.success).toBe(false);
  });

  it('deletes a group as an admin', async () => {
    conf.users.deleteGroup.mockResolvedValue(undefined);

    const result = await service.adminDeleteGroup('developers');

    expect(conf.users.deleteGroup).toHaveBeenCalledWith({ groupName: 'developers' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a group as an admin', async () => {
    conf.users.deleteGroup.mockRejectedValue(new Error('boom'));

    const result = await service.adminDeleteGroup('developers');

    expect(result.success).toBe(false);
  });

  it('lists active users with the default page-size limit', async () => {
    conf.users.getActiveUsers.mockResolvedValue({ results: [] });

    await service.adminGetActiveUsers();

    expect(conf.users.getActiveUsers).toHaveBeenCalledWith({ expand: undefined, limit: '25', start: undefined });
  });

  it('forwards API errors when listing active users', async () => {
    conf.users.getActiveUsers.mockRejectedValue(new Error('boom'));

    const result = await service.adminGetActiveUsers();

    expect(result.success).toBe(false);
  });
});
