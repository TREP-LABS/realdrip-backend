import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Enabling CORS for browser clients
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api', routes);

export default app;
