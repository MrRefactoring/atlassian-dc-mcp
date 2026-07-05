import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';

const bb = vi.hoisted(() => ({
  authentication: {
    getProjectAccessTokens: vi.fn(),
    getRepositoryAccessTokens: vi.fn(),
    getUserAccessTokens: vi.fn(),
    createProjectAccessToken: vi.fn(),
    createRepositoryAccessToken: vi.fn(),
    createUserAccessToken: vi.fn(),
    deleteProjectAccessToken: vi.fn(),
    deleteRepositoryAccessToken: vi.fn(),
    deleteUserAccessToken: vi.fn(),
    addSshKey: vi.fn(),
    deleteSshKey: vi.fn(),
    getSshKeys: vi.fn(),
  },
  security: {
    addKey: vi.fn(),
    deleteKey: vi.fn(),
    getKeysForUser: vi.fn(),
  },
}));

vi.mock('../src/bitbucketClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createBitbucketClient: () => bb,
}));

describe('BitbucketService', () => {
  let bitbucketService: BitbucketService;

  beforeEach(() => {
    bitbucketService = new BitbucketService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  describe('getAccessTokens', () => {
    it('should get personal access tokens for a user', async () => {
      const mockTokens = { values: [{ id: 1, name: 'my-token' }], size: 1, isLastPage: true };
      (bb.authentication.getUserAccessTokens as Mock).mockResolvedValue(mockTokens);

      const result = await bitbucketService.getAccessTokens('user', 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTokens);
      expect(bb.authentication.getUserAccessTokens).toHaveBeenCalledWith({ userSlug: 'jsmith', start: undefined, limit: 25 });
    });

    it('should get access tokens for a project', async () => {
      const mockTokens = { values: [], size: 0, isLastPage: true };
      (bb.authentication.getProjectAccessTokens as Mock).mockResolvedValue(mockTokens);

      const result = await bitbucketService.getAccessTokens('project', undefined, 'proj');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTokens);
      expect(bb.authentication.getProjectAccessTokens).toHaveBeenCalledWith({ projectKey: 'PROJ', start: undefined, limit: 25 });
    });

    it('should get access tokens for a repository, uppercasing/lowercasing keys and passing pagination', async () => {
      const mockTokens = { values: [], size: 0, isLastPage: true };
      (bb.authentication.getRepositoryAccessTokens as Mock).mockResolvedValue(mockTokens);

      const result = await bitbucketService.getAccessTokens('repo', undefined, 'proj', 'Test-Repo', 10, 5);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTokens);
      expect(bb.authentication.getRepositoryAccessTokens).toHaveBeenCalledWith({ projectKey: 'PROJ', repositorySlug: 'test-repo', start: 10, limit: 5 });
    });

    it('should fail when scope is user but userSlug is missing', async () => {
      const result = await bitbucketService.getAccessTokens('user');

      expect(result.success).toBe(false);
      expect(result.error).toContain('userSlug is required');
      expect(bb.authentication.getUserAccessTokens).not.toHaveBeenCalled();
    });

    it('should fail when scope is repo but repositorySlug is missing', async () => {
      const result = await bitbucketService.getAccessTokens('repo', undefined, 'proj');

      expect(result.success).toBe(false);
      expect(result.error).toContain('projectKey and repositorySlug are required');
      expect(bb.authentication.getRepositoryAccessTokens).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      (bb.authentication.getProjectAccessTokens as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getAccessTokens('project', undefined, 'PROJ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('createAccessToken', () => {
    it('should create a personal access token for a user', async () => {
      const mockRawToken = { token: 'BBDC-secret', id: 1, name: 'my-token' };
      (bb.authentication.createUserAccessToken as Mock).mockResolvedValue(mockRawToken);

      const result = await bitbucketService.createAccessToken('user', 'my-token', ['PROJECT_READ'], undefined, 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRawToken);
      expect(bb.authentication.createUserAccessToken).toHaveBeenCalledWith({ userSlug: 'jsmith', name: 'my-token', permissions: ['PROJECT_READ'] });
    });

    it('should create a project access token including expiryDays', async () => {
      const mockRawToken = { token: 'BBDC-secret', id: 2, name: 'ci-token' };
      (bb.authentication.createProjectAccessToken as Mock).mockResolvedValue(mockRawToken);

      const result = await bitbucketService.createAccessToken(
        'project',
        'ci-token',
        ['PROJECT_WRITE'],
        30,
        undefined,
        'proj',
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRawToken);
      expect(bb.authentication.createProjectAccessToken).toHaveBeenCalledWith({ projectKey: 'PROJ', name: 'ci-token', permissions: ['PROJECT_WRITE'], expiryDays: 30 });
    });

    it('should create a repository access token, normalizing project key and repo slug', async () => {
      const mockRawToken = { token: 'BBDC-secret', id: 3, name: 'repo-token' };
      (bb.authentication.createRepositoryAccessToken as Mock).mockResolvedValue(mockRawToken);

      const result = await bitbucketService.createAccessToken(
        'repo',
        'repo-token',
        ['REPO_WRITE'],
        undefined,
        undefined,
        'proj',
        'Test-Repo',
      );

      expect(result.success).toBe(true);
      expect(bb.authentication.createRepositoryAccessToken).toHaveBeenCalledWith({ projectKey: 'PROJ', repositorySlug: 'test-repo', name: 'repo-token', permissions: ['REPO_WRITE'] });
    });

    it('should fail when scope is project but projectKey is missing', async () => {
      const result = await bitbucketService.createAccessToken('project', 'token', ['PROJECT_READ']);

      expect(result.success).toBe(false);
      expect(result.error).toContain('projectKey is required');
      expect(bb.authentication.createProjectAccessToken).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      (bb.authentication.createUserAccessToken as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createAccessToken('user', 'token', ['PROJECT_READ'], undefined, 'jsmith');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('deleteAccessToken', () => {
    it('should delete a personal access token and return an ack', async () => {
      (bb.authentication.deleteUserAccessToken as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAccessToken('user', '1', 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, tokenId: '1' });
      expect(bb.authentication.deleteUserAccessToken).toHaveBeenCalledWith({ tokenId: '1', userSlug: 'jsmith' });
    });

    it('should delete a project access token', async () => {
      (bb.authentication.deleteProjectAccessToken as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAccessToken('project', '2', undefined, 'proj');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, tokenId: '2' });
      expect(bb.authentication.deleteProjectAccessToken).toHaveBeenCalledWith({ projectKey: 'PROJ', tokenId: '2' });
    });

    it('should delete a repository access token, normalizing project key and repo slug', async () => {
      (bb.authentication.deleteRepositoryAccessToken as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAccessToken('repo', '3', undefined, 'proj', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, tokenId: '3' });
      expect(bb.authentication.deleteRepositoryAccessToken).toHaveBeenCalledWith({ projectKey: 'PROJ', tokenId: '3', repositorySlug: 'test-repo' });
    });

    it('should fail when scope is repo but projectKey is missing', async () => {
      const result = await bitbucketService.deleteAccessToken('repo', '4', undefined, undefined, 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toContain('projectKey and repositorySlug are required');
      expect(bb.authentication.deleteRepositoryAccessToken).not.toHaveBeenCalled();
    });

    it('should not overwrite the error when the delete call fails', async () => {
      (bb.authentication.deleteUserAccessToken as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.deleteAccessToken('user', '1', 'jsmith');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
      expect(result.data).toBeUndefined();
    });
  });

  describe('SSH keys', () => {
    describe('getSshKeys', () => {
      it('should get SSH keys with the default page size', async () => {
        const mockData = { size: 1, isLastPage: true, values: [{ id: 1, text: 'ssh-rsa AAAA... me@host' }] };
        (bb.authentication.getSshKeys as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.getSshKeys();

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(bb.authentication.getSshKeys).toHaveBeenCalledWith({ userName: undefined, user: undefined, start: undefined, limit: 25 });
      });

      it('should get SSH keys for a specific user with explicit pagination', async () => {
        (bb.authentication.getSshKeys as Mock).mockResolvedValue({ values: [] });

        await bitbucketService.getSshKeys('someuser', 10, 5);

        expect(bb.authentication.getSshKeys).toHaveBeenCalledWith({ userName: 'someuser', user: undefined, start: 10, limit: 5 });
      });

      it('should handle errors when fetching SSH keys', async () => {
        (bb.authentication.getSshKeys as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.getSshKeys();

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('addSshKey', () => {
      it('should add an SSH key for the current user', async () => {
        const mockData = { id: 1, text: 'ssh-rsa AAAA... me@host' };
        (bb.authentication.addSshKey as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.addSshKey('ssh-rsa AAAA... me@host');

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(bb.authentication.addSshKey).toHaveBeenCalledWith({ user: undefined, text: 'ssh-rsa AAAA... me@host' });
      });

      it('should add an SSH key for a specified user', async () => {
        (bb.authentication.addSshKey as Mock).mockResolvedValue({});

        await bitbucketService.addSshKey('ssh-rsa AAAA... me@host', 'someuser');

        expect(bb.authentication.addSshKey).toHaveBeenCalledWith({ user: 'someuser', text: 'ssh-rsa AAAA... me@host' });
      });

      it('should handle errors when adding an SSH key', async () => {
        (bb.authentication.addSshKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.addSshKey('bad-key');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('deleteSshKey', () => {
      it('should delete an SSH key and return an ack', async () => {
        (bb.authentication.deleteSshKey as Mock).mockResolvedValue(undefined);

        const result = await bitbucketService.deleteSshKey('42');

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ deleted: true, keyId: '42' });
        expect(bb.authentication.deleteSshKey).toHaveBeenCalledWith({ keyId: '42' });
      });

      it('should preserve the error field when delete fails', async () => {
        (bb.authentication.deleteSshKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.deleteSshKey('42');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });

  describe('GPG keys', () => {
    describe('getGpgKeys', () => {
      it('should get GPG keys with the default page size', async () => {
        const mockData = { size: 1, isLastPage: true, values: [{ id: '00000000000004d2', fingerprint: '43:51:43' }] };
        (bb.security.getKeysForUser as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.getGpgKeys();

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(bb.security.getKeysForUser).toHaveBeenCalledWith({ user: undefined, start: undefined, limit: 25 });
      });

      it('should get GPG keys for a specific user with explicit pagination', async () => {
        (bb.security.getKeysForUser as Mock).mockResolvedValue({ values: [] });

        await bitbucketService.getGpgKeys('someuser', 10, 5);

        expect(bb.security.getKeysForUser).toHaveBeenCalledWith({ user: 'someuser', start: 10, limit: 5 });
      });

      it('should handle errors when fetching GPG keys', async () => {
        (bb.security.getKeysForUser as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.getGpgKeys();

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('addGpgKey', () => {
      it('should add a GPG key for the current user', async () => {
        const mockData = { id: '00000000000004d2', fingerprint: '43:51:43' };
        (bb.security.addKey as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.addGpgKey('-----BEGIN PGP PUBLIC KEY BLOCK-----');

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(bb.security.addKey).toHaveBeenCalledWith({ user: undefined, text: '-----BEGIN PGP PUBLIC KEY BLOCK-----' });
      });

      it('should add a GPG key for a specified user', async () => {
        (bb.security.addKey as Mock).mockResolvedValue({});

        await bitbucketService.addGpgKey('-----BEGIN PGP PUBLIC KEY BLOCK-----', 'someuser');

        expect(bb.security.addKey).toHaveBeenCalledWith({ user: 'someuser', text: '-----BEGIN PGP PUBLIC KEY BLOCK-----' });
      });

      it('should handle errors when adding a GPG key', async () => {
        (bb.security.addKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.addGpgKey('bad-key');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('deleteGpgKey', () => {
      it('should delete a GPG key and return an ack', async () => {
        (bb.security.deleteKey as Mock).mockResolvedValue(undefined);

        const result = await bitbucketService.deleteGpgKey('00000000000004d2');

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ deleted: true, fingerprintOrId: '00000000000004d2' });
        expect(bb.security.deleteKey).toHaveBeenCalledWith({ fingerprintOrId: '00000000000004d2' });
      });

      it('should preserve the error field when delete fails', async () => {
        (bb.security.deleteKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.deleteGpgKey('00000000000004d2');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });
});
