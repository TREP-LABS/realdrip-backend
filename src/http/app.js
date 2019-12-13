import express from 'express';
import uuid from 'uuid/v4';
import { log, logMiddleware } from '../utils/logger';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const reqId = uuid();
  res.locals.log = log.child({ reqId });
  next();
}, (req, res, next) => logMiddleware(res.locals.log)(req, res, next));

// Enabling CORS for browser clients
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTOINS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api', routes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.locals.log.error(`Error processing request for route: ${req.method} ${req.route.path}`);
  res.locals.log.error(err);
  return res.status(500).json({ success: false, message: 'Unable to complete operation' });
});

export default app;
