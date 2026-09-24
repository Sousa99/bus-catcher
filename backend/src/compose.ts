import { createDb, createSqlite, type DB } from './db/client';
import { migrateDb } from './db/migrate';
import { createCarrisProvider } from './providers/carris';
import type { ScheduleProvider } from './providers/types';
import { createConfigService, type ConfigService } from './services/config';

export interface BackendDeps {
  db: DB;
  provider: ScheduleProvider;
  config: ConfigService;
}

export function createBackend(dbPath: string): BackendDeps {
  migrateDb(dbPath);
  const sqlite = createSqlite(dbPath);
  const db = createDb(sqlite);
  return {
    db,
    provider: createCarrisProvider(db),
    config: createConfigService(db),
  };
}
