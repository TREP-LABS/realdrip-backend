import mongoose from 'mongoose';
import config from './config';

const dbUrl = config.dbUrl[config.environment];

export default () => {
  console.info(`Start setting up database for ${config.environment} environment`);
  mongoose.connect('mongodb+srv://treplabs:ppuPoSjZclVKwqYXg5@cluster0-aitdw.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.Promise = global.Promise;
  console.info('Finished setting up database');
};
