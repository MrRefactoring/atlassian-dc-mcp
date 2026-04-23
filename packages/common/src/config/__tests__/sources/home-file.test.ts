import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { HomeFileSource, getHomeFilePath, HOME_DIR_NAME } from '../../sources/home-file.js';
import type { ProductDefinition } from '../../source.js';

const JIRA: ProductDefinition = {
  id: 'jira',
  envVars: {
    host: 'JIRA_HOST',
    apiBasePath: 'JIRA_API_BASE_PATH',
    token: 'JIRA_API_TOKEN',
    defaultPageSize: 'JIRA_DEFAULT_PAGE_SIZE',
  },
};

const CONFLUENCE: ProductDefinition = {
  id: 'confluence',
  envVars: {
    host: 'CONFLUENCE_HOST',
    apiBasePath: 'CONFLUENCE_API_BASE_PATH',
    token: 'CONFLUENCE_API_TOKEN',
    defaultPageSize: 'CONFLUENCE_DEFAULT_PAGE_SIZE',
  },
};

describe('HomeFileSource', () => {
  let tempHome: string;
  let homedirSpy: jest.SpyInstance;

  beforeEach(() => {
    tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'home-file-src-'));
    homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tempHome);
  });

  afterEach(() => {
    homedirSpy.mockRestore();
    fs.rmSync(tempHome, { recursive: true, force: true });
  });

  it('returns undefined when the home file does not exist', () => {
    expect(new HomeFileSource().read(JIRA, 'host')).toBeUndefined();
  });

  it('writes values and reads them back', () => {
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'j-host');
    source.write(JIRA, 'token', 'j-token');
    expect(source.read(JIRA, 'host')).toBe('j-host');
    expect(source.read(JIRA, 'token')).toBe('j-token');
  });

  it('writes files with mode 0600 on POSIX', () => {
    if (process.platform === 'win32') {
      return;
    }
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'j-host');
    const stat = fs.statSync(getHomeFilePath(JIRA));
    expect(stat.mode & 0o777).toBe(0o600);
  });

  it('merge preserves unrelated keys', () => {
    const filePath = getHomeFilePath(JIRA);
    fs.mkdirSync(path.join(tempHome, HOME_DIR_NAME), { recursive: true });
    fs.writeFileSync(filePath, 'JIRA_HOST=old\nUNRELATED_KEY=keep-me\n', { mode: 0o600 });
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'new');
    const contents = fs.readFileSync(filePath, 'utf8');
    expect(contents).toContain('JIRA_HOST=new');
    expect(contents).toContain('UNRELATED_KEY=keep-me');
  });

  it('clear removes only the specified key', () => {
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'j-host');
    source.write(JIRA, 'token', 'j-token');
    source.clear(JIRA, 'token');
    expect(source.read(JIRA, 'host')).toBe('j-host');
    expect(source.read(JIRA, 'token')).toBeUndefined();
  });

  it('quotes values that contain whitespace', () => {
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'value with spaces');
    const contents = fs.readFileSync(getHomeFilePath(JIRA), 'utf8');
    expect(contents).toMatch(/JIRA_HOST="value with spaces"/);
    expect(source.read(JIRA, 'host')).toBe('value with spaces');
  });

  it('stores each product in its own file', () => {
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'j-host');
    source.write(CONFLUENCE, 'host', 'c-host');
    expect(fs.existsSync(getHomeFilePath(JIRA))).toBe(true);
    expect(fs.existsSync(getHomeFilePath(CONFLUENCE))).toBe(true);
    expect(source.read(JIRA, 'host')).toBe('j-host');
    expect(source.read(CONFLUENCE, 'host')).toBe('c-host');
  });

  it('evicts cache when the home file is deleted externally so writes do not merge stale values', () => {
    const source = new HomeFileSource();
    source.write(JIRA, 'host', 'stale-host');
    expect(source.read(JIRA, 'host')).toBe('stale-host');

    fs.unlinkSync(getHomeFilePath(JIRA));
    expect(source.read(JIRA, 'host')).toBeUndefined();

    source.write(JIRA, 'token', 'fresh-token');
    const contents = fs.readFileSync(getHomeFilePath(JIRA), 'utf8');
    expect(contents).not.toContain('stale-host');
    expect(contents).toContain('JIRA_API_TOKEN=fresh-token');
  });

  it('removes the temp file if rename fails', () => {
    const source = new HomeFileSource();
    const renameSpy = jest.spyOn(fs, 'renameSync').mockImplementation(() => {
      throw new Error('boom');
    });
    try {
      expect(() => source.write(JIRA, 'host', 'x')).toThrow('boom');
      const dir = path.join(tempHome, HOME_DIR_NAME);
      const entries = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      expect(entries.filter((e) => e.includes('.tmp-'))).toEqual([]);
    } finally {
      renameSpy.mockRestore();
    }
  });
});
