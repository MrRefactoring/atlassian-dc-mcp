describe('Confluence config', () => {
  const originalValue = process.env.CONFLUENCE_DEFAULT_PAGE_SIZE;

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env.CONFLUENCE_DEFAULT_PAGE_SIZE;
    } else {
      process.env.CONFLUENCE_DEFAULT_PAGE_SIZE = originalValue;
    }
    jest.resetModules();
  });

  it('uses the configured page size when the env var is a positive integer', async () => {
    process.env.CONFLUENCE_DEFAULT_PAGE_SIZE = '40';
    jest.resetModules();

    const { DEFAULT_PAGE_SIZE } = await import('../config.js');

    expect(DEFAULT_PAGE_SIZE).toBe(40);
  });

  it('falls back to 25 when the env var is invalid', async () => {
    process.env.CONFLUENCE_DEFAULT_PAGE_SIZE = '0';
    jest.resetModules();

    const { DEFAULT_PAGE_SIZE } = await import('../config.js');

    expect(DEFAULT_PAGE_SIZE).toBe(25);
  });
});
