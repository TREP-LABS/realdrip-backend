import dotenv from 'dotenv';

dotenv.config();

export default {
  environment: process.env.NODE_ENV || 'development',
  fbUrl: {
    test: process.env.FIREBASE_TEST_DATABASEURL,
    development: process.env.FIREBASE_DEV_DATABASEURL,
  }
};