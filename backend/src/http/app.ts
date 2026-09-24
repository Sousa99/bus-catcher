import { Hono } from 'hono';
import { logger } from '../lib/logger';

export function createApp(): Hono {
  const app = new Hono();

  app.onError((err, c) => {
    logger.error('unhandled error', {
      message: err instanceof Error ? err.message : String(err),
    });
    return c.json({ error: 'internal_error' }, 500);
  });

  app.notFound((c) => c.json({ error: 'not_found' }, 404));

  app.get('/api/health', (c) => c.json({ ok: true, service: 'bus-catcher' }));

  return app;
}
