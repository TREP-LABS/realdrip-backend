import firebase from 'firebase-admin';
import config from './config';
class Device {
  constructor(model) {
    this.Model = model;
    this.fb = firebase.initializeApp(config.firebase_config[config.environment]);
  }
  async getDevice (deviceId) {
    return await this.fb.database().ref('/fireboy/devices/')
      .orderByValue().equalTo(deviceId)
      .once('value', snapshot => snapshot);
  }
}
export default {
  Device,
};
