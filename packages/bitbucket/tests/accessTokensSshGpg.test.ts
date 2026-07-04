import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { BitbucketService } from '../src/bitbucketService.js';
import { AuthenticationService, SecurityService } from '../src/bitbucketClient/index.js';

vi.mock('../src/bitbucketClient/index.js', () => ({
  AuthenticationService: {
    getAllAccessTokens: vi.fn(),
    getAllAccessTokens1: vi.fn(),
    getAllAccessTokens2: vi.fn(),
    createAccessToken: vi.fn(),
    createAccessToken1: vi.fn(),
    createAccessToken2: vi.fn(),
    deleteById: vi.fn(),
    deleteById1: vi.fn(),
    deleteById2: vi.fn(),
    addSshKey: vi.fn(),
    deleteSshKey: vi.fn(),
    getSshKeys: vi.fn(),
  },
  SecurityService: {
    addKey: vi.fn(),
    deleteKey: vi.fn(),
    getKeysForUser: vi.fn(),
  },
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
  },
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
      (AuthenticationService.getAllAccessTokens2 as Mock).mockResolvedValue(mockTokens);

      const result = await bitbucketService.getAccessTokens('user', 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTokens);
      expect(AuthenticationService.getAllAccessTokens2).toHaveBeenCalledWith('jsmith', undefined, 25);
    });

    it('should get access tokens for a project', async () => {
      const mockTokens = { values: [], size: 0, isLastPage: true };
      (AuthenticationService.getAllAccessTokens as Mock).mockResolvedValue(mockTokens);

      const result = await bitbucketService.getAccessTokens('project', undefined, 'proj');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTokens);
      expect(AuthenticationService.getAllAccessTokens).toHaveBeenCalledWith('PROJ', undefined, 25);
    });

    it('should get access tokens for a repository, uppercasing/lowercasing keys and passing pagination', async () => {
      const mockTokens = { values: [], size: 0, isLastPage: true };
      (AuthenticationService.getAllAccessTokens1 as Mock).mockResolvedValue(mockTokens);

      const result = await bitbucketService.getAccessTokens('repo', undefined, 'proj', 'Test-Repo', 10, 5);

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockTokens);
      expect(AuthenticationService.getAllAccessTokens1).toHaveBeenCalledWith('PROJ', 'test-repo', 10, 5);
    });

    it('should fail when scope is user but userSlug is missing', async () => {
      const result = await bitbucketService.getAccessTokens('user');

      expect(result.success).toBe(false);
      expect(result.error).toContain('userSlug is required');
      expect(AuthenticationService.getAllAccessTokens2).not.toHaveBeenCalled();
    });

    it('should fail when scope is repo but repositorySlug is missing', async () => {
      const result = await bitbucketService.getAccessTokens('repo', undefined, 'proj');

      expect(result.success).toBe(false);
      expect(result.error).toContain('projectKey and repositorySlug are required');
      expect(AuthenticationService.getAllAccessTokens1).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      (AuthenticationService.getAllAccessTokens as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.getAccessTokens('project', undefined, 'PROJ');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('createAccessToken', () => {
    it('should create a personal access token for a user', async () => {
      const mockRawToken = { token: 'BBDC-secret', id: 1, name: 'my-token' };
      (AuthenticationService.createAccessToken2 as Mock).mockResolvedValue(mockRawToken);

      const result = await bitbucketService.createAccessToken('user', 'my-token', ['PROJECT_READ'], undefined, 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockRawToken);
      expect(AuthenticationService.createAccessToken2).toHaveBeenCalledWith('jsmith', {
        name: 'my-token',
        permissions: ['PROJECT_READ'],
      });
    });

    it('should create a project access token including expiryDays', async () => {
      const mockRawToken = { token: 'BBDC-secret', id: 2, name: 'ci-token' };
      (AuthenticationService.createAccessToken as Mock).mockResolvedValue(mockRawToken);

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
      expect(AuthenticationService.createAccessToken).toHaveBeenCalledWith('PROJ', {
        name: 'ci-token',
        permissions: ['PROJECT_WRITE'],
        expiryDays: 30,
      });
    });

    it('should create a repository access token, normalizing project key and repo slug', async () => {
      const mockRawToken = { token: 'BBDC-secret', id: 3, name: 'repo-token' };
      (AuthenticationService.createAccessToken1 as Mock).mockResolvedValue(mockRawToken);

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
      expect(AuthenticationService.createAccessToken1).toHaveBeenCalledWith('PROJ', 'test-repo', {
        name: 'repo-token',
        permissions: ['REPO_WRITE'],
      });
    });

    it('should fail when scope is project but projectKey is missing', async () => {
      const result = await bitbucketService.createAccessToken('project', 'token', ['PROJECT_READ']);

      expect(result.success).toBe(false);
      expect(result.error).toContain('projectKey is required');
      expect(AuthenticationService.createAccessToken).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      (AuthenticationService.createAccessToken2 as Mock).mockRejectedValue(new Error('API Error'));

      const result = await bitbucketService.createAccessToken('user', 'token', ['PROJECT_READ'], undefined, 'jsmith');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('deleteAccessToken', () => {
    it('should delete a personal access token and return an ack', async () => {
      (AuthenticationService.deleteById2 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAccessToken('user', '1', 'jsmith');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, tokenId: '1' });
      expect(AuthenticationService.deleteById2).toHaveBeenCalledWith('1', 'jsmith');
    });

    it('should delete a project access token', async () => {
      (AuthenticationService.deleteById as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAccessToken('project', '2', undefined, 'proj');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, tokenId: '2' });
      expect(AuthenticationService.deleteById).toHaveBeenCalledWith('PROJ', '2');
    });

    it('should delete a repository access token, normalizing project key and repo slug', async () => {
      (AuthenticationService.deleteById1 as Mock).mockResolvedValue(undefined);

      const result = await bitbucketService.deleteAccessToken('repo', '3', undefined, 'proj', 'Test-Repo');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true, tokenId: '3' });
      expect(AuthenticationService.deleteById1).toHaveBeenCalledWith('PROJ', '3', 'test-repo');
    });

    it('should fail when scope is repo but projectKey is missing', async () => {
      const result = await bitbucketService.deleteAccessToken('repo', '4', undefined, undefined, 'test-repo');

      expect(result.success).toBe(false);
      expect(result.error).toContain('projectKey and repositorySlug are required');
      expect(AuthenticationService.deleteById1).not.toHaveBeenCalled();
    });

    it('should not overwrite the error when the delete call fails', async () => {
      (AuthenticationService.deleteById2 as Mock).mockRejectedValue(new Error('API Error'));

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
        (AuthenticationService.getSshKeys as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.getSshKeys();

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(AuthenticationService.getSshKeys).toHaveBeenCalledWith(undefined, undefined, undefined, 25);
      });

      it('should get SSH keys for a specific user with explicit pagination', async () => {
        (AuthenticationService.getSshKeys as Mock).mockResolvedValue({ values: [] });

        await bitbucketService.getSshKeys('someuser', 10, 5);

        expect(AuthenticationService.getSshKeys).toHaveBeenCalledWith('someuser', undefined, 10, 5);
      });

      it('should handle errors when fetching SSH keys', async () => {
        (AuthenticationService.getSshKeys as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.getSshKeys();

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('addSshKey', () => {
      it('should add an SSH key for the current user', async () => {
        const mockData = { id: 1, text: 'ssh-rsa AAAA... me@host' };
        (AuthenticationService.addSshKey as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.addSshKey('ssh-rsa AAAA... me@host');

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(AuthenticationService.addSshKey).toHaveBeenCalledWith(undefined, { text: 'ssh-rsa AAAA... me@host' });
      });

      it('should add an SSH key for a specified user', async () => {
        (AuthenticationService.addSshKey as Mock).mockResolvedValue({});

        await bitbucketService.addSshKey('ssh-rsa AAAA... me@host', 'someuser');

        expect(AuthenticationService.addSshKey).toHaveBeenCalledWith('someuser', { text: 'ssh-rsa AAAA... me@host' });
      });

      it('should handle errors when adding an SSH key', async () => {
        (AuthenticationService.addSshKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.addSshKey('bad-key');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('deleteSshKey', () => {
      it('should delete an SSH key and return an ack', async () => {
        (AuthenticationService.deleteSshKey as Mock).mockResolvedValue(undefined);

        const result = await bitbucketService.deleteSshKey('42');

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ deleted: true, keyId: '42' });
        expect(AuthenticationService.deleteSshKey).toHaveBeenCalledWith('42');
      });

      it('should preserve the error field when delete fails', async () => {
        (AuthenticationService.deleteSshKey as Mock).mockRejectedValue(new Error('API Error'));

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
        (SecurityService.getKeysForUser as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.getGpgKeys();

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(SecurityService.getKeysForUser).toHaveBeenCalledWith(undefined, undefined, 25);
      });

      it('should get GPG keys for a specific user with explicit pagination', async () => {
        (SecurityService.getKeysForUser as Mock).mockResolvedValue({ values: [] });

        await bitbucketService.getGpgKeys('someuser', 10, 5);

        expect(SecurityService.getKeysForUser).toHaveBeenCalledWith('someuser', 10, 5);
      });

      it('should handle errors when fetching GPG keys', async () => {
        (SecurityService.getKeysForUser as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.getGpgKeys();

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('addGpgKey', () => {
      it('should add a GPG key for the current user', async () => {
        const mockData = { id: '00000000000004d2', fingerprint: '43:51:43' };
        (SecurityService.addKey as Mock).mockResolvedValue(mockData);

        const result = await bitbucketService.addGpgKey('-----BEGIN PGP PUBLIC KEY BLOCK-----');

        expect(result.success).toBe(true);
        expect(result.data).toBe(mockData);
        expect(SecurityService.addKey).toHaveBeenCalledWith(undefined, { text: '-----BEGIN PGP PUBLIC KEY BLOCK-----' });
      });

      it('should add a GPG key for a specified user', async () => {
        (SecurityService.addKey as Mock).mockResolvedValue({});

        await bitbucketService.addGpgKey('-----BEGIN PGP PUBLIC KEY BLOCK-----', 'someuser');

        expect(SecurityService.addKey).toHaveBeenCalledWith('someuser', { text: '-----BEGIN PGP PUBLIC KEY BLOCK-----' });
      });

      it('should handle errors when adding a GPG key', async () => {
        (SecurityService.addKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.addGpgKey('bad-key');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('deleteGpgKey', () => {
      it('should delete a GPG key and return an ack', async () => {
        (SecurityService.deleteKey as Mock).mockResolvedValue(undefined);

        const result = await bitbucketService.deleteGpgKey('00000000000004d2');

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ deleted: true, fingerprintOrId: '00000000000004d2' });
        expect(SecurityService.deleteKey).toHaveBeenCalledWith('00000000000004d2');
      });

      it('should preserve the error field when delete fails', async () => {
        (SecurityService.deleteKey as Mock).mockRejectedValue(new Error('API Error'));

        const result = await bitbucketService.deleteGpgKey('00000000000004d2');

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });
  });
});
