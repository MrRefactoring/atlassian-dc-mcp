import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { confluenceInstanceType } from './constants.js';

export function registerPrompts(server: McpServer) {
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
}
