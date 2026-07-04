import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import {
  ContentBlueprintService,
  ContentBodyService,
  WebhooksService,
} from '../src/confluenceClient/index.js';
import { ConfluenceService } from '../src/confluenceService.js';

const CONTENT_BLUEPRINT = ContentBlueprintService as unknown as Record<string, Mock>;
const CONTENT_BODY = ContentBodyService as unknown as Record<string, Mock>;
const WEBHOOKS = WebhooksService as unknown as Record<string, Mock>;

vi.mock('../src/confluenceClient/index.js', () => ({
  ContentBlueprintService: {
    publishSharedDraft: vi.fn(),
    publishLegacyDraft: vi.fn(),
  },
  ContentBodyService: {
    convert: vi.fn(),
  },
  WebhooksService: {
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
  OpenAPI: {
    BASE: '',
    TOKEN: '',
    VERSION: '',
    HEADERS: undefined,
  },
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
    CONTENT_BLUEPRINT.publishSharedDraft.mockResolvedValue({ id: 'draft-1' });

    const result = await service.publishBlueprintSharedDraft('draft-1', draftContent);

    expect(CONTENT_BLUEPRINT.publishSharedDraft).toHaveBeenCalledWith('draft-1', undefined, 'draft', draftContent);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when publishing a shared blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishSharedDraft.mockRejectedValue(new Error('boom'));

    const result = await service.publishBlueprintSharedDraft('draft-1', draftContent);

    expect(result.success).toBe(false);
  });

  it('publishes a legacy blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishLegacyDraft.mockResolvedValue({ id: 'draft-1' });

    const result = await service.publishBlueprintLegacyDraft('draft-1', draftContent, 'history');

    expect(CONTENT_BLUEPRINT.publishLegacyDraft).toHaveBeenCalledWith('draft-1', 'history', 'draft', draftContent);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when publishing a legacy blueprint draft', async () => {
    CONTENT_BLUEPRINT.publishLegacyDraft.mockRejectedValue(new Error('boom'));

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
    CONTENT_BODY.convert.mockResolvedValue({ value: '<p>Hello</p>', representation: 'view' });

    const result = await service.convertContentBody('view', '<p>Hello</p>', 'storage');

    expect(CONTENT_BODY.convert).toHaveBeenCalledWith('view', undefined, { value: '<p>Hello</p>', representation: 'storage' });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ value: '<p>Hello</p>', representation: 'view' });
  });

  it('forwards API errors when converting a content body', async () => {
    CONTENT_BODY.convert.mockRejectedValue(new Error('boom'));

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
    WEBHOOKS.findWebhooks.mockResolvedValue({ results: [] });

    await service.findWebhooks();

    expect(WEBHOOKS.findWebhooks).toHaveBeenCalledWith('25', undefined, undefined, undefined);
  });

  it('forwards API errors when finding webhooks', async () => {
    WEBHOOKS.findWebhooks.mockRejectedValue(new Error('boom'));

    const result = await service.findWebhooks();

    expect(result.success).toBe(false);
  });

  it('creates a webhook', async () => {
    WEBHOOKS.createWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.createWebhook(webhook);

    expect(WEBHOOKS.createWebhook).toHaveBeenCalledWith(webhook);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when creating a webhook', async () => {
    WEBHOOKS.createWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.createWebhook(webhook);

    expect(result.success).toBe(false);
  });

  it('gets a webhook by ID', async () => {
    WEBHOOKS.getWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.getWebhook('wh-1', true);

    expect(WEBHOOKS.getWebhook).toHaveBeenCalledWith('wh-1', true);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting a webhook', async () => {
    WEBHOOKS.getWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhook('wh-1');

    expect(result.success).toBe(false);
  });

  it('updates a webhook', async () => {
    WEBHOOKS.updateWebhook.mockResolvedValue({ id: 'wh-1' });

    const result = await service.updateWebhook('wh-1', webhook);

    expect(WEBHOOKS.updateWebhook).toHaveBeenCalledWith('wh-1', webhook);
    expect(result.success).toBe(true);
  });

  it('forwards API errors when updating a webhook', async () => {
    WEBHOOKS.updateWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.updateWebhook('wh-1', webhook);

    expect(result.success).toBe(false);
  });

  it('deletes a webhook', async () => {
    WEBHOOKS.deleteWebhook.mockResolvedValue(undefined);

    const result = await service.deleteWebhook('wh-1');

    expect(WEBHOOKS.deleteWebhook).toHaveBeenCalledWith('wh-1');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when deleting a webhook', async () => {
    WEBHOOKS.deleteWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.deleteWebhook('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets the latest invocation of a webhook', async () => {
    WEBHOOKS.getLatestInvocation.mockResolvedValue({ outcome: 'SUCCESS' });

    const result = await service.getWebhookLatestInvocation('wh-1', 'SUCCESS', 'page_created');

    expect(WEBHOOKS.getLatestInvocation).toHaveBeenCalledWith('wh-1', 'SUCCESS', 'page_created');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the latest invocation', async () => {
    WEBHOOKS.getLatestInvocation.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookLatestInvocation('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets webhook statistics', async () => {
    WEBHOOKS.getStatistics.mockResolvedValue({ successCount: 1 });

    const result = await service.getWebhookStatistics('wh-1', 'page_created');

    expect(WEBHOOKS.getStatistics).toHaveBeenCalledWith('wh-1', 'page_created');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting webhook statistics', async () => {
    WEBHOOKS.getStatistics.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookStatistics('wh-1');

    expect(result.success).toBe(false);
  });

  it('gets the webhook statistics summary', async () => {
    WEBHOOKS.getStatisticsSummary.mockResolvedValue({ successCount: 1 });

    const result = await service.getWebhookStatisticsSummary('wh-1');

    expect(WEBHOOKS.getStatisticsSummary).toHaveBeenCalledWith('wh-1');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when getting the webhook statistics summary', async () => {
    WEBHOOKS.getStatisticsSummary.mockRejectedValue(new Error('boom'));

    const result = await service.getWebhookStatisticsSummary('wh-1');

    expect(result.success).toBe(false);
  });

  it('tests connectivity to a webhook endpoint', async () => {
    WEBHOOKS.testWebhook.mockResolvedValue({ ok: true });

    const result = await service.testWebhook('https://example.com/webhook');

    expect(WEBHOOKS.testWebhook).toHaveBeenCalledWith('https://example.com/webhook');
    expect(result.success).toBe(true);
  });

  it('forwards API errors when testing a webhook', async () => {
    WEBHOOKS.testWebhook.mockRejectedValue(new Error('boom'));

    const result = await service.testWebhook('https://example.com/webhook');

    expect(result.success).toBe(false);
  });
});
