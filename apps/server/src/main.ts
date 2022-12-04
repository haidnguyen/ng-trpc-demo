import * as express from 'express';
import * as path from 'path';
import * as trpcExpress from '@trpc/server/adapters/express';
import * as cors from 'cors';
import { appRouter, createContext } from '@conduit/data-access/trpc';

const ROUTES = {
  ASSETS: '/assets',
  TRPC: '/trpc',
};

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
app.use(ROUTES.ASSETS, express.static(path.join(__dirname, 'assets')));
app.use(
  ROUTES.TRPC,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  Object.entries(ROUTES).forEach(([, endpoint]) => {
    console.log(`listening at http://localhost:${port}${endpoint}`);
  });
});
server.on('error', console.error);
