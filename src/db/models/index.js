import user from './user';
import verifyDevice from './verifyDevice';

export default {
  ...user, // The user module exports multiple models in an object
  ...verifyDevice,
};
