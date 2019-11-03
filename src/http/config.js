import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  clientAppUrl: process.env.CLIENT_APP_URL,
};
