export const config = {
  serverName: 'bus-catcher',
  restPort: Number(process.env.PORT ?? 3000),
  mcpPort: Number(process.env.MCP_PORT ?? 3001),
  dbPath: process.env.DB_PATH ?? './data/bus-catcher.db',
  feedUrl: process.env.CARRIS_GTFS_URL ?? 'https://gateway.carris.pt/gateway/gtfs/api/v2.11/GTFS',
} as const;
