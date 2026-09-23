import { config } from './config';
import { logger } from './lib/logger';

function resolveMode(): 'http' | 'mcp' {
  return process.argv.includes('--mcp') ? 'mcp' : 'http';
}

const mode = resolveMode();

logger.info('bus-catcher backend starting', {
  mode,
  serverName: config.serverName,
});

if (mode === 'http') {
  logger.info(`REST server will listen on :${config.restPort}`, {
    wired: 'Phase 2',
  });
} else {
  logger.info(`MCP server will listen on :${config.mcpPort}`, {
    wired: 'Phase 2',
  });
}
