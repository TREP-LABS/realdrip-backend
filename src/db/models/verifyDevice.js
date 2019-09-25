import firebase from 'firebase-admin';
import serviceAccount from './fireboy-79d85-firebase-adminsdk-eq2r2-07f67da5cb.json';

class verifyDevice {
  constructor(model) {
    this.Model = model;
    this.fb = firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        apiKey: 'AIzaSyAKVRIv-4e8JaGaDRcJDY1TJI4MbtHU0OI',
        authDomain: 'fireboy-79d85.firebaseapp.com',
        databaseURL: 'https://fireboy-79d85.firebaseio.com',
        projectId: 'fireboy-79d85',
        storageBucket: 'fireboy-79d85.appspot.com',
        messagingSenderId: '856690883473',
        appId: '1:856690883473:web:7bce3dab58c50f2b',
      });
  }
  async getDevice (deviceId) {
    return await this.fb.database().ref('/fireboy/devices/')
      .orderByValue().equalTo(deviceId)
      .once('value', snapshot => snapshot);
  }
}
export default {
  verifyDevice,
};
