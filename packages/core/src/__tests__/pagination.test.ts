import { paginateAll } from '../pagination.js';

describe('paginateAll', () => {
  it('returns a single page as-is when isLast is true immediately', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [1, 2, 3], isLast: true });
    const result = await paginateAll(fetchPage);
    expect(result).toEqual([1, 2, 3]);
    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(fetchPage).toHaveBeenCalledWith(0);
  });

  it('follows startAt + items.length across pages until isLast', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ items: [1, 2], isLast: false })
      .mockResolvedValueOnce({ items: [3, 4], isLast: false })
      .mockResolvedValueOnce({ items: [5], isLast: true });

    const result = await paginateAll(fetchPage);

    expect(result).toEqual([1, 2, 3, 4, 5]);
    expect(fetchPage).toHaveBeenNthCalledWith(1, 0);
    expect(fetchPage).toHaveBeenNthCalledWith(2, 2);
    expect(fetchPage).toHaveBeenNthCalledWith(3, 4);
  });

  it('uses an explicit nextStart instead of startAt + items.length when provided', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ items: [1, 2], isLast: false, nextStart: 100 })
      .mockResolvedValueOnce({ items: [3], isLast: true });

    const result = await paginateAll(fetchPage);

    expect(result).toEqual([1, 2, 3]);
    expect(fetchPage).toHaveBeenNthCalledWith(2, 100);
  });

  it('starts from a custom startAt offset', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [1], isLast: true });
    await paginateAll(fetchPage, { startAt: 50 });
    expect(fetchPage).toHaveBeenCalledWith(50);
  });

  it('stops when a page returns zero items even if isLast is false', async () => {
    const fetchPage = jest
      .fn()
      .mockResolvedValueOnce({ items: [1], isLast: false })
      .mockResolvedValueOnce({ items: [], isLast: false });

    const result = await paginateAll(fetchPage);

    expect(result).toEqual([1]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('stops at maxPages even if the API never reports isLast', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [1], isLast: false });
    const result = await paginateAll(fetchPage, { maxPages: 3 });
    expect(result).toEqual([1, 1, 1]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  it('stops accumulating once maxItems is reached and trims the overshoot', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [1, 2, 3], isLast: false });
    const result = await paginateAll(fetchPage, { maxItems: 5 });
    // 2 pages of 3 = 6 items fetched, trimmed down to the 5-item cap
    expect(result).toEqual([1, 2, 3, 1, 2]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('defaults to startAt 0 and safe caps when no options are passed', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [], isLast: true });
    const result = await paginateAll(fetchPage);
    expect(result).toEqual([]);
    expect(fetchPage).toHaveBeenCalledWith(0);
  });
});
