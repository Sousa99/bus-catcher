import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { config } from '../config';
import * as schema from './schema';

export type DB = BetterSQLite3Database<typeof schema>;

export interface OpenDb {
  sqlite: Database.Database;
  db: DB;
}

export function createSqlite(dbPath: string = config.dbPath): Database.Database {
  mkdirSync(dirname(dbPath), { recursive: true });
  return new Database(dbPath);
}

export function createDb(sqlite: Database.Database): DB {
  return drizzle(sqlite, { schema });
}

export function openDb(dbPath: string = config.dbPath): OpenDb {
  const sqlite = createSqlite(dbPath);
  return { sqlite, db: createDb(sqlite) };
}
