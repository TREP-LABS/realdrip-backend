import bunyan from 'bunyan';
import expressRequestsLogger from 'express-requests-logger';

export const log = bunyan.createLogger({
  name: process.env.APP_NAME || 'app',
  level: process.env.LOG_LEVEL || 'info',
});

export const logMiddleware = logger => expressRequestsLogger({
  logger,
  request: {
    maskBody: ['password'],
    maskHeaders: ['authorization', 'token', 'auth-token'],
  },
  response: {
    maskHeaders: ['authorization', 'token', 'auth-token'],
  },
});
