import type Database from 'better-sqlite3';
import { logger } from '../../lib/logger';
import type { ParsedGtfs } from './gtfs';

export interface IngestInput {
  parsed: ParsedGtfs;
  feedVersion: string;
  fetchedAt: string;
}

const BATCH = 500;

function insertChunked(
  sqlite: Database.Database,
  table: string,
  columns: string[],
  rows: unknown[][],
): void {
  if (rows.length === 0) return;
  const columnList = columns.join(',');
  const rowPlaceholder = `(${columns.map(() => '?').join(',')})`;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const placeholders = chunk.map(() => rowPlaceholder).join(',');
    sqlite
      .prepare(`INSERT INTO ${table} (${columnList}) VALUES ${placeholders}`)
      .run(...chunk.flat());
  }
}

/**
 * Atomically replaces the static schedule tables with the parsed feed in a
 * single transaction. Runs on a worker thread (see services/refresh.ts) so it
 * never blocks the main server thread. User configuration (configured_stops)
 * and metadata are preserved; FK enforcement is disabled because configured
 * stops may reference stops being replaced, and stale references are flagged
 * at read time (spec edge cases).
 */
export async function ingestParsedGtfs(
  sqlite: Database.Database,
  input: IngestInput,
): Promise<void> {
  sqlite.pragma('foreign_keys = OFF');

  const { parsed, feedVersion, fetchedAt } = input;
  const startedAt = Date.now();

  const run = sqlite.transaction(() => {
    sqlite.exec(
      'DELETE FROM stop_times; ' +
        'DELETE FROM trips; ' +
        'DELETE FROM calendar_dates; ' +
        'DELETE FROM calendar; ' +
        'DELETE FROM lines; ' +
        'DELETE FROM stops;',
    );

    insertChunked(
      sqlite,
      'lines',
      ['id', 'short_name', 'long_name', 'route_type', 'agency_id'],
      parsed.lines.map((l) => [l.id, l.shortName, l.longName, l.routeType, l.agencyId]),
    );
    insertChunked(
      sqlite,
      'stops',
      ['id', 'name', 'lat', 'lon'],
      parsed.stops.map((s) => [s.id, s.name, s.lat, s.lon]),
    );
    insertChunked(
      sqlite,
      'calendar',
      [
        'service_id',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'start_date',
        'end_date',
      ],
      parsed.calendar.map((c) => [
        c.serviceId,
        c.monday,
        c.tuesday,
        c.wednesday,
        c.thursday,
        c.friday,
        c.saturday,
        c.sunday,
        c.startDate,
        c.endDate,
      ]),
    );
    insertChunked(
      sqlite,
      'calendar_dates',
      ['service_id', 'date', 'exception_type'],
      parsed.calendarDates.map((c) => [c.serviceId, c.date, c.exceptionType]),
    );
    insertChunked(
      sqlite,
      'trips',
      ['id', 'line_id', 'service_id', 'headsign', 'direction_id'],
      parsed.trips.map((t) => [t.id, t.lineId, t.serviceId, t.headsign, t.directionId]),
    );
    insertChunked(
      sqlite,
      'stop_times',
      [
        'trip_id',
        'stop_sequence',
        'stop_id',
        'arrival_min',
        'departure_min',
        'pickup_type',
        'drop_off_type',
      ],
      parsed.stopTimes.map((s) => [
        s.tripId,
        s.stopSequence,
        s.stopId,
        s.arrivalMin,
        s.departureMin,
        s.pickupType,
        s.dropOffType,
      ]),
    );

    const metadataStmt = sqlite.prepare(
      'INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)',
    );
    metadataStmt.run('feed_version', feedVersion);
    metadataStmt.run('last_refresh', fetchedAt);
  });

  run();

  logger.info('ingest complete', {
    lines: parsed.lines.length,
    stops: parsed.stops.length,
    trips: parsed.trips.length,
    stopTimes: parsed.stopTimes.length,
    feedVersion,
    elapsedMs: Date.now() - startedAt,
  });
}
