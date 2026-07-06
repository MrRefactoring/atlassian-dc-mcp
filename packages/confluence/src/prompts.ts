import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';
import { confluenceInstanceType } from './constants.js';
import { createConfluenceCompleters } from './completions.js';
import type { ConfluenceService } from './confluenceService.js';

export function registerPrompts(server: McpServer, service: ConfluenceService) {
  const completers = createConfluenceCompleters(service);

  server.registerPrompt(
    'confluence_build_cql_query',
    {
      title: 'Build a CQL query for Confluence search',
      description: `Turns a natural-language content request into a valid CQL (Confluence Query Language) query for confluence_search_content in ${confluenceInstanceType}.`,
      argsSchema: {
        request: z.string().describe(
          'A natural-language description of what to find, e.g. \'pages about onboarding updated in the last month in the ENG space\'',
        ),
      },
    },
    ({ request }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Translate this request into a CQL query: "${request}"

  Common CQL fields: type (page, blogpost, attachment, comment), space, title, text, label, creator, contributor, created, lastmodified, ancestor.
  Operators: =, !=, ~, !~, in, not in, and, or, not. Relative dates use forms like now("-1m") or now("-7d").
  Example: type=page and space=ENG and lastmodified >= now("-30d") and title ~ "onboarding"

  Produce the CQL string, then call confluence_search_content with it and summarize the results.`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'confluence_summarize_space',
    {
      title: 'Summarize a Confluence space',
      description: `Produce a structured overview of a space in ${confluenceInstanceType}: its purpose, top-level structure, and notable recent activity.`,
      argsSchema: {
        spaceKey: completable(z.string().describe('The key of the space to summarize (e.g. ENG)'), completers.spaceKey),
      },
    },
    ({ spaceKey }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Summarize the Confluence space "${spaceKey}".

  1. Call confluence_get_space with spaceKey="${spaceKey}" for its name, type and description.
  2. Call confluence_get_space_content with spaceKey="${spaceKey}" to list its top-level pages and blog posts.
  3. Call confluence_search_content with a CQL like space=${spaceKey} and lastmodified >= now("-30d") order by lastmodified desc to find recent activity.
  4. Optionally call confluence_get_space_popular_labels with spaceKey="${spaceKey}" to surface dominant topics.

  Then write a concise summary: what the space is for, how its content is organized (major sections/top pages), what has changed recently, and any gaps worth attention.`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'confluence_draft_page',
    {
      title: 'Draft a Confluence page',
      description: `Turn rough notes into a well-structured Confluence page and create it in a space in ${confluenceInstanceType}.`,
      argsSchema: {
        spaceKey: completable(z.string().describe('The key of the space to create the page in (e.g. ENG)'), completers.spaceKey),
        title: z.string().describe('The title for the new page'),
        notes: z.string().describe('Rough notes / bullet points / requirements the page should cover'),
      },
    },
    ({ spaceKey, title, notes }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Draft a Confluence page titled "${title}" for space "${spaceKey}" from these notes:

  ${notes}

  1. Organize the notes into a clear structure with headings, short paragraphs and bullet/numbered lists as appropriate.
  2. Express the body as Confluence storage-format XHTML. If unsure about the markup, use confluence_convert_content_body to convert from a simpler representation.
  3. Create the page by calling confluence_create_content with type="page", the space key "${spaceKey}", the title "${title}", and the storage-format body.
  4. Report the new page's id and URL. Do NOT invent content beyond the notes — flag anything that needs the author's input.`,
          },
        },
      ],
    }),
  );

  server.registerPrompt(
    'confluence_review_space_access',
    {
      title: 'Review Confluence space access',
      description: `Audit who can access a space in ${confluenceInstanceType} and flag over-broad or risky permissions.`,
      argsSchema: {
        spaceKey: completable(z.string().describe('The key of the space whose access to review (e.g. ENG)'), completers.spaceKey),
      },
    },
    ({ spaceKey }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review access to the Confluence space "${spaceKey}".

  1. Call confluence_get_all_space_permissions with spaceKey="${spaceKey}" to list every group/user grant on the space.
  2. Call confluence_get_anonymous_space_permissions with spaceKey="${spaceKey}" to check whether anonymous users have any access.
  3. Call confluence_get_space_watchers with spaceKey="${spaceKey}" to see who is actively watching it.
  4. Optionally call confluence_get_global_permissions for instance-wide context on admin/site-level grants.

  Then report: who has view vs edit vs admin rights, whether anonymous or all-logged-in-users access is enabled, and any grants that look overly broad or unexpected for this space. Recommend least-privilege tightening where warranted, but do NOT change any permission — this is a read-only audit.`,
          },
        },
      ],
    }),
  );
}
