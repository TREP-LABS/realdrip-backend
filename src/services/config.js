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
    testEmail: process.env.TEST_EMAIL,
  },
  jwtSecrete: process.env.JWT_SECRETE,
  appUrl: process.env.SERVER_APP_URL,
};
