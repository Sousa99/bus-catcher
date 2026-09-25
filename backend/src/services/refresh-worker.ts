import { parentPort } from 'node:worker_threads';
import { createIngestSqlite } from '../db/client';
import { migrateDb } from '../db/migrate';
import { parseGtfsZipBuffer } from '../providers/carris/gtfs';
import { ingestParsedGtfs } from '../providers/carris/ingest';

interface RefreshWorkerMessage {
  dbPath: string;
  buffer: Uint8Array;
  feedVersion: string;
}

parentPort?.on('message', async (message: RefreshWorkerMessage) => {
  const { dbPath, buffer, feedVersion } = message;
  try {
    const parsed = parseGtfsZipBuffer(buffer);
    migrateDb(dbPath);
    const sqlite = createIngestSqlite(dbPath);
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
    parentPort?.postMessage({ ok: true });
  } catch (err) {
    parentPort?.postMessage({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});
