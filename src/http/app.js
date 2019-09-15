import express from 'express';
import logger from 'morgan';
import config from './config';
import routes from './routes';
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);

app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});

export default app;
