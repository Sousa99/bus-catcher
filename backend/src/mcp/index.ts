import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { config } from '../config';
import { logger } from '../lib/logger';

export function startMcpServer(): void {
  const server = new McpServer({
    name: config.serverName,
    version: '0.1.0',
  });

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  void server.connect(transport);

  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    if (url.pathname !== '/mcp') {
      res.writeHead(404).end('not found');
      return;
    }
    void transport.handleRequest(req, res).catch((err: unknown) => {
      logger.error('MCP request failed', {
        message: err instanceof Error ? err.message : String(err),
      });
    });
  });

  httpServer.listen(config.mcpPort, () => {
    logger.info('MCP server listening', { port: config.mcpPort });
  });
}
