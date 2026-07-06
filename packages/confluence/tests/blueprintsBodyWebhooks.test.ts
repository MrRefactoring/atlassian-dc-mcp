import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfluenceService } from '../src/confluenceService.js';

const conf = vi.hoisted(() => ({
  content: {
    publishSharedDraft: vi.fn(),
    publishLegacyDraft: vi.fn(),
    convert: vi.fn(),
  },
  webhooks: {
    findWebhooks: vi.fn(),
    createWebhook: vi.fn(),
    getWebhook: vi.fn(),
    updateWebhook: vi.fn(),
    deleteWebhook: vi.fn(),
    getLatestInvocation: vi.fn(),
    getStatistics: vi.fn(),
    getStatisticsSummary: vi.fn(),
    testWebhook: vi.fn(),
  },
}));

vi.mock('../src/confluenceClient/index.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createConfluenceClient: () => conf,
}));

describe('ConfluenceService blueprint draft publishing', () => {
  let service: ConfluenceService;
  const draftContent = {
    id: 'draft-1',
    type: 'page',
    status: 'current',
    title: 'From template',
    space: { key: 'DEV' },
  };

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('publishes a shared blueprint draft', async () => {
    conf.content.publishSharedDraft.mockResolvedValue({ id: 'draft-1' });

    const result = await service.publishBlueprintSharedDraft('draft-1', draftContent);

    expect(conf.content.publishSharedDraft).toHaveBeenCalledWith({ draftId: 'draft-1', expand: undefined, status: 'draft', requestBody: draftContent });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when publishing a shared blueprint draft', async () => {
    conf.content.publishSharedDraft.mockRejectedValue(new Error('boom'));

    const result = await service.publishBlueprintSharedDraft('draft-1', draftContent);

    expect(result.success).toBe(false);
  });

  it('publishes a legacy blueprint draft', async () => {
    conf.content.publishLegacyDraft.mockResolvedValue({ id: 'draft-1' });

    const result = await service.publishBlueprintLegacyDraft('draft-1', draftContent, 'history');

    expect(conf.content.publishLegacyDraft).toHaveBeenCalledWith({ draftId: 'draft-1', expand: 'history', status: 'draft', requestBody: draftContent });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when publishing a legacy blueprint draft', async () => {
    conf.content.publishLegacyDraft.mockRejectedValue(new Error('boom'));

    const result = await service.publishBlueprintLegacyDraft('draft-1', draftContent);

    expect(result.success).toBe(false);
  });
});


describe('ConfluenceService.convertContentBody', () => {
  let service: ConfluenceService;

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('converts a content body between representations', async () => {
    conf.content.convert.mockResolvedValue({ value: '<p>Hello</p>', representation: 'view' });

    const result = await service.convertContentBody('view', '<p>Hello</p>', 'storage');

    expect(conf.content.convert).toHaveBeenCalledWith({ to: 'view', expand: undefined, requestBody: { value: '<p>Hello</p>', representation: 'storage' } });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ value: '<p>Hello</p>', representation: 'view' });
  });

  it('forwards API errors when converting a content body', async () => {
    conf.content.convert.mockRejectedValue(new Error('boom'));

    const result = await service.convertContentBody('view', '<p>Hello</p>', 'storage');

    expect(result.success).toBe(false);
  });
});


describe('ConfluenceService webhooks', () => {
  let service: ConfluenceService;
  const webhook = { name: 'my webhook', url: 'https://example.com/webhook', events: ['page_created'], active: true };

  beforeEach(() => {
    service = new ConfluenceService('test-host', 'test-token');
    vi.clearAllMocks();
  });

  it('finds webhooks with the default page-size limit', async () => {
    conf.webhooks.findWebhooks.mockResolvedValue({ results: [] });

    await service.findWebhooks();

    expect(conf.webhooks.findWebhooks).toHaveBeenCalledWith({ limit: '25', start: undefined, event: undefined, statistics: undefined });
  });

  it('forwards API errors when finding webhooks', async () => {
    conf.webhooks.findWebhooks.mockRejectedValue(new Error('boom'));

    const result = await service.findWebhooks();

    expect(result.success).toBe(false);
  });

  it('creates a webhook', async () => {
    conf.webhooks.createWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.createWebhook(webhook);

    expect(conf.webhooks.createWebhook).toHaveBeenCalledWith({ requestBody: webhook });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a webhook', async () => {
    conf.webhooks.createWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.createWebhook(webhook);

    expect(result.success).toBe(false);
  });

  it('gets a webhook by ID', async () => {
    conf.webhooks.getWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.getWebhook('wh-1', true);

    expect(conf.webhooks.getWebhook).toHaveBeenCalledWith({ webhookId: 'wh-1', statistics: true });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a webhook', async () => {
    conf.webhooks.getWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhook('wh-1');

    expect(result.success).toBe(false);
  });

  it('updates a webhook', async () => {
    conf.webhooks.updateWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.updateWebhook('wh-1', webhook);

    expect(conf.webhooks.updateWebhook).toHaveBeenCalledWith({ webhookId: 'wh-1', requestBody: webhook });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating a webhook', async () => {
    conf.webhooks.updateWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.updateWebhook('wh-1', webhook);

    expect(result.success).toBe(false);
  });

  it('deletes a webhook', async () => {
    conf.webhooks.deleteWebhook.mockResolvedValue(undefined);

    const result = await service.deleteWebhook('wh-1');

    expect(conf.webhooks.deleteWebhook).toHaveBeenCalledWith({ webhookId: 'wh-1' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a webhook', async () => {
    conf.webhooks.deleteWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.deleteWebhook('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets the latest invocation of a webhook', async () => {
    conf.webhooks.getLatestInvocation.mockResolvedValue({ outcome: 'SUCCESS' });

    const result = await service.getWebhookLatestInvocation('wh-1', 'SUCCESS', 'page_created');

    expect(conf.webhooks.getLatestInvocation).toHaveBeenCalledWith({ webhookId: 'wh-1', outcomes: 'SUCCESS', event: 'page_created' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the latest invocation', async () => {
    conf.webhooks.getLatestInvocation.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookLatestInvocation('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets webhook statistics', async () => {
    conf.webhooks.getStatistics.mockResolvedValue({ successCount: 1 });

    const result = await service.getWebhookStatistics('wh-1', 'page_created');

    expect(conf.webhooks.getStatistics).toHaveBeenCalledWith({ webhookId: 'wh-1', event: 'page_created' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting webhook statistics', async () => {
    conf.webhooks.getStatistics.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookStatistics('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets the webhook statistics summary', async () => {
    conf.webhooks.getStatisticsSummary.mockResolvedValue({ successCount: 1 });

    const result = await service.getWebhookStatisticsSummary('wh-1');

    expect(conf.webhooks.getStatisticsSummary).toHaveBeenCalledWith({ webhookId: 'wh-1' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the webhook statistics summary', async () => {
    conf.webhooks.getStatisticsSummary.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookStatisticsSummary('wh-1');

    expect(result.success).toBe(false);
  });

  it('tests connectivity to a webhook endpoint', async () => {
    conf.webhooks.testWebhook.mockResolvedValue({ ok: true });

    const result = await service.testWebhook('https://example.com/webhook');

    expect(conf.webhooks.testWebhook).toHaveBeenCalledWith({ url: 'https://example.com/webhook' });
    expect(result.success).toBe(true);
  });

  it('forwards API errors when testing a webhook', async () => {
    conf.webhooks.testWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.testWebhook('https://example.com/webhook');

    expect(result.success).toBe(false);
  });
});
