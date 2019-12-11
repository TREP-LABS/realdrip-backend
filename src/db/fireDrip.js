import firebaseApp from 'firebase/app';
import firebase from 'firebase';
import dotenv from 'dotenv';

dotenv.config();

const initFB = () => {
  if (!firebaseApp.apps.length) {
    firebaseApp.initializeApp({
      apiKey: 'AIzaSyD0nw8jkUlIIooNFkZToyrtuIxjEOyYYJg',
      authDomain: 'drip1-d6340.firebaseapp.com',
      databaseURL: 'https://drip1-d6340.firebaseio.com',
      projectId: 'drip1-d6340',
      storageBucket: 'drip1-d6340.appspot.com',
      messagingSenderId: '575383619718',
      appId: '1:575383619718:web:bb287addffb68bb8',
    });
  }
};

const getDevicesFromFirebase = () => {
  initFB();
  return firebase.database().ref('/devices')
    .once('value', snapshot => snapshot.val());
};

export default { getDevicesFromFirebase };
