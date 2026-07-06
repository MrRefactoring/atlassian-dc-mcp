import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  spaces: {
    space: vi.fn(),
    spaces: vi.fn(),
    createSpace: vi.fn(),
    createPrivateSpace: vi.fn(),
    update4: vi.fn(),
    delete5: vi.fn(),
    contents: vi.fn(),
    contentsWithType1: vi.fn(),
    archive: vi.fn(),
    restore: vi.fn(),
    get1: vi.fn(),
    get: vi.fn(),
    create3: vi.fn(),
    update3: vi.fn(),
    delete4: vi.fn(),
    getAllSpacePermissions: vi.fn(),
    setPermissions1: vi.fn(),
    getPermissionsGrantedToAnonymousUsers1: vi.fn(),
    getPermissionsGrantedToGroup1: vi.fn(),
    getPermissionsGrantedToUser1: vi.fn(),
    grantPermissionsToAnonymousUsers1: vi.fn(),
    grantPermissionsToGroup1: vi.fn(),
    grantPermissionsToUser1: vi.fn(),
    revokePermissionsFromAnonymousUser: vi.fn(),
    revokePermissionsFromGroup1: vi.fn(),
    revokePermissionsFromUser1: vi.fn(),
  },
}));

const SPACE = conf.spaces as unknown as Record<string, Mock>;
const SPACE_PROPERTY = conf.spaces as unknown as Record<string, Mock>;
const SPACE_PERMISSIONS = conf.spaces as unknown as Record<string, Mock>;

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService space CRUD', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets a single space by key', async () => {
    SPACE.space.mockResolvedValue({ key: 'DEV' });

    await service.getSpace('DEV', 'description.plain');

    expect(SPACE.space).toHaveBeenCalledWith({ spaceKey: 'DEV', expand: 'description.plain' });
  });

  it('lists spaces mapping filters onto the generated positional params', async () => {
    SPACE.spaces.mockResolvedValue({ results: [] });

    await service.getSpaces('DEV', 'global', 'current', 'team', true, 'description.plain', 10, 5);

    expect(SPACE.spaces).toHaveBeenCalledWith({
      start: '5',
      label: 'team',
      favourite: 'true',
      type: 'global',
      spaceKey: 'DEV',
      expand: 'description.plain',
      limit: '10',
      status: 'current',
    });
  });

  it('defaults the limit to the package page size when listing spaces', async () => {
    SPACE.spaces.mockResolvedValue({ results: [] });

    await service.getSpaces();

    expect(SPACE.spaces).toHaveBeenCalledWith({
      start: undefined,
      label: undefined,
      favourite: undefined,
      type: undefined,
      spaceKey: undefined,
      expand: undefined,
      limit: '25',
      status: undefined,
    });
  });

  it('creates a public space via createSpace', async () => {
    SPACE.createSpace.mockResolvedValue({ key: 'DEV' });
    const body = { key: 'DEV', name: 'Dev' };

    await service.createSpace(body);

    expect(SPACE.createSpace).toHaveBeenCalledWith({ requestBody: body });
    expect(SPACE.createPrivateSpace).not.toHaveBeenCalled();
  });

  it('creates a private space when isPrivate is true', async () => {
    SPACE.createPrivateSpace.mockResolvedValue({ key: 'DEV' });
    const body = { key: 'DEV', name: 'Dev' };

    await service.createSpace(body, true);

    expect(SPACE.createPrivateSpace).toHaveBeenCalledWith({ requestBody: body });
    expect(SPACE.createSpace).not.toHaveBeenCalled();
  });

  it('updates a space', async () => {
    SPACE.update4.mockResolvedValue({ key: 'DEV' });
    const body = { key: 'DEV', name: 'Dev renamed' };

    await service.updateSpace('DEV', body);

    expect(SPACE.update4).toHaveBeenCalledWith({ spaceKey: 'DEV', requestBody: body });
  });

  it('deletes a space', async () => {
    SPACE.delete5.mockResolvedValue({ id: 'task-1' });

    const result = await service.deleteSpace('DEV');

    expect(SPACE.delete5).toHaveBeenCalledWith({ spaceKey: 'DEV' });
    expect(result.success).toBe(true);
  });
});


