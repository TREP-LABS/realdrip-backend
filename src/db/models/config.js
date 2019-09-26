import firebase from 'firebase-admin';
import dotenv from 'dotenv';
import serviceAccount from './fireboy-79d85-firebase-adminsdk-eq2r2-07f67da5cb.json';

dotenv.config();

export default {
  environment: process.env.NODE_ENV || 'development',
  firebase_config: {
    test: {
      credential: firebase.credential.cert(serviceAccount),
      apiKey: process.env.FIREBASE_TEST_APIKEY,
      authDomain: process.env.FIREBASE_TEST_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_TEST_DATABASEURL,
      projectId: process.env.FIREBASE_TEST_PROJECTID,
      storageBucket: process.env.FIREBASE_TEST_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_TEST_MESSAGINGSENDERID,
      appId: process.env.FIREBASE_TEST_APPID,  
    },
    development: {
      credential: firebase.credential.cert(serviceAccount),
      apiKey: process.env.FIREBASE_DEV_APIKEY,
      authDomain: process.env.FIREBASE_DEV_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DEV_DATABASEURL,
      projectId: process.env.FIREBASE_DEV_PROJECTID,
      storageBucket: process.env.FIREBASE_DEV_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_DEV_MESSAGINGSENDERID,
      appId: process.env.FIREBASE_DEV_APPID,  
    },
  }
};