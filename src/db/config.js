import dotenv from 'dotenv';

dotenv.config();

export default {
  environment: process.env.NODE_ENV,
  dbUrl: {
    production: process.env.DB_PRODUCTION_URL,
    test: process.env.DB_TEST_URL,
    staging: process.env.DB_STAGING_URL,
    development: process.env.DB_DEV_URL,
  },
};
