import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import firebase from 'firebase-admin';
import serviceAccount from './fireboy-79d85-firebase-adminsdk-eq2r2-07f67da5cb.json';

dotenv.config();
let connectionInstance = null;
const url = process.env.DB_TEST_URL;
const database = process.env.DB_TEST_NAME;

const fb = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  apiKey: 'AIzaSyAKVRIv-4e8JaGaDRcJDY1TJI4MbtHU0OI',
  authDomain: 'fireboy-79d85.firebaseapp.com',
  databaseURL: 'https://fireboy-79d85.firebaseio.com',
  projectId: 'fireboy-79d85',
  storageBucket: 'fireboy-79d85.appspot.com',
  messagingSenderId: '856690883473',
  appId: '1:856690883473:web:7bce3dab58c50f2b',
});

const connect = async () => {
  try {
    if (connectionInstance === null) {
      connectionInstance = MongoClient
        .connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      return connectionInstance;
    }
    return connectionInstance;
  } catch (error) {
    // log error
  }
  return connectionInstance;
};
const getDevice = async (deviceId) => {
  const res = await fb.database().ref('/fireboy/devices/')
    .orderByValue().equalTo(deviceId)
    .once('value', snapshot => snapshot);
  return res;
};

const create = async (collectionName, data) => {
  let res;
  const client = await connect();
  const db = client.db(database);
  const collection = db.collection(collectionName);
  try {
    res = collection.insertMany(data);
  } catch (error) {
    // log error
  }
  return res;
};

const read = async (collectionName, filter = {}) => {
  let res;
  const client = await connect();
  const db = client.db(database);
  const coll = db.collection(collectionName);
  try {
    res = coll.find(filter).toArray();
  } catch (error) {
    // log error;
  }
  return res;
};

module.exports = {
  connect, create, read, getDevice,
};
