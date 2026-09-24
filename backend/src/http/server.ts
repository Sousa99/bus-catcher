import { serve } from '@hono/node-server';
import { config } from '../config';
import { logger } from '../lib/logger';
import { createApp } from './app';

export function startHttpServer(): void {
  const app = createApp();
  serve({ fetch: app.fetch, port: config.restPort }, (info) => {
    logger.info('REST server listening', {
      port: config.restPort,
      address: info.address,
    });
  });
}
