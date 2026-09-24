import { createDb, createSqlite, type DB } from './db/client';
import { migrateDb } from './db/migrate';
import { createCarrisProvider } from './providers/carris';
import type { ScheduleProvider } from './providers/types';
import { createConfigService, type ConfigService } from './services/config';
import { createScheduleService, type ScheduleService } from './services/schedule';

export interface BackendDeps {
  db: DB;
  provider: ScheduleProvider;
  config: ConfigService;
  schedule: ScheduleService;
}

export function createBackend(dbPath: string): BackendDeps {
  migrateDb(dbPath);
  const sqlite = createSqlite(dbPath);
  const db = createDb(sqlite);
  const provider = createCarrisProvider(db);
  return {
    db,
    provider,
    config: createConfigService(db),
    schedule: createScheduleService(provider),
  };
}