describe('ConfluenceService space content & archival lifecycle', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets all space content when no type is given', async () => {
    SPACE.contents.mockResolvedValue({ results: [] });

    await service.getSpaceContent('DEV', undefined, 'history', 'root');

    expect(SPACE.contents).toHaveBeenCalledWith({ spaceKey: 'DEV', expand: 'history', depth: 'root', limit: '25', start: undefined });
    expect(SPACE.contentsWithType1).not.toHaveBeenCalled();
  });

  it('gets space content filtered by type', async () => {
    SPACE.contentsWithType1.mockResolvedValue({ results: [] });

    await service.getSpaceContent('DEV', 'page', undefined, undefined, 10, 5);

    expect(SPACE.contentsWithType1).toHaveBeenCalledWith({ spaceKey: 'DEV', type: 'page', expand: undefined, depth: undefined, limit: '10', start: '5' });
    expect(SPACE.contents).not.toHaveBeenCalled();
  });

  it('archives a space', async () => {
    SPACE.archive.mockResolvedValue(undefined);

    const result = await service.archiveSpace('DEV');

    expect(SPACE.archive).toHaveBeenCalledWith({ spaceKey: 'DEV' });
    expect(result.success).toBe(true);
  });

  it('restores a space', async () => {
    SPACE.restore.mockResolvedValue(undefined);

    const result = await service.restoreSpace('DEV');

    expect(SPACE.restore).toHaveBeenCalledWith({ spaceKey: 'DEV' });
    expect(result.success).toBe(true);
  });
});


describe('ConfluenceService space properties', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('lists space properties with the default page-size limit', async () => {
    SPACE_PROPERTY.get1.mockResolvedValue({ results: [] });

    await service.getSpaceProperties('DEV', 'version');

    expect(SPACE_PROPERTY.get1).toHaveBeenCalledWith({ spaceKey: 'DEV', expand: 'version', limit: '25', start: undefined });
  });

  it('gets a single space property by key', async () => {
    SPACE_PROPERTY.get.mockResolvedValue({ key: 'k' });

    await service.getSpaceProperty('DEV', 'my-key', 'space');

    expect(SPACE_PROPERTY.get).toHaveBeenCalledWith({ spaceKey: 'DEV', key: 'my-key', expand: 'space' });
  });

  it('creates a space property wrapping key and value into the body', async () => {
    SPACE_PROPERTY.create3.mockResolvedValue({ key: 'k' });

    await service.createSpaceProperty('DEV', 'my-key', { enabled: true });

    expect(SPACE_PROPERTY.create3).toHaveBeenCalledWith({ spaceKey: 'DEV', requestBody: { key: 'my-key', value: { enabled: true } } });
  });

  it('updates a space property with the new version number', async () => {
    SPACE_PROPERTY.update3.mockResolvedValue({ key: 'k' });

    await service.updateSpaceProperty('DEV', 'my-key', 'new-value', 2);

    expect(SPACE_PROPERTY.update3).toHaveBeenCalledWith({
      spaceKey: 'DEV',
      key: 'my-key',
      requestBody: { key: 'my-key', value: 'new-value', version: { number: 2 } },
    });
  });

  it('deletes a space property by key', async () => {
    SPACE_PROPERTY.delete4.mockResolvedValue(undefined);

    const result = await service.deleteSpaceProperty('DEV', 'my-key');

    expect(SPACE_PROPERTY.delete4).toHaveBeenCalledWith({ spaceKey: 'DEV', key: 'my-key' });
    expect(result.success).toBe(true);
  });
});


