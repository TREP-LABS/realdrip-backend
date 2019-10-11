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
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api', routes);

export default app;
