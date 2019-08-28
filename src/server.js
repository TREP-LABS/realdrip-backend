import express from 'express';
import logger from 'morgan';
import dotEnv from 'dotenv';
import apiRoutesV1 from './api/v1/routes';

dotEnv.config();

const server = express();
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use('/api/v1', apiRoutesV1);

const port = process.env.PORT || 7000;

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

export default server;
