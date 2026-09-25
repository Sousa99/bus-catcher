import { createHash } from 'node:crypto';
import { config } from '../config';
import { createIngestSqlite } from '../db/client';
import { migrateDb } from '../db/migrate';
import { logger } from '../lib/logger';
import { decodeGtfsZip, downloadGtfs, parseGtfsFiles, unzipGtfs } from '../providers/carris/gtfs';
import { ingestParsedGtfs } from '../providers/carris/ingest';

async function main(): Promise<void> {
  logger.info('downloading GTFS feed', { url: config.feedUrl });
  const buffer = await downloadGtfs(config.feedUrl);
  const feedVersion = createHash('sha256').update(buffer).digest('hex').slice(0, 12);
  logger.info('feed downloaded', { bytes: buffer.byteLength, feedVersion });

  const files = decodeGtfsZip(unzipGtfs(buffer));
  const parsed = parseGtfsFiles(files);
  if (parsed.warnings.length > 0) {
    logger.warn('gtfs parse warnings', {
      count: parsed.warnings.length,
      first: parsed.warnings.slice(0, 5),
    });
  }

  migrateDb();
  const sqlite = createIngestSqlite();
  try {
    await ingestParsedGtfs(sqlite, {
      parsed,
      feedVersion,
      fetchedAt: new Date().toISOString(),
    });
    sqlite.pragma('wal_checkpoint(TRUNCATE)');
  } finally {
    sqlite.close();
  }
}

main().catch((err: unknown) => {
  logger.error('ingest failed', {
    message: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
