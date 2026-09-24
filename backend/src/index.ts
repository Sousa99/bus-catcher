import { config } from './config';
import { migrateDb } from './db/migrate';
import { startHttpServer } from './http/server';
import { logger } from './lib/logger';
import { startMcpServer } from './mcp';

const mode = process.argv.includes('--mcp') ? 'mcp' : 'http';

logger.info('bus-catcher backend starting', {
  mode,
  serverName: config.serverName,
});

migrateDb();

if (mode === 'http') {
  startHttpServer();
} else {
  startMcpServer();
}
