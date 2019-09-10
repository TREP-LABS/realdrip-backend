import dotenv from 'dotenv';

dotenv.config();

export default {
  dbUrl: {
    production: process.env.DB_PRODUCTION_URL,
    test: process.env.DB_TEST_URL,
    staging: process.env.DB_STAGING_URL,
  },
};