describe('ConfluenceService space permissions', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('gets all space permissions', async () => {
    SPACE_PERMISSIONS.getAllSpacePermissions.mockResolvedValue([{ spaceKey: 'DEV' }]);

    const result = await service.getAllSpacePermissions('DEV');

    expect(SPACE_PERMISSIONS.getAllSpacePermissions).toHaveBeenCalledWith({ spaceKey: 'DEV' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ spaceKey: 'DEV' }]);
  });

  it('forwards API errors when getting all space permissions', async () => {
    SPACE_PERMISSIONS.getAllSpacePermissions.mockRejectedValue(new Error('boom'));

    const result = await service.getAllSpacePermissions('DEV');

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('sets space permissions for multiple subjects', async () => {
    SPACE_PERMISSIONS.setPermissions1.mockResolvedValue({});
    const permissions = [{ userKey: 'u1', operations: [{ targetType: 'space', operationKey: 'read' }] }];

    const result = await service.setSpacePermissions('DEV', permissions);

    expect(SPACE_PERMISSIONS.setPermissions1).toHaveBeenCalledWith({ spaceKey: 'DEV', requestBody: permissions });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when setting space permissions', async () => {
    SPACE_PERMISSIONS.setPermissions1.mockRejectedValue(new Error('boom'));

    const result = await service.setSpacePermissions('DEV', []);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('gets anonymous space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToAnonymousUsers1.mockResolvedValue([]);

    const result = await service.getAnonymousSpacePermissions('DEV');

    expect(SPACE_PERMISSIONS.getPermissionsGrantedToAnonymousUsers1).toHaveBeenCalledWith({ spaceKey: 'DEV' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting anonymous space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToAnonymousUsers1.mockRejectedValue(new Error('boom'));

    const result = await service.getAnonymousSpacePermissions('DEV');

    expect(result.success).toBe(false);
  });

  it('gets group space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToGroup1.mockResolvedValue([]);

    const result = await service.getGroupSpacePermissions('DEV', 'developers');

    expect(SPACE_PERMISSIONS.getPermissionsGrantedToGroup1).toHaveBeenCalledWith({ spaceKey: 'DEV', groupName: 'developers' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting group space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToGroup1.mockRejectedValue(new Error('boom'));

    const result = await service.getGroupSpacePermissions('DEV', 'developers');

    expect(result.success).toBe(false);
  });

  it('gets user space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToUser1.mockResolvedValue([]);

    const result = await service.getUserSpacePermissions('DEV', 'user-key-1');

    expect(SPACE_PERMISSIONS.getPermissionsGrantedToUser1).toHaveBeenCalledWith({ spaceKey: 'DEV', userKey: 'user-key-1' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting user space permissions', async () => {
    SPACE_PERMISSIONS.getPermissionsGrantedToUser1.mockRejectedValue(new Error('boom'));

    const result = await service.getUserSpacePermissions('DEV', 'user-key-1');

    expect(result.success).toBe(false);
  });

  it('grants anonymous space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToAnonymousUsers1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.grantAnonymousSpacePermissions('DEV', operations);

    expect(SPACE_PERMISSIONS.grantPermissionsToAnonymousUsers1).toHaveBeenCalledWith({ spaceKey: 'DEV', requestBody: operations });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when granting anonymous space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToAnonymousUsers1.mockRejectedValue(new Error('boom'));

    const result = await service.grantAnonymousSpacePermissions('DEV', []);

    expect(result.success).toBe(false);
  });

  it('grants group space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToGroup1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.grantGroupSpacePermissions('DEV', 'developers', operations);

    expect(SPACE_PERMISSIONS.grantPermissionsToGroup1).toHaveBeenCalledWith({ spaceKey: 'DEV', groupName: 'developers', requestBody: operations });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when granting group space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToGroup1.mockRejectedValue(new Error('boom'));

    const result = await service.grantGroupSpacePermissions('DEV', 'developers', []);

    expect(result.success).toBe(false);
  });

  it('grants user space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToUser1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.grantUserSpacePermissions('DEV', 'user-key-1', operations);

    expect(SPACE_PERMISSIONS.grantPermissionsToUser1).toHaveBeenCalledWith({ spaceKey: 'DEV', userKey: 'user-key-1', requestBody: operations });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when granting user space permissions', async () => {
    SPACE_PERMISSIONS.grantPermissionsToUser1.mockRejectedValue(new Error('boom'));

    const result = await service.grantUserSpacePermissions('DEV', 'user-key-1', []);

    expect(result.success).toBe(false);
  });

  it('revokes anonymous space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromAnonymousUser.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.revokeAnonymousSpacePermissions('DEV', operations);

    expect(SPACE_PERMISSIONS.revokePermissionsFromAnonymousUser).toHaveBeenCalledWith({ spaceKey: 'DEV', requestBody: operations });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when revoking anonymous space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromAnonymousUser.mockRejectedValue(new Error('boom'));

    const result = await service.revokeAnonymousSpacePermissions('DEV', []);

    expect(result.success).toBe(false);
  });

  it('revokes group space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromGroup1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.revokeGroupSpacePermissions('DEV', 'developers', operations);

    expect(SPACE_PERMISSIONS.revokePermissionsFromGroup1).toHaveBeenCalledWith({ spaceKey: 'DEV', groupName: 'developers', requestBody: operations });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when revoking group space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromGroup1.mockRejectedValue(new Error('boom'));

    const result = await service.revokeGroupSpacePermissions('DEV', 'developers', []);

    expect(result.success).toBe(false);
  });

  it('revokes user space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromUser1.mockResolvedValue(undefined);
    const operations = [{ targetType: 'space', operationKey: 'read' }];

    const result = await service.revokeUserSpacePermissions('DEV', 'user-key-1', operations);

    expect(SPACE_PERMISSIONS.revokePermissionsFromUser1).toHaveBeenCalledWith({ spaceKey: 'DEV', userKey: 'user-key-1', requestBody: operations });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when revoking user space permissions', async () => {
    SPACE_PERMISSIONS.revokePermissionsFromUser1.mockRejectedValue(new Error('boom'));

    const result = await service.revokeUserSpacePermissions('DEV', 'user-key-1', []);

    expect(result.success).toBe(false);
  });
});
