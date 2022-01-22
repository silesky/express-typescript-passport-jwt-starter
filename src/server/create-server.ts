import express from 'express';
import { registerRoutes } from './routes';
import { registerBottomErrorHandler } from './bottom-error-handler';
import { registerPassportStrategies } from './passport';
import { mongooseConnect } from './connections/mongoose';
import passport from 'passport';
import { Server } from 'http';

// wrap server in promise in case we want to use this function in testing
// passing in mongoConnectionString allow for component based tests using an in-memory database (if we wish).
export const createServer = async (
  port: number,
  mongoConnectionString: string
): Promise<Server> =>
  new Promise((resolve, reject) => {
    try {
      const app = express();

      app.get('/health', (_req, res) => {
        res.end('I am ok!');
      });

      /*  The order of the following middleware is important */
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // register passport strategies in preparation for using them with routes below
      registerPassportStrategies(passport);

      // register API routes
      registerRoutes(app);

      // register bottom error handler
      registerBottomErrorHandler(app);

      // start server on a given port
      const server = app.listen(port, async () => {
        await mongooseConnect(mongoConnectionString);
        console.log(`Listening on http://localhost:${port}`);

        // resolve server instance
        resolve(server);
      });
    } catch (err) {
      console.error('Unable to start server ->', err);
      reject(err);
    }
  });

export type { Server };
