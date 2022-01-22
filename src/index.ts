import { createServer } from './server/create-server';
import { config } from './config';

// pass application configuration explicitly into create server, so create server can be tested in isolation
createServer(config.port, config.mongoDbConnectionString).catch(() =>
  process.exit(1)
);
