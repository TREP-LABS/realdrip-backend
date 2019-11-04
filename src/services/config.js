import dotenv from 'dotenv';

dotenv.config();

export default {
  environment: process.env.NODE_ENV,
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
  email: {
    noReply: 'no-reply@realdrip.com',
  },
  bcryptHashSaltRounds: Number.parseInt(process.env.BCRYPT_HASH_SALT_ROUNDS, 10),
  jwtSecrete: process.env.JWT_SECRETE,
  serverAppUrl: process.env.SERVER_APP_URL,
  clientAppUrl: process.env.CLIENT_APP_URL,
};
