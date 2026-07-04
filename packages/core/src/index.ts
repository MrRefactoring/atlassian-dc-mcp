import { randomUUID } from 'node:crypto';
import { createServer as createHttpServer } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { logger } from './logger.js';

export * from './apiErrorHandler.js';
export * from './pagination.js';
export * from './config/index.js';
export { describeValidationError } from './setup/describeError.js';
export { parseSetupArgs, printSetupHelp, SetupArgsError, type ParsedSetupArgs } from './setup/args.js';
export { logger, type Logger, type LogLevel, type LogFields, LOG_LEVEL_ENV_VAR } from './logger.js';

// Helper function to format tool responses
export const formatToolResponse = (result: unknown) => ({
  content: [{
    type: 'text' as const,
    text: JSON.stringify(result),
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
}) {
  return new McpServer({
    name: options.name,
    version: options.version,
  });
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
