import mongoose from 'mongoose';
import config from './config';

const dbUrl = config.dbUrl[config.environment];

export default () => {
  console.info(`Start setting up database for ${config.environment} environment`);
  mongoose.connect(dbUrl, {
    useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true,
  });
  mongoose.Promise = global.Promise;
  console.info('Finished setting up database');
};
