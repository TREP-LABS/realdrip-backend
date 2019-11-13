/* eslint-disable no-console */
import dotenv from 'dotenv';

dotenv.config();
const STAGING = 'staging';
const TEST = 'test';
const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

let currentEnvironment = process.env.NODE_ENV;
if (!process.env.NODE_ENV) {
  console.log('NODE_ENV is not set in environment, defaulting to "development"');
  process.env.NODE_ENV = DEVELOPMENT;
  currentEnvironment = DEVELOPMENT;
}

/*
This object contains all the environment variables used by the application.
When new environment variables are used, they should be included in this object.
Each entry in this object represents an environment variable like this:
ENV_VAR_NAME: {
  // severityLevel: Describes how severe this environment var is.
  // Use 1(one) if the env var is required such that the app shouldn't start without it
  // Use 2(two) if the env var is needed such that the app can still start without it
  severityLevel: 1

  // env: An array of environment names to determine the environment to run the validation
  env: []

  // defaultValue: An optional value to use for an environment variable if it's not set
  defaultValue: '',

  // message: An optional message(to overrides the default message) to log
  // if the environment var is not set
  message: ''
}
*/
const environmetnVars = {
  APP_NAME: {
    severityLevel: 2,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
    defaultValue: 'rd-backend',
  },
  PORT: {
    severityLevel: 2,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
    defaultValue: 9000,
  },
  DB_DEV_URL: {
    severityLevel: 1,
    env: [DEVELOPMENT],
  },
  DB_TEST_URL: {
    severityLevel: 1,
    env: [TEST],
  },
  DB_STAGING_URL: {
    severityLevel: 1,
    env: [STAGING],
  },
  DB_PRODUCTION_URL: {
    severityLevel: 1,
    env: [PRODUCTION],
  },
  JWT_SECRETE: {
    severityLevel: 1,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
  },
  MAILGUN_API_KEY: {
    severityLevel: 1,
    env: [DEVELOPMENT, STAGING, PRODUCTION],
  },
  MAILGUN_DOMAIN: {
    severityLevel: 1,
    env: [DEVELOPMENT, STAGING, PRODUCTION],
  },
  BCRYPT_HASH_SALT_ROUNDS: {
    severityLevel: 2,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
    defaultValue: 10,
  },
  LOG_LEVEL: {
    severityLevel: 2,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
    defaultValue: 'debug',
  },
  SERVER_APP_URL: {
    severityLevel: 2,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
    defaultValue: 'https://rd-backend-staging.herokuapp.com',
  },
  CLIENT_APP_URL: {
    severityLevel: 2,
    env: [TEST, DEVELOPMENT, STAGING, PRODUCTION],
    defaultValue: 'https://rd-frontend-staging.herokuapp.com',
  },
};

const variableNames = Object.keys(environmetnVars);

variableNames.forEach((name) => {
  const {
    severityLevel, env, message, defaultValue,
  } = environmetnVars[name];
  if (!env.includes(currentEnvironment)) return;
  switch (severityLevel) {
    case 1: {
      if (!process.env[name] && defaultValue) {
        console.warn(message || `Missing required env var ${name}. Defaulting to a value of "${defaultValue}"`);
        process.env[name] = defaultValue;
      } else if (!process.env[name]) throw Error(message || `Missing required env var "${name}". App can't start without it.`);
      break;
    }
    case 2: {
      if (!process.env[name] && defaultValue) {
        console.warn(message || `Missing needed env var "${name}". Defaulting to a value of "${defaultValue}"`);
        process.env[name] = defaultValue;
      } else if (!process.env[name]) console.warn(message || `Missing needed env var "${name}". Some features of the app might not work`);
      break;
    }
    default: {
      console.log(`Severity level for env var: "${name}" is not set, not sure if it is needed or not`);
    }
  }
});
