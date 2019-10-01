import firebase from 'firebase-admin';
import config from './config';
import serviceAccount from './fireboy-79d85-firebase-adminsdk-eq2r2-07f67da5cb.json';

class Device {
  constructor(model) {
    this.Model = model;
    this.fb = firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: config.fbUrl[config.environment],
    });
  }

  async getDevice(deviceId) {
    return this.fb.database().ref('/fireboy/devices/')
      .orderByValue().equalTo(deviceId)
      .once('value', snapshot => snapshot);
  }
}
export default {
  Device,
};
