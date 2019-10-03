import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 7000,
  clientAppUrl: process.env.CLIENT_APP_URL,
};
