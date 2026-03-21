import { shapeConfluenceMutationAck } from '../confluence-response-mapper.js';

describe('shapeConfluenceMutationAck', () => {
  it('returns a compact acknowledgement with a resolved content URL', () => {
    expect(
      shapeConfluenceMutationAck({
        id: '123',
        type: 'page',
        title: 'Test page',
        space: { key: 'DOCS' },
        version: { number: 7 },
        _links: {
          base: 'https://confluence.example.com',
          webui: '/pages/viewpage.action?pageId=123',
        },
      })
    ).toEqual({
      id: '123',
      type: 'page',
      title: 'Test page',
      spaceKey: 'DOCS',
      version: 7,
      url: 'https://confluence.example.com/pages/viewpage.action?pageId=123',
    });
  });
});
