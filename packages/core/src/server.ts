import { randomUUID } from 'node:crypto';
import { createServer as createHttpServer } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { logger } from './logger.js';

export const MAX_RESPONSE_CHARS_ENV_VAR = 'ATLASSIAN_DC_MCP_MAX_RESPONSE_CHARS';

/**
 * Default ceiling on the serialized size of a single tool response, in characters
 * (~25k tokens). Oversized API responses — large diffs, long page bodies, or big
 * unfiltered list results — can otherwise blow the model's context window. Set
 * ATLASSIAN_DC_MCP_MAX_RESPONSE_CHARS to raise/lower it, or to 0 to disable the cap.
 */
export const DEFAULT_MAX_RESPONSE_CHARS = 100_000;

function resolveMaxResponseChars(): number {
  const raw = process.env[MAX_RESPONSE_CHARS_ENV_VAR];
  if (raw === undefined || raw.trim() === '') {
    return DEFAULT_MAX_RESPONSE_CHARS;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return DEFAULT_MAX_RESPONSE_CHARS;
  }

  // An explicit 0 disables the cap entirely.
  return parsed === 0 ? Number.POSITIVE_INFINITY : parsed;
}

/**
 * Truncate an oversized serialized response, appending a clear marker that tells
 * the model the payload was cut and how to get the rest. Exported for testing.
 */
export function capResponseText(text: string, max: number = resolveMaxResponseChars()): string {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max)}\n\n…[response truncated: showing ${max} of ${text.length} characters. Narrow your query, pass a smaller limit or use pagination, or request specific fields. Set ${MAX_RESPONSE_CHARS_ENV_VAR} to change this cap (0 disables it).]`;
}

// Helper function to format tool responses
export const formatToolResponse = (result: unknown) => ({
  content: [{
    type: 'text' as const,
    text: capResponseText(JSON.stringify(result)),
  }],
});

// Error handler helper
export const handleError = (error: Error) => {
  logger.error('Server error', { error });
  process.exit(1);
};

// Create a base server setup function
export function createMcpServer(options: {
  name: string;
  version: string;
  instructions?: string;
}) {
  return new McpServer(
    {
      name: options.name,
      version: options.version,
    },
    options.instructions ? { instructions: options.instructions } : undefined,
  );
}

export const HTTP_PORT_ENV_VAR = 'ATLASSIAN_DC_MCP_HTTP_PORT';

/**
 * Connects the server to a transport. By default this is stdio (what Claude
 * Desktop and other local MCP hosts expect). Setting `ATLASSIAN_DC_MCP_HTTP_PORT`
 * to a positive integer instead starts the MCP Streamable HTTP transport
 * (the current spec's recommendation for remote/multi-client access) on that
 * port and never touches stdio — the two are mutually exclusive per process.
 */
export async function connectServer(server: McpServer) {
  const httpPort = parsePositiveInteger(process.env[HTTP_PORT_ENV_VAR]);
  if (httpPort !== undefined) {
    await connectStreamableHttp(server, httpPort);

    return server;
  }

  logger.debug('Connecting via stdio transport');
  const transport = new StdioServerTransport();
  await server.connect(transport);

  return server;
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);

  return parsed > 0 ? parsed : undefined;
}

async function connectStreamableHttp(server: McpServer, port: number): Promise<void> {
  logger.debug('Connecting via Streamable HTTP transport', { port });
  // Stateful mode: one long-lived transport demultiplexes many concurrent
  // client sessions by the Mcp-Session-Id header, so — unlike the SDK's
  // stateless example — the already-configured `server` (with all its tools,
  // resources, and prompts already registered) is connected exactly once,
  // not reconstructed per request.
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  await server.connect(transport);

  const httpServer = createHttpServer((req, res) => {
    transport.handleRequest(req, res).catch((error) => {
      logger.error('Streamable HTTP request failed', { error });
      if (!res.headersSent) {
        res.writeHead(500).end();
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(port, () => {
      logger.info(`MCP server listening on Streamable HTTP at http://localhost:${port}/`, { port });
      resolve();
    });
  });
}
